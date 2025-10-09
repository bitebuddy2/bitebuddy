"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeModal from "./UpgradeModal";
import jsPDF from "jspdf";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

type MealPlanEntry = {
  id: string;
  date: string;
  meal_type: MealType;
  recipe_type: "published" | "ai";
  recipe_slug?: string;
  ai_recipe_id?: string;
  notes?: string;
};

type DayNote = {
  id?: string;
  user_id: string;
  date: string;
  note: string;
};

type Recipe = {
  slug?: string;
  id?: string;
  title: string;
  heroImage?: { asset?: { url: string }; alt?: string };
  description?: string;
  type: "published" | "ai";
};

export default function MealPlannerCalendar() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [mealPlan, setMealPlan] = useState<Record<string, MealPlanEntry>>({});
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; mealType: MealType } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const [dayNotes, setDayNotes] = useState<Record<string, DayNote>>({});
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const { isPremium, loading: subLoading } = useSubscription();

  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack"];
  const MAX_NOTE_LENGTH = 100;

  // Get user ID
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  // Generate days from start date - 14 days for premium, 3 days for free
  const getDays = () => {
    const days = [];
    const maxDays = isPremium ? 14 : 3;
    for (let i = 0; i < maxDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Fetch meal plan and saved recipes
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // Fetch meal plan entries
      const endDate = new Date(startDate);
      const maxDays = isPremium ? 14 : 3;
      endDate.setDate(endDate.getDate() + maxDays);

      const { data: planData } = await supabase
        .from("meal_plan")
        .select("*")
        .gte("date", startDate.toISOString().split("T")[0])
        .lt("date", endDate.toISOString().split("T")[0]);

      if (planData) {
        const planMap: Record<string, MealPlanEntry> = {};
        planData.forEach((entry) => {
          planMap[`${entry.date}-${entry.meal_type}`] = entry;
        });
        setMealPlan(planMap);
      }

      // Fetch day notes
      const { data: notesData } = await supabase
        .from("day_notes")
        .select("*")
        .gte("date", startDate.toISOString().split("T")[0])
        .lt("date", endDate.toISOString().split("T")[0]);

      if (notesData) {
        const notesMap: Record<string, DayNote> = {};
        notesData.forEach((note) => {
          notesMap[note.date] = note;
        });
        setDayNotes(notesMap);
      }

      // Fetch saved published recipes
      const { data: savedSlugs } = await supabase.from("saved_recipes").select("recipe_slug");

      let publishedRecipes: Recipe[] = [];
      if (savedSlugs && savedSlugs.length > 0) {
        const { client } = await import("@/sanity/client");
        const slugs = savedSlugs.map((s) => s.recipe_slug);
        const sanityRecipes = await client.fetch(
          `*[_type == "recipe" && slug.current in $slugs]{
            title,
            "slug": slug.current,
            description,
            heroImage{
              asset->{url},
              alt
            }
          }`,
          { slugs }
        );
        publishedRecipes = sanityRecipes.map((r: any) => ({ ...r, type: "published" as const }));
      }

      // Fetch saved AI recipes
      const { data: aiRecipes } = await supabase
        .from("saved_ai_recipes")
        .select("id, title, description")
        .order("created_at", { ascending: false });

      const aiRecipesList: Recipe[] = (aiRecipes || []).map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        type: "ai" as const,
      }));

      setSavedRecipes([...publishedRecipes, ...aiRecipesList]);
      setLoading(false);
    }

    fetchData();
  }, [startDate, isPremium]);

  // Assign recipe to a meal slot
  async function assignRecipe() {
    if (!selectedRecipe || !selectedSlot) return;

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const entry = {
      user_id: user.id,
      date: selectedSlot.date,
      meal_type: selectedSlot.mealType,
      recipe_type: selectedRecipe.type,
      recipe_slug: selectedRecipe.type === "published" ? selectedRecipe.slug : null,
      ai_recipe_id: selectedRecipe.type === "ai" ? selectedRecipe.id : null,
    };

    const { data, error } = await supabase.from("meal_plan").upsert(entry, {
      onConflict: "user_id,date,meal_type",
    }).select();

    if (error) {
      console.error("Error assigning recipe:", error);
      alert("Failed to assign recipe. Please try again.");
      return;
    }

    if (data) {
      setMealPlan({ ...mealPlan, [`${selectedSlot.date}-${selectedSlot.mealType}`]: data[0] });
      setSelectedSlot(null);
      setSelectedRecipe(null);
    }
  }

  // Remove recipe from meal slot
  async function removeRecipe(date: string, mealType: MealType) {
    const key = `${date}-${mealType}`;
    const entry = mealPlan[key];
    if (!entry) return;

    await supabase.from("meal_plan").delete().eq("id", entry.id);

    const newPlan = { ...mealPlan };
    delete newPlan[key];
    setMealPlan(newPlan);
  }

  // Get recipe for a slot
  function getRecipeForSlot(date: string, mealType: MealType): Recipe | null {
    const entry = mealPlan[`${date}-${mealType}`];
    if (!entry) return null;

    if (entry.recipe_type === "published") {
      return savedRecipes.find((r) => r.slug === entry.recipe_slug) || null;
    } else {
      return savedRecipes.find((r) => r.id === entry.ai_recipe_id) || null;
    }
  }

  // Save or update day note
  async function saveDayNote(date: string) {
    if (!noteText.trim()) {
      // If note is empty, delete it
      const existingNote = dayNotes[date];
      if (existingNote?.id) {
        await supabase.from("day_notes").delete().eq("id", existingNote.id);
        const newNotes = { ...dayNotes };
        delete newNotes[date];
        setDayNotes(newNotes);
      }
      setEditingNote(null);
      setNoteText("");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const noteData = {
      user_id: user.id,
      date: date,
      note: noteText.trim().substring(0, MAX_NOTE_LENGTH),
    };

    const { data, error } = await supabase
      .from("day_notes")
      .upsert(noteData, { onConflict: "user_id,date" })
      .select();

    if (error) {
      console.error("Error saving note:", error);
      alert("Failed to save note. Please try again.");
      return;
    }

    if (data && data[0]) {
      setDayNotes({ ...dayNotes, [date]: data[0] });
    }

    setEditingNote(null);
    setNoteText("");
  }

  // Start editing a note
  function startEditingNote(date: string) {
    setEditingNote(date);
    setNoteText(dayNotes[date]?.note || "");
  }

  // Export meal plan to PDF with multi-page support - 4 days per page in landscape
  function exportToPDF() {
    const doc = new jsPDF('landscape', 'mm', 'a4');

    // Use all days from the current view (3 for free, 14 for premium)
    const days = getDays();
    const pageWidth = 297; // A4 landscape width in mm
    const pageHeight = 210; // A4 landscape height in mm
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    // All 4 days on one page
    const daysPerPage = 4;
    const totalPages = Math.ceil(days.length / daysPerPage);

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) doc.addPage();

      const pageDays = days.slice(page * daysPerPage, (page + 1) * daysPerPage);
      const numDaysOnPage = pageDays.length;

      // Title (only on first page)
      if (page === 0) {
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(16, 185, 129); // emerald-600
        doc.text(`${days.length}-Day Meal Plan`, margin, 20);

        // Add logo to top right - using text as placeholder since we can't easily embed images in jsPDF without loading
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(16, 185, 129);
        doc.text('BiteBuddy', pageWidth - margin - 30, 20);

        // Date range
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(107, 114, 128); // gray-500
        const startDateStr = startDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + days.length - 1);
        const endDateStr = endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
        doc.text(`${startDateStr} - ${endDateStr}`, margin, 28);

        // Add divider line
        doc.setDrawColor(229, 231, 235); // gray-200
        doc.setLineWidth(0.5);
        doc.line(margin, 32, pageWidth - margin, 32);
      }

      // Page title for subsequent pages
      if (page > 0) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(16, 185, 129);
        doc.text('Meal Plan (continued)', margin, 20);

        // Logo on subsequent pages too
        doc.setFontSize(14);
        doc.text('BiteBuddy', pageWidth - margin - 30, 20);

        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.5);
        doc.line(margin, 24, pageWidth - margin, 24);
      }

      const startY = page === 0 ? 38 : 28;
      const colWidth = contentWidth / numDaysOnPage;
      const rowHeight = 26; // Reduced to fit all 4 meal types + snack on page

      // Day headers
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);

      pageDays.forEach((day, index) => {
        const x = margin + (index * colWidth);

        // Header background
        doc.setFillColor(243, 244, 246); // gray-100
        doc.roundedRect(x + 1, startY, colWidth - 2, 16, 2, 2, 'F');

        // Day name
        const dayName = day.toLocaleDateString('en-GB', { weekday: 'long' });
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(dayName, x + (colWidth / 2), startY + 7, { align: 'center' });

        // Date
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(107, 114, 128);
        const dateStr = day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        doc.text(dateStr, x + (colWidth / 2), startY + 13, { align: 'center' });
        doc.setTextColor(0, 0, 0);
      });

      // Day notes row (new)
      let currentY = startY + 17;

      // Notes section
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(55, 65, 81);
      doc.setFillColor(249, 250, 251);
      doc.roundedRect(margin, currentY, contentWidth, 7, 1, 1, 'F');
      doc.text('Notes', margin + 3, currentY + 5);
      currentY += 8;

      pageDays.forEach((day, index) => {
        const x = margin + (index * colWidth);
        const dateStr = day.toISOString().split('T')[0];
        const dayNote = dayNotes[dateStr];

        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.3);
        doc.roundedRect(x + 1, currentY, colWidth - 2, 12, 2, 2);

        if (dayNote?.note) {
          doc.setFillColor(254, 249, 195); // yellow-100
          doc.roundedRect(x + 2, currentY + 1, colWidth - 4, 10, 2, 2, 'F');
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(6);
          doc.setTextColor(0, 0, 0);

          // Wrap text properly
          const noteLines = doc.splitTextToSize(dayNote.note, colWidth - 6);
          noteLines.slice(0, 2).forEach((line: string, lineIndex: number) => {
            doc.text(line, x + 3, currentY + 4 + (lineIndex * 3));
          });
        } else {
          doc.setFontSize(6);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(156, 163, 175);
          doc.text('-', x + (colWidth / 2), currentY + 7, { align: 'center' });
          doc.setTextColor(0, 0, 0);
        }
      });

      currentY += 14;

      // Meal rows
      mealTypes.forEach((mealType) => {
        // Meal type label
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(55, 65, 81); // gray-700

        // Meal label background
        doc.setFillColor(249, 250, 251); // gray-50
        doc.roundedRect(margin, currentY, contentWidth, 7, 1, 1, 'F');
        doc.text(mealType.charAt(0).toUpperCase() + mealType.slice(1), margin + 3, currentY + 5);

        currentY += 8;

        // Recipe cards for each day
        pageDays.forEach((day, index) => {
          const x = margin + (index * colWidth);
          const dateStr = day.toISOString().split('T')[0];
          const recipe = getRecipeForSlot(dateStr, mealType);

          // Card border
          doc.setDrawColor(229, 231, 235); // gray-200
          doc.setLineWidth(0.3);
          doc.roundedRect(x + 1, currentY, colWidth - 2, rowHeight - 2, 2, 2);

          if (recipe) {
            // Recipe content background
            doc.setFillColor(236, 253, 245); // emerald-50
            doc.roundedRect(x + 2, currentY + 1, colWidth - 4, rowHeight - 4, 2, 2, 'F');

            // Recipe title with proper wrapping
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(0, 0, 0);

            const lines = doc.splitTextToSize(recipe.title, colWidth - 8);
            const maxLines = 3;
            const startTextY = currentY + 5;

            lines.slice(0, maxLines).forEach((line: string, lineIndex: number) => {
              doc.text(line, x + 4, startTextY + (lineIndex * 3));
            });

            // AI badge
            if (recipe.type === 'ai') {
              const badgeY = currentY + rowHeight - 6;
              doc.setFillColor(16, 185, 129); // emerald-600
              doc.roundedRect(x + 4, badgeY - 3, 10, 4, 1, 1, 'F');
              doc.setFontSize(7);
              doc.setFont('helvetica', 'bold');
              doc.setTextColor(255, 255, 255);
              doc.text('AI', x + 5, badgeY);
              doc.setTextColor(0, 0, 0);
            }
          } else {
            // Empty slot
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(156, 163, 175); // gray-400
            doc.text('-', x + (colWidth / 2), currentY + (rowHeight / 2), { align: 'center' });
            doc.setTextColor(0, 0, 0);
          }
        });

        currentY += rowHeight + 1;
      });

      // Footer
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(156, 163, 175); // gray-400
      const footerY = pageHeight - 10;
      doc.text('Generated by Bite Buddy', margin, footerY);
      doc.text(`bitebuddy.co.uk`, pageWidth - margin, footerY, { align: 'right' });
      doc.text(`Page ${page + 1} of ${totalPages}`, pageWidth / 2, footerY, { align: 'center' });
    }

    // Save the PDF
    const filename = `meal-plan-${startDate.toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
  }

  const days = getDays();

  const maxDays = isPremium ? 14 : 3;

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {isPremium ? "14-Day Meal Planner" : "3-Day Meal Planner"}
            </h2>
            {!isPremium && (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="text-xs bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-3 py-1 rounded-full hover:from-emerald-600 hover:to-emerald-700 transition-all font-semibold"
              >
                ⭐ Upgrade for 14 days
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {isPremium ? (
            <button
              onClick={exportToPDF}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export to PDF
            </button>
          ) : (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="rounded-lg bg-gray-400 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-500 flex items-center gap-2"
              title="Upgrade to Premium to export your meal plan"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Export to PDF (Premium)
            </button>
          )}
          <button
            onClick={() => {
              const newDate = new Date(startDate);
              newDate.setDate(newDate.getDate() - maxDays);
              setStartDate(newDate);
            }}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            ← Previous {maxDays} days
          </button>
          <button
            onClick={() => setStartDate(new Date())}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={() => {
              const newDate = new Date(startDate);
              newDate.setDate(newDate.getDate() + maxDays);
              setStartDate(newDate);
            }}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next {maxDays} days →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading meal plan...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-200 bg-gray-50 p-2 text-left text-sm font-semibold text-gray-700 sticky left-0 z-10">
                  Meal
                </th>
                {days.map((day) => (
                  <th
                    key={day.toISOString()}
                    className="border border-gray-200 bg-gray-50 p-2 text-center text-sm font-semibold text-gray-700 min-w-[150px]"
                  >
                    <div>{day.toLocaleDateString("en-GB", { weekday: "short" })}</div>
                    <div className="text-xs font-normal text-gray-500">
                      {day.toLocaleDateString("en-GB", { month: "short", day: "numeric" })}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Day Notes Row */}
              <tr>
                <td className="border border-gray-200 bg-yellow-50 p-2 text-sm font-medium text-gray-700 sticky left-0 z-10">
                  📝 Notes
                </td>
                {days.map((day) => {
                  const dateStr = day.toISOString().split("T")[0];
                  const dayNote = dayNotes[dateStr];
                  const isEditing = editingNote === dateStr;

                  return (
                    <td key={`note-${dateStr}`} className="border border-gray-200 p-2 align-top bg-yellow-50">
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value.substring(0, MAX_NOTE_LENGTH))}
                            placeholder="Add a note..."
                            className="w-full text-xs p-2 border border-gray-300 rounded resize-none"
                            rows={2}
                            maxLength={MAX_NOTE_LENGTH}
                          />
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">
                              {noteText.length}/{MAX_NOTE_LENGTH}
                            </span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => saveDayNote(dateStr)}
                                className="px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 text-xs"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingNote(null);
                                  setNoteText("");
                                }}
                                className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="relative group">
                          {dayNote?.note ? (
                            <div
                              onClick={() => startEditingNote(dateStr)}
                              className="text-xs p-2 bg-yellow-100 rounded cursor-pointer hover:bg-yellow-200 transition-colors min-h-[60px] break-words whitespace-pre-wrap"
                            >
                              {dayNote.note}
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditingNote(dateStr)}
                              className="w-full h-16 rounded border-2 border-dashed border-gray-300 hover:border-yellow-400 hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors text-xs"
                            >
                              + Add Note
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Meal Type Rows */}
              {mealTypes.map((mealType) => (
                <tr key={mealType}>
                  <td className="border border-gray-200 bg-gray-50 p-2 text-sm font-medium text-gray-700 capitalize sticky left-0 z-10">
                    {mealType}
                  </td>
                  {days.map((day) => {
                    const dateStr = day.toISOString().split("T")[0];
                    const recipe = getRecipeForSlot(dateStr, mealType);

                    return (
                      <td key={`${dateStr}-${mealType}`} className="border border-gray-200 p-1 align-top">
                        {recipe ? (
                          <div className="relative group">
                            <a
                              href={recipe.type === "published" ? `/recipes/${recipe.slug}` : `/account?tab=recipes&ai=${recipe.id}`}
                              className="block rounded-lg bg-emerald-50 p-2 text-xs hover:bg-emerald-100 transition-colors cursor-pointer"
                              title={`View ${recipe.title}`}
                            >
                              {recipe.heroImage?.asset?.url && (
                                <Image
                                  src={recipe.heroImage.asset.url}
                                  alt={recipe.title}
                                  width={120}
                                  height={80}
                                  className="w-full h-16 object-cover rounded mb-1"
                                />
                              )}
                              <div className="font-medium text-gray-900 line-clamp-3 break-words">{recipe.title}</div>
                              {recipe.type === "ai" && (
                                <div className="text-xs text-emerald-600 mt-1">🤖 AI</div>
                              )}
                            </a>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                removeRecipe(dateStr, mealType);
                              }}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-opacity z-10"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedSlot({ date: dateStr, mealType })}
                            className="w-full h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors text-xs"
                          >
                            + Add
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recipe selection modal */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Select recipe for {new Date(selectedSlot.date).toLocaleDateString("en-GB", {
                  month: "short",
                  day: "numeric"
                })} - {selectedSlot.mealType}
              </h3>
              <button
                onClick={() => {
                  setSelectedSlot(null);
                  setSelectedRecipe(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              {savedRecipes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No saved recipes yet. Save some recipes first!
                </p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {savedRecipes.map((recipe) => (
                    <button
                      key={recipe.slug || recipe.id}
                      onClick={() => setSelectedRecipe(recipe)}
                      className={`text-left rounded-lg border-2 p-3 transition-all ${
                        selectedRecipe?.slug === recipe.slug || selectedRecipe?.id === recipe.id
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      {recipe.heroImage?.asset?.url && (
                        <Image
                          src={recipe.heroImage.asset.url}
                          alt={recipe.title}
                          width={200}
                          height={120}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                      )}
                      <div className="font-medium text-gray-900">{recipe.title}</div>
                      {recipe.type === "ai" && (
                        <div className="text-xs text-emerald-600 mt-1">🤖 AI Generated</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedSlot(null);
                  setSelectedRecipe(null);
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={assignRecipe}
                disabled={!selectedRecipe}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign Recipe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && userId && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          userId={userId}
        />
      )}
    </div>
  );
}
