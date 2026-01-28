import Donacion from '../models/Donacion.js';
import pool from '../config/db.js';

// Obtener todas las donaciones con información del colaborador
export const getAllDonaciones = async (req, res) => {
  try {
    const query = `
      SELECT 
        d.*,
        c.nombre || ' ' || c.apellidos AS colaborador_nombre,
        c.email AS colaborador_email
      FROM donaciones d
      LEFT JOIN colaboradores c ON d.colaborador_id = c.id
      ORDER BY d.created_at DESC
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching donaciones:', error);
    res.status(500).json({ message: 'Error al obtener donaciones', error: error.message });
  }
};

// Obtener donación por ID
export const getDonacionById = async (req, res) => {
  try {
    const { id } = req.params;
    const donacion = await Donacion.getById(id);
    
    if (!donacion) {
      return res.status(404).json({ message: 'Donación no encontrada' });
    }
    
    res.json(donacion);
  } catch (error) {
    console.error('Error fetching donacion:', error);
    res.status(500).json({ message: 'Error al obtener donación', error: error.message });
  }
};

// Obtener donaciones por colaborador
export const getDonacionesByColaborador = async (req, res) => {
  try {
    const { colaborador_id } = req.params;
    const query = `
      SELECT * FROM donaciones
      WHERE colaborador_id = $1
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query, [colaborador_id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching donaciones by colaborador:', error);
    res.status(500).json({ message: 'Error al obtener donaciones del colaborador', error: error.message });
  }
};
