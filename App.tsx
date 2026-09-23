import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { 
  Store, 
  LayoutDashboard, 
  Sparkles, 
  ShoppingBag, 
  Share2, 
  Plus, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Mail
} from 'lucide-react';
import { BusinessProfile, Product, CustomerOrder, BusinessLead, BusinessStats } from './types';
import { 
  INITIAL_BUSINESS_PROFILE, 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_LEADS 
} from './data/initialData';
import { initAuth, googleSignIn, logout } from './lib/firebase';
import { sendGmailMessage } from './lib/gmailService';
import { GoogleAuthButton } from './components/GoogleAuthButton';
import { StorefrontView } from './components/StorefrontView';
import { AdminDashboard } from './components/AdminDashboard';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductModal } from './components/ProductModal';
import { EditProfileModal } from './components/EditProfileModal';
import { OnboardingModal } from './components/OnboardingModal';

export default function App() {
  // Navigation / Mode: 'storefront' (what customers see) vs 'dashboard' (business owner control room)
  const [viewMode, setViewMode] = useState<'storefront' | 'dashboard'>('storefront');

  // Business Profile State
  const [profile, setProfile] = useState<BusinessProfile>(() => {
    const saved = localStorage.getItem('paanwala_profile');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESS_PROFILE;
  });

  // Products State
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('paanwala_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  // Customer Orders State
  const [orders, setOrders] = useState<CustomerOrder[]>(() => {
    const saved = localStorage.getItem('paanwala_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  // Leads State
  const [leads, setLeads] = useState<BusinessLead[]>(() => {
    const saved = localStorage.getItem('paanwala_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  // Google Auth & Workspace Integration
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Modals
  const [selectedProductForCheckout, setSelectedProductForCheckout] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (authenticatedUser, accessToken) => {
        setUser(authenticatedUser);
        setToken(accessToken);
        setNeedsAuth(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe && unsubscribe();
  }, []);

  // Sync state to local storage for persistence across reloads
  useEffect(() => {
    localStorage.setItem('paanwala_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('paanwala_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('paanwala_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('paanwala_leads', JSON.stringify(leads));
  }, [leads]);

  // Derived Business Statistics
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.status === 'completed' ? ord.pricePaid : 0), 0);
  const totalOrders = orders.length;
  const totalLeads = leads.length;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const conversionRate = totalLeads + totalOrders > 0 ? (totalOrders / (totalOrders + totalLeads)) * 100 : 0;

  const stats: BusinessStats = {
    totalRevenue,
    totalOrders,
    totalLeads,
    conversionRate,
    averageOrderValue,
  };

  // Google Login Handler
  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
      }
    } catch (err) {
      console.error('Sign in failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Google Logout Handler
  const handleGoogleLogout = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setNeedsAuth(true);
  };

  // Order Completion & Gmail Receipt Automation
  const handleCompleteOrder = async (orderData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    notes: string;
    sendGmailReceipt: boolean;
  }) => {
    if (!selectedProductForCheckout) return;

    const newOrder: CustomerOrder = {
      id: `ord_${Date.now()}`,
      orderNumber: `PW-${Math.floor(10000 + Math.random() * 90000)}`,
      productId: selectedProductForCheckout.id,
      productTitle: selectedProductForCheckout.title,
      productType: selectedProductForCheckout.type,
      pricePaid: selectedProductForCheckout.price,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      notes: orderData.notes,
      status: 'completed',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      emailReceiptSent: false,
    };

    // Update product metrics
    setProducts(prev => prev.map(p => {
      if (p.id === selectedProductForCheckout.id) {
        return {
          ...p,
          salesCount: p.salesCount + 1,
          revenue: p.revenue + selectedProductForCheckout.price,
        };
      }
      return p;
    }));

    // Send email via Gmail API if requested & token present
    if (orderData.sendGmailReceipt && token) {
      const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e7e5e4; border-radius: 16px; color: #1c1917;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #15803d; margin: 0; font-size: 24px;">${profile.name}</h1>
            <p style="color: #78716c; font-size: 14px; margin: 4px 0 0 0;">Official Order Receipt & Deliverable Access</p>
          </div>

          <div style="background-color: #f5f5f4; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Order Reference:</strong> ${newOrder.orderNumber}</p>
            <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Customer:</strong> ${orderData.customerName} (${orderData.customerEmail})</p>
            <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Item:</strong> ${selectedProductForCheckout.title}</p>
            <p style="margin: 0; font-size: 16px; color: #15803d;"><strong>Access:</strong> 100% Free Direct Access</p>
          </div>

          <div style="margin-bottom: 24px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px;">Deliverable Instructions</h3>
            <p style="margin: 0; font-size: 14px; color: #44403c;">
              ${selectedProductForCheckout.deliverable.instructions || 'Your access has been activated.'}
            </p>
            ${selectedProductForCheckout.deliverable.downloadFileName ? `
              <p style="margin-top: 12px; font-size: 14px;">
                <strong>Attached File:</strong> ${selectedProductForCheckout.deliverable.downloadFileName}
              </p>
            ` : ''}
          </div>

          <div style="border-top: 1px solid #e7e5e4; padding-top: 16px; font-size: 12px; color: #a8a29e; text-align: center;">
            <p style="margin: 0;">Thank you for your business! Reach out directly at ${profile.ownerEmail} with any questions.</p>
            <p style="margin: 4px 0 0 0;">${profile.name} • ${profile.tagline}</p>
          </div>
        </div>
      `;

      try {
        const gmailRes = await sendGmailMessage({
          to: orderData.customerEmail,
          subject: `Order Receipt: ${selectedProductForCheckout.title} (${newOrder.orderNumber})`,
          bodyHtml: emailHtml,
        });

        if (gmailRes.success) {
          newOrder.emailReceiptSent = true;
          newOrder.receiptSentAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
        }
      } catch (e) {
        console.error('Automated Gmail send error:', e);
      }
    }

    setOrders(prev => [newOrder, ...prev]);
  };

  // Lead capture handler
  const handleLeadCapture = async (productId: string, name: string, email: string) => {
    const targetProduct = products.find(p => p.id === productId);
    const newLead: BusinessLead = {
      id: `lead_${Date.now()}`,
      productId,
      productTitle: targetProduct?.title || 'Free Resource',
      name,
      email,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    setLeads(prev => [newLead, ...prev]);

    // If token present, send welcome email via Gmail
    if (token) {
      await sendGmailMessage({
        to: email,
        subject: `Your Free Download from ${profile.name}: ${targetProduct?.title || 'Resource'}`,
        bodyHtml: `
          <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e7e5e4; border-radius: 12px;">
            <h2 style="color: #15803d; margin-top: 0;">Welcome, ${name}!</h2>
            <p>Thank you for requesting <strong>${targetProduct?.title}</strong> from ${profile.name}.</p>
            <p>Here is your instant free starter resource:</p>
            <p style="padding: 12px; background-color: #f5f5f4; border-radius: 8px; font-weight: bold;">
              📄 ${targetProduct?.deliverable.downloadFileName || 'Paanwala-Guide.pdf'}
            </p>
            <p style="font-size: 12px; color: #78716c; margin-top: 24px;">Warmly,<br>${profile.ownerName} & The Paanwala Team</p>
          </div>
        `,
      }).catch(err => console.error('Gmail send error for lead:', err));
    }
  };

  // Product CRUD Handlers
  const handleSaveProduct = (productData: Partial<Product>) => {
    if (productToEdit) {
      setProducts(prev => prev.map(p => {
        if (p.id === productToEdit.id) {
          return { ...p, ...productData } as Product;
        }
        return p;
      }));
    } else {
      const newProduct: Product = {
        id: `prod_${Date.now()}`,
        businessId: profile.id,
        title: productData.title || 'New Product',
        subtitle: productData.subtitle || '',
        description: productData.description || '',
        price: productData.price ?? 29,
        originalPrice: productData.originalPrice,
        type: productData.type || 'digital_download',
        coverImage: productData.coverImage || 'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=600&auto=format&fit=crop&q=80',
        badge: productData.badge,
        isActive: true,
        features: productData.features || ['Instant digital delivery'],
        deliverable: productData.deliverable || {},
        salesCount: 0,
        revenue: 0,
        createdAt: new Date().toISOString().substring(0, 10),
      };
      setProducts(prev => [newProduct, ...prev]);
    }
    setIsProductModalOpen(false);
    setProductToEdit(null);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleBulkImportProducts = (newProducts: Product[]) => {
    setProducts(prev => [...newProducts, ...prev]);
  };

  // Manual Receipt Resend via Gmail
  const handleManualReceipt = async (order: CustomerOrder): Promise<{ success: boolean; error?: string }> => {
    if (!token) {
      return { success: false, error: 'Please connect your Google account in the top right to send emails via Gmail.' };
    }

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 24px; border: 1px solid #e7e5e4; border-radius: 12px; color: #1c1917;">
        <h2 style="color: #15803d; margin-top: 0;">${profile.name} - Order Receipt</h2>
        <p>Dear ${order.customerName},</p>
        <p>Here is your official receipt for <strong>${order.productTitle}</strong> (Order Ref: <code>${order.orderNumber}</code>).</p>
        <div style="background-color: #f5f5f4; padding: 12px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 0 0 4px 0;"><strong>Access Status:</strong> Free Direct Access</p>
          <p style="margin: 0;"><strong>Date:</strong> ${order.createdAt}</p>
        </div>
        <p>Thank you for choosing ${profile.name}!</p>
        <p style="font-size: 12px; color: #78716c; margin-top: 20px;">— ${profile.ownerName}</p>
      </div>
    `;

    const res = await sendGmailMessage({
      to: order.customerEmail,
      subject: `Official Receipt: ${order.productTitle} (${order.orderNumber})`,
      bodyHtml: emailHtml,
    });

    if (res.success) {
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, emailReceiptSent: true, receiptSentAt: new Date().toISOString().substring(0, 16) } : o));
    }
    return res;
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* Universal Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-xs">
              P
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight">{profile.name}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-1.5 py-0.5 rounded">
                  Stan Store
                </span>
              </div>
              <p className="text-[11px] text-stone-400 leading-none">
                Creator & Business Monetization • 100% Free
              </p>
            </div>
          </div>

          {/* Mode Switcher: Storefront vs Business Dashboard */}
          <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 p-1 rounded-full border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setViewMode('storefront')}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'storefront'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Customer Storefront</span>
            </button>
            <button
              onClick={() => setViewMode('dashboard')}
              className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'dashboard'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Owner Dashboard</span>
            </button>
          </div>

          {/* Right Action: Google OAuth + Register Business */}
          <div className="flex items-center gap-2">
            <GoogleAuthButton
              user={user}
              needsAuth={needsAuth}
              isLoggingIn={isLoggingIn}
              onLogin={handleGoogleLogin}
              onLogout={handleGoogleLogout}
              gmailActive={!!token}
            />
            <button
              onClick={() => setIsOnboardingModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-full shadow-xs transition cursor-pointer"
            >
              <span>New Business</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {viewMode === 'storefront' ? (
          <StorefrontView
            profile={profile}
            products={products}
            currency={profile.currency}
            isOwnerViewing={true}
            onSelectProduct={(prod) => setSelectedProductForCheckout(prod)}
            onLeadSubmit={handleLeadCapture}
            onEditProfileClick={() => setIsEditProfileModalOpen(true)}
          />
        ) : (
          <AdminDashboard
            profile={profile}
            products={products}
            orders={orders}
            leads={leads}
            stats={stats}
            isGmailConnected={!!token}
            currentUserEmail={user?.email}
            onAddProduct={() => {
              setProductToEdit(null);
              setIsProductModalOpen(true);
            }}
            onBulkImportProducts={handleBulkImportProducts}
            onEditProduct={(prod) => {
              setProductToEdit(prod);
              setIsProductModalOpen(true);
            }}
            onDeleteProduct={handleDeleteProduct}
            onEditProfile={() => setIsEditProfileModalOpen(true)}
            onSendManualReceipt={handleManualReceipt}
          />
        )}
      </main>

      {/* Modals */}
      <CheckoutModal
        isOpen={!!selectedProductForCheckout}
        product={selectedProductForCheckout}
        currency={profile.currency}
        businessName={profile.name}
        isGmailConnected={!!token}
        onClose={() => setSelectedProductForCheckout(null)}
        onCompleteOrder={handleCompleteOrder}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        productToEdit={productToEdit}
        currency={profile.currency}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
        onSave={handleSaveProduct}
      />

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        profile={profile}
        onClose={() => setIsEditProfileModalOpen(false)}
        onSave={(updated) => setProfile(prev => ({ ...prev, ...updated }))}
      />

      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
        onComplete={(newBiz) => setProfile(prev => ({ ...prev, ...newBiz }))}
      />
    </div>
  );
}
