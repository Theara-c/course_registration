import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { updateEnrollmentProgress, getVideoData } from "../api/enrollmentAPI";
import Youtube from "react-youtube";
import useAuth from "../hooks/useAuth";
function Video() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const { user } = useAuth();
  const { id } = useParams();

  useEffect(() => {
    const fetchCourseById = async (id) => {
      try {
        const c = await getVideoData(id, user.user_id);
        console.log(c);
        console.log("instructor", c.instructor);
        setData(c);
      } catch (error) {
        console.log({ msg: "Error fetching" }, error);
      }
    };

    fetchCourseById(id);
  }, [id]);

  // keep track of current time and duration
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const intervalRef = useRef(null);

  const handleReady = (event) => {
    const player = event.target;
    setTimeout(() => {
    player.seekTo(data.enrollments[0].last_watched, true); }, 2000);

    setDuration(player.getDuration());

    if (intervalRef.current) clearInterval(intervalRef.current);

    // 3. Update current time every 5 seconds
    intervalRef.current = setInterval(() => {
      setCurrentTime(player.getCurrentTime());
      const time = parseInt(player.getCurrentTime());
      console.log("Current Time:", time);
    }, 5000);
  };

  // 4. Always clean up your intervals when the component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const updateProgress = async (user_id, id, currentTime) => {
    try {
      await updateEnrollmentProgress(user_id, id, currentTime);
    } catch (err) {
      console.error("Error updating progress:", err);
    }
  };
  useEffect(() => {
    if (currentTime > 0 && duration > 0) {
      updateProgress(user.user_id, id, currentTime);
    }
  }, [currentTime, user.user_id, id]);

  return (
    <div className="min-h-screen w-full">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex ml-10 mt-5 items-center gap-2 bg-[#142175] text-white px-4 py-2 rounded-full cursor-pointer hover:bg-opacity-90 transition"
      >
        ← Back
      </button>

      <div className="max-w-6xl mx-auto px-6 flex flex-col justify-center items-start">
        <div className="mt-5 w-full md:w-4/5 aspect-video bg-black mb-3 rounded-xl overflow-hidden shadow-lg">
          <Youtube
            videoId={data?.video_id}
            className="w-full h-full"
            iframeClassName="w-full h-full"
            onReady={handleReady}
            opts={{
              playerVars: {
                autoplay: 0
              },
            }}
          />
        </div>

        {/* Title */}
        <p className="text-2xl text-black font-medium mt-4">{data?.title}</p>

        {/* Instructor */}
        <div className="flex items-center gap-4 mt-5">
          <i className="fa-solid fa-circle-user text-5xl text-[#142175] mb-5"></i>
          <div className="mb-5">
            <h4 className="font-bold text-black">
              {data.instructor?.full_name}
            </h4>
            <p className="text-gray-500 text-sm">
              {data.instructor?.specialization}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="font-bold text-black text-xl mt-4">Description:</p>
        <p className="mt-2 text-black max-w-2xl text-lg  leading-8">
          {data?.description}
        </p>
      </div>
    </div>
  );
}

export default Video;
