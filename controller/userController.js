import bycrypt from "bcrypt"
import jwt from "jsonwebtoken";
import * as User from '../models/User.js'
import dotenv from "dotenv"
dotenv.config();
// create user account

export async function createStudentAccount(req, res){
 try {
    const { email, password, dob, phone_number, gender, full_name } = req.body;
    const user = await User.checkExistingUser(email);
    if ( user ){
        return res.status(400).json( {error: "Email is already exit."})
    }
    // email is not duplicated
    const passwordHash = await bycrypt.hash( password, 10);
    const newUserId = await User.createStudent(full_name,email, passwordHash, dob, phone_number, gender);

    const payload = {
        user_id: newUserId,
        role: "student"
    }
    jwt.sign ( 
        payload, 
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "2h"},
        ( err, token) => {
            if (err) {
                console.error( "JWT signing error");
                return res.status(500).json( { message: "Error generate token."})
            }
            res.json ( { 
                create: "success",
                accessToken: token,
                user: {
                    user_id: newUserId,
                    role: "student",
                    email: email
                }
            })
        }
    )
 } catch (error) {
    console.error("Error fetching User:", error);
    res.status(500).json({ message: "Server error" });
 }

}
// export async function getCurrentUser(req, res) {

//     try {
//         const user = await User.getUserById(user_id);
//         // if ( user) res.status(404).json({msg: "User no longer exit."})
//         res.json({user});

//     } catch ( error) {

//         console.error("Error fetching current user:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// }
// export async function getCurrentUser(req, res) {
//     try {
//         const token = req
//     }


// }
export async function loginUser( req, res) { 
    try {
        const { email, password } = req.body;
        const user = await User.checkExistingUser(email);
        if (!user) {
            return res.status(400).json({ error: "Invalid email or password." });
        }
        const isPasswordValid = await bycrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid email or password." });
        }
        const token = generateAccessToken({ user_id: user.user_id, role: user.user_role, email: user.email });
        res.json({
            login: "success",
            accessToken: token,
            user: {
                user_id: user.user_id,
                role: user.user_role,
                email: user.email
            }
        });

    } catch ( error ) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error" });
    }

}
export async function getCurrent(req, res) {
    res.json( {
        me: "success",
        user: {
            user_id: req.user.user_id,
            role: req.user.role,
            email: req.user.email
        }
    })
}
const generateAccessToken = (user) => {
  try {
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
    return token;
  } catch (err) {
    console.error("JWT signing error:", err);
    throw new Error("Error generating token.");
  }
};
