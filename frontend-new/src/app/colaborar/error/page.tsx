/**
 * @file page.tsx - Página de error de pago
 * @route /colaborar/error
 * @description Página que muestra al usuario cuando un pago falla o es cancelado
 */

'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

function ErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    
    if (orderId) {
      // Intentar obtener información del pago fallido
      const checkPaymentStatus = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/payment/redsys/status/${orderId}`);
          
          if (response.ok) {
            const data = await response.json();
            setPaymentInfo(data.donacion);
          }
        } catch (err) {
          console.error('Error al verificar el pago:', err);
        } finally {
          setLoading(false);
        }
      };

      checkPaymentStatus();
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('collaborate.error.verifyingPayment')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFE5E5' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl mx-4">
        {/* Icono de error */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        {/* Título */}
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-red-600">
          {t('collaborate.error.title')}
        </h1>

        <p className="text-center text-gray-600 mb-8">
          {t('collaborate.error.message')}
        </p>

        {/* Información del pago si está disponible */}
        {paymentInfo && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-gray-800">
              {t('collaborate.error.transactionInfo')}
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('collaborate.error.amount')}</span>
                <span className="font-bold text-xl text-red-600">
                  {paymentInfo.cantidad}€
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">{t('collaborate.error.orderId')}</span>
                <span className="font-mono text-sm font-semibold text-gray-900">{paymentInfo.redsys_order_id}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('collaborate.error.status')}</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                  ✗ {paymentInfo.estado || 'Fallido'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Posibles causas */}
        <div className="bg-yellow-50 rounded-xl p-6 mb-8 border border-yellow-200">
          <h2 className="text-lg font-bold mb-4 text-yellow-900">
            {t('collaborate.error.possibleCauses')}
          </h2>
          
          <ul className="space-y-2 text-sm text-yellow-800">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>{t('collaborate.error.cancelledByUser')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>{t('collaborate.error.insufficientFunds')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>{t('collaborate.error.expiredCard')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>{t('collaborate.error.incorrectData')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>{t('collaborate.error.limitReached')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>{t('collaborate.error.bankError')}</span>
            </li>
          </ul>
        </div>

        {/* Qué puedes hacer */}
        <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-200">
          <h2 className="text-lg font-bold mb-4 text-blue-900">
            {t('collaborate.error.whatCanYouDo')}
          </h2>
          
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔵</span>
              <div>
                <p className="font-semibold mb-1">{t('collaborate.error.verifyData')}</p>
                <p className="text-blue-700">{t('collaborate.error.verifyDataDesc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🔵🔵</span>
              <div>
                <p className="font-semibold mb-1">{t('collaborate.error.contactBank')}</p>
                <p className="text-blue-700">{t('collaborate.error.contactBankDesc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">🔵🔵🔵</span>
              <div>
                <p className="font-semibold mb-1">{t('collaborate.error.tryAnotherMethod')}</p>
                <p className="text-blue-700">{t('collaborate.error.tryAnotherMethodDesc')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Llamada a la acción */}
        <div className="text-center space-y-3">
          <p className="text-gray-700 mb-4">
            {t('collaborate.error.noChargesMessage')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/colaborar')}
              className="px-6 py-3 rounded-full font-bold text-white hover:shadow-lg transition-all"
              style={{ backgroundColor: '#8A4D76' }}
            >
              {t('collaborate.error.tryAgain')}
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 rounded-full font-bold border-2 hover:shadow-lg transition-all"
              style={{ borderColor: '#8A4D76', color: '#8A4D76' }}
            >
              {t('collaborate.error.backHome')}
            </button>
          </div>
        </div>

        {/* Otras formas de colaborar */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600 mb-3">
            {t('collaborate.error.alsoCollaborate')}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 text-center border border-purple-200">
              <div className="text-2xl mb-2">📱</div>
              <p className="text-sm font-semibold text-purple-900 mb-1">{t('collaborate.error.bizum')}</p>
              <p className="text-2xl font-bold text-purple-600">12892</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 text-center border border-blue-200">
              <div className="text-2xl mb-2">🏦</div>
              <p className="text-sm font-semibold text-blue-900 mb-1">{t('collaborate.error.transfer')}</p>
              <button
                onClick={() => {
                  router.push('/colaborar#otras-formas-donar');
                }}
                className="text-xs text-blue-600 hover:underline"
              >
                {t('collaborate.error.viewAccounts')}
              </button>
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-2">
            {t('collaborate.error.needHelp')}
          </p>
          <a
            href="mailto:ametsgoien@gmail.com"
            className="text-sm font-semibold hover:underline"
            style={{ color: '#8A4D76' }}
          >
            ametsgoien@gmail.com
          </a>
          <span className="text-gray-400 mx-2">|</span>
          <a
            href="/contacto"
            className="text-sm font-semibold hover:underline"
            style={{ color: '#8A4D76' }}
          >
            {t('collaborate.error.contactForm')}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600"></div>
          </div>
        }>
          <ErrorContent />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
