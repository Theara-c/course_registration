import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import RecommendCourse from "./RecommendCourse.jsx";
import { useEffect, useState } from "react";
import { getHomeCourses } from "../api/courseApi.js";

const chooseUs = [
  {
    icon: "📚",
    title: "Flexible Learning",
    content: "Access courses anytime, anywhere at your own pace.",
  },
  {
    icon: "🚀",
    title: "Progress Tracking",
    content: "Stay motivated with learning analytics and milestones.",
  },
  {
    icon: "🌍",
    title: "Global Certification",
    content: "Earn certificates recognized worldwide.",
  },
];


export default function LandingPage() {
  const [data, setData] = useState({courses: []});
  const navigate = useNavigate();

  const fetchHomePage = async () => {
    try {
      const c = await getHomeCourses();
      setData(c);
      console.log(c);
    } catch (err) {
      console.log("error ", err.message);
    }
  };
  useEffect(() => {
    fetchHomePage();
  }, []);

  return (
    <div className="bg-[#F7F8FC]">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-5xl font-bold text-[#142175] leading-tight">
              Unlock Your Potential
              <br />
              with Expert-Led Courses
            </h1>

            <p className="text-gray-600 mt-6">
              Master in-demand skills with high-quality education designed for
              the modern world.
            </p>
            <button
              className="bg-[#142175] text-white px-6 py-3 rounded-lg mt-5 cursor-pointer  "
              onClick={() => navigate("/courses")} id = 'move'
            >
              Explore Courses →
            </button>
          </div>

          <div className="bg-[#142175] rounded-2xl p-8 shadow-xl">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNoQcFQwFuJAur3UflOJa_8opg_Y0k6xaAC-bl1G5bspjeu9uAMeMMpn8&s=10"
              alt=""
              className="rounded-xl w-full h-[300px] object-cover"
              id="move"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <h3 className="font-bold text-xl">10k+</h3>
              <p className="text-gray-500">Students</p>
            </div>

            <div>
              <h3 className="font-bold text-xl">250+</h3>
              <p className="text-gray-500">Courses</p>
            </div>

            <div>
              <h3 className="font-bold text-xl">50+</h3>
              <p className="text-gray-500">Expert Instructors</p>
            </div>

            <div>
              <h3 className="font-bold text-xl">4.8/5</h3>
              <p className="text-gray-500">Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Why Choose Us</h2>
          <p className="text-gray-500 mt-2">
            We're here for learners, experts, and growth.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {chooseUs.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl hover:text-black border hover:bg-gray-200"
              id="move"
            >
              <div className="text-[#142175] text-xl mb-4">{item.icon}</div>

              <h3 className="font-semibold text-lg">{item.title}</h3>

              <p className="text-gray-600 mt-2">{item.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex justify-between items-center mb-8 py-3">
          <div>
            <h2 className="text-3xl font-bold">Featured Courses</h2>

            <p className="text-gray-500">Our most popular learning paths</p>
          </div>

          <Link to="/courses" className="text-[#142175] font-medium cursor-pointer">
            View All Courses →
          </Link>
        </div>

        <RecommendCourse courses={data.courses} />
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-[#2F3FAE] rounded-3xl text-center py-16 px-8">
          <p className="text-white text-3xl font-bold sm:text-xl">
            Ready to start your journey?
          </p>

          <p className="text-blue-100 mt-4">
            Join thousands of students and start learning today.
          </p>

          <div className="flex justify-center gap-4 mt-8 flex-wrap">
            <button className="bg-blue-500 px-6 py-3 text-black cursor-pointer rounded-lg font-medium hover:text-white">
              Enroll Now
            </button>

            <button className="bg-white/10 cursor-pointer text-white px-6 py-3 rounded-lg border border-white/20">
              Become An Instructor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
