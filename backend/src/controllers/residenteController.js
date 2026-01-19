import pool from '../config/db.js';
import Residente from '../models/Residente.js';

// Get all residentes
export const getResidentes = async (req, res) => {
  try {
    const residentes = await Residente.getAll();
    res.json(residentes);
  } catch (error) { 
    console.error('Error fetching residentes:', error);
    res.status(500).json({ message: 'Error al obtener residentes' });
  }
};

// Get residente by ID
export const getResidenteById = async (req, res) => {
  try {
    const residente = await Residente.getById(req.params.id);
    if(!residente){
        return res.status(404).json({message: 'Residente no encontrado'});      
    }else{
        res.json(residente);
    };
    } catch (error) {
    console.error('Error fetching residente by ID:', error);
    res.status(500).json({ message: 'Error al obtener residente por ID' });
  }
};
// Create new residente
export const createResidente = async (req, res) => {
  try {
    const newResidente = await Residente.create(req.body);
    res.status(201).json(newResidente);
    } catch (error) {
    console.error('Error creating residente:', error);
    res.status(500).json({ message: 'Error al crear residente' });
  }
};
// Update existing residente
export const updateResidente = async (req, res) => {
  try {
    const updatedResidente = await Residente.update(req.params.id, req.body);
    if(!updatedResidente){
        return res.status(404).json({message: 'Residente no encontrado'});      
    }
    res.json(updatedResidente);
  } catch (error) {
    console.error('Error updating residente:', error);
    res.status(500).json({ message: 'Error al actualizar residente' });
  }
};
// Delete existing residente
export const deleteResidente = async (req, res) => {
  try {
    const residente = await Residente.getById(req.params.id);   
    if(!residente){
        return res.status(404).json({message: 'Residente no encontrado'});      
    }
    await Residente.delete(req.params.id);
    res.json({ message: 'Residente eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting residente:', error);
    res.status(500).json({ message: 'Error al eliminar residente' });
  }
};