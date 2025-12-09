import pool from "../config/db.js";

const Noticia = {
  getAll: async () => {
    const result = await pool.query("SELECT * FROM noticias ORDER BY id DESC");
    return result.rows;
  },

  getById: async (id) => {
    const result = await pool.query("SELECT * FROM noticias WHERE id = $1", [id]);
    return result.rows[0];
  },

  create: async (noticiaData) => {
    const query = `
      INSERT INTO noticias(titulo, contenido, url_imagen, creado_por)
      VALUES ($1,$2,$3,$4)
      RETURNING *;
    `;
    const values = [
      noticiaData.titulo, 
      noticiaData.contenido, 
      noticiaData.url_imagen, 
      noticiaData.creado_por || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  update: async (id, noticiaData) => {
    const query = `
      UPDATE noticias SET titulo=$1, contenido=$2, url_imagen=$3, creado_por=$4
      WHERE id=$5 RETURNING *;
    `;
    const values = [
      noticiaData.titulo, noticiaData.contenido, noticiaData.url_imagen, noticiaData.creado_por, id
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  delete: async (id) => {
    await pool.query("DELETE FROM noticias WHERE id=$1", [id]);
  }
};

export default Noticia;
