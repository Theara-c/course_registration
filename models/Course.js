import {pool} from '../database/db.js';

export async function getCourses(limit, offset, category, search, user_id = null) {
    let query = ` 
    select c.course_id, c.title, a.category_name, count(distinct e.user_id) as totalStudent, c.video_id, c.sub_description, c.price, AVG(r.rating) as rating
        from course c
        join category a on a.category_id = c.category_id
        left join enrollment e on e.course_id = c.course_id
        left join rating r on r.enrollment_id = e.enrollment_id
        where c.status = 'Active' 
    `;
    
    const params = [];

    if (user_id) {
        query += ` and c.course_id not in (
            select course_id 
            from enrollment 
            where user_id = ?
        ) `;
        params.push(user_id);
    }

    if (category) {
        query += ` and (a.category_name = ?) `;
        params.push(category);
    }

    if (search) {
        query += ` and (c.title like ? or a.category_name like ? or c.sub_description like ?) `;
        params.push(`%${search}%`);
        params.push(`%${search}%`);
        params.push(`%${search}%`);
    }

    query += ` group by c.course_id `;
    
    if (limit !== undefined && offset !== undefined) {
        query += ` limit ? offset ?`;
        params.push(Number(limit));
        params.push(Number(offset));
    }

    query += `;`;

    const [rows] = await pool.query(query, params);
    return rows;
}

export async function getNumberOfCourses(category, search) {
    let query = ` 
    select count(*) as totalCourses
        from course c
        join category a on a.category_id = c.category_id
        where c.status = 'Active'
        
    `;
    const params = [];
    // filter by category
    if (category ) {
        query += ` and a.category_name = ?`;
        params.push(category);
    }
    // filter by search
    if (search) {
        query += ` and (c.title like ? or a.category_name like ?)`;
        params.push(`%${search}%`);
        params.push(`%${search}%`);
    }
    const [rows] = await pool.query(query, params);
    return rows[0].totalCourses;
}

export async function getCourseById(id) {
    const [rows] = await pool.query ( `
        select c.course_id, c.title, a.category_name, count(e.user_id) as totalStudent, c.video_id, c.sub_description, c.duration, c.description,
        c.price, AVG(r.rating) as rating, l.full_name, l.user_id, l.specialization, e.last_watched
        from course c
        join category a on a.category_id = c.category_id
        left join enrollment e on e.course_id = c.course_id
        left join rating r on r.enrollment_id = e.enrollment_id
        join users l on l.user_id = c.user_id
        where c.status = 'Active' and c.course_id = ?
        group by c.course_id, e.enrollment_id;
        `, [id]);
    return rows[0];
}
export async function getCourseByIdAndUserId(course_id, user_id) {

    const [rows] = await pool.query ( `
        select c.course_id, c.title, a.category_name, c.video_id, c.sub_description, c.duration, c.description,
        c.price,l.full_name, l.user_id, l.specialization, e.last_watched
        from course c
        join category a on a.category_id = c.category_id
        left join enrollment e on e.course_id = c.course_id
        join users l on l.user_id = c.user_id
        where c.status = 'Active' and c.course_id = ? and e.user_id = ?
        group by c.course_id, e.enrollment_id;
        `, [course_id, user_id]);
    return rows[0];
}