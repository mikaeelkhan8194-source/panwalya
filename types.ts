export interface BusinessProfile {
  id: string;
  name: string;
  tagline: string;
  handle: string; // e.g. @paanwala
  bio: string;
  ownerName: string;
  ownerEmail: string;
  category: string;
  avatarUrl: string;
  bannerUrl: string;
  accentColor: string;
  currency: string;
  socialLinks: {
    instagram?: string;
    whatsapp?: string;
    youtube?: string;
    twitter?: string;
    website?: string;
  };
  gmailNotificationsEnabled: boolean;
  sendOrderReceipts: boolean;
  registeredAt: string;
}

export type ProductType = 
  | 'digital_download' // e.g., Recipe handbook, Business blueprint, Guide PDF
  | 'custom_package'   // e.g., Signature Paan Catering Box, Gift Hamper, Wholesale Bundle
  | 'consultation'     // e.g., 1:1 Franchise consultation, Store setup call
  | 'course_workshop'  // e.g., Artisanal Paan & Sweet Crafting Masterclass
  | 'lead_magnet';     // Free download to capture customer leads

export interface Product {
  id: string;
  businessId: string;
  title: string;
  subtitle: string;
  description: string;
  price: number; // 0 for free lead magnets
  originalPrice?: number;
  type: ProductType;
  coverImage: string;
  badge?: string; // e.g., "Best Seller", "Popular", "Exclusive"
  isActive: boolean;
  features: string[];
  deliverable: {
    downloadFileName?: string;
    downloadUrl?: string;
    meetingLink?: string;
    instructions?: string;
  };
  salesCount: number;
  revenue: number;
  createdAt: string;
}

export interface CustomerOrder {
  id: string;
  orderNumber: string;
  productId: string;
  productTitle: string;
  productType: ProductType;
  pricePaid: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  notes?: string;
  status: 'completed' | 'pending' | 'refunded';
  createdAt: string;
  emailReceiptSent: boolean;
  receiptSentAt?: string;
}

export interface BusinessLead {
  id: string;
  productId: string;
  productTitle: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface BusinessStats {
  totalRevenue: number;
  totalOrders: number;
  totalLeads: number;
  conversionRate: number;
  averageOrderValue: number;
}
