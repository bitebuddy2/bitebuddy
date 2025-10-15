"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CreateCollectionModal from "./CreateCollectionModal";

interface Collection {
  id: string;
  name: string;
  description?: string;
  recipe_count?: number;
}

interface AddToCollectionButtonProps {
  recipeSlug: string;
}

export default function AddToCollectionButton({ recipeSlug }: AddToCollectionButtonProps) {
  const [user, setUser] = useState<any>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [savedCollections, setSavedCollections] = useState<Set<string>>(new Set());
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCollections();
  }, [recipeSlug]);

  async function fetchCollections() {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (!user) {
      setLoading(false);
      return;
    }

    // Fetch all user's collections
    const { data: collectionsData } = await supabase
      .from("recipe_collections")
      .select("*")
      .eq("user_id", user.id)
      .order("name");

    // Fetch which collections this recipe is in
    const { data: recipeInCollections } = await supabase
      .from("collection_recipes")
      .select("collection_id")
      .eq("recipe_slug", recipeSlug);

    setCollections(collectionsData || []);
    setSavedCollections(
      new Set((recipeInCollections || []).map((r) => r.collection_id))
    );
    setLoading(false);
  }

  async function toggleCollection(collectionId: string) {
    if (!user) return;

    const isInCollection = savedCollections.has(collectionId);

    if (isInCollection) {
      // Remove from collection
      await supabase
        .from("collection_recipes")
        .delete()
        .eq("collection_id", collectionId)
        .eq("recipe_slug", recipeSlug);

      setSavedCollections((prev) => {
        const next = new Set(prev);
        next.delete(collectionId);
        return next;
      });
    } else {
      // Add to collection
      await supabase
        .from("collection_recipes")
        .insert({
          collection_id: collectionId,
          recipe_slug: recipeSlug,
        });

      setSavedCollections((prev) => new Set(prev).add(collectionId));
    }
  }

  function handleCreateSuccess() {
    fetchCollections();
    setShowCreateModal(false);
  }

  if (!user) {
    return (
      <button
        onClick={() => window.location.href = "/account"}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 min-h-[44px] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        title="Sign in to add to collections"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        Add to Collection
      </button>
    );
  }

  return (
    <>
      <div className="relative no-print">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 min-h-[44px] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          title="Add to collection"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          Add to Collection
          {savedCollections.size > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-semibold">
              {savedCollections.size}
            </span>
          )}
        </button>

        {/* Dropdown */}
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />

            {/* Menu */}
            <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
              {/* Create New Collection Button */}
              <button
                onClick={() => {
                  setShowCreateModal(true);
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 transition-colors text-left border-b border-gray-200"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="font-medium text-emerald-600">Create New Collection</span>
              </button>

              {/* Collections List */}
              <div className="max-h-64 overflow-y-auto">
                {collections.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    <p className="mb-2">No collections yet</p>
                    <p className="text-xs">Create your first collection to organize recipes</p>
                  </div>
                ) : (
                  collections.map((collection) => {
                    const isInCollection = savedCollections.has(collection.id);
                    return (
                      <button
                        key={collection.id}
                        onClick={() => toggleCollection(collection.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        {/* Checkbox */}
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          isInCollection
                            ? "bg-emerald-600 border-emerald-600"
                            : "border-gray-300"
                        }`}>
                          {isInCollection && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>

                        {/* Collection Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {collection.name}
                          </p>
                          {collection.description && (
                            <p className="text-xs text-gray-500 truncate">
                              {collection.description}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Manage Collections Link */}
              {collections.length > 0 && (
                <div className="border-t border-gray-200">
                  <a
                    href="/account/collections"
                    className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-colors text-center"
                    onClick={() => setShowDropdown(false)}
                  >
                    Manage Collections →
                  </a>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Create Collection Modal */}
      <CreateCollectionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
}
