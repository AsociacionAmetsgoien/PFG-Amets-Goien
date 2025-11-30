const HomePage = () => {
  return (
    <div className="bg-white">
      
      {/* HERO - Nombre grande de Amets Goien */}
      <section className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#D8BFB3' }}>
        <div className="w-full px-16">
          <div className="max-w-7xl mx-auto w-full text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-8" style={{ color: '#8A4D76', lineHeight: '1.1' }}>
              Amets Goien
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#4A3A3C', lineHeight: '1.2' }}>
              Acogida, dignidad y acompañamiento
            </h2>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto" style={{ color: '#6B5D5F', lineHeight: '1.5' }}>
              Construyendo un refugio seguro junto a mujeres migrantes.
            </p>
            <button 
              className="rounded-full font-medium hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer px-6 py-2"
              style={{ 
                backgroundColor: 'white', 
                color: '#8A4D76',
                border: '2.5px solid #8A4D76',
                letterSpacing: '0.3px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              Descubre Nuestro Trabajo
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN SOBRE AMETS GOIEN */}
      <section className="min-h-screen flex items-center py-20" style={{ backgroundColor: '#D8BFB3' }}>
        <div className="w-full px-16">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Columna izquierda - Texto */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: '#8A4D76', lineHeight: '1.2' }}>
                Sobre AMETS GOIEN
              </h2>
              <p className="text-base md:text-lg mb-6" style={{ color: '#4A3A3C', lineHeight: '1.7' }}>
                AMETS GOIEN trabaja por ofrecer apoyo integral a mujeres migrantes y sus hijos, priorizando la dignidad, la seguridad emocional y el acompañamiento humano.
              </p>
              <p className="text-base md:text-lg" style={{ color: '#4A3A3C', lineHeight: '1.7' }}>
                Creemos en la importancia de construir un refugio seguro, cálido y humano, donde cada mujer pueda reencontrar su fuerza, recuperar esperanza y avanzar hacia una vida estable.
              </p>
            </div>
            
            {/* Columna derecha - Imagen placeholder */}
            <div className="w-full h-[400px] lg:h-[500px] rounded-2xl shadow-xl" style={{ backgroundColor: '#B89E93' }}></div>
          </div>
          </div>
        </div>
      </section>

      {/* BLOQUE DE LLAMADA A LA ACCIÓN */}
      <section className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#D8BFB3' }}>
        <div className="w-full px-16">
          <div className="max-w-6xl mx-auto text-center">
          <h2 className="font-bold mb-14" style={{ color: '#8A4D76', lineHeight: '1.1', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
            Colabora con AMETS GOIEN
          </h2>
          <p className="mb-16 max-w-5xl mx-auto" style={{ color: '#6B5D5F', lineHeight: '1.5', fontSize: 'clamp(1.125rem, 2.5vw, 2rem)' }}>
            Tu apoyo transforma vidas y ayuda a construir un espacio seguro, humano y digno para mujeres migrantes.
          </p>
          <button 
            className="rounded-full font-medium hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300"
            style={{ 
              backgroundColor: 'white', 
              color: '#8A4D76',
              border: '2.5px solid #8A4D76',
              padding: 'clamp(0.875rem, 1.5vw, 1.25rem) clamp(2.5rem, 4vw, 4rem)',
              fontSize: 'clamp(1rem, 1.5vw, 1.5rem)'
            }}
          >
            Colaborar / Donar
          </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE ÚLTIMAS NOTICIAS */}
      <section className="h-screen flex flex-col py-20" style={{ backgroundColor: '#F5F0EB' }}>
        <div className="w-full px-16">
          <div className="max-w-7xl mx-auto w-full">
          <h2 className="text-5xl md:text-6xl font-bold mb-24" style={{ color: '#8A4D76' }}>
            Noticias de actualidad
          </h2>
          
          <div className="flex justify-between">
            {/* Noticia 1 */}
            <article className="border-2 rounded-3xl overflow-hidden hover:shadow-2xl transition-all" style={{ borderColor: '#D8BFB3', backgroundColor: 'white', height: '60vh', width: '30%' }}>
              <div className="w-full h-64 bg-cover bg-center" style={{ backgroundColor: '#E8D4C8' }}></div>
              <div className="p-10">
                <h3 className="text-3xl font-bold mb-5" style={{ color: '#4A3A3C' }}>
                  Título de la noticia 1
                </h3>
                <p className="text-lg mb-6" style={{ color: '#6B5D5F', lineHeight: '1.8' }}>
                  Breve descripción de la noticia publicada por AMETS GOIEN.
                </p>
                <a href="#" className="inline-flex items-center font-semibold text-lg hover:underline" style={{ color: '#8A4D76' }}>
                  Leer más
                </a>
              </div>
            </article>
            
            {/* Noticia 2 */}
            <article className="border-2 rounded-3xl overflow-hidden hover:shadow-2xl transition-all" style={{ borderColor: '#D8BFB3', backgroundColor: 'white', height: '60vh', width: '30%' }}>
              <div className="w-full h-64 bg-cover bg-center" style={{ backgroundColor: '#E8D4C8' }}></div>
              <div className="p-10">
                <h3 className="text-3xl font-bold mb-5" style={{ color: '#4A3A3C' }}>
                  Título de la noticia 2
                </h3>
                <p className="text-lg mb-6" style={{ color: '#6B5D5F', lineHeight: '1.8' }}>
                  Breve descripción de la noticia publicada por AMETS GOIEN.
                </p>
                <a href="#" className="inline-flex items-center font-semibold text-lg hover:underline" style={{ color: '#8A4D76' }}>
                  Leer más
                </a>
              </div>
            </article>
            
            {/* Noticia 3 */}
            <article className="border-2 rounded-3xl overflow-hidden hover:shadow-2xl transition-all" style={{ borderColor: '#D8BFB3', backgroundColor: 'white', height: '60vh', width: '30%' }}>
              <div className="w-full h-64 bg-cover bg-center" style={{ backgroundColor: '#E8D4C8' }}></div>
              <div className="p-10">
                <h3 className="text-3xl font-bold mb-5" style={{ color: '#4A3A3C' }}>
                  Título de la noticia 3
                </h3>
                <p className="text-lg mb-6" style={{ color: '#6B5D5F', lineHeight: '1.8' }}>
                  Breve descripción de la noticia publicada por AMETS GOIEN.
                </p>
                <a href="#" className="inline-flex items-center font-semibold text-lg hover:underline" style={{ color: '#8A4D76' }}>
                  Leer más
                </a>
              </div>
            </article>
          </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE TESTIMONIOS */}
      <section className="h-screen flex flex-col py-20" style={{ backgroundColor: '#FAF6F2' }}>
        <div className="w-full px-16">
          <div className="max-w-7xl mx-auto w-full">
            <h2 className="text-5xl md:text-6xl font-bold mb-24" style={{ color: '#8A4D76' }}>
              Testimonios
            </h2>
            
            <div className="flex justify-between">
              {/* Testimonio 1 */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2" style={{ borderColor: '#D8BFB3', height: '60vh', width: '47%' }}>
                <div className="w-full h-80 flex-shrink-0 bg-cover bg-center" style={{ backgroundColor: '#E8D4C8' }}></div>
                <div className="p-12 h-[calc(60vh-20rem)] flex items-center justify-center">
                  <p className="text-2xl italic" style={{ color: '#4A3A3C', lineHeight: '1.8' }}>
                    "Gracias a AMETS GOIEN pude recuperar estabilidad, seguridad y sentirme acompañada en un momento complicado de mi vida."
                  </p>
                </div>
              </div>
              
              {/* Testimonio 2 */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2" style={{ borderColor: '#D8BFB3', height: '60vh', width: '47%' }}>
                <div className="w-full h-80 flex-shrink-0 bg-cover bg-center" style={{ backgroundColor: '#E8D4C8' }}></div>
                <div className="p-12 h-[calc(60vh-20rem)] flex items-center justify-center">
                  <p className="text-2xl italic" style={{ color: '#4A3A3C', lineHeight: '1.8' }}>
                    "Gracias a AMETS GOIEN pude recuperar estabilidad, seguridad y sentirme acompañada en un momento complicado de mi vida."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE ACTIVIDADES */}
<section className="min-h-screen flex flex-col justify-center bg-[#F5F0EB]">
  <div className="w-full px-16">
    <div className="max-w-7xl mx-auto w-full">

      <h2 className="text-6xl font-bold text-[#8A4D76] mb-16 text-left">
        Actividades y Talleres
      </h2>

      <p className="text-2xl text-[#4A3A3C] mb-20 text-left max-w-4xl">
        Cada semana ofrecemos actividades formativas y comunitarias abiertas a mujeres del programa y voluntariado. Este tablón se actualiza según la programación semanal.
      </p>

      {/* GRID DE ACTIVIDADES */}
      <div className="grid grid-cols-3 grid-rows-2 gap-x-32 gap-y-32 px-8 py-8">

        {/* Card 1 */}
        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all 
          px-12 py-10 text-left border-2 border-[#D8BFB3] mx-8 my-8"
           >
          <h3 className="text-2xl font-bold text-purple-700 mb-3">
            Taller de Capacitación Laboral
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            15 de Diciembre, 2025
          </p>
          <p className="text-gray-600 leading-relaxed">
            Formación profesional enfocada en habilidades digitales y empleabilidad para mujeres migrantes.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all
          px-12 py-10 text-left border-2 border-[#D8BFB3] mx-8 my-8"
           >
          <h3 className="text-3xl font-bold text-[#8A4D76] mb-2">
            Jornada de Integración Cultural
          </h3>
          <p className="text-xl font-semibold text-[#8A4D76] mb-2">
            20 de Diciembre, 2025
          </p>
          <p className="text-xl text-[#4A3A3C]">
            Encuentro intercultural con actividades, música y gastronomía de diferentes países.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all
            px-12 py-10 text-left border-2 border-[#D8BFB3] mx-2 my-2"
             >
          <h3 className="text-2xl font-bold text-purple-700 mb-3">
            Sesión de Apoyo Psicológico
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Todos los Lunes
          </p>
          <p className="text-gray-600 leading-relaxed">
            Espacio seguro de acompañamiento emocional y terapia grupal para el bienestar integral.
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all
            px-12 py-10 text-left border-2 border-[#D8BFB3] mx-2 my-2"
             >
          <h3 className="text-2xl font-bold text-purple-700 mb-3">
            Clases de Español
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Martes y Jueves, 18:00h
          </p>
          <p className="text-gray-600 leading-relaxed">
            Cursos de español para facilitar la integración lingüística y mejorar oportunidades laborales.
          </p>
        </div>

        {/* Card 5 */}
        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all
            px-12 py-10 text-left border-2 border-[#D8BFB3] mx-2 my-2"
             >
          <h3 className="text-2xl font-bold text-purple-700 mb-3">
            Asesoramiento Legal
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Miércoles, 10:00 - 14:00h
          </p>
          <p className="text-gray-600 leading-relaxed">
            Orientación jurídica gratuita sobre derechos, documentación y procesos de regularización.
          </p>
        </div>

        {/* Card 6 */}
        <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all
            px-12 py-10 text-left border-2 border-[#D8BFB3] mx-2 my-2"
             >
          <h3 className="text-2xl font-bold text-purple-700 mb-3">
            Taller de Autocuidado
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            5 de Enero, 2026
          </p>
          <p className="text-gray-600 leading-relaxed">
            Actividades de bienestar, mindfulness y cuidado personal para fortalecer la salud mental.
          </p>
        </div>

      </div>
    </div>
  </div>
</section>


      {/* SECCIÓN DE CONTACTO */}
      <section className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F5ECE6' }}>
        <div className="w-full px-16">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="font-bold mb-14" style={{ color: '#8A4D76', lineHeight: '1.1', fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
              Contacto
            </h2>
            <p className="mb-16 max-w-5xl mx-auto" style={{ color: '#4A3A3C', lineHeight: '1.5', fontSize: 'clamp(1.125rem, 2.5vw, 2rem)' }}>
              Para más información o colaboración, visita nuestra página de contacto.
            </p>
            <button 
              className="rounded-full font-medium hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300"
              style={{ 
                backgroundColor: '#8A4D76', 
                color: 'white',
                border: '2.5px solid #8A4D76',
                padding: 'clamp(0.875rem, 1.5vw, 1.25rem) clamp(2.5rem, 4vw, 4rem)',
                fontSize: 'clamp(1rem, 1.5vw, 1.5rem)',
                boxShadow: '0 8px 24px 0 rgba(138,77,118,0.18)'
              }}
            >
              Ir a la página de contacto
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
