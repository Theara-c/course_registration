import API_BASE from "./axiosAPI";

export async function createEnrollment (user_id, course_id, status ) {
    const res = await API_BASE.post(`/courses/${course_id}/enroll`, {
        user_id,
        course_id,
        status
    })

    return res;
}
export async function updateStatus( user_id,course_id, status, token) {
    const res = await API_BASE.patch(`/lecturers/courses/update`, {
        course_id,
        user_id,
        status
    }, 
{
    headers: {
        Authorization: `Bearer ${token}  `
    }
})
    return res;
}
export async function updateEnrollmentProgress(user_id, course_id, progress) {
    const last_watched = parseInt(progress);
    const res = await API_BASE.patch(`/courses/${course_id}/progress`, {
        user_id,
        course_id,
        last_watched
    });
    return res;
}
export async function studentDashboard(token, filter) {
    const res = await API_BASE.get(`/students/dashboard?${filter}`, 
        { 
            headers: {
                Authorization:  `Bearer ${token}`
            },
        }
    );
    return res.data;
}
export async function getVideoData(course_id, user_id) {
    const res = await API_BASE.get(`/courses/${course_id}/video?user_id=${user_id}`);
    return res.data;
}