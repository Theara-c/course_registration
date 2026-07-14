import { useNavigate } from "react-router-dom"
export default function CourseCard ( {course}) {
    const navigate = useNavigate();

    return (
        <>
        <div
            key={course.course_id}
            className="bg-white rounded-xl border-2 shadow-sm  overflow-hidden hover:shadow-lg transition flex flex-col" 
            style={{ border: "1px solid black" }} id = 'move'
          >
            {/* Image */}
            <div className=" aspect-video overflow-hidden w-full ">
            <img
              src={`https://img.youtube.com/vi/${course.video_id}/hqdefault.jpg`}
              alt={course.title}
              className="h-full w-full object-cover "
            />
          

            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">

              <div className="flex justify-between items-center mb-3 ">
                <span className="text-xs px-2 py-1 rounded-full bg-[#142175]  text-white font-bold">
                  {course.category_name}
                </span>

                <span className="text-sm text-yellow-500">
                  ★  { course.rating ? parseInt(course.rating) : 0 }
                </span>
              </div>

              <h3 className="font-bold text-lg text-gray-800 line-clamp-2 min-h-14">
                {course.title}
              </h3>

              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                {course.sub_description}
              </p>

              <div className="mt-4 text-sm text-gray-500">
                👥 {course.totalStudent ? course.totalStudent : 0} Students
              </div>

              <div className="flex justify-between items-center mt-auto pt-5 ">
                <span className="px-3 py-1 rounded-full bg-[#142175]  text-white font-bold">
                  { course.price > 0 ? <p>{course.price } $</p> : <p>Free</p>} 
                </span>

                <button className="border border-[#142175] text-[#142175] cursor-pointer text-xs px-3 py-1 rounded hover:bg-[#142175] hover:text-white transition"
                onClick={ () => { navigate(`/courses/${course.course_id}/course_detail`)}}>
                  Preview
                </button>
              </div>
            </div>
          </div>
        
        </>
    )
}