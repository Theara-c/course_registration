import API_BASE from "./axiosAPI";


export async function createStudentAccount({full_name, email, password, dob, phone_number, gender}) {
    const res = await API_BASE.post("/auth/signup", {
        full_name,
        email,
        password,
        dob,
        phone_number,
        gender
    });
    return res.data;
}
export async function loginUser( email, password) {
    const res = await API_BASE.post("/auth/login", {
        email,
        password
    });
    return res.data;
}

export async function getCurrentUser(token) {
    const res = await API_BASE.get("/auth/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
}
