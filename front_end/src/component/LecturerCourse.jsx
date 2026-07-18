import { Users, ChevronRight } from "lucide-react";

export default function LecturerCourse({ info }) {
  const { image, title, students, completion } = info;
  return (
    <div className="w-[290px] rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition">
      {/* Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h2 className="text-4xl font-bold text-[#1B3A8A] leading-tight">
          {title}
        </h2>

        {/* Students */}
        <div className="flex items-center gap-2 mt-5 text-gray-700">
          <Users size={18} />
          <span className="text-lg">
            <span className="font-semibold">{students.toLocaleString()}</span>{" "}
            Enrolled Students
          </span>
        </div>

        {/* Progress */}
        <div className="mt-8">
          <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
            <span>Overall Completion</span>
            <span>{completion}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full bg-teal-700 rounded-full"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        {/* Button */}
        <button className="mt-8 w-full bg-blue-100 hover:bg-blue-200 transition rounded-xl py-4 flex items-center justify-center gap-2 text-[#1B3A8A] font-medium text-lg">
          View Student Details
          <ChevronRight size={22} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}