import bycrypt from "bcrypt"
import jwt from "jsonwebtoken";
import * as User from '../service/userService.js'
import dotenv from "dotenv"
import * as Action from '../service/activityService.js'
dotenv.config();

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
        role: "student",
        email: email
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

        Action.userAction(user.user_id, "Login", user.user_role, user.user_id )

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
 export const generateAccessToken = (user) => {
  try {
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "24h" });
    return token;
  } catch (err) {
    console.error("JWT signing error:", err);
    throw new Error("Error generating token.");
  }
};
