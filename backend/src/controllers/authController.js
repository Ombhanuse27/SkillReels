import { registerUser, loginUser, getUserById } from '../services/authService.js';

export const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await registerUser(email, password);
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const data = await loginUser(email, password);
        res.json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const getMe = async (req, res, next) => {
    try {
        const user = await getUserById(req.user.id);
        res.json(user);
    } catch (err) {
        next(err);
    }
};