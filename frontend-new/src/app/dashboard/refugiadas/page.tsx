"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function RefugiadasPage() {
  const router = useRouter();
  const [refugiadas, setRefugiadas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRefugiadas();
  }, []);

  const fetchRefugiadas = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/residentes", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setRefugiadas(data);
      } else if (response.status === 401) {
        router.push("/acceso-interno");
      }
    } catch (error) {
      console.error("Error fetching refugiadas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar esta refugiada?")) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/residentes/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchRefugiadas(); // Refrescar lista
      }
    } catch (error) {
      console.error("Error deleting refugiada:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#F5ECE6' }}>
        <div className="max-w-7xl mx-auto py-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="mb-6 px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            ← Volver al Dashboard
          </button>

          <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: '#8A4D76' }}>
            Gestión de Refugiadas
          </h1>

          {loading ? (
            <div className="text-center py-8">Cargando...</div>
          ) : (
            <>
              <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#8A4D76' }}>
                  Listado de Refugiadas
                </h2>
                {refugiadas.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No hay refugiadas registradas</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2" style={{ borderColor: '#8A4D76' }}>
                          <th className="text-left py-3 px-4">Nombre</th>
                          <th className="text-left py-3 px-4">Apellidos</th>
                          <th className="text-left py-3 px-4">Nacionalidad</th>
                          <th className="text-left py-3 px-4">Edad</th>
                          <th className="text-left py-3 px-4">Fecha Entrada</th>
                          <th className="text-left py-3 px-4">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {refugiadas.map((refugiada) => (
                          <tr key={refugiada.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">{refugiada.nombre}</td>
                            <td className="py-3 px-4">{refugiada.apellidos}</td>
                            <td className="py-3 px-4">{refugiada.nacionalidad}</td>
                            <td className="py-3 px-4">{refugiada.edad}</td>
                            <td className="py-3 px-4">{refugiada.fecha_entrada ? new Date(refugiada.fecha_entrada).toLocaleDateString() : 'N/A'}</td>
                            <td className="py-3 px-4 flex gap-2">
                              <button
                                className="px-4 py-2 rounded-lg text-white"
                                style={{ backgroundColor: '#8A4D76' }}
                              >
                                Ver Ficha
                              </button>
                              <button
                                onClick={() => handleDelete(refugiada.id)}
                                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <button
                className="px-8 py-4 rounded-2xl text-white font-semibold hover:shadow-xl transition-all"
                style={{ backgroundColor: '#8A4D76' }}
                onClick={() => alert("Funcionalidad de añadir nueva refugiada pendiente")}
              >
                + Añadir Nueva Refugiada
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
