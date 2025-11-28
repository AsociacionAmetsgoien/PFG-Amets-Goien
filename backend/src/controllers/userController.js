import pool from '../config/db.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

 //Method for user registration
export const registerUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create(
      { username, password: hashed, role },
      pool
    );

    res.status(201).json({ msg: "User created", user });
  } catch (err) {
    console.error('Error in registerUser:', err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Method for user login
export const loginUser = async (req, res) => {
    try{
        const {username, password} = req.body;
        
        if (!username || !password) {
            return res.status(400).json({message: 'Missing fields'});
        }
        
        const user = await User.findByUsername(username, pool);
        if(!user){
            return res.status(400).json({message: 'Invalid credentials'});
        }
        
        // Validar que el usuario tenga contraseña antes de comparar
        if(!user.password){
            return res.status(400).json({message: 'Invalid credentials'});
        }
        
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(400).json({message: 'Invalid credentials'});
        }
        
        const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1d'});
        res.json({message: 'Login successful', token});
    }catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error'});
    }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.getAll(pool);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.getById(req.params.id, pool);
    if(!user){
        return res.status(404).json({message: 'User not found'});      
    }else{
        res.json(user);
    };
    } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ message: 'Error fetching user by ID' });
  }
};

// Update existing user
export const updateUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const updatedData = { username, role };
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }
    const updatedUser = await User.update(req.params.id, updatedData, pool);
    if(!updatedUser){
        return res.status(404).json({message: 'User not found'});      
    }
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

// Delete existing user
export const deleteUser = async (req, res) => {
  try { 
    const user = await User.getById(req.params.id, pool);   
    if(!user){
        return res.status(404).json({message: 'User not found'});      
    }
    await User.delete(req.params.id, pool);
    res.json({message: 'User deleted'});
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
};