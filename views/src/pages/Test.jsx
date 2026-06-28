import YouTube from "react-youtube";
import { useState, useEffect, useRef } from "react";

export default function Test() {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0); // Changed to state
  const intervalRef = useRef(null); // Keep track of interval safely

  const handleReady = (event) => {
    const player = event.target;
    player.seekTo(300, true);

    // 1. Set duration state (triggers a clean render immediately)
    setDuration(player.getDuration()); 

    // 2. Clear any existing intervals to prevent memory leaks
    if (intervalRef.current) clearInterval(intervalRef.current);

    // 3. Update current time every second
    intervalRef.current = setInterval(() => {
      setCurrentTime(player.getCurrentTime());
    }, 1000);
  };

  // 4. Always clean up your intervals when the component unmounts
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="p-4 space-y-2">
      <YouTube videoId="ELEpGv1AbSo" onReady={handleReady} />
      <p className="font-medium text-gray-700">Current Time: {currentTime.toFixed(1)} sec</p>
      <p className="font-medium text-gray-700">Duration: {duration.toFixed(1)} sec</p>
    </div>
  );
}