import { Course, Category, Enrollment, Rating, User } from "../models/relationship.js";
import { sequelize } from "../database/db.js";
import { Op, fn, col, QueryTypes } from "sequelize";


export async function getAllCourse(category, page = 1, limit = 12, search, offset) {

     let sqlQuery = `
      SELECT 
        c.course_id,
        c.title,
        c.video_id,
        c.sub_description,
        c.price,
        cat.category_name,
        COUNT(DISTINCT e.user_id) AS totalStudent,
        AVG(r.rating) AS rating
      FROM course  c
      LEFT JOIN category cat ON c.category_id = cat.category_id
      LEFT JOIN enrollment  e ON c.course_id = e.course_id
      LEFT JOIN rating  r ON e.enrollment_id = r.enrollment_id
      WHERE c.status = :status
    `;

    // 2. Set up dynamic filters
    const replacements = {
      status: "Active",
      limit: limit,
      offset: offset
    };

    if (search) {
      sqlQuery += ` AND (c.title LIKE :search OR c.sub_description LIKE :search)`;
      replacements.search = `%${search}%`;
    }

    if (category) {
      sqlQuery += ` AND cat.category_name = :category`;
      replacements.category = category;
    }

    sqlQuery += `
      GROUP BY c.course_id, cat.category_id
      LIMIT :limit OFFSET :offset
    `;

    // 4. Execute Raw Query
    const courses = await sequelize.query(sqlQuery, {
      replacements,
      type: QueryTypes.SELECT
    });
    return courses;
}
export async function getCourseForStudent(user_id, category, page = 1, limit = 12, search, offset) {

    let sqlQuery = `
      SELECT 
        c.course_id,
        c.title,
        c.video_id,
        c.sub_description,
        c.price,
        cat.category_name,
        COUNT(DISTINCT e.user_id) AS totalStudent,
        AVG(r.rating) AS rating
      FROM course  c
      LEFT JOIN category cat ON c.category_id = cat.category_id
      LEFT JOIN enrollment  e ON c.course_id = e.course_id
      LEFT JOIN rating  r ON e.enrollment_id = r.enrollment_id
      WHERE c.status = :status and c.course_id not in (
          select course_id 
             from enrollment 
             where user_id = :user_id
          )
    `;

    // 2. Set up dynamic filters
    const replacements = {
      status: "Active",
      limit: limit,
      offset: offset,
      user_id: user_id
    };

    if (search) {
      sqlQuery += ` AND (c.title LIKE :search OR c.sub_description LIKE :search)`;
      replacements.search = `%${search}%`;
    }

    if (category) {
      sqlQuery += ` AND cat.category_name = :category`;
      replacements.category = category;
    }
    sqlQuery += `
      GROUP BY c.course_id, cat.category_id
      LIMIT :limit OFFSET :offset
    `;


    const courses = await sequelize.query(sqlQuery, {
      replacements,
      type: QueryTypes.SELECT
    });
    return courses;
}
export async function getNumberOfCourses(category, search, id = null) {
  try {
    let sqlQuery = ` 
      SELECT COUNT(*) AS totalCourses
      FROM course AS c
      JOIN category AS a ON a.category_id = c.category_id
      WHERE c.status = 'Active'
    `;

    const replacements = {};

    // 1. Filter by category
    if ( id) {
      sqlQuery += ` AND c.course_id NOT IN (
        SELECT course_id 
        FROM enrollment
        WHERE user_id = :user_id
      )`;
      replacements.user_id = id;
    }
    if (category) {
      sqlQuery += ` AND a.category_name = :category`;
      replacements.category = category;
    }

    // 2. Filter by search
    if (search) {
      sqlQuery += ` AND (c.title LIKE :search OR a.category_name LIKE :search)`;
      replacements.search = `%${search}%`;
    }

    // 3. Execute query
    const result = await sequelize.query(sqlQuery, {
      replacements,
      type: QueryTypes.SELECT
    });

    // Returns the total number directly (defaulting to 0 if undefined)
    return result[0]?.totalCourses || 0;
    
  } catch (error) {
    console.error("Error getting number of courses via raw query:", error);
    throw error;
  }
}
export async function getCourseByIdAndUserId(course_id, user_id) {
  try {
    const course = await Course.findOne({
      where: {
        course_id: course_id,
        status: 'Active'
      },
      subQuery: false,
      include: [
        {
          model: Category,
          as: 'category', 
          attributes: ['category_name']
        },
        {
          model: User,
          as: 'instructor', 
          attributes: ['user_id', 'full_name', 'specialization']
        },
        {
          model: Enrollment,
          as: 'enrollments', 
          where: {
            user_id: user_id 
          },
          attributes: ['last_watched'],
          // required: false 
        }
      ],
      attributes: [
        'course_id',
        'title',
        'video_id',
        'sub_description',
        'duration',
        'description',
        'price'
      ],
      group: [
        'Course.course_id',
        'category.category_id',
        'instructor.user_id',
        'enrollments.enrollment_id'
      ]
    });

    return course;
  } catch (error) {
    console.error("Error fetching course by course_id and user_id:", error);
    throw error;
  }
}
export async function getCourseById(course_id) {
         const course = await Course.findOne({
      where: {
        course_id: course_id,
        status: 'Active'
      },
      subQuery: false,
      include: [
        {
          model: Category,
          as: 'category', 
          attributes: ['category_name']
        },
        {
          model: User,
          as: 'instructor', 
          attributes: ['user_id', 'full_name', 'specialization']
        },
        {
          model: Enrollment,
          as: 'enrollments',
          attributes: ['last_watched'], 
          include: [
            {
              model: Rating,
              as: 'rating',
              attributes: [] 
            }
          ]
        }
      ],
      attributes: [
        'course_id',
        'title',
        'video_id',
        'sub_description',
        'duration',
        'description',
        'price',
        [
          fn('COUNT', fn('DISTINCT', col('enrollments.user_id'))),
          'totalStudent'
        ],
        [
          fn('AVG', col('enrollments.rating.rating')),
          'rating'
        ]
      ],
      group: [
        'Course.course_id',
        'category.category_id',
        'instructor.user_id',
        'enrollments.enrollment_id' 
      ]
    });
    
    return course;
}
export async function createCourseRecord(title, description, sub_description, video_id, duration, price, category_id, user_id) {
  try {
    const newCourse = await Course.create({
      title,
      description,
      sub_description,
      video_id,
      duration,
      price,
      category_id,
      user_id,
      status: 'waiting'
    });
    return newCourse.course_id;
  }
  catch (error) {
    console.error("Error creating course record:", error);
    throw error;
  } 
}
export async function getCoursesByLecturer(user_id) {
  try {
    let query = `
     select c.course_id, c.title, c.sub_description, c.video_id, cat.category_name, c.status, count( distinct e.user_id) as totalStudent
     from course c 
     join category cat on c.category_id = cat.category_id
     left join enrollment e on c.course_id = e.course_id
     where c.user_id = :user_id
     group by c.course_id, cat.category_name, c.status;
    `;
    const courses = await sequelize.query(query, {
      replacements: { user_id },
      type: QueryTypes.SELECT
    });
    return courses;
  } catch (error) {
    console.error("Error fetching courses by lecturer:", error);
    throw error;
  }
}
export async function updateStatus(course_id, status) {
  const [affectRow] = await Course.update(
    { status},
    {
      where: {
        course_id
      }
    }
  );
}