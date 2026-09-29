import { ScreenTab, PortalRole } from '../types';

interface BottomNavProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
  cartCount: number;
  role: PortalRole;
}

export function BottomNav({ currentTab, onTabChange, cartCount, role }: BottomNavProps) {
  const isOwner = role === 'admin';

  // Distinct navigation for Customer vs Owner
  const customerNavItems: { id: ScreenTab; label: string; icon: string; badge?: number | boolean }[] = [
    {
      id: 'home-and-catalog',
      label: 'สินค้า',
      icon: 'storefront',
    },
    {
      id: 'apparel-customizer',
      label: 'คัสตอม',
      icon: 'palette',
    },
    {
      id: 'live-support-chat',
      label: 'แชทช่าง',
      icon: 'chat_bubble',
      badge: true,
    },
    {
      id: 'cart-and-quote',
      label: 'ตะกร้า',
      icon: 'shopping_cart',
      badge: cartCount > 0 ? cartCount : undefined,
    },
    {
      id: 'customer-profile',
      label: 'ออเดอร์ฉัน',
      icon: 'account_circle',
    },
  ];

  const ownerNavItems: { id: ScreenTab; label: string; icon: string; badge?: number | boolean }[] = [
    {
      id: 'owner-dashboard',
      label: 'ภาพรวมร้าน',
      icon: 'analytics',
    },
    {
      id: 'owner-orders',
      label: 'คิวผลิต',
      icon: 'precision_manufacturing',
      badge: 3, // 3 pending approvals
    },
    {
      id: 'owner-inventory',
      label: 'คลังวัสดุ',
      icon: 'inventory_2',
    },
    {
      id: 'owner-chat',
      label: 'แชทลูกค้า',
      icon: 'support_agent',
      badge: true,
    },
    {
      id: 'owner-settings',
      label: 'จัดการร้าน',
      icon: 'admin_panel_settings',
    },
  ];

  const navItems = isOwner ? ownerNavItems : customerNavItems;

  return (
    <nav className="fixed bottom-0 w-full z-50 pb-safe bg-[#f8f9ff]/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.05)] border-t border-[#e5eeff]">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const isActive =
            currentTab === item.id ||
            (item.id === 'owner-dashboard' && currentTab === 'admin-portal');
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center min-w-[58px] min-h-[44px] gap-0.5 transition-all active:scale-95 ${
                isActive
                  ? 'text-[#00288e] font-bold'
                  : 'text-[#444653] hover:text-[#0b1c30]'
              }`}
              type="button"
            >
              <div className="relative flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>

                {/* Badge indicators */}
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 bg-[#00288e] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {item.badge}
                  </span>
                )}
                {typeof item.badge === 'boolean' && item.badge && !isActive && (
                  <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full ring-2 ring-white"></span>
                )}
              </div>

              <span className="text-[11px] leading-tight font-medium">
                {item.label}
              </span>

              {isActive && (
                <span className="w-4 h-0.5 bg-[#00288e] rounded-full mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
