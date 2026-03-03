import pool from "../config/db.js";

const Colaborador = {
  getAll: async () => {
    const result = await pool.query("SELECT * FROM colaboradores ORDER BY id DESC");
    return result.rows;
  },

  getById: async (id) => {
    const result = await pool.query("SELECT * FROM colaboradores WHERE id = $1", [id]);
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query("SELECT * FROM colaboradores WHERE id = $1", [id]);
    return result.rows[0];
  },

  findByEmail: async (email) => {
    const result = await pool.query("SELECT * FROM colaboradores WHERE email = $1", [email]);
    return result.rows[0];
  },

  create: async (colaboradorData) => {
    const query = `
      INSERT INTO colaboradores(nombre, apellidos, email, telefono, direccion, anotacion, tipo_colaboracion, periodicidad)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *;
    `;
    const values = [
      colaboradorData.nombre, 
      colaboradorData.apellidos, 
      colaboradorData.email, 
      colaboradorData.telefono,
      colaboradorData.direccion, 
      colaboradorData.anotacion,
      colaboradorData.tipo_colaboracion || 'monetario',
      colaboradorData.periodicidad || 'puntual'
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  update: async (id, colaboradorData) => {
    const query = `
      UPDATE colaboradores SET nombre=$1, apellidos=$2, email=$3, telefono=$4,
      direccion=$5, anotacion=$6, tipo_colaboracion=$7, periodicidad=$8
      WHERE id=$9 RETURNING *;
    `;
    const values = [
      colaboradorData.nombre, 
      colaboradorData.apellidos, 
      colaboradorData.email, 
      colaboradorData.telefono,
      colaboradorData.direccion, 
      colaboradorData.anotacion,
      colaboradorData.tipo_colaboracion || 'monetario',
      colaboradorData.periodicidad || 'puntual',
      id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query("DELETE FROM colaboradores WHERE id = $1", [id]);
  }
};

export default Colaborador;
