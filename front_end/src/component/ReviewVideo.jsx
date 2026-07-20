import React from "react";
import { X } from "lucide-react";

export default function ReviewVideo({
  onClose,
  title,
  videoUrl,
  onApprove,
}) {


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/5 backdrop-blur-sm">
      <div className="w-[900px] rounded-2xl bg-white p-6 shadow-2xl">

        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            Reviewing: {title}
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Video */}
        <div className="overflow-hidden rounded-xl border border-gray-700">
          <iframe
            className="aspect-video w-full"
            src={ `https://www.youtube.com/embed/${videoUrl}`}
            title="Course Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="rounded-lg border-black border  bg-white text-black px-6 py-2 transition hover:bg-red-500 hover:text-white "
          >
            Close Video
          </button>

          <button
            onClick={() => onApprove()}
            className="rounded-lg bg-green-500 px-6 py-2 font-semibold text-white transition hover:bg-green-600"
          >
            Approve Course
          </button>
        </div>
      </div>
    </div>
  );
}