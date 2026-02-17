import pool from "../config/db.js";

const Actividad = {
  getAll: async () => {
    const result = await pool.query("SELECT * FROM actividades ORDER BY id DESC");
    return result.rows;
  },

  getById: async (id) => {
    const result = await pool.query("SELECT * FROM actividades WHERE id = $1", [id]);
    return result.rows[0];
  },

  create: async (actividadData) => {
    const query = `
      INSERT INTO actividades(titulo, descripcion, fecha, creador_id)
      VALUES ($1,$2,$3,$4)
      RETURNING *;
    `;
    const values = [
      actividadData.titulo, 
      actividadData.descripcion, 
      actividadData.fecha, 
      actividadData.creador_id || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  update: async (id, actividadData) => {
    const query = `
      UPDATE actividades SET titulo=$1, descripcion=$2, fecha=$3
      WHERE id=$4 RETURNING *;
    `;
    const values = [
      actividadData.titulo, 
      actividadData.descripcion, 
      actividadData.fecha, 
      id
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query("DELETE FROM actividades WHERE id=$1", [id]);
  }
};

export default Actividad;
