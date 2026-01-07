/**
 * @file ColaborarPage - Página de Donaciones y Colaboración
 * @route /colaborar
 * @description Página para realizar donaciones mediante Bizum o tarjeta, guardando datos del colaborador
 */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutForm from "@/components/CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

interface DonacionForm {
  nombre: string;
  apellidos: string;
  email: string;
  prefijoTelefono: string;
  telefono: string;
  direccion: string;
  anotacion: string;
  cantidad: string;
  metodoPago: 'bizum' | 'tarjeta' | '';
  aceptaPolitica: boolean;
}

export default function ColaborarPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<DonacionForm>({
    nombre: "",
    apellidos: "",
    email: "",
    prefijoTelefono: "+34",
    telefono: "",
    direccion: "",
    anotacion: "",
    cantidad: "",
    metodoPago: "",
    aceptaPolitica: false
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'success' | 'error' } | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.aceptaPolitica) {
      setMensaje({ texto: "Debes aceptar la política de privacidad", tipo: "error" });
      return;
    }

    if (!formData.metodoPago) {
      setMensaje({ texto: "Selecciona un método de pago", tipo: "error" });
      return;
    }

    if (!formData.cantidad || parseFloat(formData.cantidad) <= 0) {
      setMensaje({ texto: "Ingresa una cantidad válida", tipo: "error" });
      return;
    }

    setLoading(true);
    setMensaje(null);

    try {
      // Guardar los datos del colaborador en la BD
      const colaboradorData = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.email,
        telefono: formData.telefono ? `${formData.prefijoTelefono} ${formData.telefono}` : null,
        direccion: formData.direccion || null,
        anotacion: formData.anotacion ? 
          `Donación: ${formData.cantidad}€ - ${formData.anotacion}` : 
          `Donación: ${formData.cantidad}€ via ${formData.metodoPago}`
      };

      if (formData.metodoPago === 'bizum') {
        // Para Bizum, guardar colaborador y mostrar instrucciones
        const response = await fetch("http://localhost:4000/api/colaboradores", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(colaboradorData)
        });

        if (response.ok) {
          setMensaje({ 
            texto: `¡Gracias por tu colaboración de ${formData.cantidad}€!`, 
            tipo: "success" 
          });
          
          setTimeout(() => {
            alert(`Envía ${formData.cantidad}€ al número de Bizum: 600 000 000\nConcepto: Donación Amets Goien`);
            
            // Resetear formulario
            setFormData({
              nombre: "",
              apellidos: "",
              email: "",
              prefijoTelefono: "+34",
              telefono: "",
              direccion: "",
              anotacion: "",
              cantidad: "",
              metodoPago: "",
              aceptaPolitica: false
            });
          }, 1000);
        } else {
          const error = await response.json();
          setMensaje({ texto: error.message || "Error al procesar la donación", tipo: "error" });
        }
      } else {
        // Para tarjeta, crear Payment Intent con Stripe
        const response = await fetch("http://localhost:4000/api/payment/create-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            amount: parseFloat(formData.cantidad),
            colaboradorData
          })
        });

        if (response.ok) {
          const data = await response.json();
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
          setShowPaymentForm(true);
        } else {
          const error = await response.json();
          setMensaje({ texto: error.message || "Error al procesar la donación", tipo: "error" });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje({ texto: "Error de conexión. Intenta nuevamente.", tipo: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setMensaje({ 
      texto: `¡Pago exitoso! Gracias por tu donación de ${formData.cantidad}€`, 
      tipo: "success" 
    });
    
    // Resetear formulario
    setTimeout(() => {
      setFormData({
        nombre: "",
        apellidos: "",
        email: "",
        prefijoTelefono: "+34",
        telefono: "",
        direccion: "",
        anotacion: "",
        cantidad: "",
        metodoPago: "",
        aceptaPolitica: false
      });
      setShowPaymentForm(false);
      setClientSecret(null);
    }, 3000);
  };

  const handlePaymentError = (errorMessage: string) => {
    setMensaje({ texto: errorMessage, tipo: "error" });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20" style={{ backgroundColor: '#F5ECE6' }}>
        {/* Hero Section */}
        <section className="py-12 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#8A4D76' }}>
          <div className="max-w-6xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Tu ayuda transforma vidas
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Cada donación contribuye a ofrecer un refugio seguro, apoyo integral y oportunidades de futuro para mujeres migrantes y sus hijos.
            </p>
          </div>
        </section>

        {/* Formulario de Donación y Sección de Impacto en paralelo */}
        <section className="py-12 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Columna Izquierda: Información de Impacto */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-4" style={{ color: '#8A4D76' }}>
                    ¿Cómo ayuda tu donación?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Cada aportación contribuye directamente a mejorar la vida de las mujeres migrantes y sus familias.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="text-3xl">🏠</div>
                    <div>
                      <h3 className="text-lg font-bold mb-1" style={{ color: '#8A4D76' }}>Alojamiento Seguro</h3>
                      <p className="text-gray-700 text-sm">Proporcionamos un espacio digno y seguro donde las mujeres y sus hijos pueden reconstruir sus vidas.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="text-3xl">📚</div>
                    <div>
                      <h3 className="text-lg font-bold mb-1" style={{ color: '#8A4D76' }}>Formación y Apoyo</h3>
                      <p className="text-gray-700 text-sm">Ofrecemos talleres, formación laboral y acompañamiento psicológico para su desarrollo personal.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="text-3xl">🤝</div>
                    <div>
                      <h3 className="text-lg font-bold mb-1" style={{ color: '#8A4D76' }}>Autonomía</h3>
                      <p className="text-gray-700 text-sm">Ayudamos a conseguir autonomía económica y social para un futuro independiente y estable.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-5 border-l-4 border-[#8A4D76]">
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#8A4D76' }}>El impacto de tu aportación</h3>
                  <div className="space-y-2 text-gray-700 text-sm">
                    <p><strong>20€</strong> - Material escolar para un niño durante un mes</p>
                    <p><strong>50€</strong> - Taller formativo para 5 mujeres</p>
                    <p><strong>100€</strong> - Alojamiento de una familia durante una semana</p>
                    <p><strong>200€</strong> - Apoyo psicológico mensual para 3 personas</p>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Formulario de Donación */}
              <div>
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 sticky top-24">
              <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: '#8A4D76' }}>
                Haz tu donación
              </h2>
              <p className="text-center text-gray-600 mb-6">Completa el formulario para realizar tu aportación</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
              {/* Datos Personales en Grid Compacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-800 font-semibold mb-1 text-sm">Nombre *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-1 text-sm">Apellidos *</label>
                  <input
                    type="text"
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-1 text-sm">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-1 text-sm">Teléfono</label>
                  <div className="flex gap-2">
                    <select
                      value={formData.prefijoTelefono}
                      onChange={(e) => setFormData({ ...formData, prefijoTelefono: e.target.value })}
                      className="px-2 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                    >
                      <option value="+34">+34</option>
                      <option value="+33">+33</option>
                      <option value="+1">+1</option>
                    </select>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                      placeholder="600000000"
                    />
                  </div>
                </div>
              </div>

              {/* Cantidad a Donar */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2 text-sm">Cantidad a Donar *</label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[10, 20, 50, 100].map((cantidad) => (
                    <button
                      key={cantidad}
                      type="button"
                      onClick={() => setFormData({ ...formData, cantidad: cantidad.toString() })}
                      className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                        formData.cantidad === cantidad.toString()
                          ? 'text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:border-[#8A4D76]'
                      }`}
                      style={formData.cantidad === cantidad.toString() ? { backgroundColor: '#8A4D76' } : {}}
                    >
                      {cantidad}€
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                  placeholder="Otra cantidad"
                  required
                />
              </div>

              {/* Método de Pago Compacto */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2 text-sm">Método de Pago *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, metodoPago: 'bizum' })}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.metodoPago === 'bizum'
                        ? 'border-[#8A4D76] bg-purple-50'
                        : 'border-gray-300 bg-white hover:border-[#8A4D76]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold" style={{ backgroundColor: '#8A4D76' }}>B</div>
                      <div>
                        <h3 className="font-bold text-gray-900">Bizum</h3>
                        <p className="text-xs text-gray-600">Rápido y seguro</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, metodoPago: 'tarjeta' })}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      formData.metodoPago === 'tarjeta'
                        ? 'border-[#8A4D76] bg-purple-50'
                        : 'border-gray-300 bg-white hover:border-[#8A4D76]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#8A4D76' }}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Tarjeta</h3>
                        <p className="text-xs text-gray-600">Débito o crédito</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Política de Privacidad */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.aceptaPolitica}
                    onChange={(e) => setFormData({ ...formData, aceptaPolitica: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-[#8A4D76] focus:ring-[#8A4D76]"
                    required
                  />
                  <span className="text-gray-700 text-xs">
                    Acepto la{" "}
                    <a href="/privacidad" className="font-semibold hover:underline" style={{ color: '#8A4D76' }}>
                      política de privacidad
                    </a>
                    {" "}y autorizo el tratamiento de mis datos *
                  </span>
                </label>
              </div>

              {/* Mensaje de respuesta */}
              {mensaje && (
                <div className={`p-3 rounded-lg text-sm ${
                  mensaje.tipo === 'success' ? 'bg-green-50 border border-green-500 text-green-800' : 'bg-red-50 border border-red-500 text-red-800'
                }`}>
                  {mensaje.texto}
                </div>
              )}

              {/* Botón de Enviar */}
              {!showPaymentForm && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full text-white font-bold hover:shadow-lg transition-all disabled:opacity-50"
                  style={{ backgroundColor: '#8A4D76' }}
                >
                  {loading ? "Procesando..." : `Donar ${formData.cantidad ? formData.cantidad + '€' : ''}`}
                </button>
              )}
              </form>

              {/* Formulario de pago con tarjeta (Stripe) */}
              {showPaymentForm && clientSecret && paymentIntentId && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#8A4D76' }}>
                    Completar Pago
                  </h3>
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm 
                      amount={parseFloat(formData.cantidad)} 
                      paymentIntentId={paymentIntentId}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </Elements>
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="mt-6 text-center text-gray-600">
              <p className="text-sm">
                🔒 Todas las transacciones son seguras y encriptadas
              </p>
              <p className="text-sm mt-2">
                ¿Necesitas ayuda? Contacta con nosotros en{" "}
                <a href="mailto:info@ametsgoien.org" className="font-semibold hover:underline" style={{ color: '#8A4D76' }}>
                  info@ametsgoien.org
                </a>
              </p>
            </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
