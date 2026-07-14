import * as Enrollment from '../models/Enrollment.js'
export async function createEnrollment(req, res) {
    try {
        const { user_id, course_id, status} = req.body ;
        const result = await Enrollment.createEnrollmentRecord( user_id, course_id, status);
        res.json ( {
            create: "success",
            enrollment_id : result
        })
    } catch(err) {
        console.error("Error enroll in courses:", err);
    res.status(500).json({ message: "Server error" });

    }

}
export async function updateEnrollmentStatus( req, res) {
    try {
        const { user_id, course_id, status} = req.body;
        const result = await Enrollment.updateStatus( user_id, course_id, status);
        res.json ( {
            msg: "update successfully"
        })
    } catch (err) {
        console.error("Error fetching courses:", err);
    res.status(500).json({ message: "Server error" });
    }
}
export async function updateEnrollmentProgress( req, res) {
    try {
        const { user_id, course_id, last_watched} = req.body;
        const result = await Enrollment.updateProgressVideo( user_id, course_id, last_watched);
        res.json ( {
            msg: "update successfully"
        })
    } catch (err) {
        console.error("Error fetching courses:", err);
    res.status(500).json({ message: "Server error" });
    }
}
export async function getUserInfo( req, res) {
    try {
        
        const { id } = req.params;

        const { filter} = req.query;
        // res.json( req.query);


        const result = await Enrollment.getUserInfo( id);
        const enrollmentRecord = await Enrollment.getEnrollmentInfo(id, filter);
        res.json ( {
            msg: "get successfully",
            data: result,
            enrollmentRecord: enrollmentRecord
        })
    } catch (err) {
        console.error("Error fetching courses:", err);
    res.status(500).json({ message: "Server error" });
    }
}