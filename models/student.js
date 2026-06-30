import db from '../config/db.js';

export const Student = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM students');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM students WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (data) => {
    const { name, email, age, course } = data;
    const [result] = await db.query(
      'INSERT INTO students (name, email, age, course) VALUES (?, ?, ?, ?)',
      [name, email, age, course]
    );
    return { id: result.insertId, ...data };
  },

  update: async (id, data) => {
    const { name, email, age, course } = data;
    await db.query(
      'UPDATE students SET name = ?, email = ?, age = ?, course = ? WHERE id = ?',
      [name, email, age, course, id]
    );
    return { id, ...data };
  },

  remove: async (id) => {
    await db.query('DELETE FROM students WHERE id = ?', [id]);
    return { message: 'Student deleted successfully' };
  }
};