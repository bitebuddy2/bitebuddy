"use client";

import { useState } from "react";
import Image from "next/image";

type CommentFormProps = {
  onSubmit: (text: string, image: File | null) => Promise<void>;
};

export default function CommentForm({ onSubmit }: CommentFormProps) {
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("File must be an image");
        return;
      }

      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (comment.trim().length < 10) {
      alert("Comment must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(comment, image);
      // Reset form
      setComment("");
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts, tips, or how it turned out... (minimum 10 characters)"
        className="w-full rounded-lg border border-gray-300 p-3 min-h-[100px] focus:border-emerald-400 focus:outline-none text-sm"
        required
        disabled={isSubmitting}
      />

      {/* Character count */}
      <div className="text-xs text-gray-500">
        {comment.length} / 10 characters minimum
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div className="relative w-24 h-18 overflow-hidden rounded-lg">
          <Image
            src={imagePreview}
            alt="Preview"
            width={96}
            height={72}
            className="object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => {
              setImage(null);
              setImagePreview(null);
            }}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 text-sm"
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Image upload button */}
        <label className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">
          📷 Add Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={isSubmitting}
          />
        </label>

        <div className="flex-1" />

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting || !comment.trim() || comment.length < 10}
          className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Posting..." : "Post Comment"}
        </button>
      </div>
    </form>
  );
}
