import { Link } from "react-router-dom";
import { useState } from "react";
function CourseDetail() {
    const [isEnroll, setIsEnroll] = useState(false);
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid lg:grid-cols-2 gap-16">

        {/* Left */}
        <div>
          <p className="text-3xl font-bold text-black flex justify-content items-center ">
            UI/UX Masterclass
          </p>

          <p className=" text-black text-lg">
            Learn modern UI/UX design with real-world projects,
            design systems, and workflows used by top tech companies.
          </p>

          {/* Instructor */}
          <div className="flex items-center gap-4 mt-7 ">
            <i className="fa-solid fa-circle-user text-4xl text-[#142175] mb-5"></i>

            <div className = "mb-5">
              <h4 className="font-bold text-black ">
                Sarah Johnson
              </h4>

              <p className="text-gray-500 text-sm">
                Senior Product Designer
              </p>
            </div>
          </div>

          <p className="text-xl text-black mt-10">
            About this course
          </p>

          <p className="mt-7 text-black leading-8">
            This course teaches you how to design beautiful
            interfaces and seamless user experiences from
            scratch. You will learn UX strategy,
            prototyping, wireframing and modern design
            workflows.
          </p>
        </div>

        {/* Right */}
        <div className = "flex  flex-col items-center">
          <div className="bg-white rounded-2xl overflow-hidden shadow border w-8/10  ">

            <img
              src="/course.jpg"
              alt=""
              className="w-full h-64 object-cover"
            />

            <div className="p-5">

              <div className="flex justify-between">
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                  Design
                </span>

                <span>⭐ 4.9</span>
              </div>

              <p className=" text-xl mt-5">
                UI/UX Masterclass
              </p>

              <p className="text-black mt-3">
                Master modern design tools and
                principles to build beautiful products.
              </p>

            </div>
          </div>

          <button
            className="block mt-8 bg-[#142175] text-white text-center py-4 rounded-full text-sm font-medium w-5/10
            cursor-pointer "
           onClick = { () => setIsEnroll(true)}>
            {!isEnroll ? <p>Enroll Now →</p> : <p>Loading...</p> }
          </button>
        </div>

      </div>
    </div>
  );
}

export default CourseDetail;