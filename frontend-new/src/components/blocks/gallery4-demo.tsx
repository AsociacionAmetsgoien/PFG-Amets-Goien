"use client";
import { useEffect, useState } from "react";
import { Gallery4 } from "@/components/blocks/gallery4";

const Gallery4Demo = () => {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    try {
      // Hacemos la llamada sin autenticación para que sea pública
      const response = await fetch("http://localhost:4000/api/noticias");
      
      if (response.ok) {
        const data = await response.json();
        setNoticias(data);
      }
    } catch (error) {
      console.error("Error fetching noticias:", error);
    } finally {
      setLoading(false);
    }
  };

  const demoData = {
    title: "Noticias",
    description:
      "Descubre las últimas noticias y logros de AMETS GOIEN. Aquí compartimos historias de superación, eventos y proyectos que transforman vidas.",
    items: noticias.map((noticia) => ({
      id: `noticia-${noticia.id}`,
      title: noticia.titulo,
      description: noticia.contenido?.substring(0, 150) + "..." || "Sin descripción",
      href: "#",
      image: noticia.url_imagen || "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1080&q=80"
    }))
  };

  if (loading) {
    return (
      <section className="w-full py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xl text-[#8A4D76]">Cargando noticias...</p>
        </div>
      </section>
    );
  }

  if (noticias.length === 0) {
    return (
      <section className="w-full py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#8A4D76] mb-4">Noticias</h2>
          <p className="text-lg text-gray-600">No hay noticias publicadas aún.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4">
        <Gallery4 {...demoData} />
      </div>
    </section>
  );
};

export default Gallery4Demo;
