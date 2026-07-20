import API_BASE from "./axiosAPI";

export const createLecturerAccount = async (
  token,
  { full_name, email, password, telegram_link, specialization },
) => {
  try {
    const res = await API_BASE.post(
      `/admin/create`,
      {
        full_name: full_name,
        email: email,
        password: password,
        telegram_link: telegram_link,
        specialization: specialization,
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
export const getAdminDashboard = async (token, params) => {
  try {
    const res = await API_BASE.get(`/admin/dashboard?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    throw error;
  }
};
export const updateCourseStatus = async (token, status, course_id) => {
  try {
    const res = await API_BASE.patch(
      `/admin/dashboard/update`,
      {
        course_id: course_id,
        status: status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error("Error updating course status:", error);
    throw error;
  }
};
export const getUserManagement = async ( token, params) =>  {
  try {
    const res = await API_BASE.get(
      `/admin/dashboard/users?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error("Error updating course status:", error);
    throw error;
  }

}
export const getActivityLog = async (token) => {
  try {
    const res = await API_BASE.get(
      `/admin/dashboard/activity`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data;
  } catch (error) {
    console.error("Error updating course status:", error);
    throw error;
  }
}
