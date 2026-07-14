import API_BASE from "./axiosAPI";
export const getCourses  = async ( params, id ) => {
    if (id) {

        const response = await API_BASE.get ( `/courses/${id}/private?${params}` );
        return response.data;
    }
        const response = await API_BASE.get ( `/courses?${params}` );
        return response.data;
    }
export const getCourseById = async (id) => {
    const res = await API_BASE.get(`/courses/${id}`);
    return res.data;
}
export const getHomeCourses = async () => {

    const res = await API_BASE.get(`/courses?limit=10`);
    return res.data;
}
export const getCategory = async () => {
    const res = await API_BASE.get(`/category`);
    return res.data;
}
