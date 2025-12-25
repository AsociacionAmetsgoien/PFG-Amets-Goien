// API configuration and helper functions
const API_BASE_URL = "http://localhost:4000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

// Tareas API
export const tareasAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/tareas`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error fetching tareas");
    return response.json();
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error fetching tarea");
    return response.json();
  },

  create: async (tareaData: any) => {
    const response = await fetch(`${API_BASE_URL}/tareas`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(tareaData)
    });
    if (!response.ok) throw new Error("Error creating tarea");
    return response.json();
  },

  update: async (id: number, tareaData: any) => {
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(tareaData)
    });
    if (!response.ok) throw new Error("Error updating tarea");
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error deleting tarea");
    return response.json();
  }
};

// Noticias API
export const noticiasAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/noticias`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error fetching noticias");
    return response.json();
  },

  create: async (noticiaData: any) => {
    const response = await fetch(`${API_BASE_URL}/noticias`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(noticiaData)
    });
    if (!response.ok) throw new Error("Error creating noticia");
    return response.json();
  },

  update: async (id: number, noticiaData: any) => {
    const response = await fetch(`${API_BASE_URL}/noticias/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(noticiaData)
    });
    if (!response.ok) throw new Error("Error updating noticia");
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/noticias/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error deleting noticia");
    return response.json();
  }
};

// Actividades API
export const actividadesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/actividades`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error fetching actividades");
    return response.json();
  },

  create: async (actividadData: any) => {
    const response = await fetch(`${API_BASE_URL}/actividades`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(actividadData)
    });
    if (!response.ok) throw new Error("Error creating actividad");
    return response.json();
  },

  update: async (id: number, actividadData: any) => {
    const response = await fetch(`${API_BASE_URL}/actividades/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(actividadData)
    });
    if (!response.ok) throw new Error("Error updating actividad");
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/actividades/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error deleting actividad");
    return response.json();
  }
};

// Residentes API
export const residentesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/residentes`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error fetching residentes");
    return response.json();
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/residentes/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error fetching residente");
    return response.json();
  },

  create: async (residenteData: any) => {
    const response = await fetch(`${API_BASE_URL}/residentes`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(residenteData)
    });
    if (!response.ok) throw new Error("Error creating residente");
    return response.json();
  },

  update: async (id: number, residenteData: any) => {
    const response = await fetch(`${API_BASE_URL}/residentes/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(residenteData)
    });
    if (!response.ok) throw new Error("Error updating residente");
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/residentes/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error deleting residente");
    return response.json();
  }
};

// Users/Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) throw new Error("Login failed");
    return response.json();
  },

  logout: () => {
    localStorage.removeItem("token");
  }
};
