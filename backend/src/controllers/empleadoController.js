import Empleado from '../models/Empleado.js';


// Get all empleados
export const getEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.getAll();
    res.json(empleados);    
    } catch (error) {
    console.error('Error fetching empleados:', error);
    res.status(500).json({ message: 'Error fetching empleados' });
  }
};

// Get empleado by ID
export const getEmpleadoById = async (req, res) => {
  try {
    const empleado = await Empleado.getById(req.params.id);
    if(!empleado){
        return res.status(404).json({message: 'Empleado not found'});      
    }else{
        res.json(empleado);
    };
    } catch (error) {
    console.error('Error fetching empleado by ID:', error);
    res.status(500).json({ message: 'Error fetching empleado by ID' });
  }
};

// Create new empleado
export const createEmpleado = async (req, res) => {
  try {
    const newEmpleado = await Empleado.create(req.body);
    res.status(201).json(newEmpleado);
    } catch (error) {
    console.error('Error creating empleado:', error);
    res.status(500).json({ message: 'Error creating empleado' });
  }
};

// Update existing empleado
export const updateEmpleado = async (req, res) => {
  try {
    const updatedEmpleado = await Empleado.update(req.params.id, req.body);
    if(!updatedEmpleado){
        return res.status(404).json({message: 'Empleado not found'});      
    }
    res.json(updatedEmpleado);
  } catch (error) {
    console.error('Error updating empleado:', error);
    res.status(500).json({ message: 'Error updating empleado' });
  }
};

// Delete existing empleado
export const deleteEmpleado = async (req, res) => {
  try {
    const empleado = await Empleado.getById(req.params.id);   
    if(!empleado){
        return res.status(404).json({message: 'Empleado not found'});      
    }
    await Empleado.delete(req.params.id);
    res.json({ message: 'Empleado deleted successfully' });
  } catch (error) {
    console.error('Error deleting empleado:', error);
    res.status(500).json({ message: 'Error deleting empleado' });
  }
};

