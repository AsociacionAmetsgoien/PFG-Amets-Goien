"use client";

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const PDF_DOWNLOAD_URL = '/Formulario_Ametsgoien_Aportaciones.pdf';
const AMOUNT_OPTIONS = [10, 20, 50, 100];

type FormState = {
  nombre: string;
  apellidos: string;
  dni: string;
  direccion: string;
  codigo_postal: string;
  localidad: string;
  telefono: string;
  email: string;
  titular_cuenta: string;
  iban: string;
  cantidad: string;
  periodicidad: 'mensual' | 'trimestral' | 'semestral' | 'anual';
  acepta: boolean;
  website: string;
};

type RecurringDonationContent = {
  manualTitle: string;
  manualText: string;
  manualDownload: string;
  help: string;
  send: string;
  clear: string;
  success: string;
  error: string;
  signature: string;
  labels: {
    nombre: string;
    apellidos: string;
    dni: string;
    direccion: string;
    cp: string;
    localidad: string;
    telefono: string;
    email: string;
    titular: string;
    iban: string;
    cantidad: string;
    periodicidad: string;
  };
  periodicity: Record<FormState['periodicidad'], string>;
};


export default function RecurringDonationForm({ embedded = false }: { embedded?: boolean }) {
  const { t } = useLanguage();
  const content = t('collaborate.recurringDonation') as RecurringDonationContent;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const formStartedAtRef = useRef(Date.now());
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [formData, setFormData] = useState<FormState>({
    nombre: '',
    apellidos: '',
    dni: '',
    direccion: '',
    codigo_postal: '',
    localidad: '',
    telefono: '',
    email: '',
    titular_cuenta: '',
    iban: '',
    cantidad: '',
    periodicidad: 'mensual',
    acepta: false,
    website: ''
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = '#2f2f2f';
      context.lineWidth = 2.5;
      context.clearRect(0, 0, rect.width, rect.height);
      setHasSignature(false);
    };

    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  const getCanvasPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return null;
    }

    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(event);
    if (!point) {
      return;
    }

    drawingRef.current = true;
    lastPointRef.current = point;
    setHasSignature(true);
    const context = event.currentTarget.getContext('2d');
    if (context) {
      context.beginPath();
      context.arc(point.x, point.y, 1.25, 0, Math.PI * 2);
      context.fillStyle = '#2f2f2f';
      context.fill();
    }
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const lastPoint = lastPointRef.current;
    const point = getCanvasPoint(event);
    if (!canvas || !lastPoint || !point) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    lastPointRef.current = point;
  };

  const stopDrawing = () => {
    drawingRef.current = false;
    lastPointRef.current = null;
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    context.clearRect(0, 0, rect.width, rect.height);
    setHasSignature(false);
  };

  const isCanvasBlank = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return true;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return true;
    }

    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] !== 0) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.acepta || !hasSignature || isCanvasBlank()) {
      setMessage({ type: 'error', text: content.error });
      return;
    }

    const payload = {
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      dni: formData.dni,
      direccion: formData.direccion,
      codigo_postal: formData.codigo_postal,
      localidad: formData.localidad,
      telefono: formData.telefono,
      email: formData.email,
      titular_cuenta: formData.titular_cuenta,
      iban: formData.iban,
      cantidad: formData.cantidad,
      periodicidad: formData.periodicidad,
      signatureDataUrl: canvasRef.current?.toDataURL('image/png') || '',
      formStartedAt: formStartedAtRef.current,
      website: formData.website
    };

    if (!payload.signatureDataUrl) {
      setMessage({ type: 'error', text: content.error });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/api/colaboradores/registro-recurrente`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const contentType = response.headers.get('content-type') || '';
      const responseBody = contentType.includes('application/json')
        ? await response.json()
        : { message: await response.text() };

      if (!response.ok) {
        setMessage({
          type: 'error',
          text: (responseBody && typeof responseBody.message === 'string' && responseBody.message.trim())
            ? responseBody.message
            : content.error
        });
        return;
      }

      setMessage({
        type: 'success',
        text: (responseBody && typeof responseBody.message === 'string' && responseBody.message.trim())
          ? responseBody.message
          : content.success
      });
      setFormData({
        nombre: '',
        apellidos: '',
        dni: '',
        direccion: '',
        codigo_postal: '',
        localidad: '',
        telefono: '',
        email: '',
        titular_cuenta: '',
        iban: '',
        cantidad: '',
        periodicidad: 'mensual',
        acepta: false,
        website: ''
      });
      formStartedAtRef.current = Date.now();
      clearSignature();
    } catch (error) {
      console.error('Error enviando formulario recurrente:', error);
      setMessage({ type: 'error', text: content.error });
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <>
        <div className={embedded ? "block" : "grid grid-cols-1 lg:grid-cols-5 gap-8 items-start"}>
          <div className={embedded ? "" : "lg:col-span-3 bg-[#F8F2FA] rounded-3xl p-6 md:p-8 shadow-lg border border-purple-100"}>
            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <p className="text-sm font-bold text-gray-900 mb-1">{content.manualTitle}</p>
                <p className="text-xs text-gray-600 mb-3">{content.manualText}</p>
                <a
                  href={PDF_DOWNLOAD_URL}
                  download
                  className="inline-flex w-full items-center justify-center rounded-full border border-[#8A4D76] px-4 py-2 text-sm font-bold text-[#8A4D76] transition-colors hover:bg-[#8A4D76] hover:text-white"
                >
                  {content.manualDownload}
                </a>
              </div>

              <div className="hidden" aria-hidden="true">
                <label htmlFor="recurrente-website">Website</label>
                <input
                  id="recurrente-website"
                  type="text"
                  value={formData.website}
                  onChange={(event) => setFormData({ ...formData, website: event.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label={content.labels.nombre} value={formData.nombre} onChange={(value) => setFormData({ ...formData, nombre: value })} required />
                <Field label={content.labels.apellidos} value={formData.apellidos} onChange={(value) => setFormData({ ...formData, apellidos: value })} required />
                <Field label={content.labels.dni} value={formData.dni} onChange={(value) => setFormData({ ...formData, dni: value })} required />
                <Field label={content.labels.direccion} value={formData.direccion} onChange={(value) => setFormData({ ...formData, direccion: value })} required />
                <Field label={content.labels.cp} value={formData.codigo_postal} onChange={(value) => setFormData({ ...formData, codigo_postal: value })} required />
                <Field label={content.labels.localidad} value={formData.localidad} onChange={(value) => setFormData({ ...formData, localidad: value })} required />
                <Field label={content.labels.telefono} value={formData.telefono} onChange={(value) => setFormData({ ...formData, telefono: value })} />
                <Field label={content.labels.email} value={formData.email} onChange={(value) => setFormData({ ...formData, email: value })} type="email" required />
                <Field label={content.labels.titular} value={formData.titular_cuenta} onChange={(value) => setFormData({ ...formData, titular_cuenta: value })} required />
              </div>

              <Field label={content.labels.iban} value={formData.iban} onChange={(value) => setFormData({ ...formData, iban: value })} required />

              <fieldset>
                <legend className="block text-sm font-semibold text-gray-800 mb-2">{content.labels.cantidad} *</legend>
                <div className="grid grid-cols-4 gap-2 mb-3" role="group" aria-label={content.labels.cantidad}>
                  {AMOUNT_OPTIONS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setFormData({ ...formData, cantidad: amount.toString() })}
                      className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                        formData.cantidad === amount.toString()
                          ? 'text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:border-[#8A4D76]'
                      }`}
                      style={formData.cantidad === amount.toString() ? { backgroundColor: '#8A4D76' } : {}}
                      aria-pressed={formData.cantidad === amount.toString()}
                    >
                      {amount}€
                    </button>
                  ))}
                </div>
                <Field label="" value={formData.cantidad} onChange={(value) => setFormData({ ...formData, cantidad: value })} type="number" step="1" min="1" required />
              </fieldset>

              <fieldset>
                <legend className="block text-sm font-semibold text-gray-800 mb-2">{content.labels.periodicidad} *</legend>
                <div className="grid grid-cols-2 gap-2" role="group" aria-label={content.labels.periodicidad}>
                  {(Object.keys(content.periodicity) as FormState['periodicidad'][]).map((period) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() => setFormData({ ...formData, periodicidad: period })}
                      className={`rounded-lg border-2 p-3 text-sm font-bold transition-all ${
                        formData.periodicidad === period
                          ? 'border-[#8A4D76] bg-purple-50 text-[#8A4D76]'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-[#8A4D76]'
                      }`}
                      aria-pressed={formData.periodicidad === period}
                    >
                      {content.periodicity[period]}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="bg-white rounded-2xl p-4 border border-gray-200">
                <label className="block text-sm font-semibold text-gray-800 mb-3">{content.signature} *</label>
                <div className="rounded-2xl border-2 border-dashed border-purple-200 bg-white overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    className="w-full h-40 touch-none cursor-crosshair"
                    onPointerDown={startDrawing}
                    onPointerMove={draw}
                    onPointerUp={stopDrawing}
                    onPointerLeave={stopDrawing}
                  />
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-xs text-gray-500">{content.help}</p>
                  <button
                    type="button"
                    onClick={clearSignature}
                    className="px-4 py-2 rounded-full text-sm font-semibold border border-[#8A4D76] text-[#8A4D76] hover:bg-[#8A4D76] hover:text-white transition-colors"
                  >
                    {content.clear}
                  </button>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer bg-white rounded-2xl p-4 border border-gray-200">
                <input
                  type="checkbox"
                  checked={formData.acepta}
                  onChange={(event) => setFormData({ ...formData, acepta: event.target.checked })}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[#8A4D76] focus:ring-[#8A4D76]"
                  required
                />
                <span className="text-sm text-gray-700 leading-relaxed">
                  {t('collaborate.donation.privacyConsent')}{' '}
                  <a href="/privacidad" className="font-semibold hover:underline" style={{ color: '#8A4D76' }}>
                    {t('collaborate.donation.privacyLink')}
                  </a>
                  {' '}{t('collaborate.donation.authorizeData')} *
                </span>
              </label>
              

              {message && (
                <div className={`rounded-2xl px-4 py-3 text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full px-6 py-4 font-bold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#8A4D76' }}
              >
                {loading ? '...' : content.send}
              </button>
            </form>
          </div>

          <div className={`${embedded ? 'hidden' : 'lg:col-span-2 space-y-4'}`}>
            <div className="bg-[#E8D5F2] rounded-3xl p-6 border border-purple-100 shadow-sm">
              <h3 className="text-2xl font-bold mb-3" style={{ color: '#8A4D76' }}>
                {content.manualTitle}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {content.manualText}
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">QuÃ© recibirÃ¡ la asociaciÃ³n</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li>Formulario PDF rellenado con tus datos.</li>
                <li>Firma digitalizada dentro del documento.</li>
                <li>Registro interno del colaborador sin duplicados por email.</li>
              </ul>
            </div>
          </div>
        </div>
    </>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-white border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        {formContent}
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  required = false,
  type = 'text',
  step,
  min
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  step?: string;
  min?: string;
}) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          {label}{required ? ' *' : ''}
        </label>
      )}
      <input
        type={type}
        value={value}
        step={step}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 focus:border-[#8A4D76] focus:outline-none"
        required={required}
      />
    </div>
  );
}
