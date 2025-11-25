import pool from "../config/db.js";

const Empleado = {
  getAll: async () => {
    const result = await pool.query("SELECT * FROM empleados ORDER BY id DESC");
    return result.rows;
  },

  getById: async (id) => {
    const result = await pool.query("SELECT * FROM empleados WHERE id = $1", [id]);
    return result.rows[0];
  },

  create: async (empleadoData) => {
    const query = `
      INSERT INTO empleados(nombre, apellidos, edad, dni, email, telefono,
                            direccion, cargo)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *;
    `;
    const values = [
      empleadoData.nombre, empleadoData.apellidos, empleadoData.edad, empleadoData.dni, empleadoData.email,
      empleadoData.telefono, empleadoData.direccion, empleadoData.cargo
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  update: async (id, empleadoData) => {
    const query = `
      UPDATE empleados SET nombre=$1, apellidos=$2, edad=$3, dni=$4, 
      email=$5, telefono=$6, direccion=$7, cargo=$8
      WHERE id=$9 RETURNING *;
    `;
    const values = [
      empleadoData.nombre, empleadoData.apellidos, empleadoData.edad, empleadoData.dni, empleadoData.email,
      empleadoData.telefono, empleadoData.direccion, empleadoData.cargo, id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query("DELETE FROM empleados WHERE id = $1", [id]);
  }
};

export default Empleado;
