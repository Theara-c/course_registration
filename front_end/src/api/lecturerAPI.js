import API_BASE from "./axiosAPI";

export const getLecturerDashboard = async (token) => {
  try {
    const res = await API_BASE.get(`/lecturers/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching lecturer dashboard:", error);
    throw error;
  }
};
export const createNewCourse = async (
  token, 
  {
    title,
    sub_description,
    description,
    duration,
    category_id,
    video_id,
    price,
  },
) => {
  try {
    const res = await API_BASE.post(
      `/lecturers/create`,
      {
        title,
        sub_description,
        description,
        duration,
        category_id,
        video_id,
        price,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error("Error creating new course:", error);
    throw error;
  }
};
export const getCourseEnrollment = async ( token, id, params)  => {
   try {
    const res = await API_BASE.get(`/lecturers/courses/${id}?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching lecturer dashboard:", error);
    throw error;
  }
}