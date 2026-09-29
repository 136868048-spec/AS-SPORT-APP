/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import {
  PRODUCTS,
  INITIAL_CART_ITEMS,
  INITIAL_PRODUCTION_ORDERS,
  INITIAL_CHAT_MESSAGES,
} from './data/mockData';
import {
  ScreenTab,
  PortalRole,
  ProductItem,
  CartItem,
  ProductionOrder,
  ChatMessage,
} from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { LoginScreen } from './components/screens/LoginScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { CustomizerScreen } from './components/screens/CustomizerScreen';
import { CartScreen } from './components/screens/CartScreen';
import { AdminScreen } from './components/screens/AdminScreen';
import { ChatScreen } from './components/screens/ChatScreen';
import { QuoteModal } from './components/QuoteModal';
import { SearchModal } from './components/SearchModal';
import { SizeChartModal } from './components/SizeChartModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ScreenTab>('home-and-catalog');
  const [role, setRole] = useState<PortalRole>('customer');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data states
  const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);
  const [productionOrders, setProductionOrders] = useState<ProductionOrder[]>(INITIAL_PRODUCTION_ORDERS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [selectedProductId, setSelectedProductId] = useState<string>('hyperspeed-dryfit');

  // Search & Modals
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isGlobalSizeChartOpen, setIsGlobalSizeChartOpen] = useState(false);

  // Helper toast with auto timeout
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Cart totals
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  // Handlers
  const handleSelectProductForCustomizer = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentTab('apparel-customizer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAddToCart = (product: ProductItem) => {
    const existingIndex = cartItems.findIndex((item) => item.productId === product.id);
    if (existingIndex > -1) {
      setCartItems((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex
            ? {
                ...item,
                quantity: item.quantity + 1,
                totalPrice: (item.quantity + 1) * item.unitPrice,
              }
            : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: `cart-item-${Date.now()}`,
        productId: product.id,
        title: product.name,
        categoryTag: product.tag || 'Full Sublimation',
        specs: `${product.features[0]} • คอกลม`,
        sizeBreakdown: 'ไซส์ L (1 ตัว)',
        quantity: 1,
        unitPrice: product.price,
        totalPrice: product.price,
        imageUrl: product.imageUrl,
      };
      setCartItems((prev) => [newItem, ...prev]);
    }
    showToast(`เพิ่ม "${product.name}" ลงในตะกร้าเรียบร้อย`);
  };

  const handleCustomAddToCart = (item: CartItem) => {
    setCartItems((prev) => [item, ...prev]);
  };

  const handleCustomBuyNow = (item: CartItem) => {
    setCartItems((prev) => [item, ...prev]);
    setCurrentTab('cart-and-quote');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    showToast('ลบรายการออกจากตะกร้าเรียบร้อย');
  };

  const handleOrderSuccess = (orderId: string, total: number) => {
    // Add new order to admin production queue
    const newProductionOrder: ProductionOrder = {
      id: orderId,
      clientName: 'กฤษณะ วงศ์วารินทร์ (ฝ่ายประสานงาน)',
      description: `งานพิมพ์เสื้อสั่งผลิตใหม่ (${cartCount} ตัว)`,
      quantity: cartCount,
      status: 'checking_graphic',
      statusText: 'รอตรวจไฟล์กราฟิก',
      timeAgo: 'เมื่อสักครู่',
      paidAmount: total,
      paymentStatus: `ชำระแล้ว ฿${total.toLocaleString()}`,
      fileStatus: 'รออนุมัติไฟล์แบบ',
      fileName: 'Customer_Artwork_Final.ai',
      imageUrl: cartItems[0]?.imageUrl || PRODUCTS[0].imageUrl,
    };
    setProductionOrders((prev) => [newProductionOrder, ...prev]);

    // Send confirmation in chat
    const chatConfirmation: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: 'admin',
      senderName: 'AS SPORT',
      avatarText: 'AS',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      roleBadge: 'ระบบตอบรับอัตโนมัติ',
      text: `🎉 ยืนยันคำสั่งซื้อ ${orderId} ยอดชำระ ฿${total.toLocaleString()} เรียบร้อยแล้วครับ! ช่างพิมพ์กำลังตรวจไฟล์ Artwork ก่อนเริ่มพิมพ์ซับลิเมชัน หากต้องการปรับเบอร์/ชื่อแจ้งในห้องแชทนี้ได้ตลอดเวลาครับ`,
    };
    setChatMessages((prev) => [...prev, chatConfirmation]);

    // Clear cart and navigate
    setCartItems([]);
    showToast(`สั่งซื้อสำเร็จ! บันทึกออเดอร์ ${orderId} เข้าสู่ระบบแล้ว`);
    setCurrentTab('live-support-chat');
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: ProductionOrder['status'],
    statusText: string
  ) => {
    setProductionOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId
          ? {
              ...ord,
              status: newStatus,
              statusText,
              progressPercent: newStatus === 'printing' ? 30 : ord.progressPercent,
              printerDevice:
                newStatus === 'printing'
                  ? 'เครื่องพิมพ์ Roll Sublimation Mimaki #01'
                  : ord.printerDevice,
            }
          : ord
      )
    );
  };

  const handleSendChatMessage = (text: string, isCustomer = true) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: isCustomer ? 'customer' : 'admin',
      senderName: isCustomer ? 'ลูกค้า (กฤษณะ)' : 'AS SPORT',
      avatarText: isCustomer ? undefined : 'AS',
      roleBadge: isCustomer ? undefined : 'ฝ่ายเทคนิค & งานพิมพ์',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const selectedProduct =
    PRODUCTS.find((p) => p.id === selectedProductId) || PRODUCTS[0];

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-[#dde1ff]">
      {/* Universal Floating Toast */}
      <Toast message={toastMessage} />

      {/* Main Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        cartCount={cartCount}
        role={role}
        onOpenLogin={() => setIsLoginOpen(true)}
        onSearchClick={() => setIsSearchModalOpen(true)}
      />

      {/* Content Area with viewport container */}
      <main className="flex-1 w-full max-w-md mx-auto pt-20 px-4">
        {currentTab === 'home-and-catalog' && (
          <HomeScreen
            onTabChange={setCurrentTab}
            onSelectProductForCustomizer={handleSelectProductForCustomizer}
            onAddToCart={handleQuickAddToCart}
            cartCount={cartCount}
            cartTotal={cartTotal}
            onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
          />
        )}

        {currentTab === 'apparel-customizer' && (
          <CustomizerScreen
            product={selectedProduct}
            onAddToCartCustom={handleCustomAddToCart}
            onBuyNowCustom={handleCustomBuyNow}
            onTabChange={setCurrentTab}
            showToast={showToast}
          />
        )}

        {currentTab === 'cart-and-quote' && (
          <CartScreen
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onTabChange={setCurrentTab}
            showToast={showToast}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentTab === 'live-support-chat' && (
          <ChatScreen
            messages={chatMessages}
            onSendMessage={handleSendChatMessage}
            onTabChange={setCurrentTab}
            showToast={showToast}
            onOpenSizeChart={() => setIsGlobalSizeChartOpen(true)}
            onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
          />
        )}

        {currentTab === 'admin-portal' && (
          <AdminScreen
            orders={productionOrders}
            onTabChange={setCurrentTab}
            onLogout={() => {
              setRole('customer');
              showToast('ออกจากระบบหลังบ้านแล้ว');
              setCurrentTab('home-and-catalog');
            }}
            showToast={showToast}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
      </main>

      {/* Bottom Sticky Tab Navigation */}
      <BottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === 'admin-portal' && role !== 'admin') {
            // Prompt login or direct entry
            setIsLoginOpen(true);
          } else {
            setCurrentTab(tab);
          }
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartCount}
        role={role}
      />

      {/* Login Screen / Portal Gateway Overlay */}
      {isLoginOpen && (
        <LoginScreen
          currentRole={role}
          onLoginSuccess={(newRole) => {
            setRole(newRole);
            setIsLoginOpen(false);
            if (newRole === 'admin') {
              setCurrentTab('admin-portal');
            }
          }}
          onClose={() => setIsLoginOpen(false)}
          onContinueAsGuest={() => {
            setRole('guest');
            setIsLoginOpen(false);
            showToast('เข้าสู่ระบบแบบผู้เยี่ยมชม (Guest Mode)');
          }}
          showToast={showToast}
        />
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectProduct={(id) => {
          handleSelectProductForCustomizer(id);
          setIsSearchModalOpen(false);
        }}
        onSearchSubmit={(q) => {
          setSearchQuery(q);
          setCurrentTab('home-and-catalog');
        }}
      />

      {/* Quote Request Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        onSubmit={(details) => {
          showToast(`ส่งคำขอใบเสนอราคาสำหรับ ${details.qty} ตัวเรียบร้อยแล้ว ทีมฝ่ายขายจะติดต่อกลับ`);
          const quoteChatMsg: ChatMessage = {
            id: `quote-${Date.now()}`,
            sender: 'admin',
            senderName: 'ฝ่ายเสนอราคา AS SPORT',
            avatarText: 'AS',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            roleBadge: 'ฝ่ายขายทีม',
            text: `เรียนคุณ ${details.name} เจ้าหน้าที่ได้รับคำขอใบเสนอราคาจำนวน ${details.qty} ตัวแล้วครับ กำลังจัดทำเอกสารพร้อมราคาโปรโมชั่นทีมส่งให้ทางเบอร์ ${details.phone} ครับ`,
          };
          setChatMessages((prev) => [...prev, quoteChatMsg]);
        }}
      />

      {/* Global Size Chart Modal */}
      <SizeChartModal
        isOpen={isGlobalSizeChartOpen}
        onClose={() => setIsGlobalSizeChartOpen(false)}
        onSelectSize={(size) => {
          showToast(`เลือกไซส์ ${size} เรียบร้อย`);
        }}
      />
    </div>
  );
}
