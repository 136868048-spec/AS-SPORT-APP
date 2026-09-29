import { USER_AVATAR } from '../../data/mockData';
import { ProductionOrder, ScreenTab } from '../../types';

interface CustomerProfileScreenProps {
  orders: ProductionOrder[];
  userEmail: string;
  onTabChange: (tab: ScreenTab) => void;
  onLogout: () => void;
  showToast: (msg: string) => void;
}

export function CustomerProfileScreen({
  orders,
  userEmail,
  onTabChange,
  onLogout,
  showToast,
}: CustomerProfileScreenProps) {
  return (
    <div className="flex flex-col w-full gap-4 pb-28 animate-fadeIn">
      {/* Profile Card Header */}
      <div className="bg-white p-5 rounded-3xl shadow-xs border border-[#e5eeff] flex flex-col gap-3">
        <div className="flex items-center gap-3.5">
          <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-[#00288e]/15 shrink-0 shadow-sm">
            <img src={USER_AVATAR} alt="User Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-[17px] font-bold text-[#0b1c30] truncate">
                คุณกฤษณะ วงศ์วารินทร์
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#acedff] text-[#001f26]">
                VIP MEMBER
              </span>
            </div>
            <span className="text-[12px] text-[#565e74] truncate">
              {userEmail || 'customer@sportclub.co.th'}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-[#00288e] font-semibold bg-[#eff4ff] px-2 py-0.5 rounded-full">
                สะสมแต้ม: 1,450 พอยท์
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#e5eeff]">
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#eff4ff]">
            <span className="text-[18px] font-extrabold text-[#00288e]">{orders.length}</span>
            <span className="text-[11px] text-[#565e74]">ออเดอร์ทั้งหมด</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#eff4ff]">
            <span className="text-[18px] font-extrabold text-[#003a46]">
              {orders.filter((o) => o.status === 'printing').length}
            </span>
            <span className="text-[11px] text-[#565e74]">กำลังพิมพ์</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#eff4ff]">
            <span className="text-[18px] font-extrabold text-emerald-600">
              {orders.filter((o) => o.status === 'ready_shipping').length}
            </span>
            <span className="text-[11px] text-[#565e74]">รอจัดส่ง</span>
          </div>
        </div>
      </div>

      {/* Real Orders Status Tracker */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00288e] text-[20px]">
              inventory_2
            </span>
            <h3 className="text-[15px] font-bold text-[#0b1c30]">คำสั่งซื้อและสถานะงานพิมพ์</h3>
          </div>
          <span className="text-[11px] text-[#565e74]">{orders.length} รายการ</span>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl text-center border border-[#e5eeff] flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[36px] text-[#565e74]">
              receipt_long
            </span>
            <span className="text-[13px] text-[#565e74]">ยังไม่มีรายการคำสั่งซื้อ</span>
            <button
              onClick={() => onTabChange('home-and-catalog')}
              className="mt-1 px-3 py-1.5 rounded-xl bg-[#00288e] text-white text-[12px] font-bold"
              type="button"
            >
              เลือกสั่งผลิตเสื้อ
            </button>
          </div>
        ) : (
          orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white p-4 rounded-2xl shadow-xs border border-[#e5eeff] flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-extrabold text-[#00288e]">{ord.id}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ord.status === 'printing'
                        ? 'bg-[#acedff] text-[#001f26]'
                        : ord.status === 'ready_shipping'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-[#dae2fd] text-[#131b2e]'
                    }`}
                  >
                    {ord.statusText}
                  </span>
                </div>
                <span className="text-[11px] text-[#565e74]">{ord.timeAgo}</span>
              </div>

              <div className="flex gap-3 items-center">
                <img
                  src={ord.imageUrl}
                  alt={ord.description}
                  className="w-16 h-16 rounded-xl object-cover bg-[#eff4ff] shrink-0 border border-[#d3e4fe]"
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[13px] font-bold text-[#0b1c30] truncate">
                    {ord.description}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] font-bold text-[#00288e]">
                      ฿{ord.paidAmount.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-[#565e74]">
                      • {ord.quantity} ตัว
                    </span>
                  </div>
                  <span className="text-[11px] text-[#004e5c] font-semibold flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[13px] text-emerald-600">
                      verified
                    </span>
                    {ord.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Progress bar if printing */}
              {ord.status === 'printing' && (
                <div className="p-2.5 rounded-xl bg-[#eff4ff] flex flex-col gap-1.5 border border-[#d3e4fe]">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#00288e] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">print</span>
                      กำลังพิมพ์ซับลิเมชันด้วยเครื่อง Mimaki
                    </span>
                    <span className="font-bold text-[#00288e]">{ord.progressPercent || 65}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#d3e4fe] overflow-hidden">
                    <div
                      className="h-full bg-[#00288e] rounded-full transition-all duration-500"
                      style={{ width: `${ord.progressPercent || 65}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Shipping tracker if ready */}
              {ord.status === 'ready_shipping' && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-900 flex items-center justify-between text-[11px] border border-emerald-200">
                  <span className="flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[15px] text-emerald-600">
                      local_shipping
                    </span>
                    {ord.shippingPartner || 'Kerry Express'}: TH982173491TH
                  </span>
                  <button
                    onClick={() => showToast('คัดลอกเลขพัสดุ Kerry เรียบร้อย')}
                    className="text-emerald-700 font-bold hover:underline"
                    type="button"
                  >
                    คัดลอกเลข
                  </button>
                </div>
              )}

              {/* Action row */}
              <div className="flex items-center justify-between pt-1 border-t border-[#e5eeff]/70 text-[12px]">
                <button
                  type="button"
                  onClick={() => {
                    onTabChange('live-support-chat');
                    showToast(`เปิดห้องแชทสำหรับออเดอร์ ${ord.id}`);
                  }}
                  className="text-[#00288e] font-semibold flex items-center gap-1 hover:underline"
                >
                  <span className="material-symbols-outlined text-[16px]">chat</span>
                  <span>สอบถามช่างพิมพ์ออเดอร์นี้</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast(`ดาวน์โหลดใบเสร็จ e-Tax Invoice สำหรับ ${ord.id} เรียบร้อย`)}
                  className="text-[#565e74] hover:text-[#0b1c30] font-medium flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">download</span>
                  <span>ใบเสร็จ</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Customer Delivery Address & Preferences */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e5eeff] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00288e] text-[20px]">
              home_pin
            </span>
            <h3 className="text-[15px] font-bold text-[#0b1c30]">ที่อยู่จัดส่งเริ่มต้น</h3>
          </div>
          <button
            onClick={() => showToast('แก้ไขข้อมูลที่อยู่จัดส่ง')}
            className="text-[12px] font-semibold text-[#00288e] hover:underline"
            type="button"
          >
            แก้ไข
          </button>
        </div>

        <p className="text-[12px] text-[#444653] leading-relaxed bg-[#eff4ff] p-3 rounded-xl border border-[#d3e4fe]">
          อาคารซิลลิคเฮ้าส์ ชั้น 8 เลขที่ 1/4 ถนนสีลม แขวงสีลม เขตบางรัก กทม. 10500 <br />
          <span className="font-semibold text-[#0b1c30]">ผู้รับ: คุณกฤษณะ วงศ์วารินทร์ (089-456-7890)</span>
        </p>
      </div>

      {/* Customer Service & Logout */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e5eeff] flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            onTabChange('live-support-chat');
          }}
          className="w-full py-2.5 px-3 rounded-xl bg-[#eff4ff] text-[#00288e] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#dce9ff] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">support_agent</span>
          <span>ติดต่อแอดมินฝ่ายบริการลูกค้า (Live Chat)</span>
        </button>

        <button
          type="button"
          onClick={onLogout}
          className="w-full py-2.5 px-3 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#ffdad6]/80 active:scale-95 transition-all mt-1"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>ออกจากระบบ (Log Out)</span>
        </button>
      </div>
    </div>
  );
}
