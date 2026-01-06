import pool from "../config/db.js";


const User = {

    findByUsername: async (username, pool) => {
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await pool.query(query, [username]);
        return result.rows[0];
    },

    findByEmail: async (email, pool) => {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    },

    create: async (userData, pool) => {
        const query = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role';
        const values = [userData.username, userData.password, userData.role];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    getAll: async (pool) => {
        const query = 'SELECT id, username, role, email, created_at FROM users ORDER BY id DESC';
        const result = await pool.query(query);
        return result.rows;
    },

    getById: async (id, pool) => {
        const query = 'SELECT id, username, role, email, created_at FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    update: async (id, userData, pool) => {
        const fields = [];
        const values = [];
        let paramCount = 1;

        if (userData.username) {
            fields.push(`username = $${paramCount++}`);
            values.push(userData.username);
        }
        if (userData.password) {
            fields.push(`password = $${paramCount++}`);
            values.push(userData.password);
        }
        if (userData.role) {
            fields.push(`role = $${paramCount++}`);
            values.push(userData.role);
        }
        if (userData.email) {
            fields.push(`email = $${paramCount++}`);
            values.push(userData.email);
        }

        if (fields.length === 0) {
            return null;
        }

        values.push(id);
        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING id, username, role, email`;
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    delete: async (id, pool) => {
        const query = 'DELETE FROM users WHERE id = $1';
        await pool.query(query, [id]);
    }
};

export default User;