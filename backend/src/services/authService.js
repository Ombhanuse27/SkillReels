import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const registerUser = async (name, email, password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );
        return result.rows[0];
    } catch (err) {
        if (err.code === '23505') throw { status: 409, message: 'Email is already registered.' };
        throw err;
    }
};

export const loginUser = async (email, password) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) throw new Error('Invalid email or password');

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Invalid email or password');

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return { token, user: { id: user.id, email: user.email } };
};

export const getUserById = async (id) => {
    const result = await pool.query('SELECT id, email, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
};