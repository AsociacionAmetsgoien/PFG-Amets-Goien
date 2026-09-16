"use client";
import { AnimatedTestimonialsDemo } from "./ui/demo-testimonials";
import NoticiasCarousel from "@/components/NoticiasCarousel";
import { ImagesSliderDemo } from "./ui/demo-images-slider";
import { useLanguage } from '@/contexts/LanguageContext';
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

const houseImages = [
  {
    src: "/casa-patio.webp",
    altKey: "home.houseSection.images.patio",
    className: "col-span-2 row-span-2 lg:col-span-7",
  },
  {
    src: "/casa-habitacion.webp",
    altKey: "home.houseSection.images.bedroom",
    className: "col-span-1 lg:col-span-5",
  },
  {
    src: "/casa-habitacion-infantil.webp",
    altKey: "home.houseSection.images.childrenRoom",
    className: "col-span-1 lg:col-span-5",
  },
  {
    src: "/casa-restauracion.webp",
    altKey: "home.houseSection.images.restoration",
    className: "col-span-1 lg:col-span-7",
  },
  {
    src: "/casa-escalera.webp",
    altKey: "home.houseSection.images.staircase",
    className: "col-span-1 lg:col-span-5",
  },
];

const HomePage = () => {
  const { t } = useLanguage();
  const [selectedHouseImage, setSelectedHouseImage] = useState<number | null>(null);

  const showPreviousHouseImage = () => {
    setSelectedHouseImage((current) =>
      current === null ? null : (current - 1 + houseImages.length) % houseImages.length
    );
  };

  const showNextHouseImage = () => {
    setSelectedHouseImage((current) =>
      current === null ? null : (current + 1) % houseImages.length
    );
  };

  useEffect(() => {
    if (selectedHouseImage === null) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedHouseImage(null);
      if (event.key === "ArrowLeft") showPreviousHouseImage();
      if (event.key === "ArrowRight") showNextHouseImage();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedHouseImage]);
  
  return (
    <div className="bg-[#D8B8C4]">
      {/* HERO - Slider de imágenes con Amets Goien */}
      <section id="inicio" className="h-screen">
        <ImagesSliderDemo />
      </section>

      {/* SECCIÓN SOBRE AMETSGOIEN */}
      <section id="ong" className="min-h-screen flex items-center justify-center py-20" style={{ backgroundColor: '#F3E8F7' }}>
        <div className="w-full px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center mb-16">
              {/* Columna izquierda - Texto */}
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#8A4D76] text-left mb-8 tracking-tight">
                  {t('home.about.title')}
                </h1>
                <p className="text-base md:text-lg lg:text-xl mb-6" style={{ color: '#4A3A3C', lineHeight: '1.7' }}>
                  {t('home.about.description1')}
                </p>
                <p className="text-base md:text-lg lg:text-xl mb-8" style={{ color: '#4A3A3C', lineHeight: '1.7' }}>
                  {t('home.about.description2')}
                </p>
                {/* Botones de colaborar y voluntariado */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/colaborar">
                    <button 
                      className="rounded-full font-medium hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 px-8 py-3 text-lg w-full sm:w-auto"
                      style={{ 
                        backgroundColor: '#8A4D76', 
                        color: 'white',
                        letterSpacing: '0.3px',
                      }}
                    >
                      {t('home.about.collaborateBtn')}
                    </button>
                  </a>
                  <a href="/voluntarios">
                    <button 
                      className="rounded-full font-medium hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 px-8 py-3 text-lg border-2 w-full sm:w-auto"
                      style={{ 
                        color: '#8A4D76',
                        borderColor: '#8A4D76',
                        backgroundColor: 'white',
                        letterSpacing: '0.3px',
                      }}
                    >
                       {t('home.about.volunteerBtn')}
                    </button>
                  </a>
                </div>
              </div>
              {/* Columna derecha - Logo */}
              <div className="w-full h-[400px] lg:h-[500px] rounded-2xl shadow-xl bg-white flex items-center justify-center p-8 md:p-12 lg:p-16">
                <img 
                  src="/logo-blanco.svg" 
                  alt="Logo Ametsgoien" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Video dentro de la sección Sobre AMETSGOIEN */}
            <div className="mt-12">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#8A4D76] text-center mb-8 tracking-tight">
                {t('home.about.historyTitle')}
              </h3>
              <div className="w-full max-w-2xl mx-auto">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe 
                    className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-2xl"
                    src="https://www.youtube.com/embed/iCzmfyUELgA"
                    title="Presentación Amets Goien"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      

      {/* SECCIÓN DE ÚLTIMAS NOTICIAS */}
      <section id="noticias" className="py-16 bg-[#F3E8F7]">
        <div className="w-full px-4 md:px-16">
          <div className="max-w-7xl mx-auto w-full">
            <NoticiasCarousel />
          </div>
        </div>
      </section>

      {/* SECCIÓN DE TESTIMONIOS */}
      <section id="testimonios" className="min-h-screen flex items-center justify-center py-20" style={{ backgroundColor: '#F3E8F7' }}>
        <div className="w-full px-4 md:px-16">
          <div className="max-w-7xl mx-auto w-full">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#8A4D76] text-left mb-12 tracking-tight">
              {t('home.testimonials.title')}
            </h2>
            <div className="flex justify-center">
              <AnimatedTestimonialsDemo />
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE VOLUNTARIADO */}
      <section className="py-20" style={{ backgroundColor: '#8A4D76' }}>
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t('home.volunteerSection.title')}
          </h2>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            {t('home.volunteerSection.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/voluntarios">
              <button
                className="rounded-full font-bold px-10 py-4 text-lg bg-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
                style={{ color: '#8A4D76' }}
              >
                 {t('home.volunteerSection.volunteerBtn')}
              </button>
            </a>
            <a href="/colaborar">
              <button
                className="rounded-full font-bold px-10 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-[#8A4D76] hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                 {t('home.volunteerSection.donateBtn')}
              </button>
            </a>
            <a href="/contacto">
              <button
                className="rounded-full font-bold px-10 py-4 text-lg bg-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
                style={{ color: '#8A4D76' }}
              >
                {t('home.volunteerSection.contactBtn')}
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* LA CASA DE ORDUÑA */}
      <section id="la-casa" className="bg-[#F3E8F7] py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-16">
          <div className="max-w-5xl">
              <h2 className="mb-6 text-3xl font-semibold text-[#8A4D76] tracking-tight md:text-4xl lg:text-5xl">
                {t('home.houseSection.eyebrow')}
              </h2>
              <h3 className="mb-6 text-xl font-semibold text-[#4A3A3C] md:text-2xl lg:text-3xl">
                {t('home.houseSection.title')}
              </h3>
            <div className="space-y-5 text-base text-[#4A3A3C] md:text-lg lg:text-xl" style={{ lineHeight: '1.7' }}>
              <p>{t('home.houseSection.description1')}</p>
              <p>{t('home.houseSection.description2')}</p>
            </div>
          </div>

          <div className="mt-12 grid auto-rows-[190px] grid-cols-2 gap-3 sm:auto-rows-[240px] md:mt-16 md:gap-4 lg:auto-rows-[260px] lg:grid-cols-12">
            {houseImages.map((image, index) => (
              <figure
                key={image.src}
                className={`relative min-h-0 overflow-hidden rounded-lg ${image.className}`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedHouseImage(index)}
                  className="group absolute inset-0 cursor-zoom-in"
                  aria-label={`${t('home.houseSection.openImage')}: ${t(image.altKey)}`}
                >
                  <Image
                    src={image.src}
                    alt={t(image.altKey)}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 58vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#8A4D76] opacity-90 shadow-md transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                    <ZoomIn className="h-5 w-5" aria-hidden="true" />
                  </span>
                </button>
              </figure>
            ))}
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-6 text-gray-600 md:text-base">
            {t('home.houseSection.caption')}
          </p>
        </div>
      </section>

      {selectedHouseImage !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={t('home.houseSection.galleryLabel')}
          onClick={() => setSelectedHouseImage(null)}
        >
          <div
            className="relative h-[85vh] w-full max-w-7xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={houseImages[selectedHouseImage].src}
              alt={t(houseImages[selectedHouseImage].altKey)}
              fill
              priority
              sizes="95vw"
              className="object-contain"
            />

            <button
              type="button"
              onClick={() => setSelectedHouseImage(null)}
              className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#8A4D76] shadow-lg transition-transform hover:scale-105 md:right-3 md:top-3"
              aria-label={t('home.houseSection.closeGallery')}
              title={t('home.houseSection.closeGallery')}
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={showPreviousHouseImage}
              className="absolute left-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#8A4D76] shadow-lg transition-transform hover:scale-105 md:left-3"
              aria-label={t('home.houseSection.previousImage')}
              title={t('home.houseSection.previousImage')}
            >
              <ChevronLeft className="h-7 w-7" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={showNextHouseImage}
              className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#8A4D76] shadow-lg transition-transform hover:scale-105 md:right-3"
              aria-label={t('home.houseSection.nextImage')}
              title={t('home.houseSection.nextImage')}
            >
              <ChevronRight className="h-7 w-7" aria-hidden="true" />
            </button>

            <p className="absolute bottom-1 left-1/2 max-w-[80%] -translate-x-1/2 bg-black/70 px-4 py-2 text-center text-sm text-white md:bottom-3 md:text-base">
              {t(houseImages[selectedHouseImage].altKey)} ({selectedHouseImage + 1}/{houseImages.length})
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
