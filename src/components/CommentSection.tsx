"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import Link from "next/link";

type CommentType = {
  id: string;
  user_id: string;
  comment_text: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_avatar?: string;
};

type CommentSectionProps = {
  recipeSlug?: string;
  aiRecipeId?: string;
};

export default function CommentSection({ recipeSlug, aiRecipeId }: CommentSectionProps) {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const COMMENTS_PER_PAGE = 10;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const fetchComments = async (pageNum: number = 1) => {
    try {
      setLoading(true);

      // Build query
      let query = supabase
        .from("recipe_comments")
        .select("*")
        .order("created_at", { ascending: false })
        .range((pageNum - 1) * COMMENTS_PER_PAGE, pageNum * COMMENTS_PER_PAGE - 1);

      if (recipeSlug) {
        query = query.eq("recipe_slug", recipeSlug);
      } else if (aiRecipeId) {
        query = query.eq("ai_recipe_id", aiRecipeId);
      } else {
        setLoading(false);
        return;
      }

      const { data, error } = await query;

      if (error) throw error;

      // Comments already have user info stored
      if (pageNum === 1) {
        setComments(data || []);
      } else {
        setComments((prev) => [...prev, ...(data || [])]);
      }

      setHasMore(data?.length === COMMENTS_PER_PAGE);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(1);
  }, [recipeSlug, aiRecipeId]);

  const handlePostComment = async (text: string, image: File | null) => {
    if (!user) {
      window.location.href = "/account";
      return;
    }

    try {
      let imageUrl = null;

      // Upload image if exists
      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { data, error: uploadError } = await supabase.storage
          .from("comment-images")
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("comment-images").getPublicUrl(data.path);

        imageUrl = publicUrl;
      }

      // Get user display name
      const userName =
        user.user_metadata?.first_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "Anonymous";
      const userAvatar = user.user_metadata?.avatar_url || null;

      // Insert comment
      const { error: commentError } = await supabase
        .from("recipe_comments")
        .insert({
          recipe_slug: recipeSlug || null,
          ai_recipe_id: aiRecipeId || null,
          user_id: user.id,
          user_name: userName,
          user_avatar: userAvatar,
          comment_text: text,
          image_url: imageUrl,
        });

      if (commentError) throw commentError;

      // Refresh comments
      await fetchComments(1);
      setPage(1);
    } catch (error) {
      console.error("Error posting comment:", error);
      throw error;
    }
  };

  const handleEditComment = async (
    commentId: string,
    newText: string,
    newImage: File | null
  ) => {
    if (!user) return;

    try {
      const comment = comments.find((c) => c.id === commentId);
      if (!comment) return;

      let imageUrl = comment.image_url;

      // Upload new image if provided
      if (newImage) {
        const fileExt = newImage.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { data, error: uploadError } = await supabase.storage
          .from("comment-images")
          .upload(fileName, newImage);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("comment-images").getPublicUrl(data.path);

        imageUrl = publicUrl;

        // Delete old image if exists
        if (comment.image_url) {
          const oldPath = comment.image_url.split("/comment-images/")[1];
          if (oldPath) {
            await supabase.storage.from("comment-images").remove([oldPath]);
          }
        }
      }

      // Update comment
      const { error } = await supabase
        .from("recipe_comments")
        .update({
          comment_text: newText,
          image_url: imageUrl,
        })
        .eq("id", commentId);

      if (error) throw error;

      // Refresh comments
      await fetchComments(1);
      setPage(1);
    } catch (error) {
      console.error("Error editing comment:", error);
      throw error;
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const comment = comments.find((c) => c.id === commentId);
      if (!comment) return;

      // Delete image if exists
      if (comment.image_url) {
        const imagePath = comment.image_url.split("/comment-images/")[1];
        if (imagePath) {
          await supabase.storage.from("comment-images").remove([imagePath]);
        }
      }

      // Delete comment
      const { error } = await supabase
        .from("recipe_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      // Refresh comments
      await fetchComments(1);
      setPage(1);
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments(nextPage);
  };

  if (loading && page === 1) {
    return (
      <div className="py-8 text-center text-gray-500">
        <div className="inline-flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading comments...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Community Comments ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      {user ? (
        <div className="bg-gray-50 rounded-lg p-4">
          <CommentForm onSubmit={handlePostComment} />
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-900">
            <Link href="/account" className="font-semibold hover:underline">
              Sign in
            </Link>{" "}
            to share your thoughts and photos!
          </p>
        </div>
      )}

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
          <p className="text-lg mb-2">No comments yet</p>
          <p className="text-sm">
            Be the first to share your thoughts about this recipe!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              currentUserId={user?.id || null}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
            />
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center pt-4">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                {loading ? "Loading..." : "Load More Comments"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
