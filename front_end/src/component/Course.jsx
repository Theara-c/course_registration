import { useEffect } from "react";
import { useState } from "react";
import { getCategory, getCourses } from "../api/courseApi";
import { useSearchParams } from "react-router-dom";
import CourseCard from "./CourseCard";
import useAuth from "../hooks/useAuth";

export default function Course() {
  const [data, setData] = useState({ courses: [] });
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const params = new URLSearchParams(searchParams);
  const page = Number(searchParams.get("page")) || 1;
  const totalPages = data.totalPages || 1;
  const { user } = useAuth();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const c = await getCourses(searchParams.toString(), token);
        setData(c);
        console.log(c);
      } catch (err) {
        console.log("error ", err);
      }
    };
    const fetchCategory = async () => {
      try {
        const c = await getCategory();
        setCategory(c);
      } catch (err) {
        console.log("Error", err);
      }
    };
    fetchCourses();

    fetchCategory();
  }, [searchParams]);
  // Pagination
  const getPages = () => {
    const pages = [];

    if (totalPages <= 5) {
      // Show all pages if there are 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (page > 3) {
      pages.push("...");
    }

    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (page < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      {/* Search */}
      <div className="mb-10">
        <div className="relative max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>

          <input
            type="text"
            placeholder="Search for courses, skills, or mentors..."
            value={searchParams.get("search") || ""}
            onChange={(e) => {
              params.set("search", e.target.value);
              setSearchParams(params);
            }}
            className="w-full pl-11 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#142175]"
          />
        </div>
        <div className="flex flex-wrap mt-3 gap-2 ">
          <button
            className={` ${selectedCategory === "" ? "bg-[#142175] text-white" : "bg-gray-200 text-black"} px-3 py-2 rounded-lg  cursor-pointer mr-2 font-medium hover:text-white hover:bg-[#142175]`}
            onClick={() => {
              params.delete("category");
              setSelectedCategory("");
              setSearchParams(params);
            }}
          >
            {" "}
            All
          </button>
          {category?.map((item, index) => (
            <button
              key={item.category_id || item.id || item.name || index}
              className={` ${selectedCategory === item.category_name ? "bg-[#142175] text-white" : "bg-gray-200 text-black"} px-3 py-2 rounded-lg  cursor-pointer mr-2 font-medium hover:text-white hover:bg-[#142175]`}
              onClick={() => {
                params.set("category", item.category_name);
                setSelectedCategory(item.category_name);
                setSearchParams(params);
              }}
            >
              {item.category_name}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.course?.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] w-full text-center py-12">
            <div className="text-gray-300 text-5xl mb-3">🔍</div>

            <p className="text-xl font-semibold text-gray-700">
              No courses found
            </p>

            <button
              onClick={() => setSearchParams("")}
              className="mt-5 px-4 py-2 bg-[#142175] cursor-pointer text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition shadow-sm"
            >
              Clear Search
            </button>
          </div>
        ) : (
          Array.isArray(data.course) &&
          data.course?.map((course, index) => (
            <CourseCard key={index} course={course} />
          ))
        )}
      </div> 

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-12">
        <button
          className="w-8 h-8 border rounded text-gray-500"
          disabled={page === 1}
          onClick={() => {
            if (page > 1) {
              setSearchParams({
                page: page - 1,
                search: searchParams.get("search"),
              });
            }
          }}
        >
          ‹
        </button>

        {getPages().map((p, i) => (
          <button
            key={i}
            className={`w-8 h-8 ${page === p ? "bg-[#142175] text-white rounded" : "border rounded"}`}
            onClick={() => {
              setSearchParams({
                page: p,
                search: searchParams.get("search")
                  ? searchParams.get("search")
                  : "",
              });
            }}
          >
            {p}
          </button>
        ))}

        <button
          className="w-8 h-8 border rounded text-gray-500"
          disabled={page >= totalPages}
          onClick={() => {
            if (page < totalPages) {
              setSearchParams({
                page: page + 1,
                search: searchParams.get("search"),
              });
            }
          }}
        >
          ›
        </button>
      </div>
    </section>
  );
}
