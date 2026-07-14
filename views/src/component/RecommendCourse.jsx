// import { useState, useEffect } from "react";
// import axios from 'axios'
// import { useParams } from "react-router-dom";
// export default function Tes() {
//   // Your user data object
//   const {id} = useParams();
//   const [users, setUser] = useState( {
//     user_id: '',
//     full_name: '',
//     email: '',
//     password: '',
//     phone_number: '',
//     telegram_link: '',
//     gender: '',
//     date_of_birth: '',
//     user_role: ''
//   });
//   const getUserById = async (id) => {
//     const response = await axios.get(`http://localhost:8000/users/${id}`);
//     console.log(response.data)
//     return response.data;
//   };

//   useEffect(() => {
//     if (!id) return;

//     let ignore = false;

//     (async () => {
//       try {
//         const user = await getUserById(id);
//         if (!ignore) {
//           setUser(user);
//         }
//       } catch (error) {
//         if (!ignore) {
//           console.error("Error fetching user:", error);
//         }
//       }
//     })();

//     return () => {
//       ignore = true;
//     };
//   }, [id]);

//   // Helper function to extract initials (e.g., "Sophea Meas" -> "SM")
//   const getInitials = (name = '') => { // FIX: default to '' so it never receives undefined
//     if (!name) return '';
//     return name
//       .split(' ')
//       .filter(Boolean)
//       .map(word => word[0])
//       .join('')
//       .toUpperCase();
//   };

//   // Format date of birth to a cleaner string (e.g., "April 15, 2003")
//   const formattedDOB = users.date_of_birth // FIX: guard against empty string before Date() is created
//     ? new Date(users.date_of_birth).toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric'
//       })
//     : '';

//   return (
//     <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mt-10">

//       {/* Decorative Top Banner */}
//       <div className="h-24 bg-[#142175]"></div>

//       {/* Profile Content Container */}
//       <div className="px-6 pb-6 relative flex flex-col items-center">

//         {/* Dynamic Initials Profile Pic/Avatar */}
//         <div className="w-24 h-24 bg-[#142175] text-white font-bold text-2xl rounded-full flex items-center justify-center border-4 border-white shadow-md absolute -top-12">
//           {getInitials(users.full_name)}
//         </div>

//         {/* User Identity Info */}
//         <div className="text-center mt-14 mb-6">
//           <h2 className="text-xl font-bold text-gray-800">{users.full_name}</h2>
//           <span className="inline-block bg-blue-50 text-[#142175] text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize mt-1">
//             {users.user_role}
//           </span>
//         </div>

//         {/* Detailed Metadata Grid */}
//         <div className="w-full space-y-3 text-sm border-t border-gray-100 pt-4">

//           <div className="flex justify-between py-1">
//             <span className="text-gray-400 font-medium">Email</span>
//             <span className="text-gray-700 font-medium">{users.email}</span>
//           </div>

//           <div className="flex justify-between py-1">
//             <span className="text-gray-400 font-medium">Phone</span>
//             <span className="text-gray-700 font-medium">{users.phone_number}</span>
//           </div>

//           <div className="flex justify-between py-1">
//             <span className="text-gray-400 font-medium">Telegram</span>
//             <a
//               href={`https://t.me/${(users.telegram_link || '').replace('@', '')}`}
//               target="_blank"
//               rel="noreferrer"
//               className="text-blue-600 hover:underline font-medium"
//             >
//               {users.telegram_link}
//             </a>
//           </div>

//           <div className="flex justify-between py-1">
//             <span className="text-gray-400 font-medium">Gender</span>
//             <span className="text-gray-700 font-medium">{users.gender}</span>
//           </div>

//           <div className="flex justify-between py-1">
//             <span className="text-gray-400 font-medium">Birthday</span>
//             <span className="text-gray-700 font-medium">{formattedDOB}</span>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import CourseCard from "./CourseCard.jsx";
import "swiper/css";
import "swiper/css/navigation";

export default function RecommendCourse({ courses }) {
  return (
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={24}
      slidesPerView={4}
    >
      {courses.map((course) => (
        <SwiperSlide key={course.course_id} className="flex justify-center">
          <CourseCard course={course} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
