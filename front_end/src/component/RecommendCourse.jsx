
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
      {courses?.map((course) => (
        <SwiperSlide key={course.course_id} className="flex justify-center">
          <CourseCard course={course} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
