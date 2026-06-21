import { useState } from "react";

const courses = [
  {
    id: 1,
    title: "UI/UX Masterclass",
    category: "Begineer",
    rating: 4.9,
    students: "1.2k",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
    description: "Master modern design tools and principles.",
  },
  {
    id: 2,
    title: "Advanced React",
    category: "Development",
    rating: 4.7,
    students: "850",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    description: "Learn server components, state management.",
  },
  {
    id: 3,
    title: "Product Strategy",
    category: "Business",
    rating: 4.8,
    students: "2.1k",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
    description: "Frameworks for scaling products.",
  },
  {
    id: 4,
    title: "Python for Data Science",
    category: "Development",
    rating: 5.0,
    students: "3.4k",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNoQcFQwFuJAur3UflOJa_8opg_Y0k6xaAC-bl1G5bspjeu9uAMeMMpn8&s=10",
    description: "From basics to machine learning models.",
  },
];

export default function Course() {
  const [search, setSearch] = useState("");

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(search.toLowerCase()) || 
    course.category.toLowerCase().includes(search.toLowerCase()) 
  );

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">

      {/* Search */}
      <div className="mb-10">
        <div className="relative max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

          <input
            type="text"
            placeholder="Search for courses, skills, or mentors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#142175]"
          />
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition"
          >
            {/* Image */}
            <img
              src={course.image}
              alt={course.title}
              className="h-48 w-full object-cover"
            />

            {/* Content */}
            <div className="p-4">

              <div className="flex justify-between items-center mb-3">
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {course.category}
                </span>

                <span className="text-sm text-yellow-500">
                  ★ {course.rating}
                </span>
              </div>

              <h3 className="font-bold text-lg text-gray-800">
                {course.title}
              </h3>

              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                {course.description}
              </p>

              <div className="mt-4 text-xs text-gray-500">
                👥 {course.students} Students
              </div>

              <div className="flex justify-between items-center mt-5">
                <span className="font-bold text-[#142175]">
                  Premium
                </span>

                <button className="border border-[#142175] text-[#142175] text-xs px-3 py-1 rounded hover:bg-[#142175] hover:text-white transition">
                  Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-12">

        <button className="w-8 h-8 border rounded text-gray-500" disabled>
          ‹
        </button>

        <button className="w-8 h-8 bg-[#142175] text-white rounded">
          1
        </button>

        <button className="w-8 h-8 border rounded">
          2
        </button>

        <button className="w-8 h-8 border rounded">
          3
        </button>

        <button className="w-8 h-8 border rounded text-gray-500">
          ›
        </button>

      </div>
    </section>
  );
}