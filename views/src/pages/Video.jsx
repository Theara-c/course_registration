import { Link } from "react-router-dom";

function Video() {



  return (
  <>
  < div className="h-100%"> 

      {/* Back */}
      <button className="inline-flex ml-10 mt-5 items-center gap-2 bg-[#142175] text-white px-4 py-2 rounded-full"
      >
        ← Back
      </button>
    <div className="max-w-6xl mx-auto px-6 flex flex-col justify-center items-start">


      {/* Video */}
      <div className="mt-5 w-80/100 h-100 bg-black mb-3">
        <iframe width="100%" height="100%" src="https://www.youtube.com/embed/-TkoO8Z07hI?si=bjp8EpRM9kSlk13R" title="YouTube video player" frameborder="0"
         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>

      {/* Title */}
      <p className="text-2xl text-black font-medium ">
        UI/UX Masterclass
      </p>

      {/* Instructor */}
      <div className="flex items-center gap-4 mt-5 ">
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

      {/* Description */}
      <p className="mt-6 text-black  max-w-2xl leading-8">
        This course teaches you how to design beautiful
        interfaces and seamless user experiences from
        scratch. You will learn UX strategy,
        prototyping and modern product design.
      </p>
    </div>
  </div>
  </>
  );
}

export default Video;