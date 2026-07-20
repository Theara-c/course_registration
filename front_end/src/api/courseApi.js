import API_BASE from "./axiosAPI";
export const getCourses = async (params, token) => {
  if (token) {
    const response = await API_BASE.get(`/courses/user?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
  const response = await API_BASE.get(`/courses?${params}`);
  return response.data;
};
export const getCourseById = async (id, token ) => {
  if (token) {
    const res = await API_BASE.get(`/courses/${id}/student`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  }
  const res = await API_BASE.get(`/courses/${id}`);
  return res.data;
};
export const getCourseByIdForLecturer = async (id) => {

  const res = await API_BASE.get(`/courses/${id}/load`);
  return res.data;
};


export const getHomeCourses = async () => {
  const res = await API_BASE.get(`/courses/?limit=10`);
  return res.data;
};
export const getCategory = async () => {
  const res = await API_BASE.get(`/category`);
  return res.data;
};
export const updateCourse = async (token, course_id, {
    title,
    sub_description,
    description,
    duration,
    category_id,
    video_id,
    price
}) => {
  const res = await API_BASE.patch(`/courses/${course_id}/edit`,{
    title,
    sub_description,
    description,
    duration,
    category_id,
    video_id,
    price
  }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
