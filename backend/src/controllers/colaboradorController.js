import Colaborador from '../models/Colaborador.js';


// Get all colaboradores
export const getColaboradores = async (req, res) => {
  try {
    const colaboradores = await Colaborador.getAll();
    res.json(colaboradores);    
    } catch (error) {
    console.error('Error fetching colaboradores:', error);
    res.status(500).json({ message: 'Error al obtener colaboradores' });
  }
};

// Get colaborador by ID
export const getColaboradorById = async (req, res) => {
  try { 
    const colaborador = await Colaborador.getById(req.params.id);
    if(!colaborador){
        return res.status(404).json({message: 'Colaborador no encontrado'});      
    }else{
        res.json(colaborador);
    };
    } catch (error) {
    console.error('Error fetching colaborador by ID:', error);
    res.status(500).json({ message: 'Error al obtener colaborador por ID' });
  }
};

// Create new colaborador
export const createColaborador = async (req, res) => {
  try {
    const newColaborador = await Colaborador.create(req.body);
    res.status(201).json(newColaborador);
    } catch (error) {
    console.error('Error creating colaborador:', error);
    res.status(500).json({ message: 'Error al crear colaborador' });
  }
};

// Update existing colaborador
export const updateColaborador = async (req, res) => {
  try {
    const updatedColaborador = await Colaborador.update(req.params.id, req.body);   
    if(!updatedColaborador){
        return res.status(404).json({message: 'Colaborador no encontrado'});      
    }
    res.json(updatedColaborador);
  } catch (error) {
    console.error('Error updating colaborador:', error);
    res.status(500).json({ message: 'Error al actualizar colaborador' });
  }
};

// Delete existing colaborador
export const deleteColaborador = async (req, res) => {
  try {
    const colaborador = await Colaborador.getById(req.params.id);   
    if(!colaborador){
        return res.status(404).json({message: 'Colaborador no encontrado'});      
    }
    await Colaborador.delete(req.params.id);
    res.json({ message: 'Colaborador eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting colaborador:', error);
    res.status(500).json({ message: 'Error al eliminar colaborador' });
  }
};