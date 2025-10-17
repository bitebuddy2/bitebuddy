"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CreateCollectionModal from "@/components/CreateCollectionModal";
import Link from "next/link";

interface Collection {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  recipe_count?: number;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<{
    id: string;
    name: string;
    description?: string;
  } | null>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  async function fetchCollections() {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/account";
      return;
    }

    // Fetch collections with recipe counts
    const { data: collectionsData } = await supabase
      .from("recipe_collections")
      .select(`
        *,
        collection_recipes(count)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const formatted = (collectionsData || []).map((collection: any) => ({
      ...collection,
      recipe_count: collection.collection_recipes?.[0]?.count || 0,
    }));

    setCollections(formatted);
    setLoading(false);
  }

  async function deleteCollection(id: string) {
    if (!confirm("Are you sure you want to delete this collection? Recipes won't be deleted, only removed from this collection.")) {
      return;
    }

    await supabase
      .from("recipe_collections")
      .delete()
      .eq("id", id);

    fetchCollections();
  }

  function handleEdit(collection: Collection) {
    setEditingCollection({
      id: collection.id,
      name: collection.name,
      description: collection.description,
    });
    setShowCreateModal(true);
  }

  function handleModalClose() {
    setShowCreateModal(false);
    setEditingCollection(null);
  }

  function handleSuccess() {
    fetchCollections();
    setShowCreateModal(false);
    setEditingCollection(null);
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">My Collections</h1>
            <p className="text-gray-600 mt-2">Organize your saved recipes into collections</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">New Collection</span>
          </button>
        </div>

        {/* Back to Account Link */}
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Account
        </Link>
      </div>

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No collections yet</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Create your first collection to organize recipes by theme, meal type, or occasion
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Collection
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:shadow-lg hover:border-emerald-300 transition-all"
            >
              {/* Collection Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {collection.name}
                  </h3>
                  {collection.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Recipe Count */}
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm font-medium">
                  {collection.recipe_count || 0} {collection.recipe_count === 1 ? "recipe" : "recipes"}
                </span>
              </div>

              {/* Created Date */}
              <p className="text-xs text-gray-500 mb-4">
                Created {new Date(collection.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>

              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/account/collections/${collection.id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors text-sm"
                >
                  View Recipes
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <button
                  onClick={() => handleEdit(collection)}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  title="Edit collection"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => deleteCollection(collection.id)}
                  className="px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete collection"
                >
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Collection Modal */}
      <CreateCollectionModal
        isOpen={showCreateModal}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        editCollection={editingCollection || undefined}
      />
    </main>
  );
}
