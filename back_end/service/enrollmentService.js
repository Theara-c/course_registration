import { Course, Category, Enrollment, Rating, User } from "../models/relationship.js";
import { sequelize } from "../database/db.js";
import { Op, fn, col, QueryTypes } from "sequelize";

export async function createEnrollmentRecord(user_id, course_id, status) {
  const enrollment = await Enrollment.create({
    user_id,
    course_id,
    status,
  });

  return enrollment.enrollment_id;
}
export async function updateStatus(user_id, course_id, status) {
  const [affectedRows] = await Enrollment.update(
    { status },
    {
      where: {
        user_id,
        course_id,
      },
    }
  );

  return affectedRows;
}
export async function updateProgressVideo(user_id, course_id, last_watched) {
  const [affectedRows] = await Enrollment.update(
    {
      last_watched,
    },
    {
      where: {
        user_id,
        course_id,
      },
    }
  );
  return affectedRows;
}
export async function getEnrollmentInfo( user_id, filter) {
    let query = `
    select c.title, c.course_id, c.video_id, c.duration, e.last_watched as progress, e.status from enrollment e
    join users u on e.user_id = u.user_id
    join course c on c.course_id = e.course_id
    where u.user_id = :user_id
    `;
    const replacements = {
        user_id: user_id
    }
    if ( filter && filter !== "all") {
        query += ` and e.status = :status`;
        replacements.status = filter;
    }

    const [rows] = await sequelize.query(query, { replacements });
    return rows;

}
export async function getUserInfo(user_id) {
    const [rows] = await sequelize.query(`
        select u.user_id, u.email, u.user_role, u.full_name, u.phone_number, u.date_of_birth as dob, u.gender
        from users u 
        where u.user_id = :user_id`, { replacements: { user_id } });
    return rows[0];
}

export async function getCourseEnrollment(
    course_id,
    status = "All",
    page = 1,
    limit = 20
) {
    const offset = (page - 1) * limit;
    let query = `
        SELECT
            u.user_id,
            u.full_name,

            e.enrolled_at,
            e.last_watched,
            e.status,
            c.duration,
            ROUND(
                (e.last_watched / c.duration) * 100
            ) AS progress
        FROM enrollment e
        JOIN users u
            ON u.user_id = e.user_id
        JOIN course c
            ON c.course_id = e.course_id
        WHERE e.course_id = :course_id
    `;
    const replacements = {
        course_id,
        limit,
        offset
    };
    if (status && status !== "All") {
        query += `
            AND e.status = :status
        `;
        replacements.status = status;
    }
    query += `
        ORDER BY e.enrolled_at DESC
        LIMIT :limit
        OFFSET :offset
    `;
    return await sequelize.query(query, {
        replacements,
        type: QueryTypes.SELECT
    });
}
export async function getTotalStudents(course_id, status = "All") {
    let query = `
        SELECT COUNT(*) AS totalStudents
        FROM enrollment
        WHERE course_id = :course_id
    `;
    const replacements = {
        course_id
    };
    if (status && status !== "All") {
        query += `
            AND status = :status
        `;
        replacements.status = status;
    }
    const [result] = await sequelize.query(query, {
        replacements,
        type: QueryTypes.SELECT
    });
    return result.totalStudents;
}
export async function getAverageProgress(course_id) {
    const query = `
        SELECT c.price, ROUND(AVG(
        (e.last_watched / c.duration) * 100) ) AS averageProgress
        FROM enrollment e
        JOIN course c
            ON c.course_id = e.course_id

        WHERE e.course_id = :course_id;
    `;
    const [result] = await sequelize.query(query, {
        replacements: {
            course_id
        },
        type: QueryTypes.SELECT
    });
    return result;
}
