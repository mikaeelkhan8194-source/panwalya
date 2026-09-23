import React, { useState } from 'react';
import { Product, CustomerOrder } from '../types';
import { X, Check, ShoppingBag, Download, Calendar, Sparkles, Mail, Send, ShieldCheck, Phone, User as UserIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  product: Product | null;
  currency: string;
  businessName: string;
  isGmailConnected: boolean;
  onClose: () => void;
  onCompleteOrder: (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes: string;
    sendGmailReceipt: boolean;
  }) => Promise<void>;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  product,
  currency,
  businessName,
  isGmailConnected,
  onClose,
  onCompleteOrder,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [sendGmailReceipt, setSendGmailReceipt] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [lastOrderNumber, setLastOrderNumber] = useState('');

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail) return;

    setIsSubmitting(true);
    try {
      const generatedOrderNum = `PW-${Math.floor(10000 + Math.random() * 90000)}`;
      setLastOrderNumber(generatedOrderNum);
      
      await onCompleteOrder({
        customerName,
        customerEmail,
        customerPhone,
        notes,
        sendGmailReceipt: isGmailConnected && sendGmailReceipt,
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setStep('success');
    } catch (err) {
      console.error('Order submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setNotes('');
    onClose();
  };

  const isFree = product.price === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        role="dialog"
        aria-modal="true"
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="relative p-6 border-b border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={product.coverImage} 
              alt={product.title} 
              className="w-14 h-14 rounded-2xl object-cover border border-stone-200 dark:border-stone-700 shadow-xs"
            />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {product.type.replace('_', ' ')}
              </span>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 line-clamp-1">
                {product.title}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Sold by <span className="font-semibold text-stone-800 dark:text-stone-200">{businessName}</span>
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Access summary banner */}
            <div className="flex items-center justify-between p-4 bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/60 rounded-2xl">
              <div>
                <p className="text-xs font-medium text-emerald-800 dark:text-emerald-300">Access Mode</p>
                <p className="text-2xl font-extrabold text-emerald-950 dark:text-emerald-100">
                  Free Direct Access
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Instant Free Delivery</span>
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Your Full Name *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Jordan Miller"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Email Address (Receipt & Digital Deliverable) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Phone Number (Optional for order dispatch updates)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Special Notes or Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any event dates, customization preferences, or queries..."
                  className="w-full px-3 py-2.5 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none"
                />
              </div>

              {/* Gmail Automated Delivery Notification Option */}
              <div className="p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/30 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="sendGmailReceipt"
                  checked={sendGmailReceipt}
                  onChange={(e) => setSendGmailReceipt(e.target.checked)}
                  disabled={!isGmailConnected}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="sendGmailReceipt" className="text-xs text-stone-600 dark:text-stone-300 cursor-pointer">
                  <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                    Deliver receipt & link via business Gmail API
                  </span>
                  {isGmailConnected ? (
                    'Will dispatch official confirmation email from store owner address to your inbox immediately upon order.'
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400">
                      (Business owner can connect Gmail in dashboard to enable live automated email dispatches)
                    </span>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !customerName || !customerEmail}
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Request...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Claim & Unlock Instant Access</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-stone-500 dark:text-stone-400">
              🔒 100% Free Access. Instant digital delivery & access link.
            </p>
          </form>
        ) : (
          /* Order Complete / Success State */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Order Confirmed</span>
              <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
                Thank you, {customerName}!
              </h3>
              <p className="text-xs text-stone-500">Order Ref: <span className="font-mono font-medium">{lastOrderNumber}</span></p>
            </div>

            <div className="bg-stone-50 dark:bg-stone-800/50 rounded-2xl p-4 text-left border border-stone-200 dark:border-stone-700 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-700 text-xs">
                <span className="text-stone-500">Delivered to:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">{customerEmail}</span>
              </div>

              <div>
                <p className="text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Your Access Deliverable:</p>
                {product.type === 'digital_download' || product.type === 'lead_magnet' ? (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Downloading: ${product.deliverable.downloadFileName || 'Paanwala-Package.pdf'}`);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {product.deliverable.downloadFileName || 'File'}</span>
                  </a>
                ) : product.type === 'consultation' ? (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-900 dark:text-amber-200">
                    <p className="font-semibold flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-amber-600" />
                      Google Meet Private Link Reserved
                    </p>
                    <p className="mt-1 text-stone-600 dark:text-stone-300">
                      Founder Mikaeel has received your booking. You will be sent an invitation for scheduling your 45-min session.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-stone-100 dark:bg-stone-700/50 rounded-xl text-xs text-stone-700 dark:text-stone-300">
                    <p className="font-semibold">Bespoke Catering Logistics Initiated</p>
                    <p className="mt-1 text-stone-600 dark:text-stone-400">
                      Our concierge team will review notes and reach out within 2 hours.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 px-6 rounded-2xl bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 text-sm font-semibold transition"
            >
              Back to Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
