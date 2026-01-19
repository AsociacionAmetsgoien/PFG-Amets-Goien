/**
 * @file SkipNavigation - Enlace para saltar al contenido principal
 * @description Mejora la accesibilidad permitiendo a usuarios de lectores de pantalla saltar la navegación
 */
"use client";

export default function SkipNavigation() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:font-semibold focus:shadow-lg transition-all"
      style={{
        backgroundColor: '#8A4D76',
        color: 'white',
      }}
    >
      Saltar al contenido principal
    </a>
  );
}
