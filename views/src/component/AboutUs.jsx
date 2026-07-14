import { Link } from "react-router-dom";
import {
  FaLightbulb,
  FaUsers,
  FaGlobe,
  FaLinkedin,
  FaEnvelope,
  FaTelegram,
} from "react-icons/fa";
import ra from '../assets/ra.webp'
import liya from '../assets/riya.webp'
import mean from "../assets/sokmean.webp"
const timeline = [
  {
    year: "1",
    title: "The Spark",
    description:
      "Started as a research project to make online education accessible for everyone.",
  },
  {
    year: "2",
    title: "Expansion",
    description:
      "Started developing the platform and expanding our team.",
  },
  {
    year: "3",
    title: "Today & Beyond",
    description:
      "Building education platform for lifelong learners.",
  },
];

const values = [
  {
    icon: <FaLightbulb size={22} />,
    title: "Innovation",
    description:
      "We continuously improve learning through technology and creativity.",
  },
  {
    icon: <FaUsers size={22} />,
    title: "Accessibility",
    description:
      "Education should be available to everyone regardless of location.",
  },
  {
    icon: <FaGlobe size={22} />,
    title: "Community",
    description:
      "Learning grows stronger through collaboration and shared knowledge.",
  },
];
const leaders = [
  {
    name: "Mrs. Sokmean Lehn",
    role: "Founder & CEO",
    image: mean,
    description: "I enjoy turning ideas into simple, efficient, and user-friendly software solutions, and I continuously improve my technical skills."
  },
  {
    name: "Mrs. Riya La",
    role: "CTO",
    image: liya,
    description: "Passionate about technology and education, striving to develop scalable technology solutions that improve education and enhance user experience.  "
  },
  {
    name: "Mr. Sotheara Long",
    role: "Head of Content",
    image: ra,
    description: "Passionate about gambling and believe in No risk, no ferrari. "
  }
];

export default function AboutUs() {
  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>

            <h1 className="text-5xl font-bold text-[#142175] mt-6 leading-tight">
              Empowering the future of education.
            </h1>

            <p className="text-gray-500 mt-6 text-lg">
              We believe quality education should be accessible to everyone.
              EduFlow connects learners with practical skills for tomorrow.
            </p>

            <div className="flex gap-4 mt-8">
              <Link
                to="/courses"
                className="bg-[#142175] text-white px-6 py-3 rounded-lg  hover:-translate-y-2 transition"
              >
                Explore Courses
              </Link>
            </div>
          </div>

          <img
            src='https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200'
            className="rounded-2xl shadow-xl border "
            alt=""
            id = "move"
          />

        </div>

      </section>

      {/* Mission */}

      <section className="bg-gray-50 py-20">

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">

          <div>

            <h2 className="text-4xl font-bold text-[#142175]">
              Our Mission
            </h2>

            <div className="w-20 h-1 bg-green-500 mt-4 mb-8"></div>

            <p className="text-gray-600 leading-8">
              EduFlow was founded with one mission:
              make high-quality learning available to everyone.
            </p>

            <p className="text-gray-600 leading-8 mt-6">
              We provide flexible online education that helps students,
              professionals, and lifelong learners achieve their goals.
            </p>

          </div>

          <div className="space-y-6">

            {timeline.map((item) => (

              <div
                key={item.year}
                className="bg-white rounded-xl shadow p-6 flex gap-5"
              >

                <div className="w-16 px-5 h-16 rounded-full bg-[#142175] text-white flex items-center justify-center font-bold text-xl">
                  {item.year}
                </div>

                <div>

                  <h3 className="text-xl font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 mt-2">
                    {item.description}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Values */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="text-center">

          <h2 className="text-4xl font-bold text-[#142175]">
            Guided by Values
          </h2>

          <p className="text-gray-500 mt-3">
            The principles that drive every decision we make.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

          {values.map((value) => (

            <div
              key={value.title}
              className="border rounded-2xl p-8 hover:shadow-xl transition"
            >

              <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-[#142175]">
                {value.icon}
              </div>

              <h3 className="text-xl font-semibold mt-6">
                {value.title}
              </h3>

              <p className="text-gray-500 mt-4 leading-7">
                {value.description}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* Leadership */}

      <section className="bg-gray-50 py-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="flex justify-between items-center">

            <div>

              <h2 className="text-4xl font-bold text-[#142175]">
                Meet Our Leadership
              </h2>

              <p className="text-gray-500 mt-3">
                Passionate educators building the future of learning.
              </p>

            </div>

          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

            {leaders.map((person) => (

              <div
                key={person.name}
                className="bg-white rounded-xl shadow overflow-hidden hover:-translate-y-2 transition"
              >

                <img
                  src={person.image}
                  alt=""
                  className="h-72 w-full object-cover"
                />

                <div className="p-6">

                  <h3 className="font-bold text-xl">
                    {person.name}
                  </h3>

                  <p className="text-green-600 mt-2">
                    {person.role}
                  </p>

                  <p className="text-gray-500 mt-4 text-sm">
                    {person.description}
                  </p>

                  <div className="flex gap-3 mt-6">

                    <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <FaLinkedin />
                    </button>

                    <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <FaTelegram />
                    </button>

                    <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <FaEnvelope />
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

    </div>
  );
}