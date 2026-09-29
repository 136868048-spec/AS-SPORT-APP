import { USER_AVATAR } from '../data/mockData';
import { PortalRole, ScreenTab } from '../types';

interface ProfileMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: PortalRole;
  userEmail: string;
  onLogout: () => void;
  onOwnerLoginRequest?: () => void;
  onTabChange: (tab: ScreenTab) => void;
}

export function ProfileMenuModal({
  isOpen,
  onClose,
  role,
  userEmail,
  onLogout,
  onOwnerLoginRequest,
  onTabChange,
}: ProfileMenuModalProps) {
  if (!isOpen) return null;

  const isOwner = role === 'admin';

  return (
    <div className="fixed inset-0 z-50 bg-[#213145]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl flex flex-col gap-4 border border-[#e5eeff]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00288e] text-[20px]">
              {isOwner ? 'shield_person' : 'person'}
            </span>
            <span className="text-[14px] font-bold text-[#0b1c30]">
              {isOwner ? 'ระบบจัดการบัญชีเจ้าของร้าน' : 'ข้อมูลบัญชีลูกค้าสมาชิก'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#565e74] hover:text-[#0b1c30] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#eff4ff] border border-[#d3e4fe]">
          <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#00288e]/30 shrink-0">
            <img src={USER_AVATAR} alt="User Avatar" className="w-full h-full object-cover" />
            {isOwner && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[14px] font-bold text-[#0b1c30] truncate">
                {isOwner ? 'เจ้าของร้าน AS SPORT' : 'คุณกฤษณะ วงศ์วารินทร์'}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isOwner
                    ? 'bg-[#1e40af] text-white'
                    : role === 'guest'
                    ? 'bg-[#dae2fd] text-[#131b2e]'
                    : 'bg-[#acedff] text-[#001f26]'
                }`}
              >
                {isOwner ? 'OWNER / ADMIN' : role === 'guest' ? 'GUEST' : 'VIP MEMBER'}
              </span>
            </div>
            <span className="text-[12px] text-[#565e74] truncate">
              {userEmail || (isOwner ? 'admin@subliprint-admin.com' : 'customer@sportclub.co.th')}
            </span>
            <span className="text-[11px] text-[#00288e] font-semibold mt-0.5">
              {isOwner ? 'สิทธิ์สูงสุด: ควบคุมระบบหลังบ้าน & โรงงานพิมพ์' : 'สิทธิ์ผู้ใช้งาน: สั่งผลิตเสื้อ & ติดตามออเดอร์'}
            </span>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div className="flex flex-col gap-1 text-[13px]">
          {isOwner ? (
            <>
              <button
                onClick={() => {
                  onTabChange('owner-dashboard');
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#eff4ff] text-[#0b1c30] font-semibold transition-colors"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00288e] text-[20px]">
                    analytics
                  </span>
                  <span>แดชบอร์ดภาพรวมร้านค้า</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#565e74]">chevron_right</span>
              </button>

              <button
                onClick={() => {
                  onTabChange('owner-orders');
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#eff4ff] text-[#0b1c30] font-semibold transition-colors"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00288e] text-[20px]">
                    precision_manufacturing
                  </span>
                  <span>คิวสั่งผลิต &amp; ตรวจไฟล์พิมพ์</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#565e74]">chevron_right</span>
              </button>

              <button
                onClick={() => {
                  onTabChange('owner-inventory');
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#eff4ff] text-[#0b1c30] font-semibold transition-colors"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00288e] text-[20px]">
                    inventory_2
                  </span>
                  <span>คลังม้วนผ้า &amp; หมึกพิมพ์ CMYK</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#565e74]">chevron_right</span>
              </button>

              <button
                onClick={() => {
                  onTabChange('home-and-catalog');
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#eff4ff] text-[#00288e] font-bold transition-colors"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">
                    visibility
                  </span>
                  <span>ดูมุมมองหน้าร้านค้าลูกค้า</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#565e74]">chevron_right</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  onTabChange('customer-profile');
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#eff4ff] text-[#0b1c30] font-semibold transition-colors"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00288e] text-[20px]">
                    receipt_long
                  </span>
                  <span>ประวัติคำสั่งซื้อและสถานะงานพิมพ์</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#565e74]">chevron_right</span>
              </button>

              <button
                onClick={() => {
                  onTabChange('cart-and-quote');
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#eff4ff] text-[#0b1c30] font-semibold transition-colors"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00288e] text-[20px]">
                    shopping_cart
                  </span>
                  <span>ตะกร้าสินค้าของฉัน</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#565e74]">chevron_right</span>
              </button>

              <button
                onClick={() => {
                  onTabChange('live-support-chat');
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#eff4ff] text-[#0b1c30] font-semibold transition-colors"
                type="button"
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00288e] text-[20px]">
                    support_agent
                  </span>
                  <span>แชทติดต่อช่างพิมพ์ &amp; ฝ่ายบริการ</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-[#565e74]">chevron_right</span>
              </button>
            </>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 border-t border-[#e5eeff] flex flex-col gap-2">
          {/* For Customer: Secured link to switch to owner login (requires credentials, not immediate switch) */}
          {!isOwner && onOwnerLoginRequest && (
            <button
              onClick={() => {
                onOwnerLoginRequest();
                onClose();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-[#eff4ff] text-[#00288e] text-[12px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#dce9ff] transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">lock</span>
              <span>เข้าสู่ระบบในฐานะเจ้าของร้าน/แอดมิน</span>
            </button>
          )}

          {/* Log Out Button */}
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-[13px] font-bold flex items-center justify-center gap-1.5 hover:bg-[#ffdad6]/80 active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>ออกจากระบบ (Log Out)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
