"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editCollection?: {
    id: string;
    name: string;
    description?: string;
  };
}

export default function CreateCollectionModal({
  isOpen,
  onClose,
  onSuccess,
  editCollection,
}: CreateCollectionModalProps) {
  const [name, setName] = useState(editCollection?.name || "");
  const [description, setDescription] = useState(editCollection?.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("Please log in to create collections");
        setLoading(false);
        return;
      }

      if (editCollection) {
        // Update existing collection
        const { error: updateError } = await supabase
          .from("recipe_collections")
          .update({
            name: name.trim(),
            description: description.trim() || null,
          })
          .eq("id", editCollection.id)
          .eq("user_id", user.id);

        if (updateError) throw updateError;
      } else {
        // Create new collection
        const { error: insertError } = await supabase
          .from("recipe_collections")
          .insert({
            user_id: user.id,
            name: name.trim(),
            description: description.trim() || null,
          });

        if (insertError) throw insertError;
      }

      // Reset form
      setName("");
      setDescription("");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Error saving collection:", err);
      if (err.code === "23505") {
        setError("You already have a collection with this name");
      } else {
        setError(err.message || "Failed to save collection");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {editCollection ? "Edit Collection" : "Create Collection"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Collection Name */}
            <div className="mb-4">
              <label htmlFor="collection-name" className="block text-sm font-medium text-gray-700 mb-2">
                Collection Name *
              </label>
              <input
                id="collection-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Weeknight Dinners, Meal Prep, Date Night"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
                maxLength={50}
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-1">
                {name.length}/50 characters
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label htmlFor="collection-description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                id="collection-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for this collection..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/200 characters
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || !name.trim()}
              >
                {loading ? "Saving..." : editCollection ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
