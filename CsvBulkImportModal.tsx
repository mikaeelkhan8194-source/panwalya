import React, { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2, Download, X, HelpCircle } from 'lucide-react';
import { Product, ProductType } from '../types';

interface CsvBulkImportModalProps {
  isOpen: boolean;
  currency: string;
  onClose: () => void;
  onImport: (newProducts: Product[]) => void;
}

interface ParsedRow {
  title: string;
  price: number;
  type: ProductType;
  description: string;
  subtitle: string;
  badge?: string;
  stock?: number;
  sku?: string;
  originalPrice?: number;
  coverImage?: string;
  features?: string[];
  deliverableInstructions?: string;
}

export const CsvBulkImportModal: React.FC<CsvBulkImportModalProps> = ({
  isOpen,
  currency,
  onClose,
  onImport,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [csvText, setCsvText] = useState<string>('');
  const [parsedProducts, setParsedProducts] = useState<ParsedRow[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Standard Sample CSV Template for Shop Owners
  const sampleCsvContent = `title,price,type,description,subtitle,badge,stock,sku,originalPrice,coverImage,features,deliverableInstructions
Artisan Banarasi Meetha Paan Box,24.99,custom_package,Handcrafted traditional organic paan made fresh on order,Signature Delight,Best Seller,45,PW-BAN-01,29.99,https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600,Fresh ingredients;100% natural,Freshly packaged and dispatched with temperature control.
Royal Saffron Paan Chutney Jar,14.50,custom_package,Pure Kashmiri saffron blended with natural herbs and sweeteners,Gourmet Preserve,Popular,60,PW-SAF-02,18.00,https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600,Authentic taste;Long shelf life,Store in a cool dry place after opening.
Paan Masterclass & Recipe Secrets,49.00,course_workshop,Comprehensive 45-page HD eBook and video walkthrough on secret blends,Video Course,High Value,100,PW-DIG-03,79.00,https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600,Immediate download;4K video tutorials,Your download link is ready immediately upon checkout.
1:1 Franchise & Business Strategy Call,99.00,consultation,45-minute private consultation to setup your local paan franchise,VIP Coaching,Exclusive,15,PW-CALL-04,150.00,https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600,Direct founder call;Actionable roadmap,You will receive a Google Meet calendar link via email within 5 minutes.`;

  const handleDownloadSample = () => {
    const blob = new Blob([sampleCsvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'paanwala_products_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Robust RFC 4180 CSV parser handling quotes, commas, and newlines
  const parseCsvLines = (text: string): string[][] => {
    const lines: string[][] = [];
    let row: string[] = [];
    let currentField = '';
    let insideQuote = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (char === '"') {
        if (insideQuote && nextChar === '"') {
          currentField += '"';
          i++; // skip escaped quote
        } else {
          insideQuote = !insideQuote;
        }
      } else if (char === ',' && !insideQuote) {
        row.push(currentField.trim());
        currentField = '';
      } else if ((char === '\r' || char === '\n') && !insideQuote) {
        if (char === '\r' && nextChar === '\n') {
          i++; // skip \r\n
        }
        row.push(currentField.trim());
        if (row.length > 0 && row.some(col => col.length > 0)) {
          lines.push(row);
        }
        row = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }

    if (currentField.length > 0 || row.length > 0) {
      row.push(currentField.trim());
      if (row.some(col => col.length > 0)) {
        lines.push(row);
      }
    }

    return lines;
  };

  const processCsvText = (rawText: string) => {
    setParseErrors([]);
    setParsedProducts([]);
    const rows = parseCsvLines(rawText);

    if (rows.length < 2) {
      setParseErrors(['CSV file must contain a header row and at least one product data row.']);
      return;
    }

    const header = rows[0].map(h => h.toLowerCase().trim());
    const titleIdx = header.indexOf('title');
    const priceIdx = header.indexOf('price');
    const typeIdx = header.indexOf('type');
    const descIdx = header.indexOf('description');
    const subtitleIdx = header.indexOf('subtitle');
    const badgeIdx = header.indexOf('badge');
    const stockIdx = header.indexOf('stock');
    const skuIdx = header.indexOf('sku');
    const origPriceIdx = header.indexOf('originalprice');
    const coverImageIdx = header.indexOf('coverimage');
    const featuresIdx = header.indexOf('features');
    const instrIdx = header.indexOf('deliverableinstructions');

    if (titleIdx === -1 || priceIdx === -1) {
      setParseErrors(['Missing required columns: "title" and "price" must be included in the header row.']);
      return;
    }

    const results: ParsedRow[] = [];
    const errors: string[] = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length === 0 || (row.length === 1 && !row[0])) continue;

      const title = row[titleIdx] || '';
      const priceStr = row[priceIdx] || '0';
      const price = parseFloat(priceStr.replace(/[^0-9.]/g, ''));

      if (!title) {
        errors.push(`Row #${i}: Product title is required.`);
        continue;
      }

      if (isNaN(price) || price < 0) {
        errors.push(`Row #${i} ("${title}"): Price must be a valid positive number.`);
        continue;
      }

      // Valid ProductTypes: 'digital_download' | 'custom_package' | 'consultation' | 'course_workshop' | 'lead_magnet'
      let rawType = (typeIdx !== -1 ? row[typeIdx] : '').toLowerCase();
      let type: ProductType = 'custom_package';
      if (rawType.includes('digital') || rawType.includes('download') || rawType.includes('pdf')) {
        type = 'digital_download';
      } else if (rawType.includes('consult') || rawType.includes('call') || rawType.includes('coach')) {
        type = 'consultation';
      } else if (rawType.includes('course') || rawType.includes('workshop') || rawType.includes('class')) {
        type = 'course_workshop';
      } else if (rawType.includes('lead') || rawType.includes('magnet') || rawType.includes('free')) {
        type = 'lead_magnet';
      }

      const description = descIdx !== -1 ? row[descIdx] : '';
      const subtitle = subtitleIdx !== -1 ? row[subtitleIdx] : '';
      const badge = badgeIdx !== -1 ? row[badgeIdx] : undefined;
      const stock = stockIdx !== -1 && !isNaN(parseInt(row[stockIdx])) ? parseInt(row[stockIdx]) : 50;
      const sku = skuIdx !== -1 ? row[skuIdx] : `SKU-${Date.now()}-${i}`;
      const originalPrice = origPriceIdx !== -1 && !isNaN(parseFloat(row[origPriceIdx])) ? parseFloat(row[origPriceIdx]) : undefined;
      const coverImage = coverImageIdx !== -1 && row[coverImageIdx] ? row[coverImageIdx] : 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600&auto=format&fit=crop&q=80';
      const featuresRaw = featuresIdx !== -1 ? row[featuresIdx] : '';
      const features = featuresRaw ? featuresRaw.split(';').map(f => f.trim()).filter(Boolean) : ['Direct artisan product'];
      const deliverableInstructions = instrIdx !== -1 ? row[instrIdx] : 'Fulfillment will be coordinated directly by Paanwala store.';

      results.push({
        title,
        price,
        type,
        description,
        subtitle,
        badge,
        stock,
        sku,
        originalPrice,
        coverImage,
        features,
        deliverableInstructions,
      });
    }

    setParseErrors(errors);
    setParsedProducts(results);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
      processCsvText(content);
    };
    reader.readAsText(selectedFile);
  };

  const handlePasteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCsvText(text);
    if (text.trim().length > 0) {
      processCsvText(text);
    } else {
      setParsedProducts([]);
      setParseErrors([]);
    }
  };

  const handleExecuteImport = () => {
    if (parsedProducts.length === 0) return;
    setIsProcessing(true);

    const generatedProducts: Product[] = parsedProducts.map((p, idx) => ({
      id: `prod_bulk_${Date.now()}_${idx}`,
      businessId: 'biz_paanwala_01',
      title: p.title,
      subtitle: p.subtitle || '',
      description: p.description || '',
      price: p.price,
      originalPrice: p.originalPrice,
      type: p.type,
      coverImage: p.coverImage || 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=600',
      badge: p.badge,
      isActive: true,
      features: p.features || ['Local verified inventory'],
      deliverable: {
        instructions: p.deliverableInstructions || 'Order processed by store.',
      },
      salesCount: 0,
      revenue: 0,
      createdAt: new Date().toISOString().substring(0, 10),
    }));

    setTimeout(() => {
      onImport(generatedProducts);
      setIsProcessing(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div 
        role="dialog"
        aria-modal="true"
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Bulk Import Products via CSV
              </h3>
              <p className="text-xs text-stone-500">
                Quickly populate your store catalog without manual entry.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Info Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-stone-50 dark:bg-stone-800/40 rounded-2xl border border-stone-200 dark:border-stone-700/60">
          <div className="text-xs text-stone-600 dark:text-stone-300">
            <p className="font-semibold text-stone-800 dark:text-stone-200">
              Need the exact template format?
            </p>
            <p className="text-[11px] text-stone-500">
              Headers: <code className="bg-stone-200 dark:bg-stone-700 px-1 py-0.5 rounded text-[10px]">title, price, type, description, subtitle, badge, stock, sku, originalPrice</code>
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownloadSample}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Download Sample CSV</span>
          </button>
        </div>

        {/* Upload or Paste Choice */}
        <div className="space-y-4">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition bg-stone-50/50 dark:bg-stone-900/40"
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".csv,text/csv" 
              className="hidden" 
              onChange={handleFileUpload}
            />
            <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-stone-700 dark:text-stone-300">
              {file ? file.name : 'Click to select CSV file from your computer'}
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              Supports standard UTF-8 .csv files
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Or paste raw CSV text directly:
            </label>
            <textarea
              rows={4}
              value={csvText}
              onChange={handlePasteChange}
              placeholder="title,price,type,description,subtitle&#10;Banarasi Paan,20,physical_goods,Handmade paan,Signature Blend"
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Errors & Validation */}
        {parseErrors.length > 0 && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-700 dark:text-red-300 space-y-1 max-h-24 overflow-y-auto">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>Validation Issues ({parseErrors.length}):</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px]">
              {parseErrors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Preview of Parsed Products */}
        {parsedProducts.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Ready to Import: {parsedProducts.length} Products</span>
              </span>
              <span className="text-stone-500 text-[11px]">Previewing parsed data</span>
            </div>

            <div className="max-h-40 overflow-y-auto border border-stone-200 dark:border-stone-800 rounded-xl divide-y divide-stone-100 dark:divide-stone-800 text-xs">
              {parsedProducts.map((p, idx) => (
                <div key={idx} className="p-2.5 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800/40">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-[10px] text-stone-400">#{idx + 1}</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100 truncate max-w-xs">{p.title}</span>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 uppercase">
                      {p.type.replace('_', ' ')}
                    </span>
                    {p.badge && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-100 text-emerald-700">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {currency}{p.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={parsedProducts.length === 0 || isProcessing}
            onClick={handleExecuteImport}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Importing Products...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                <span>Import {parsedProducts.length} Items to Catalog</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
