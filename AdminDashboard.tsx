import React, { useState } from 'react';
import { BusinessProfile, Product, CustomerOrder, BusinessLead, BusinessStats } from '../types';
import { 
  Plus, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Mail, 
  Send, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  ExternalLink, 
  AlertCircle, 
  Sparkles, 
  FileText,
  Calendar,
  Box,
  Eye,
  RefreshCw,
  Clock,
  ShieldCheck,
  Check,
  FileSpreadsheet
} from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';
import { CsvBulkImportModal } from './CsvBulkImportModal';
import { sendGmailMessage } from '../lib/gmailService';

interface AdminDashboardProps {
  profile: BusinessProfile;
  products: Product[];
  orders: CustomerOrder[];
  leads: BusinessLead[];
  stats: BusinessStats;
  isGmailConnected: boolean;
  currentUserEmail?: string | null;
  onAddProduct: () => void;
  onBulkImportProducts?: (products: Product[]) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onEditProfile: () => void;
  onSendManualReceipt: (order: CustomerOrder) => Promise<{ success: boolean; error?: string }>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  profile,
  products,
  orders,
  leads,
  stats,
  isGmailConnected,
  currentUserEmail,
  onAddProduct,
  onBulkImportProducts,
  onEditProduct,
  onDeleteProduct,
  onEditProfile,
  onSendManualReceipt,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'leads' | 'email_hub'>('products');
  
  // Confirmation state for deleting a product (User Confirmation for Destructive Operations)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  // Confirmation state for sending email (Workspace User Confirmation for Mutating / Sending actions)
  const [orderToEmail, setOrderToEmail] = useState<CustomerOrder | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatusToast, setEmailStatusToast] = useState<{ message: string; isError?: boolean } | null>(null);

  // Quick test email sender
  const [customToEmail, setCustomToEmail] = useState(profile.ownerEmail || '');
  const [customSubject, setCustomSubject] = useState(`Update from ${profile.name} Business Store`);
  const [customBody, setCustomBody] = useState(`Hello,\n\nThank you for supporting ${profile.name}! Your order has been processed.\n\nWarm regards,\n${profile.ownerName}`);
  const [isSendingCustom, setIsSendingCustom] = useState(false);
  const [showCustomSendModal, setShowCustomSendModal] = useState(false);

  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  const confirmDeleteProduct = () => {
    if (!productToDelete) return;
    onDeleteProduct(productToDelete.id);
    setProductToDelete(null);
  };

  const handleConfirmSendReceipt = async () => {
    if (!orderToEmail) return;
    setIsSendingEmail(true);
    try {
      const res = await onSendManualReceipt(orderToEmail);
      if (res.success) {
        setEmailStatusToast({ message: `Order receipt successfully sent to ${orderToEmail.customerEmail} via Gmail!` });
      } else {
        setEmailStatusToast({ message: res.error || 'Failed to dispatch email via Gmail API', isError: true });
      }
    } catch (err: any) {
      setEmailStatusToast({ message: err?.message || 'Error occurred', isError: true });
    } finally {
      setIsSendingEmail(false);
      setOrderToEmail(null);
      setTimeout(() => setEmailStatusToast(null), 5000);
    }
  };

  const handleConfirmSendCustomEmail = async () => {
    if (!customToEmail.trim() || !customSubject.trim()) return;
    setIsSendingCustom(true);
    try {
      const res = await sendGmailMessage({
        to: customToEmail.trim(),
        subject: customSubject.trim(),
        bodyHtml: `<div style="font-family: sans-serif; line-height: 1.6; color: #1c1917; max-width: 600px; padding: 20px; border: 1px solid #e7e5e4; border-radius: 12px;">
          <h2 style="color: #15803d; margin-top: 0;">${profile.name}</h2>
          <p style="white-space: pre-line;">${customBody.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 20px 0;" />
          <p style="font-size: 12px; color: #78716c;">Sent from ${profile.name} official creator commerce platform.</p>
        </div>`
      });

      if (res.success) {
        setEmailStatusToast({ message: `Message successfully sent to ${customToEmail} via Gmail!` });
        setShowCustomSendModal(false);
      } else {
        setEmailStatusToast({ message: res.error || 'Failed to send Gmail message', isError: true });
      }
    } finally {
      setIsSendingCustom(false);
      setTimeout(() => setEmailStatusToast(null), 5000);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner / Store status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs">
        <div className="flex items-center gap-4">
          <img 
            src={profile.avatarUrl} 
            alt={profile.name}
            className="w-16 h-16 rounded-2xl object-cover border border-stone-200 dark:border-stone-700 shadow-xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-900 dark:text-stone-100">{profile.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                Storefront Active
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Handle: <span className="font-mono text-stone-700 dark:text-stone-300">@{profile.handle}</span> • Owner: {profile.ownerName} ({profile.ownerEmail})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            title="Import products from CSV spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Bulk CSV Import</span>
          </button>
          <button
            onClick={onEditProfile}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Store Settings</span>
          </button>
          <button
            onClick={onAddProduct}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Notification toast if any */}
      {emailStatusToast && (
        <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-medium border ${
          emailStatusToast.isError 
            ? 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-200 dark:border-red-800' 
            : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800'
        }`}>
          <div className="flex items-center gap-2">
            {emailStatusToast.isError ? <AlertCircle className="w-4 h-4 text-red-600" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            <span>{emailStatusToast.message}</span>
          </div>
          <button onClick={() => setEmailStatusToast(null)} className="text-stone-400 hover:text-stone-600 text-xs font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
            {profile.currency}{stats.totalRevenue.toLocaleString()}
          </p>
          <span className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> Real-time sales
          </span>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Customer Orders</span>
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
            {stats.totalOrders}
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Direct orders received
          </span>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Email Leads Captured</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
            {stats.totalLeads}
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Free magnet subscribers
          </span>
        </div>

        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-medium">Gmail Automation</span>
            <Mail className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-base font-bold text-stone-900 dark:text-stone-100 mt-1">
            {isGmailConnected ? 'Connected & Live' : 'Ready to Connect'}
          </p>
          <span className="text-[11px] text-stone-500 mt-1 block">
            {isGmailConnected ? `${currentUserEmail}` : 'Connect Google via header'}
          </span>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="space-y-4">
        <div className="flex border-b border-stone-200 dark:border-stone-800 gap-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-xs font-bold transition border-b-2 cursor-pointer ${
              activeTab === 'products'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Store Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-xs font-bold transition border-b-2 cursor-pointer ${
              activeTab === 'orders'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Customer Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-3 text-xs font-bold transition border-b-2 cursor-pointer ${
              activeTab === 'leads'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Lead Magnet Subscribers ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('email_hub')}
            className={`pb-3 text-xs font-bold transition border-b-2 cursor-pointer ${
              activeTab === 'email_hub'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Gmail Communications Hub
          </button>
        </div>

        {/* Tab 1: Products */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs text-stone-500">
                Products currently displayed on your customer-facing Stan link-in-bio storefront.
              </p>
              <button
                onClick={onAddProduct}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((p) => (
                <div 
                  key={p.id}
                  className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-4 shadow-xs flex flex-col justify-between"
                >
                  <div className="flex gap-3">
                    <img 
                      src={p.coverImage} 
                      alt={p.title} 
                      className="w-20 h-20 rounded-xl object-cover border border-stone-200 dark:border-stone-700 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-600">
                          {p.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-extrabold text-stone-900 dark:text-stone-100">
                          {p.price === 0 ? 'Free' : `${profile.currency}${p.price}`}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-1 mt-0.5">
                        {p.title}
                      </h4>
                      <p className="text-xs text-stone-500 line-clamp-2 mt-0.5">
                        {p.subtitle}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-stone-500">
                        <span>Sales: <strong className="text-stone-700 dark:text-stone-300">{p.salesCount}</strong></span>
                        <span>Revenue: <strong className="text-stone-700 dark:text-stone-300">{profile.currency}{p.revenue}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-stone-100 dark:border-stone-800">
                    <button
                      onClick={() => onEditProduct(p)}
                      className="px-3 py-1 text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" /> Edit
                    </button>
                    <button
                      onClick={() => setProductToDelete(p)}
                      className="px-3 py-1 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">Customer Purchase Records</h3>
                <p className="text-xs text-stone-500">Orders placed by customers through your store.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-100 dark:border-stone-800">
                  <tr>
                    <th className="p-3.5">Order Ref</th>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Gmail Status</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                      <td className="p-3.5 font-mono font-medium text-stone-700 dark:text-stone-300">
                        {ord.orderNumber}
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold text-stone-900 dark:text-stone-100">{ord.customerName}</div>
                        <div className="text-stone-500 text-[11px]">{ord.customerEmail}</div>
                      </td>
                      <td className="p-3.5 max-w-[200px]">
                        <div className="font-medium text-stone-800 dark:text-stone-200 truncate">{ord.productTitle}</div>
                        <span className="text-[10px] text-emerald-600 font-semibold uppercase">{ord.productType.replace('_', ' ')}</span>
                      </td>
                      <td className="p-3.5 font-bold text-stone-900 dark:text-stone-100">
                        {profile.currency}{ord.pricePaid}
                      </td>
                      <td className="p-3.5">
                        {ord.emailReceiptSent ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-medium">
                            <Check className="w-3 h-3" /> Dispatched
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">
                            Pending dispatch
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-stone-500 text-[11px] whitespace-nowrap">
                        {ord.createdAt}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setOrderToEmail(ord)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Send className="w-3 h-3" />
                          <span>{ord.emailReceiptSent ? 'Resend Gmail' : 'Send Gmail'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Leads */}
        {activeTab === 'leads' && (
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-stone-100 dark:border-stone-800">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">Lead Magnet Inquiries & Email Subscribers</h3>
              <p className="text-xs text-stone-500">Customers who opted in through free downloads and lead magnets on your store.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-100 dark:border-stone-800">
                  <tr>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Email</th>
                    <th className="p-3.5">Resource Downloaded</th>
                    <th className="p-3.5">Date Subscribed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-stone-50/50 dark:hover:bg-stone-800/30">
                      <td className="p-3.5 font-semibold text-stone-900 dark:text-stone-100">
                        {lead.name}
                      </td>
                      <td className="p-3.5 text-emerald-600 font-medium">
                        {lead.email}
                      </td>
                      <td className="p-3.5 text-stone-600 dark:text-stone-300">
                        {lead.productTitle}
                      </td>
                      <td className="p-3.5 text-stone-500 text-[11px]">
                        {lead.createdAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Gmail Hub */}
        {activeTab === 'email_hub' && (
          <div className="space-y-6">
            {/* Status card */}
            <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                      Gmail Store Delivery & Automated Dispatch
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Direct integration with Google Workspace Gmail API allows Paanwala to automatically dispatch order receipts, digital files, and consultation invitations from your authenticated Google account.
                  </p>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isGmailConnected ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-800'
                }`}>
                  {isGmailConnected ? 'Active • Connected' : 'Google Auth Required'}
                </span>
              </div>

              {!isGmailConnected && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
                  <span>Sign in with Google in the top navigation bar to activate the live Gmail send & receive pipeline.</span>
                </div>
              )}

              {/* Compose custom email with mandatory confirmation modal */}
              <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Send Direct Customer Communication
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">Recipient Email</label>
                    <input
                      type="email"
                      value={customToEmail}
                      onChange={(e) => setCustomToEmail(e.target.value)}
                      placeholder="customer@domain.com"
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">Subject</label>
                    <input
                      type="text"
                      value={customSubject}
                      onChange={(e) => setCustomSubject(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">Message Body</label>
                  <textarea
                    rows={4}
                    value={customBody}
                    onChange={(e) => setCustomBody(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={!isGmailConnected || !customToEmail.trim()}
                    onClick={() => setShowCustomSendModal(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Review & Send Email via Gmail</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal 1: Product Deletion (Destructive Operation) */}
      <ConfirmationModal
        isOpen={!!productToDelete}
        isDestructive={true}
        title="Delete Store Product?"
        description={`Are you sure you want to delete "${productToDelete?.title}" from your storefront? Customers will no longer be able to purchase or view this listing.`}
        impactDetails={productToDelete ? [
          { label: 'Product Name', value: productToDelete.title },
          { label: 'Price', value: `${profile.currency}${productToDelete.price}` },
          { label: 'Past Sales', value: `${productToDelete.salesCount} units` },
        ] : []}
        confirmText="Delete Product"
        cancelText="Keep Product"
        onConfirm={confirmDeleteProduct}
        onCancel={() => setProductToDelete(null)}
      />

      {/* Confirmation Modal 2: Send Order Receipt via Gmail (Workspace Mutating Operation) */}
      <ConfirmationModal
        isOpen={!!orderToEmail}
        isLoading={isSendingEmail}
        title="Send Customer Receipt via Gmail?"
        description={`This will send an official order confirmation and access email to ${orderToEmail?.customerEmail} directly from your authenticated Gmail account.`}
        impactDetails={orderToEmail ? [
          { label: 'Recipient', value: orderToEmail.customerEmail },
          { label: 'Customer Name', value: orderToEmail.customerName },
          { label: 'Order Number', value: orderToEmail.orderNumber },
          { label: 'Product', value: orderToEmail.productTitle },
          { label: 'Amount Paid', value: `${profile.currency}${orderToEmail.pricePaid}` },
        ] : []}
        confirmText="Send Receipt Email"
        cancelText="Cancel"
        onConfirm={handleConfirmSendReceipt}
        onCancel={() => setOrderToEmail(null)}
      />

      {/* Confirmation Modal 3: Send Custom Email via Gmail */}
      <ConfirmationModal
        isOpen={showCustomSendModal}
        isLoading={isSendingCustom}
        title="Confirm Dispatch via Gmail"
        description={`Are you sure you want to send this email to ${customToEmail} on behalf of your business account?`}
        impactDetails={[
          { label: 'Recipient', value: customToEmail },
          { label: 'Subject', value: customSubject },
          { label: 'Sender', value: currentUserEmail || profile.ownerEmail },
        ]}
        confirmText="Send Now"
        cancelText="Review Edits"
        onConfirm={handleConfirmSendCustomEmail}
        onCancel={() => setShowCustomSendModal(false)}
      />

      {/* CSV Bulk Import Modal */}
      <CsvBulkImportModal
        isOpen={isCsvModalOpen}
        currency={profile.currency}
        onClose={() => setIsCsvModalOpen(false)}
        onImport={(imported) => {
          if (onBulkImportProducts) {
            onBulkImportProducts(imported);
          }
          setEmailStatusToast({
            message: `Successfully imported ${imported.length} products to store catalog!`,
          });
          setTimeout(() => setEmailStatusToast(null), 5000);
        }}
      />
    </div>
  );
};
