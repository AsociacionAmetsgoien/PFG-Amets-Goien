import Actividad from '../models/Actividad.js';

// Get all actividades
export const getActividades = async (req, res) => {
  try {
    const actividades = await Actividad.getAll();
    res.json(actividades);    
    } catch (error) {
    console.error('Error fetching actividades:', error);
    res.status(500).json({ message: 'Error fetching actividades' });
  }
};

// Get actividad by ID
export const getActividadById = async (req, res) => {
  try {
    const actividad = await Actividad.getById(req.params.id);
    if(!actividad){
        return res.status(404).json({message: 'Actividad not found'});      
    }else{
        res.json(actividad);
    };
    } catch (error) {
    console.error('Error fetching actividad by ID:', error);
    res.status(500).json({ message: 'Error fetching actividad by ID' });
  }
};

// Create new actividad
export const createActividad = async (req, res) => {
  try {
    const newActividad = await Actividad.create(req.body);
    res.status(201).json(newActividad);
    } catch (error) {
    console.error('Error creating actividad:', error);
    res.status(500).json({ message: 'Error creating actividad' });
  }
};

// Update existing actividad
export const updateActividad = async (req, res) => {
  try {
    const updatedActividad = await Actividad.update(req.params.id, req.body);   
    if(!updatedActividad){
        return res.status(404).json({message: 'Actividad not found'});      
    }
    res.json(updatedActividad);
  } catch (error) {
    console.error('Error updating actividad:', error);
    res.status(500).json({ message: 'Error updating actividad' });
  }
};

// Delete existing actividad
export const deleteActividad = async (req, res) => {
  try {
    const actividad = await Actividad.getById(req.params.id);   
    if(!actividad){
        return res.status(404).json({message: 'Actividad not found'});      
    }
    await Actividad.delete(req.params.id);
    res.json({ message: 'Actividad deleted successfully' });
  } catch (error) {
    console.error('Error deleting actividad:', error);
    res.status(500).json({ message: 'Error deleting actividad' });
  }
};