export type PortalRole = 'customer' | 'admin' | 'guest';

export type ScreenTab = 'home-and-catalog' | 'apparel-customizer' | 'cart-and-quote' | 'live-support-chat' | 'admin-portal';

export interface ProductItem {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  price: number;
  originalPrice?: number;
  tag?: string;
  tagColor?: string;
  tierNotice?: string;
  badge?: string;
  features: string[];
  imageUrl: string;
  detailImages?: {
    front: string;
    back: string;
    fabric: string;
    seam: string;
  };
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  categoryTag: string;
  specs: string; // e.g. "เนื้อผ้า Dry-Tech Airflow • คอกลม"
  sizeBreakdown: string; // e.g. "ไซส์ L (10 ตัว)" or "M (15 ตัว), XL (5 ตัว)"
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl: string;
  artworkName?: string;
  collarStyle?: string;
  customNote?: string;
}

export interface ProductionOrder {
  id: string; // e.g. "#SP-9921"
  clientName: string;
  description: string;
  quantity: number;
  status: 'printing' | 'checking_graphic' | 'ready_shipping' | 'completed';
  statusText: string;
  timeAgo: string;
  paidAmount: number;
  paymentStatus: string;
  fileStatus: string;
  fileName?: string;
  printerDevice?: string;
  progressPercent?: number;
  shippingPartner?: string;
  pickupTime?: string;
  imageUrl: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'admin';
  senderName: string;
  avatarText?: string;
  time: string;
  text?: string;
  roleBadge?: string;
  hasMockupImage?: boolean;
  mockupImageUrl?: string;
  mockupTitle?: string;
  mockupSubtitle?: string;
  mockupBadge?: string;
  colorProofNote?: {
    navyHex: string;
    description: string;
  };
  hasTechComparison?: boolean;
  fabricImage?: string;
  seamImage?: string;
}
