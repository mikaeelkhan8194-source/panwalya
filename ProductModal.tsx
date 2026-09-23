import React, { useState } from 'react';
import { Product, ProductType } from '../types';
import { X, Sparkles, Plus, Image, Trash2, CheckCircle2 } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  productToEdit: Product | null;
  currency: string;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  productToEdit,
  currency,
  onClose,
  onSave,
}) => {
  const isEditing = !!productToEdit;

  const [title, setTitle] = useState(productToEdit?.title || '');
  const [subtitle, setSubtitle] = useState(productToEdit?.subtitle || '');
  const [description, setDescription] = useState(productToEdit?.description || '');
  const [price, setPrice] = useState<number>(productToEdit?.price ?? 0);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(productToEdit?.originalPrice);
  const [type, setType] = useState<ProductType>(productToEdit?.type || 'digital_download');
  const [coverImage, setCoverImage] = useState(productToEdit?.coverImage || 'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=600&auto=format&fit=crop&q=80');
  const [badge, setBadge] = useState(productToEdit?.badge || '');
  const [features, setFeatures] = useState<string[]>(productToEdit?.features || [
    'Instant digital delivery to inbox',
    'Commercial usage rights for your business',
    'Free future template updates'
  ]);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [downloadFileName, setDownloadFileName] = useState(productToEdit?.deliverable?.downloadFileName || '');
  const [instructions, setInstructions] = useState(productToEdit?.deliverable?.instructions || '');

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeatures([...features, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      type,
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=600&auto=format&fit=crop&q=80',
      badge: badge.trim() || undefined,
      features,
      isActive: true,
      deliverable: {
        downloadFileName: downloadFileName.trim() || undefined,
        instructions: instructions.trim() || undefined,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        role="dialog"
        aria-modal="true"
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8"
      >
        <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              {isEditing ? 'Edit Business Product' : 'Add New Monetizable Product'}
            </h3>
            <p className="text-xs text-stone-500">
              Sell digital goods, franchise consulting, VIP catering boxes, or free lead magnets.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Product Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Product Category / Format
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: 'digital_download', label: 'Digital File', desc: 'Recipe, PDF, guide' },
                { type: 'consultation', label: '1:1 Coaching', desc: 'Google Meet call' },
                { type: 'custom_package', label: 'Physical Box', desc: 'Catering or kit' },
                { type: 'lead_magnet', label: 'Free Magnet', desc: 'Grow customer list' },
              ].map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => {
                    setType(item.type as ProductType);
                    if (item.type === 'lead_magnet') setPrice(0);
                  }}
                  className={`p-3 text-left rounded-xl border transition cursor-pointer ${
                    type === item.type
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                  }`}
                >
                  <p className="font-semibold text-xs">{item.label}</p>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Royal Saffron Paan Catering Box (50 Servings)"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Short Catchy Subtitle / Hook
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Turn-key luxury dessert presentation for weddings & VIP events"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Pricing & Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Price ({currency})
              </label>
              <input
                type="number"
                min="0"
                step="1"
                disabled={type === 'lead_magnet'}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Original Price (Strikethrough)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                disabled={type === 'lead_magnet'}
                value={originalPrice ?? ''}
                onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="e.g. 79"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Display Badge (Optional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Best Seller, Exclusive"
                className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Detailed Product Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain value, what is included, ingredients/modules, and how it helps the customer..."
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Cover Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-stone-200 flex-shrink-0 bg-stone-100">
                <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Features / Bullet Points */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Key Value Points / What's Included
            </label>
            <div className="space-y-2 mb-2">
              {features.map((feat, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2 p-2 bg-stone-50 dark:bg-stone-800/40 rounded-xl text-xs border border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{feat}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-stone-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                placeholder="Add another highlight bullet..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 text-xs font-semibold rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Deliverables info */}
          <div className="p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
              Customer Fulfillment Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Deliverable File Name (for downloads)
                </label>
                <input
                  type="text"
                  value={downloadFileName}
                  onChange={(e) => setDownloadFileName(e.target.value)}
                  placeholder="e.g. Paanwala-Formulas.pdf"
                  className="w-full px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-600 dark:text-stone-400 mb-1">
                  Post-Purchase Instructions
                </label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Sent directly to your email inbox."
                  className="w-full px-3 py-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer"
            >
              {isEditing ? 'Save Product Changes' : 'Publish Product to Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
