import pool from "../config/db.js";

const Actividad = {
  getAll: async () => {
    const result = await pool.query("SELECT * FROM actividades ORDER BY id DESC");
    return result.rows;
  },

  create: async (actividadData) => {
    const query = `
      INSERT INTO actividades(titulo, descripcion, creador_id)
      VALUES ($1,$2,$3)
      RETURNING *;
    `;
    const values = [actividadData.titulo, actividadData.descripcion, actividadData.creador_id];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query("DELETE FROM actividades WHERE id=$1", [id]);
  }
};

export default Actividad;
