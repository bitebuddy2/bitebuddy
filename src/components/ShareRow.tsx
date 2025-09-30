"use client";

interface ShareRowProps {
  title: string;
  url: string;
}

export default function ShareRow({ title, url }: ShareRowProps) {
  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied!");
    }
  }

  function print() {
    window.print();
  }

  return (
    <div className="flex gap-2">
      <button onClick={print} className="rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50">
        Print
      </button>
      <button onClick={share} className="rounded-full border px-3 py-1.5 text-sm hover:bg-gray-50">
        Share
      </button>
    </div>
  );
}