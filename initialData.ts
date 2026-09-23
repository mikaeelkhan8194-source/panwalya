import { BusinessProfile, Product, CustomerOrder, BusinessLead } from '../types';

export const INITIAL_BUSINESS_PROFILE: BusinessProfile = {
  id: 'biz_paanwala_01',
  name: 'Paanwala',
  tagline: 'Artisanal Crafted Delights, Franchise Blueprints & Modern Paan Culture',
  handle: 'paanwala',
  bio: 'Welcome to Paanwala official store! We empower creators, food entrepreneurs, and connoisseurs with our signature artisan banarasi blends, catering masterclasses, franchise recipe systems, and exclusive wholesale kits.',
  ownerName: 'Mikaeel Khan',
  ownerEmail: 'mikaeelkhan8194@gmail.com',
  category: 'Food & Beverage / Artisan Entrepreneurship',
  avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=240&auto=format&fit=crop&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1200&auto=format&fit=crop&q=80',
  accentColor: '#16a34a', // Emerald / betel green
  currency: '$',
  socialLinks: {
    instagram: 'https://instagram.com/paanwala_official',
    whatsapp: '+1 (555) 234-7890',
    youtube: 'https://youtube.com/@paanwalabusiness',
    website: 'https://paanwala.store'
  },
  gmailNotificationsEnabled: true,
  sendOrderReceipts: true,
  registeredAt: '2026-01-15'
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1',
    businessId: 'biz_paanwala_01',
    title: 'The Modern Paan Bar Franchise & Recipe Blueprint',
    subtitle: 'Step-by-step SOPs, 18 proprietary syrup blends, supplier lists & profit calculator',
    description: 'Everything you need to launch a high-margin modern artisanal Paan lounge or kiosk. Includes full licensing checklist, hygiene protocols, custom equipment guides, and 18 signature flavor formulation recipes (Chocolate Mint, Calcutta Meetha, Saffron Gold, and Rose Supreme).',
    price: 0,
    type: 'digital_download',
    coverImage: 'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=600&auto=format&fit=crop&q=80',
    badge: 'Popular',
    isActive: true,
    features: [
      'Comprehensive 74-page PDF master operating manual',
      'Supplier contact directory (packaging, organic betel leaves, silver leaf)',
      'Excel Profit & Margin Costing Model',
      'Instant digital download with free future updates'
    ],
    deliverable: {
      downloadFileName: 'Paanwala-Franchise-Blueprint-v2.pdf',
      instructions: 'Your instant download link is generated immediately and emailed to you for free.'
    },
    salesCount: 142,
    revenue: 0,
    createdAt: '2026-02-01'
  },
  {
    id: 'prod_2',
    businessId: 'biz_paanwala_01',
    title: '1:1 Business Scaling & Franchise Consultation (45 Min)',
    subtitle: 'Private advisory video call with founder Mikaeel on launch strategy & menu design',
    description: 'Book a high-impact strategy session. We audit your business location, review your product pricing, advise on staff training, and create a 90-day expansion roadmap tailored to your market.',
    price: 0,
    type: 'consultation',
    coverImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80',
    badge: 'Free Booking',
    isActive: true,
    features: [
      '45-minute live 1-on-1 strategy call via Google Meet',
      'Personalized Action Blueprint & recording sent within 24h',
      'Direct WhatsApp access for 14 days following the session'
    ],
    deliverable: {
      meetingLink: 'https://meet.google.com/pnw-scale-call',
      instructions: 'You will receive a calendar invite and direct prep checklist via Gmail.'
    },
    salesCount: 38,
    revenue: 0,
    createdAt: '2026-02-10'
  },
  {
    id: 'prod_3',
    businessId: 'biz_paanwala_01',
    title: 'Artisanal Royal Betel Catering Experience Box (Sample Pack)',
    subtitle: 'Luxury bespoke presentation kit with edible 24k gold, organic rose preserves & gulkand',
    description: 'Crafted for luxury weddings, corporate banquets, and high-end celebrations. Each handcrafted gift set includes sample artisanal Paan delights crafted with imported saffron, Persian dates, organic gulkand, and gold leaf foil.',
    price: 0,
    type: 'custom_package',
    coverImage: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=600&auto=format&fit=crop&q=80',
    badge: 'Free Sample',
    isActive: true,
    features: [
      'Bespoke presentation packaging',
      'Direct tasting samples of signature preserves',
      'Custom catering quotation included'
    ],
    deliverable: {
      instructions: 'Our concierge contacts you within 2 hours of booking to coordinate sample dispatch and custom event details.'
    },
    salesCount: 24,
    revenue: 0,
    createdAt: '2026-02-18'
  },
  {
    id: 'prod_4',
    businessId: 'biz_paanwala_01',
    title: 'Free Guide: 5 Lucrative Modern Food Cart Business Models',
    subtitle: 'Discover how to generate $5,000+/mo from compact gourmet pop-ups',
    description: 'Download our zero-cost starter handbook detailing equipment checklists, licensing fast-tracks, and viral marketing playbooks for modern specialty culinary carts.',
    price: 0,
    type: 'lead_magnet',
    coverImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    badge: 'Free Guide',
    isActive: true,
    features: [
      'Instant access PDF checklist',
      'Budget breakdown for launch under $3,500',
      'Vendor negotiation scripts'
    ],
    deliverable: {
      downloadFileName: 'Paanwala-5-PopUp-Models-FreeGuide.pdf',
      instructions: 'Delivered directly to your email inbox immediately.'
    },
    salesCount: 310,
    revenue: 0,
    createdAt: '2026-03-01'
  }
];

export const INITIAL_ORDERS: CustomerOrder[] = [
  {
    id: 'ord_101',
    orderNumber: 'PW-84920',
    productId: 'prod_1',
    productTitle: 'The Modern Paan Bar Franchise & Recipe Blueprint',
    productType: 'digital_download',
    pricePaid: 0,
    customerName: 'Aarav Patel',
    customerEmail: 'aarav.patel@example.com',
    customerPhone: '+1 (555) 782-9012',
    notes: 'Planning to launch our flagship kiosk in Chicago in Spring 2026.',
    status: 'completed',
    createdAt: '2026-03-18 14:32',
    emailReceiptSent: true,
    receiptSentAt: '2026-03-18 14:33'
  },
  {
    id: 'ord_102',
    orderNumber: 'PW-84921',
    productId: 'prod_2',
    productTitle: '1:1 Business Scaling & Franchise Consultation',
    productType: 'consultation',
    pricePaid: 0,
    customerName: 'Sara Lindqvist',
    customerEmail: 'sara.l@nordicfoodlab.org',
    customerPhone: '+44 20 7946 0912',
    notes: 'Looking to incorporate infused digestive leaves into modern fusion bistro menu.',
    status: 'completed',
    createdAt: '2026-03-19 09:15',
    emailReceiptSent: true,
    receiptSentAt: '2026-03-19 09:16'
  },
  {
    id: 'ord_103',
    orderNumber: 'PW-84922',
    productId: 'prod_3',
    productTitle: 'Artisanal Royal Betel Catering Experience Box',
    productType: 'custom_package',
    pricePaid: 0,
    customerName: 'Devon Vance',
    customerEmail: 'devon@vanceholdings.com',
    customerPhone: '+1 (555) 438-1120',
    notes: 'Executive Gala on April 12. Need personalized ribbon with company insignia.',
    status: 'completed',
    createdAt: '2026-03-20 18:40',
    emailReceiptSent: true,
    receiptSentAt: '2026-03-20 18:41'
  }
];

export const INITIAL_LEADS: BusinessLead[] = [
  {
    id: 'lead_1',
    productId: 'prod_4',
    productTitle: 'Free Guide: 5 Lucrative Modern Food Cart Business Models',
    name: 'Kabir Mehta',
    email: 'kabir.mehta@gmail.com',
    createdAt: '2026-03-19 11:20'
  },
  {
    id: 'lead_2',
    productId: 'prod_4',
    productTitle: 'Free Guide: 5 Lucrative Modern Food Cart Business Models',
    name: 'Ananya Sharma',
    email: 'ananya.culinary@outlook.com',
    createdAt: '2026-03-20 16:45'
  }
];
