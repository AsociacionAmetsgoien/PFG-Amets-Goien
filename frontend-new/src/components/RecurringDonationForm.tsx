"use client";

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type Language = 'es' | 'eu' | 'en';

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

const copy = {
  es: {
    title: 'Formulario de donación recurrente',
    subtitle: 'Rellena los datos y firma aquí. Recibiremos el PDF generado en la asociación con tu solicitud lista para revisar.',
    intro: 'Este formulario no usa Redsys. Sirve para dejar preparada tu intención de donación periódica en un PDF firmado.',
    help: 'Si tienes dudas, puedes escribirnos antes de enviarlo.',
    send: 'Enviar formulario y generar PDF',
    clear: 'Borrar firma',
    success: 'Hemos recibido tu solicitud de donación recurrente. Revisaremos el PDF y te contactaremos si necesitamos confirmar algo.',
    error: 'No se ha podido enviar el formulario. Vuelve a intentarlo.',
    consent: 'Autorizo a Ametsgoien a registrar y remitir mi solicitud de donación recurrente con los datos introducidos.',
    signature: 'Firma',
    labels: {
      nombre: 'Nombre',
      apellidos: 'Apellidos',
      dni: 'DNI / NIE',
      direccion: 'Dirección',
      cp: 'Código Postal',
      localidad: 'Localidad',
      telefono: 'Teléfono',
      email: 'Correo electrónico',
      titular: 'Titular de la cuenta',
      iban: 'IBAN / Número de cuenta',
      cantidad: 'Cantidad de colaboración (€)',
      periodicidad: 'Periodicidad'
    },
    periodicity: {
      mensual: 'Mensual',
      trimestral: 'Trimestral',
      semestral: 'Semestral',
      anual: 'Anual'
    }
  },
  eu: {
    title: 'Ekarpen errepikakorrerako formularioa',
    subtitle: 'Bete datuak eta hemen sinatu. Sortutako PDFa jasoko dugu elkartean zure eskaera prest egon dadin.',
    intro: 'Formulario honek ez du Redsys erabiltzen. Zure dohaintza periodikoaren asmoa sinatutako PDF batean prest uzteko balio du.',
    help: 'Zalantzarik baduzu, bidali aurretik idatz diezagukezu.',
    send: 'Bidali formularioa eta sortu PDFa',
    clear: 'Sinadura ezabatu',
    success: 'Jasota dugu zure dohaintza errepikakorrerako eskaera. PDFa berrikusiko dugu eta zerbait baieztatu behar badugu zurekin harremanetan jarriko gara.',
    error: 'Ezin izan da formularioa bidali. Saiatu berriro.',
    consent: 'Onartzen dut AMETSGOIENek sartutako datuekin nire dohaintza errepikakorrerako eskaera erregistratu eta bidaltzea.',
    signature: 'Sinadura',
    labels: {
      nombre: 'Izena',
      apellidos: 'Abizenak',
      dni: 'NAN / AIZ',
      direccion: 'Helbidea',
      cp: 'Posta kodea',
      localidad: 'Herria',
      telefono: 'Telefonoa',
      email: 'Helbide elektronikoa',
      titular: 'Kontuaren titularra',
      iban: 'IBAN / Kontu zenbakia',
      cantidad: 'Lankidetza zenbatekoa (€)',
      periodicidad: 'Maiztasuna'
    },
    periodicity: {
      mensual: 'Hilerokoa',
      trimestral: 'Hiruhilekoa',
      semestral: 'Seihilekoa',
      anual: 'Urterokoa'
    }
  },
  en: {
    title: 'Recurring donation form',
    subtitle: 'Fill in your details and sign here. We will receive the generated PDF at the association with your request ready to review.',
    intro: 'This form does not use Redsys. It prepares your recurring donation request in a signed PDF.',
    help: 'If you have any questions, you can contact us before sending it.',
    send: 'Send form and generate PDF',
    clear: 'Clear signature',
    success: 'We have received your recurring donation request. We will review the PDF and contact you if we need to confirm anything.',
    error: 'The form could not be sent. Please try again.',
    consent: 'I authorize Ametsgoien to record and send my recurring donation request with the details entered.',
    signature: 'Signature',
    labels: {
      nombre: 'First name',
      apellidos: 'Last name',
      dni: 'ID / NIE',
      direccion: 'Address',
      cp: 'Postal code',
      localidad: 'City',
      telefono: 'Phone',
      email: 'Email address',
      titular: 'Account holder',
      iban: 'IBAN / Account number',
      cantidad: 'Contribution amount (€)',
      periodicidad: 'Frequency'
    },
    periodicity: {
      mensual: 'Monthly',
      trimestral: 'Quarterly',
      semestral: 'Semiannual',
      anual: 'Yearly'
    }
  }
} as const;

export default function RecurringDonationForm({ embedded = false }: { embedded?: boolean }) {
  const { language } = useLanguage();
  const content = copy[(language as Language) || 'es'] ?? copy.es;
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
        <div className={embedded ? "text-center mb-6" : "text-center mb-10"}>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#8A4D76' }}>
            {content.title}
          </h2>
          <p className={`${embedded ? 'text-sm' : 'text-lg'} text-gray-700 max-w-3xl mx-auto leading-relaxed`}>
            {content.subtitle}
          </p>
          <p className={`${embedded ? 'hidden' : 'block'} text-sm text-gray-500 mt-3 max-w-2xl mx-auto`}>
            {content.intro}
          </p>
        </div>

        <div className={embedded ? "block" : "grid grid-cols-1 lg:grid-cols-5 gap-8 items-start"}>
          <div className={embedded ? "" : "lg:col-span-3 bg-[#F8F2FA] rounded-3xl p-6 md:p-8 shadow-lg border border-purple-100"}>
            <form onSubmit={handleSubmit} className="space-y-5">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label={content.labels.cantidad} value={formData.cantidad} onChange={(value) => setFormData({ ...formData, cantidad: value })} type="number" step="1" min="1" required />
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">{content.labels.periodicidad} *</label>
                  <select
                    value={formData.periodicidad}
                    onChange={(event) => setFormData({ ...formData, periodicidad: event.target.value as FormState['periodicidad'] })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:border-[#8A4D76] focus:outline-none"
                    required
                  >
                    <option value="mensual">{content.periodicity.mensual}</option>
                    <option value="trimestral">{content.periodicity.trimestral}</option>
                    <option value="semestral">{content.periodicity.semestral}</option>
                    <option value="anual">{content.periodicity.anual}</option>
                  </select>
                </div>
              </div>

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
                <span className="text-sm text-gray-700 leading-relaxed">{content.consent}</span>
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
                {content.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                El PDF se completa automáticamente con los datos del formulario, se firma con la firma dibujada y se envía por email a la asociación.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Qué recibirá la asociación</h3>
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
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}{required ? ' *' : ''}
      </label>
      <input
        type={type}
        value={value}
        step={step}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:border-[#8A4D76] focus:outline-none"
        required={required}
      />
    </div>
  );
}
