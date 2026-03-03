/**
 * @file RedsysPaymentForm.tsx
 * @description Formulario para procesar pagos con Redsys (TPV Virtual de La Caixa)
 * Incluye soporte para Bizum
 */

'use client';
import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RedsysPaymentFormProps {
  amount: number;
  redsysParams: {
    Ds_SignatureVersion: string;
    Ds_MerchantParameters: string;
    Ds_Signature: string;
    redsysUrl: string;
  };
  orderId: string;
}

export default function RedsysPaymentForm({ amount, redsysParams, orderId }: RedsysPaymentFormProps) {
  const { t } = useLanguage();
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-submit del formulario cuando se monta el componente
  useEffect(() => {
    // Pequeño delay para que el usuario vea que se está redirigiendo
    const timer = setTimeout(() => {
      if (formRef.current && !submitting) {
        setSubmitting(true);
        formRef.current.submit();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleManualSubmit = () => {
    if (formRef.current && !submitting) {
      setSubmitting(true);
      formRef.current.submit();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        
        <h3 className="text-2xl font-bold mb-2" style={{ color: '#8A4D76' }}>
          {t('collaborate.redsys.redirecting')}
        </h3>
        
        <p className="text-gray-600 mb-4">
          {t('collaborate.redsys.description')}
        </p>

        <div className="bg-purple-50 rounded-lg p-4 mb-6 border border-purple-200">
          <p className="text-sm text-purple-800 mb-2">
            <strong>{t('collaborate.redsys.amountToPay')}</strong> {amount.toFixed(2)}€
          </p>
          <p className="text-sm text-purple-700 mb-2">
            <strong>{t('collaborate.redsys.orderId')}</strong> {orderId}
          </p>
          <p className="text-xs text-gray-600">
            {t('collaborate.redsys.paymentOptions')}
          </p>
        </div>

        {submitting ? (
          <div className="flex flex-col items-center gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
            <p className="text-sm text-gray-600">{t('collaborate.redsys.redirectingText')}</p>
          </div>
        ) : (
          <button
            onClick={handleManualSubmit}
            className="w-full py-3 px-6 rounded-full text-white font-bold hover:shadow-lg transition-all"
            style={{ backgroundColor: '#8A4D76' }}
          >
            {t('collaborate.redsys.proceedPayment')}
          </button>
        )}
      </div>

      {/* Formulario oculto que se auto-submite a Redsys */}
      <form
        ref={formRef}
        action={redsysParams.redsysUrl}
        method="POST"
        className="hidden"
      >
        <input
          type="hidden"
          name="Ds_SignatureVersion"
          value={redsysParams.Ds_SignatureVersion}
        />
        <input
          type="hidden"
          name="Ds_MerchantParameters"
          value={redsysParams.Ds_MerchantParameters}
        />
        <input
          type="hidden"
          name="Ds_Signature"
          value={redsysParams.Ds_Signature}
        />
      </form>

      {/* Información de seguridad */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-start gap-3 text-sm text-gray-600">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div>
            <p className="font-semibold text-gray-800 mb-1">{t('collaborate.redsys.securePayment')}</p>
            <p className="text-xs">
              {t('collaborate.redsys.secureDescription')}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3 text-xs text-gray-500">
          <img src="/Bizum.png" alt="Bizum" className="h-6 object-contain" />
          <span className="text-gray-400">|</span>
          <span>Visa</span>
          <span className="text-gray-400">|</span>
          <span>Mastercard</span>
          <span className="text-gray-400">|</span>
          <span>Maestro</span>
        </div>
      </div>
    </div>
  );
}
