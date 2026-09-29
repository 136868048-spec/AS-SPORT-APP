import { AS_SPORT_LOGOS, USER_AVATAR } from '../data/mockData';
import { ScreenTab, PortalRole } from '../types';

interface HeaderProps {
  currentTab: ScreenTab;
  onTabChange: (tab: ScreenTab) => void;
  cartCount: number;
  role: PortalRole;
  onOpenLogin: () => void;
  onSearchClick: () => void;
}

export function Header({
  currentTab,
  onTabChange,
  cartCount,
  role,
  onOpenLogin,
  onSearchClick,
}: HeaderProps) {
  const isOwner = role === 'admin';

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#f8f9ff]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#e5eeff]">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between gap-2">
        {/* Brand Identity */}
        <div 
          onClick={() => onTabChange(isOwner ? 'owner-dashboard' : 'home-and-catalog')}
          className="flex items-center gap-2.5 min-w-0 cursor-pointer select-none"
        >
          <img
            alt="AS SPORT Logo"
            className="h-8 w-auto object-contain shrink-0"
            src={AS_SPORT_LOGOS.headerLinear}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-[#003a46] uppercase tracking-wider font-bold">
              {isOwner ? 'OWNER & FACTORY PORTAL' : 'CUSTOM APPAREL'}
            </span>
            <div className="flex items-center gap-1.5">
              <h1 className="text-[17px] text-[#00288e] font-bold tracking-tight leading-none truncate">
                AS SPORT
              </h1>
              {isOwner && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#1e40af] text-white">
                  เจ้าของร้าน
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          {/* Quick toggle for Owner */}
          {isOwner ? (
            <div className="flex items-center gap-1.5">
              {currentTab === 'home-and-catalog' ||
              currentTab === 'apparel-customizer' ||
              currentTab === 'cart-and-quote' ? (
                <button
                  onClick={() => onTabChange('owner-dashboard')}
                  title="กลับสู่แผงควบคุมเจ้าของร้าน"
                  className="px-2.5 py-1 rounded-xl bg-[#00288e] text-white text-[11px] font-bold flex items-center gap-1 hover:bg-[#1e40af] transition-colors shadow-xs"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px]">arrow_back</span>
                  <span>กลับหลังบ้าน</span>
                </button>
              ) : (
                <button
                  onClick={() => onTabChange('home-and-catalog')}
                  title="ดูมุมมองหน้าร้านค้าลูกค้า"
                  className="px-2.5 py-1 rounded-xl bg-[#eff4ff] text-[#00288e] text-[11px] font-bold flex items-center gap-1 hover:bg-[#dce9ff] transition-colors border border-[#d3e4fe]"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[15px]">visibility</span>
                  <span className="hidden sm:inline">ดูหน้าร้าน</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Search Toggle */}
              <button
                onClick={onSearchClick}
                aria-label="ค้นหาแบบเสื้อ"
                className="w-10 h-10 flex items-center justify-center rounded-full text-[#0b1c30] hover:bg-[#e5eeff] active:scale-95 transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">search</span>
              </button>

              {/* Cart Icon */}
              <button
                onClick={() => onTabChange('cart-and-quote')}
                aria-label="ดูตะกร้าสินค้า"
                className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#0b1c30] hover:bg-[#e5eeff] active:scale-95 transition-all"
                type="button"
              >
                <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-[#00288e] text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-fadeIn shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            </>
          )}

          {/* Profile / Role Avatar */}
          <button
            onClick={onOpenLogin}
            title={isOwner ? 'จัดการบัญชีเจ้าของร้าน (คลิกเพื่อดูเมนูหรือออกจากระบบ)' : 'บัญชีลูกค้า (คลิกเพื่อดูโปรไฟล์หรือออกจากระบบ)'}
            className="relative w-8 h-8 rounded-full ml-1 overflow-hidden ring-2 ring-[#00288e]/20 hover:ring-[#00288e] transition-all active:scale-90"
            type="button"
          >
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src={USER_AVATAR}
            />
            {isOwner && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
