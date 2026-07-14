import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const courses = [
  {
    title: "Advanced React",
    author: "Dr. Sarah Chen",
    price: "$39.99",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4",
  },
  {
    title: "UI/UX Masterclass 2024",
    author: "A. Marcus Sterling",
    price: "$49.00",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  },
  {
    title: "Machine Learning Basics",
    author: "Dr. Alex Rodriguez",
    price: "$59.99",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c",
  },
];

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

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function LandingPage() {
  const navigate = useNavigate();

  function handleEnrollNow() {
    // Browsing courses doesn't require login — the actual Enroll button on
    // a course's detail page already checks login before enrolling.
    navigate("/courses");
  }

  function handleBecomeInstructor() {
    const user = getStoredUser();
    if (!user) {
      navigate("/login", { state: { redirectTo: "/signup" } });
      return;
    }
    if (user.user_role === "Administrator") {
      navigate(`/admin/${user.user_id}/dashboard`);
    } else if (user.user_role === "Lecturer") {
      navigate(`/lecturer/${user.user_id}/dashboard`);
    } else {
      // Student — go straight to Signup with the Lecturer role preselected.
      navigate("/signup", { state: { role: "Lecturer" } });
    }
  }

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
              className="bg-[#142175] text-white px-6 py-3 rounded-lg mt-5  "
              onClick={() => navigate("/courses")}
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Courses</h2>

            <p className="text-gray-500">Our most popular learning paths</p>
          </div>

          <Link to="/courses" className="text-[#142175] font-medium">
            View All Courses →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden border hover:shadow-lg transition"
            >
              <img
                src={course.image}
                alt={course.title}
                className="h-48 w-full object-cover"
              />

              <div className="p-5">
                <h3 className="font-semibold text-lg">{course.title}</h3>

                <p className="text-gray-500 text-sm mt-1">{course.author}</p>

                <div className="flex justify-between mt-4">
                  <span className="font-bold text-[#142175]">
                    {course.price}
                  </span>

                  <span className="text-green-600">★ {course.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
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
            <button
              onClick={handleEnrollNow}
              className="bg-blue-500 px-6 py-3 text-black cursor-pointer rounded-lg font-medium hover:text-white hover:bg-blue-600 transition-colors duration-200"
            >
              Enroll Now
            </button>

            <button
              onClick={handleBecomeInstructor}
              className="bg-white/10 cursor-pointer text-white px-6 py-3 rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-200"
            >
              Become An Instructor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
