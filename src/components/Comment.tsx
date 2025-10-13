"use client";

import { useState } from "react";
import Image from "next/image";
import { User } from "lucide-react";

type CommentProps = {
  comment: {
    id: string;
    user_id: string;
    comment_text: string;
    image_url: string | null;
    created_at: string;
    updated_at: string;
    user_name: string;
    user_avatar?: string;
  };
  currentUserId: string | null;
  onEdit: (commentId: string, newText: string, newImage: File | null) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
};

export default function Comment({ comment, currentUserId, onEdit, onDelete }: CommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.comment_text);
  const [editImage, setEditImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const isOwner = currentUserId === comment.user_id;
  const isEdited = comment.updated_at !== comment.created_at;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        alert("File must be an image");
        return;
      }
      setEditImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveEdit = async () => {
    if (!editText.trim() || editText.length < 10) {
      alert("Comment must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await onEdit(comment.id, editText, editImage);
      setIsEditing(false);
      setEditImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Failed to edit comment:", error);
      alert("Failed to edit comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await onDelete(comment.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete comment:", error);
      alert("Failed to delete comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
        <div className="flex items-start gap-3">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            {comment.user_avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={comment.user_avatar}
                alt={comment.user_name}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  // Hide image on error and show default icon
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center"><svg class="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>`;
                  }
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
            )}
          </div>

          {/* Comment Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-900">{comment.user_name}</span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                {isEdited && (
                  <span className="text-xs text-gray-400 italic">(edited)</span>
                )}
              </div>

              {/* Actions (only for owner) */}
              {isOwner && !isEditing && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-emerald-600 hover:text-emerald-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-xs text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {/* Comment Text */}
            {isEditing ? (
              <div className="space-y-3">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full rounded-lg border p-2 min-h-[80px] text-sm"
                  disabled={isSubmitting}
                />

                {/* Image Upload */}
                {(imagePreview || comment.image_url) && (
                  <div className="relative w-40 h-30 overflow-hidden rounded-lg">
                    <Image
                      src={imagePreview || comment.image_url!}
                      alt="Preview"
                      width={160}
                      height={120}
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setEditImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer text-xs text-gray-600 hover:text-gray-800">
                    📷 {imagePreview || comment.image_url ? "Change" : "Add"} Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                  </label>

                  <div className="flex-1" />

                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditText(comment.comment_text);
                      setEditImage(null);
                      setImagePreview(null);
                    }}
                    className="text-xs text-gray-600 hover:text-gray-800"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded hover:bg-emerald-700 disabled:opacity-50"
                    disabled={isSubmitting || !editText.trim() || editText.length < 10}
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-800 text-sm whitespace-pre-wrap break-words">
                  {comment.comment_text}
                </p>

                {/* Comment Image */}
                {comment.image_url && (
                  <div
                    className="mt-3 relative w-full max-w-sm aspect-[4/3] cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => setShowImageModal(true)}
                  >
                    <Image
                      src={comment.image_url}
                      alt="Comment image"
                      fill
                      sizes="(max-width: 640px) 90vw, 384px"
                      className="object-cover hover:opacity-95 transition-opacity"
                      loading="lazy"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Delete Comment?</h3>
            <p className="text-sm text-gray-600 mb-4">
              This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && comment.image_url && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative w-full h-full max-w-4xl max-h-4xl">
            <Image
              src={comment.image_url}
              alt="Comment image"
              fill
              className="object-contain"
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
