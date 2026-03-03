/**
 * @file page.tsx - Página de confirmación de pago exitoso
 * @route /colaborar/exito
 * @description Página que muestra al usuario después de un pago exitoso en Redsys
 */

'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

function ExitoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    
    if (!orderId) {
      setError('No se encontró el ID de la orden');
      setLoading(false);
      return;
    }

    // Consultar el estado del pago
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/payment/redsys/status/${orderId}`);
        
        if (response.ok) {
          const data = await response.json();
          setPaymentInfo(data.donacion);
        } else {
          setError('No se pudo verificar el estado del pago');
        }
      } catch (err) {
        console.error('Error al verificar el pago:', err);
        setError('Error de conexión');
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('collaborate.success.verifying')}</p>
        </div>
      </div>
    );
  }

  if (error || !paymentInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('collaborate.success.error')}</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/colaborar')}
            className="px-6 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors"
          >
            {t('collaborate.success.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#E8D5F2' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl mx-4">
        {/* Icono de éxito */}
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#8A4D76' }}>
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: '#8A4D76' }}>
          {t('collaborate.success.title')}
        </h1>

        <p className="text-center text-gray-600 mb-8">
          {t('collaborate.success.message')}
        </p>

        {/* Detalles del pago */}
        <div className="bg-purple-50 rounded-xl p-6 mb-8 border-2 border-purple-200">
          <h2 className="text-lg font-bold mb-4" style={{ color: '#8A4D76' }}>
            {t('collaborate.success.donationDetails')}
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t('collaborate.success.amount')}</span>
              <span className="font-bold text-xl" style={{ color: '#8A4D76' }}>
                {paymentInfo.cantidad}€
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">{t('collaborate.success.type')}</span>
              <span className="font-semibold capitalize text-gray-900">{paymentInfo.periodicidad}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">{t('collaborate.success.orderId')}</span>
              <span className="font-mono text-sm font-semibold text-gray-900">{paymentInfo.redsys_order_id}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">{t('collaborate.success.status')}</span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                ✓ {paymentInfo.estado}
              </span>
            </div>

            {paymentInfo.colaborador && (
              <div className="pt-3 border-t border-purple-200">
                <span className="text-gray-600 block mb-1">{t('collaborate.success.collaborator')}</span>
                <span className="font-semibold">
                  {paymentInfo.colaborador.nombre} {paymentInfo.colaborador.apellidos}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="font-semibold text-blue-900 mb-1">{t('collaborate.success.emailSent')}</p>
              <p className="text-sm text-blue-700">
                {t('collaborate.success.emailDescription')}
                {paymentInfo.colaborador?.email && (
                  <> en <span className="font-semibold">{paymentInfo.colaborador.email}</span></>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Llamada a la acción */}
        <div className="text-center space-y-3">
          <p className="text-gray-700 mb-4">
            {t('collaborate.success.everyDonationMatters')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 rounded-full font-bold text-white hover:shadow-lg transition-all"
              style={{ backgroundColor: '#8A4D76' }}
            >
              {t('collaborate.success.backHome')}
            </button>
            
            <button
              onClick={() => router.push('/sobre-nosotros')}
              className="px-6 py-3 rounded-full font-bold border-2 hover:shadow-lg transition-all"
              style={{ borderColor: '#8A4D76', color: '#8A4D76' }}
            >
              {t('collaborate.success.learnMore')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExitoPage() {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
          </div>
        }>
          <ExitoContent />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
