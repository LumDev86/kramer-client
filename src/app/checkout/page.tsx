'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CaretLeft, Copy, Check, WhatsappLogo, CheckCircle } from '@phosphor-icons/react';
import { useCartStore } from '@/store/cart';
import { useStoreStatus } from '@/hooks/useStoreStatus';
import { generateOrderNumber } from '@/lib/orderNumber';

type PaymentMethod = 'efectivo' | 'transferencia';
type Step = 'form' | 'confirm';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clear } = useCartStore();
  const { whatsappNumber: waApi, cbu: cbuApi, alias: aliasApi, titular: titularApi } = useStoreStatus();
  const [step, setStep] = useState<Step>('form');
  const [orderNumber, setOrderNumber] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [copiedField, setCopiedField] = useState<'cbu' | 'alias' | null>(null);
  const [form, setForm] = useState({
    nombre: '',
    domicilio: '',
    telefono: '',
    pago: 'efectivo' as PaymentMethod,
    notas: '',
  });

  const cbu     = cbuApi     ?? process.env.NEXT_PUBLIC_CBU             ?? '';
  const alias   = aliasApi   ?? process.env.NEXT_PUBLIC_ALIAS           ?? '';
  const titular = titularApi ?? process.env.NEXT_PUBLIC_TITULAR         ?? '';
  const waNumber = waApi     ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '';

  const handleCopy = (text: string, field: 'cbu' | 'alias') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const number = generateOrderNumber();

    const productLines = items
      .map((i) => `  • ${i.product.title} x${i.quantity} — $${(parseFloat(i.product.price) * i.quantity).toLocaleString('es-AR')}`)
      .join('\n');

    const message = [
      '🛍️ *Nuevo pedido - Kiosco Kramer*',
      `📋 *N° de pedido: ${number}*`,
      '',
      '👤 *Datos del cliente*',
      `Nombre: ${form.nombre}`,
      `Domicilio: ${form.domicilio}`,
      `Teléfono: ${form.telefono}`,
      '',
      '🛒 *Productos*',
      productLines,
      '',
      `💰 *Total: $${total().toLocaleString('es-AR')}*`,
      `💳 *Método de pago:* ${form.pago === 'efectivo' ? 'Efectivo' : 'Transferencia bancaria'}`,
      ...(form.notas ? ['', `📝 *Notas:* ${form.notas}`] : []),
    ].join('\n');

    setOrderNumber(number);
    setWhatsappUrl(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`);
    setStep('confirm');
  };

  const handleSendWhatsapp = () => {
    clear();
    window.open(whatsappUrl, '_blank');
  };

  if (items.length === 0 && step === 'form') {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400 animate-fadeIn">
        <p className="text-5xl">🛒</p>
        <p className="text-sm font-medium">No hay productos en el carrito</p>
        <Link href="/" className="text-sm text-orange-500 font-bold underline mt-1">Ir al inicio</Link>
      </div>
    );
  }

  if (step === 'confirm') {
    return (
      <div className="flex flex-col items-center gap-6 py-6 animate-fadeIn">

        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-scaleIn">
          <CheckCircle size={52} weight="fill" className="text-green-500" />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-gray-800">¡Pedido listo!</h1>
          <p className="text-sm text-gray-400 mt-1 font-medium">
            Enviá tu pedido por WhatsApp para confirmarlo
          </p>
        </div>

        <div className="w-full bg-orange-50 border border-orange-200 rounded-2xl px-6 py-4 text-center animate-slideUp">
          <p className="text-xs text-orange-400 font-bold uppercase tracking-widest">N° de pedido</p>
          <p className="text-2xl font-extrabold text-orange-500 mt-1 font-mono tracking-wide">{orderNumber}</p>
        </div>

        <div className="w-full bg-white rounded-2xl p-4 shadow-sm animate-slideUp" style={{ animationDelay: '60ms' }}>
          <div className="flex justify-between text-sm text-gray-500 mb-1 font-medium">
            <span>{items.reduce((a, i) => a + i.quantity, 0)} productos</span>
          </div>
          <div className="flex justify-between font-extrabold text-gray-800 text-lg">
            <span>Total</span>
            <span className="text-orange-500">${total().toLocaleString('es-AR')}</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center px-4 leading-relaxed animate-slideUp" style={{ animationDelay: '120ms' }}>
          Al tocar el botón serás redirigido a WhatsApp con los datos de tu pedido listos para enviar. Guardá el número de pedido como referencia.
        </p>

        <button
          onClick={handleSendWhatsapp}
          className="w-full bg-[#25D366] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-md active:scale-95 transition-transform duration-150 text-base animate-slideUp"
          style={{ animationDelay: '180ms' }}
        >
          <WhatsappLogo size={24} weight="fill" />
          Enviar pedido por WhatsApp
        </button>

        <Link
          href="/"
          className="text-sm text-gray-400 font-semibold underline underline-offset-2 animate-fadeIn"
          style={{ animationDelay: '240ms' }}
        >
          Volver al inicio
        </Link>

      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 animate-fadeIn">
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => router.back()} className="text-gray-500 active:text-orange-500 transition-colors">
          <CaretLeft size={26} weight="bold" />
        </button>
        <h1 className="text-lg font-extrabold text-gray-800">Checkout</h1>
      </div>

      {/* Resumen */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="text-sm font-bold text-gray-700 mb-3">Resumen del pedido</h2>
        <div className="flex flex-col gap-2">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex justify-between text-sm">
              <span className="text-gray-600 truncate pr-2">{product.title} x{quantity}</span>
              <span className="font-bold text-gray-800 flex-shrink-0">
                ${(parseFloat(product.price) * quantity).toLocaleString('es-AR')}
              </span>
            </div>
          ))}
          <div className="border-t border-gray-100 mt-1 pt-2 flex justify-between font-extrabold text-gray-800">
            <span>Total</span>
            <span className="text-orange-500">${total().toLocaleString('es-AR')}</span>
          </div>
        </div>
      </div>

      {/* Datos de envío */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <h2 className="text-sm font-bold text-gray-700">Datos de envío</h2>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-semibold">Nombre y apellido *</label>
          <input
            required
            type="text"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            placeholder="Juan Pérez"
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400 font-medium"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-semibold">Domicilio *</label>
          <input
            required
            type="text"
            value={form.domicilio}
            onChange={(e) => setForm({ ...form, domicilio: e.target.value })}
            placeholder="Av. Corrientes 1234, Buenos Aires"
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400 font-medium"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-500 font-semibold">Número de celular *</label>
          <input
            required
            type="tel"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            placeholder="+54 9 11 1234-5678"
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400 font-medium"
          />
        </div>
      </div>

      {/* Método de pago */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3">
        <h2 className="text-sm font-bold text-gray-700">Método de pago</h2>

        <div className="flex flex-col gap-2">
          {(['efectivo', 'transferencia'] as PaymentMethod[]).map((method) => (
            <label
              key={method}
              className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                form.pago === method ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white'
              }`}
            >
              <input
                type="radio"
                name="pago"
                value={method}
                checked={form.pago === method}
                onChange={() => setForm({ ...form, pago: method })}
                className="accent-orange-500"
              />
              <span className="text-sm font-semibold text-gray-700">
                {method === 'efectivo' ? '💵 Efectivo' : '🏦 Transferencia bancaria'}
              </span>
            </label>
          ))}
        </div>

        {form.pago === 'transferencia' && (
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex flex-col gap-2 text-sm">
            <p className="font-bold text-gray-700">Datos bancarios</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400">CVU/CBU</p>
                <p className="font-mono text-gray-700 text-xs">{cbu}</p>
              </div>
              <button type="button" onClick={() => handleCopy(cbu, 'cbu')} className="text-orange-500 active:text-orange-700 flex-shrink-0 ml-2">
                {copiedField === 'cbu' ? <Check size={16} weight="bold" className="text-green-500" /> : <Copy size={16} weight="bold" />}
              </button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400">Alias</p>
                <p className="font-mono text-gray-700">{alias}</p>
              </div>
              <button type="button" onClick={() => handleCopy(alias, 'alias')} className="text-orange-500 active:text-orange-700 flex-shrink-0 ml-2">
                {copiedField === 'alias' ? <Check size={16} weight="bold" className="text-green-500" /> : <Copy size={16} weight="bold" />}
              </button>
            </div>
            <div>
              <p className="text-xs text-gray-400">Titular</p>
              <p className="text-gray-700 font-medium">{titular}</p>
            </div>
          </div>
        )}
      </div>

      {/* Notas */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-1">
        <label className="text-sm font-bold text-gray-700">Notas adicionales</label>
        <textarea
          value={form.notas}
          onChange={(e) => setForm({ ...form, notas: e.target.value })}
          placeholder="Horario de entrega, aclaraciones, etc."
          rows={3}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400 resize-none font-medium"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform duration-150 text-base"
      >
        Confirmar pedido
      </button>
    </form>
  );
}
