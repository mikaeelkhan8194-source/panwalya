import React, { useState } from 'react';
import { BusinessProfile, Product, CustomerOrder } from '../types';
import { 
  ShoppingBag, 
  ExternalLink, 
  Check, 
  Sparkles, 
  Download, 
  Calendar, 
  ArrowRight, 
  Share2, 
  ShieldCheck, 
  Instagram, 
  MessageCircle, 
  Youtube, 
  Globe,
  Tag,
  Star,
  Zap,
  Mail
} from 'lucide-react';

interface StorefrontViewProps {
  profile: BusinessProfile;
  products: Product[];
  currency: string;
  isOwnerViewing: boolean;
  onSelectProduct: (product: Product) => void;
  onLeadSubmit: (productId: string, name: string, email: string) => Promise<void>;
  onEditProfileClick: () => void;
}

export const StorefrontView: React.FC<StorefrontViewProps> = ({
  profile,
  products,
  currency,
  isOwnerViewing,
  onSelectProduct,
  onLeadSubmit,
  onEditProfileClick,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadSubmitted, setLeadSubmitted] = useState<string | null>(null);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  const handleCopyStoreLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleFreeLeadCapture = async (e: React.FormEvent, productId: string) => {
    e.preventDefault();
    if (!leadEmail.trim() || !leadName.trim()) return;
    setIsSubmittingLead(true);
    try {
      await onLeadSubmit(productId, leadName, leadEmail);
      setLeadSubmitted(productId);
      setLeadName('');
      setLeadEmail('');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const activeProducts = products.filter(p => p.isActive);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 md:py-10 space-y-6">
      {/* Top Floating Bar for Share & Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 dark:bg-stone-800/80 backdrop-blur-md rounded-full border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold">{profile.name}</span> Official Store
        </div>

        <div className="flex items-center gap-2">
          {isOwnerViewing && (
            <button
              onClick={onEditProfileClick}
              className="px-3 py-1 text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 rounded-full border border-stone-200 dark:border-stone-700 transition"
            >
              Customize
            </button>
          )}
          <button
            onClick={handleCopyStoreLink}
            className="p-1.5 bg-white hover:bg-stone-50 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-full border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 transition shadow-xs flex items-center gap-1 px-2.5 text-xs font-medium cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Profile Card / Stan-Style Header */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
        {/* Banner */}
        <div className="relative h-36 sm:h-44 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
          <img 
            src={profile.bannerUrl} 
            alt={profile.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Avatar & Info */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="-mt-14 mb-4 flex justify-between items-end">
            <div className="relative">
              <img 
                src={profile.avatarUrl} 
                alt={profile.ownerName}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white dark:border-stone-900 shadow-md bg-white"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-stone-900 flex items-center justify-center text-white" title="Verified Creator & Business">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-2 mb-1">
              {profile.socialLinks.instagram && (
                <a 
                  href={profile.socialLinks.instagram} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.whatsapp && (
                <a 
                  href={`https://wa.me/${profile.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.youtube && (
                <a 
                  href={profile.socialLinks.youtube} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {profile.socialLinks.website && (
                <a 
                  href={profile.socialLinks.website} 
                  target="_blank" 
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight">
                {profile.name}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium">
                @{profile.handle}
              </span>
            </div>

            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
              {profile.tagline}
            </p>

            <p className="text-xs text-stone-600 dark:text-stone-400 mt-2.5 leading-relaxed">
              {profile.bio}
            </p>

            <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
              <span>Founded by <strong className="text-stone-700 dark:text-stone-200">{profile.ownerName}</strong></span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Instant Delivery
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stan-style Product Blocks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Products & Offerings ({activeProducts.length})
          </h2>
          <span className="text-[11px] text-stone-400">Tap to view & buy</span>
        </div>

        {activeProducts.map((product) => {
          const isFree = product.price === 0;

          if (product.type === 'lead_magnet') {
            return (
              <div 
                key={product.id}
                className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-md transition group p-5"
              >
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <img 
                    src={product.coverImage} 
                    alt={product.title} 
                    className="w-16 h-16 rounded-2xl object-cover border border-stone-100 dark:border-stone-800 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold uppercase">
                        Free Gift
                      </span>
                      {product.badge && (
                        <span className="text-[10px] font-medium text-stone-500">{product.badge}</span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-1">
                      {product.title}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-2">
                      {product.subtitle}
                    </p>
                  </div>
                </div>

                {leadSubmitted === product.id ? (
                  <div className="mt-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-200">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Guide sent to your email!</span>
                    </div>
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="text-xs underline font-medium text-emerald-700"
                    >
                      Download Now
                    </button>
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => handleFreeLeadCapture(e, product.id)}
                    className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 space-y-2.5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Your First Name"
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                        className="px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Your Best Email"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        className="px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingLead}
                      className="w-full py-2.5 px-4 bg-stone-900 hover:bg-black text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isSubmittingLead ? 'Sending...' : 'Get Instant Free Download'}</span>
                    </button>
                  </form>
                )}
              </div>
            );
          }

          return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product)}
              className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs hover:shadow-md hover:border-emerald-500/50 transition cursor-pointer group"
            >
              <div className="flex gap-4 items-start">
                <img 
                  src={product.coverImage} 
                  alt={product.title} 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-stone-100 dark:border-stone-800 flex-shrink-0 group-hover:scale-[1.02] transition"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {product.type === 'consultation' ? '1:1 Session' : product.type === 'custom_package' ? 'Bespoke Package' : 'Digital Blueprint'}
                    </span>
                    {product.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 mt-1 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                    {product.title}
                  </h3>

                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                    {product.subtitle}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100 dark:border-stone-800/80">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">
                        Free Access
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition">
                      <span>Get Access</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer / Powered by Paanwala */}
      <div className="text-center pt-8 pb-4 border-t border-stone-200/60 dark:border-stone-800 space-y-2">
        <p className="text-xs font-semibold text-stone-600 dark:text-stone-400">
          Want to sell your own business blueprints, products & services?
        </p>
        <p className="text-[11px] text-stone-400">
          Powered by <strong className="text-stone-700 dark:text-stone-300">Paanwala Commerce</strong> • Official Creator Store Platform
        </p>
      </div>
    </div>
  );
};
