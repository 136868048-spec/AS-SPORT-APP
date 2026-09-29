import { useState } from 'react';
import { ProductionOrder, ScreenTab, PortalRole } from '../../types';
import { ArtworkPreviewModal } from '../ArtworkPreviewModal';

interface AdminScreenProps {
  orders: ProductionOrder[];
  onTabChange: (tab: ScreenTab) => void;
  onLogout: () => void;
  showToast: (msg: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: ProductionOrder['status'], statusText: string) => void;
  currentTab?: ScreenTab;
}

export function AdminScreen({
  orders,
  onTabChange,
  onLogout,
  showToast,
  onUpdateOrderStatus,
  currentTab = 'owner-dashboard',
}: AdminScreenProps) {
  const [selectedArtworkOrder, setSelectedArtworkOrder] = useState<ProductionOrder | null>(null);
  const [inkRestockAlert, setInkRestockAlert] = useState(false);
  const [isCallingTech, setIsCallingTech] = useState(false);
  const [orderFilter, setOrderFilter] = useState<'all' | 'checking_graphic' | 'printing' | 'ready_shipping'>('all');
  const [tierPricing, setTierPricing] = useState([
    { qty: '1 - 9 ตัว', price: 320, discount: 'ราคาปกติ' },
    { qty: '10 - 29 ตัว', price: 260, discount: 'ลด 18%' },
    { qty: '30 - 49 ตัว', price: 240, discount: 'ลด 25%' },
    { qty: '50+ ตัวขึ้นไป', price: 220, discount: 'ลด 31% (ส่งฟรี)' },
  ]);

  const handleApproveOrder = (orderId: string) => {
    onUpdateOrderStatus(orderId, 'printing', 'กำลังขึ้นแท่นพิมพ์ Mimaki');
    showToast(`อนุมัติออเดอร์ ${orderId} และส่งเข้าคิวพิมพ์แล้ว!`);
  };

  const handlePrintShippingLabel = (orderId: string) => {
    showToast(`สั่งพิมพ์ใบปะหน้าพัสดุ Kerry Express สำหรับ ${orderId} แล้ว`);
  };

  const handleOrderInk = () => {
    setInkRestockAlert(true);
    showToast('ส่งใบเบิกหมึก Sublimation Cyan ด่วนไปยังคลังสินค้าหลักแล้ว (กำหนดส่งภายใน 2 ชม.)');
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  // Determine subview
  const isOrdersTab = currentTab === 'owner-orders';
  const isInventoryTab = currentTab === 'owner-inventory';
  const isSettingsTab = currentTab === 'owner-settings';
  const isChatTab = currentTab === 'owner-chat';
  const isDashboardTab = currentTab === 'owner-dashboard' || currentTab === 'admin-portal';

  return (
    <div className="flex flex-col w-full gap-4 pb-28 animate-fadeIn">
      {/* Top Portal Badge & Admin Persona Bar */}
      <div className="flex flex-col gap-2 bg-[#eff4ff] p-4 rounded-2xl shadow-xs border border-[#d3e4fe]">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span
              className="material-symbols-outlined text-[#00288e] text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              admin_panel_settings
            </span>
            <span className="text-[16px] font-bold text-[#0b1c30]">ระบบจัดการหลังบ้าน</span>
          </div>
          <div className="flex items-center gap-1 bg-[#d3e4fe] px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-[#3cccea] animate-pulse"></span>
            <span className="text-[11px] font-bold text-[#004e5c]">SubliPrint Portal v2.4</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-1 flex-wrap gap-2 pt-1 border-t border-[#d3e4fe]/60">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="material-symbols-outlined text-[16px] text-[#003a46]">verified_user</span>
            <span className="text-[12px] text-[#565e74] truncate">
              ได้รับอนุญาต: <strong className="text-[#0b1c30]">admin@subliprint.com</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onTabChange('home-and-catalog')}
              className="px-2.5 py-1 bg-white text-[#00288e] rounded-lg text-[12px] font-semibold flex items-center gap-1 shadow-xs active:scale-95 transition-transform"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span>หน้าร้านค้า</span>
            </button>
            <button
              onClick={onLogout}
              className="px-2.5 py-1 bg-[#ffdad6] text-[#ba1a1a] rounded-lg text-[12px] font-bold flex items-center gap-1 active:scale-95 transition-transform"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>ออกระบบ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Owner Tab Navigation Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => onTabChange('owner-dashboard')}
          type="button"
          className={`px-3 py-1.5 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            isDashboardTab
              ? 'bg-[#00288e] text-white shadow-xs'
              : 'bg-white text-[#444653] hover:bg-[#eff4ff] border border-[#e5eeff]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">analytics</span>
          <span>ภาพรวมร้าน</span>
        </button>

        <button
          onClick={() => onTabChange('owner-orders')}
          type="button"
          className={`px-3 py-1.5 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            isOrdersTab
              ? 'bg-[#00288e] text-white shadow-xs'
              : 'bg-white text-[#444653] hover:bg-[#eff4ff] border border-[#e5eeff]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">precision_manufacturing</span>
          <span>คิวผลิต ({orders.length})</span>
        </button>

        <button
          onClick={() => onTabChange('owner-inventory')}
          type="button"
          className={`px-3 py-1.5 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            isInventoryTab
              ? 'bg-[#00288e] text-white shadow-xs'
              : 'bg-white text-[#444653] hover:bg-[#eff4ff] border border-[#e5eeff]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">inventory_2</span>
          <span>คลังผ้า &amp; หมึก</span>
          {!inkRestockAlert && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          )}
        </button>

        <button
          onClick={() => onTabChange('owner-chat')}
          type="button"
          className={`px-3 py-1.5 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            isChatTab
              ? 'bg-[#00288e] text-white shadow-xs'
              : 'bg-white text-[#444653] hover:bg-[#eff4ff] border border-[#e5eeff]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">support_agent</span>
          <span>แชทลูกค้า</span>
        </button>

        <button
          onClick={() => onTabChange('owner-settings')}
          type="button"
          className={`px-3 py-1.5 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            isSettingsTab
              ? 'bg-[#00288e] text-white shadow-xs'
              : 'bg-white text-[#444653] hover:bg-[#eff4ff] border border-[#e5eeff]'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
          <span>ตั้งค่าร้าน</span>
        </button>
      </div>

      {/* VIEW 1: DASHBOARD OVERVIEW */}
      {(isDashboardTab || (!isOrdersTab && !isInventoryTab && !isSettingsTab && !isChatTab)) && (
        <>
          {/* KPI Business Overview Grid */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[14px] font-bold text-[#0b1c30]">สรุปภาพรวมวันนี้</span>
              <span className="text-[11px] text-[#565e74]">อัปเดตเรียลไทม์ 14:45 น.</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* KPI 1 */}
              <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e5eeff] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-[#565e74]">ยอดขายวันนี้</span>
                  <span className="p-1.5 bg-[#dde1ff] text-[#00288e] rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-[20px] font-extrabold text-[#00288e]">฿48,500</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[14px] text-[#004e5c]">trending_up</span>
                    <span className="text-[11px] font-bold text-[#004e5c]">+18% จากเมื่อวาน</span>
                  </div>
                </div>
              </div>

              {/* KPI 2 */}
              <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e5eeff] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-[#565e74]">รอพิมพ์/ผลิต</span>
                  <span className="p-1.5 bg-[#acedff] text-[#003a46] rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-[20px] font-extrabold text-[#0b1c30]">
                    14 <span className="text-[13px] font-medium text-[#565e74]">คิว</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#003a46]">เร่งด่วน 3 คิว</span>
                </div>
              </div>

              {/* KPI 3 */}
              <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e5eeff] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-[#565e74]">กำลังพิมพ์ &amp; ตัดเย็บ</span>
                  <span className="p-1.5 bg-[#dae2fd] text-[#131b2e] rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">precision_manufacturing</span>
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-[20px] font-extrabold text-[#0b1c30]">
                    8 <span className="text-[13px] font-medium text-[#565e74]">งาน</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#003a46] bg-[#eff4ff] px-1.5 py-0.5 rounded">
                    Heat Transfer Active
                  </span>
                </div>
              </div>

              {/* KPI 4 */}
              <div className="bg-white p-3.5 rounded-2xl shadow-xs border border-[#e5eeff] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium text-[#565e74]">จัดส่งสำเร็จวันนี้</span>
                  <span className="p-1.5 bg-[#dce9ff] text-[#00288e] rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                  </span>
                </div>
                <div className="mt-2">
                  <div className="text-[20px] font-extrabold text-[#0b1c30]">
                    26 <span className="text-[13px] font-medium text-[#565e74]">กล่อง</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#565e74]">ตรงเวลา 100%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Low Ink Warning Quick Banner */}
          <div className="p-3 bg-[#ffdad6]/40 rounded-2xl flex items-center justify-between border border-[#ffdad6]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a] shrink-0">
                <span className="material-symbols-outlined text-[18px]">warning</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-bold text-[#0b1c30] truncate">
                  เตือนสต็อก: หมึก Sublimation Cyan ต่ำ (15%)
                </span>
                <span className="text-[11px] text-[#ba1a1a]">
                  {inkRestockAlert ? '✓ ส่งคำสั่งเบิกด่วนแล้ว' : 'อาจกระทบคิวพิมพ์ช่วงบ่าย'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleOrderInk}
              disabled={inkRestockAlert}
              className="px-3 py-1.5 bg-[#00288e] text-white rounded-xl text-[11px] font-bold active:scale-95 transition-transform shrink-0 disabled:opacity-50"
            >
              {inkRestockAlert ? 'เบิกแล้ว' : 'สั่งเติมด่วน'}
            </button>
          </div>

          {/* Quick Production Snapshot */}
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e5eeff] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold text-[#0b1c30]">ออเดอร์ล่าสุดในระบบ</span>
              <button
                type="button"
                onClick={() => onTabChange('owner-orders')}
                className="text-[12px] font-bold text-[#00288e] hover:underline"
              >
                ดูทั้งหมด ({orders.length}) →
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {orders.slice(0, 2).map((order) => (
                <div key={order.id} className="p-2.5 rounded-xl bg-[#eff4ff] flex items-center justify-between gap-2 border border-[#d3e4fe]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={order.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover bg-white shrink-0" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] font-bold text-[#0b1c30] truncate">{order.id} - {order.clientName}</span>
                      <span className="text-[11px] text-[#565e74] truncate">{order.quantity} ตัว • {order.statusText}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#00288e] shrink-0">฿{order.paidAmount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* VIEW 2: ORDERS & PRODUCTION QUEUE */}
      {isOrdersTab && (
        <div className="flex flex-col gap-3">
          {/* Order Status Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: 'ทั้งหมด' },
              { id: 'checking_graphic', label: 'รอตรวจไฟล์' },
              { id: 'printing', label: 'กำลังพิมพ์' },
              { id: 'ready_shipping', label: 'พร้อมจัดส่ง' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setOrderFilter(f.id as any)}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors whitespace-nowrap ${
                  orderFilter === f.id
                    ? 'bg-[#00288e] text-white'
                    : 'bg-white text-[#565e74] hover:bg-[#eff4ff] border border-[#e5eeff]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-[14px] font-bold text-[#0b1c30]">รายการคิวสั่งผลิต</span>
            <span className="text-[11px] text-[#565e74]">{filteredOrders.length} ออเดอร์</span>
          </div>

          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-2xl shadow-xs border border-[#e5eeff] flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[16px] font-bold text-[#00288e]">{order.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                      order.status === 'printing'
                        ? 'bg-[#acedff] text-[#001f26]'
                        : order.status === 'checking_graphic'
                        ? 'bg-[#dae2fd] text-[#131b2e]'
                        : 'bg-[#eff4ff] text-[#00288e]'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        order.status === 'printing'
                          ? 'bg-[#003a46]'
                          : order.status === 'checking_graphic'
                          ? 'bg-[#ba1a1a] animate-ping'
                          : 'bg-[#00288e]'
                      }`}
                    ></span>
                    {order.statusText}
                  </span>
                </div>
                <span className="text-[11px] text-[#565e74]">{order.timeAgo}</span>
              </div>

              <div className="flex gap-3 items-center">
                <img
                  src={order.imageUrl}
                  alt={order.clientName}
                  className="w-16 h-16 rounded-xl object-cover bg-[#eff4ff] shrink-0 border border-[#d3e4fe]"
                />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[13px] font-bold text-[#0b1c30] truncate">
                    {order.clientName}
                  </span>
                  <span className="text-[12px] text-[#565e74] truncate">
                    {order.description}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span className="text-[10px] text-[#004e5c] bg-[#eff4ff] px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px] text-emerald-600">check_circle</span>
                      {order.paymentStatus}
                    </span>
                    <span className="text-[10px] text-[#00288e] bg-[#dde1ff] px-1.5 py-0.5 rounded font-bold">
                      {order.fileStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Context status block */}
              {order.printerDevice && (
                <div className="p-2.5 bg-[#eff4ff] rounded-xl flex items-center justify-between text-[12px]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#00288e] text-[18px]">print</span>
                    <span className="text-[#0b1c30] font-medium">{order.printerDevice}</span>
                  </div>
                  <span className="font-bold text-[#00288e]">
                    ความคืบหน้า {order.progressPercent}%
                  </span>
                </div>
              )}

              {/* Actions depending on state */}
              {order.status === 'checking_graphic' && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSelectedArtworkOrder(order)}
                    className="py-2.5 px-3 bg-[#eff4ff] text-[#00288e] rounded-xl text-[12px] font-bold flex items-center justify-center gap-1 hover:bg-[#dce9ff] active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[18px]">find_in_page</span>
                    <span>ตรวจไฟล์แบบ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApproveOrder(order.id)}
                    className="py-2.5 px-3 bg-[#00288e] text-white rounded-xl text-[12px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-transform shadow-xs hover:bg-[#1e40af]"
                  >
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>อนุมัติขึ้นผลิต</span>
                  </button>
                </div>
              )}

              {order.status === 'ready_shipping' && (
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-[#565e74]">
                    พนักงานจัดส่งเข้ารับ: {order.pickupTime}
                  </span>
                  <button
                    type="button"
                    onClick={() => handlePrintShippingLabel(order.id)}
                    className="py-1.5 px-3 bg-[#565e74] text-white rounded-xl text-[11px] font-bold flex items-center gap-1 active:scale-95 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[16px]">print</span>
                    <span>พิมพ์ใบปะหน้า</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* VIEW 3: INVENTORY & MATERIALS */}
      {isInventoryTab && (
        <div className="flex flex-col gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e5eeff] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#00288e] text-[20px]">texture</span>
                <h3 className="text-[15px] font-bold text-[#0b1c30]">คลังม้วนผ้ากีฬา (Fabric Rolls)</h3>
              </div>
              <span className="text-[11px] text-[#565e74]">คลังหลัก Factory A</span>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="p-3 bg-[#eff4ff] rounded-xl flex items-center justify-between border border-[#d3e4fe]">
                <div>
                  <div className="text-[13px] font-bold text-[#0b1c30]">ผ้า Micro Dry-Fit ขาวโอโม่</div>
                  <div className="text-[11px] text-[#565e74]">สำหรับเสื้อวิ่ง &amp; กีฬาพิมพ์ลายเต็มตัว</div>
                </div>
                <div className="text-right">
                  <div className="text-[14px] font-bold text-[#00288e]">1,200 หลา</div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">เพียงพอ</span>
                </div>
              </div>

              <div className="p-3 bg-[#eff4ff] rounded-xl flex items-center justify-between border border-[#d3e4fe]">
                <div>
                  <div className="text-[13px] font-bold text-[#0b1c30]">ผ้า Pique เม็ดข้าวสาร Premium</div>
                  <div className="text-[11px] text-[#565e74]">สำหรับเสื้อโปโลพิมพ์ลายองค์กร</div>
                </div>
                <div className="text-right">
                  <div className="text-[14px] font-bold text-[#00288e]">650 หลา</div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">เพียงพอ</span>
                </div>
              </div>

              <div className="p-3 bg-[#eff4ff] rounded-xl flex items-center justify-between border border-[#d3e4fe]">
                <div>
                  <div className="text-[13px] font-bold text-[#0b1c30]">กระดาษทรานส์เฟอร์ Sublimation 100g</div>
                  <div className="text-[11px] text-[#565e74]">ม้วนกว้าง 1.60 ม. ความยาว 150 ม.</div>
                </div>
                <div className="text-right">
                  <div className="text-[14px] font-bold text-[#00288e]">45 ม้วน</div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">พร้อมใช้</span>
                </div>
              </div>
            </div>
          </div>

          {/* CMYK Sublimation Inks Detailed */}
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e5eeff] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#00288e] text-[20px]">palette</span>
                <h3 className="text-[15px] font-bold text-[#0b1c30]">ระดับน้ำหมึกพิมพ์แท้ Mimaki CMYK</h3>
              </div>
              <span className="text-[11px] font-bold text-[#00288e]">SB54 Genuine Ink</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Cyan */}
              <div className="p-3 rounded-xl bg-cyan-50 border border-cyan-200 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-bold text-cyan-900">Cyan (ฟ้า)</span>
                  <span className="text-[12px] font-extrabold text-red-600">15%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-cyan-200 mt-2 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: '15%' }}></div>
                </div>
                <button
                  type="button"
                  onClick={handleOrderInk}
                  className="mt-2 py-1 px-2 rounded-lg bg-red-600 text-white text-[10px] font-bold hover:bg-red-700"
                >
                  {inkRestockAlert ? '✓ เบิกด่วนแล้ว' : 'สั่งเติมทันที'}
                </button>
              </div>

              {/* Magenta */}
              <div className="p-3 rounded-xl bg-pink-50 border border-pink-200 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-bold text-pink-900">Magenta (แดงม่วง)</span>
                  <span className="text-[12px] font-extrabold text-pink-700">82%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-pink-200 mt-2 overflow-hidden">
                  <div className="h-full bg-pink-600 rounded-full" style={{ width: '82%' }}></div>
                </div>
                <span className="text-[10px] text-pink-700 mt-2 font-semibold">ระดับสมบูรณ์</span>
              </div>

              {/* Yellow */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-bold text-amber-900">Yellow (เหลือง)</span>
                  <span className="text-[12px] font-extrabold text-amber-700">74%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-amber-200 mt-2 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '74%' }}></div>
                </div>
                <span className="text-[10px] text-amber-700 mt-2 font-semibold">ระดับสมบูรณ์</span>
              </div>

              {/* Black */}
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-300 flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-bold text-slate-900">Key / Black (ดำ)</span>
                  <span className="text-[12px] font-extrabold text-slate-800">91%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-300 mt-2 overflow-hidden">
                  <div className="h-full bg-slate-800 rounded-full" style={{ width: '91%' }}></div>
                </div>
                <span className="text-[10px] text-slate-700 mt-2 font-semibold">ระดับสมบูรณ์</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: CUSTOMER SUPPORT & CHAT INBOX */}
      {isChatTab && (
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e5eeff] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#00288e] text-[20px]">chat</span>
              <h3 className="text-[15px] font-bold text-[#0b1c30]">กล่องข้อความพูดคุยกับลูกค้า</h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Online</span>
          </div>

          <p className="text-[12px] text-[#565e74]">
            ตอบคำถามลูกค้า ตรวจสอบไฟล์กราฟิก และส่งพรูฟสีแบบเรียลไทม์
          </p>

          <div
            onClick={() => onTabChange('live-support-chat')}
            className="p-3 rounded-xl bg-[#eff4ff] border border-[#d3e4fe] flex items-center justify-between cursor-pointer hover:bg-[#dce9ff] transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#00288e] text-white flex items-center justify-center font-bold shrink-0">
                กษ
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-bold text-[#0b1c30]">คุณกฤษณะ (ทีม RunForLife)</span>
                <span className="text-[11px] text-[#565e74] truncate">ออเดอร์ #SP-9921 • สอบถามการพรูฟสีกรม-ม่วง</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#00288e]">เปิดแชท →</span>
          </div>
        </div>
      )}

      {/* VIEW 5: STORE SETTINGS & TIER PRICING */}
      {isSettingsTab && (
        <div className="flex flex-col gap-3">
          {/* Bulk Tier Pricing Setup */}
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e5eeff] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#00288e] text-[20px]">price_change</span>
                <h3 className="text-[15px] font-bold text-[#0b1c30]">ตั้งค่าราคาส่งตามจำนวน (Bulk Tiers)</h3>
              </div>
              <button
                type="button"
                onClick={() => showToast('บันทึกการตั้งค่าราคาเรียบร้อย')}
                className="px-2.5 py-1 bg-[#00288e] text-white rounded-lg text-[11px] font-bold hover:bg-[#1e40af]"
              >
                บันทึก
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {tierPricing.map((tier, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-[#eff4ff] flex items-center justify-between border border-[#d3e4fe]">
                  <div>
                    <div className="text-[12px] font-bold text-[#0b1c30]">{tier.qty}</div>
                    <div className="text-[10px] text-[#004e5c]">{tier.discount}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-[#00288e]">฿{tier.price}</span>
                    <span className="text-[11px] text-[#565e74]">/ตัว</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Factory Capacity */}
          <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e5eeff] flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#00288e] text-[20px]">local_shipping</span>
              <h3 className="text-[15px] font-bold text-[#0b1c30]">พาร์ทเนอร์ขนส่งที่เชื่อมต่อ</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              <div className="p-2.5 rounded-xl bg-[#eff4ff] border border-[#d3e4fe] flex items-center justify-between">
                <span className="font-semibold text-[#0b1c30]">Kerry Express</span>
                <span className="text-emerald-600 font-bold">เปิดใช้งาน</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#eff4ff] border border-[#d3e4fe] flex items-center justify-between">
                <span className="font-semibold text-[#0b1c30]">Flash Express</span>
                <span className="text-emerald-600 font-bold">เปิดใช้งาน</span>
              </div>
            </div>
          </div>

          {/* View Customer Storefront Button */}
          <button
            type="button"
            onClick={() => {
              onTabChange('home-and-catalog');
              showToast('เปิดมุมมองหน้าร้านค้าลูกค้า (Storefront Preview Mode)');
            }}
            className="w-full py-3 px-4 rounded-xl bg-[#00288e] text-white text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-[#1e40af] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span>ดูมุมมองหน้าร้านค้าลูกค้า (Storefront Preview)</span>
          </button>
        </div>
      )}

      {/* Production Quick Notes Card */}
      <div className="bg-[#eff4ff] p-4 rounded-2xl flex items-center justify-between gap-3 border border-[#d3e4fe]">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="material-symbols-outlined text-[#00288e] text-[24px]">support_agent</span>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-bold text-[#0b1c30]">ติดต่อช่างพิมพ์ห้องคลีนรูม</span>
            <span className="text-[12px] text-[#565e74] truncate">
              กะบ่าย: ช่างประเสริฐ (ห้อง Roll Sublimation)
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsCallingTech(true);
            showToast('กำลังโทรต่อสายตรงช่างประเสริฐ (ห้องพิมพ์ #02)...');
            setTimeout(() => setIsCallingTech(false), 3000);
          }}
          className="p-2.5 bg-white text-[#00288e] rounded-full shadow-xs active:scale-95 transition-transform flex items-center justify-center border border-[#d3e4fe]"
        >
          <span className="material-symbols-outlined text-[20px]">
            {isCallingTech ? 'ring_volume' : 'call'}
          </span>
        </button>
      </div>

      {/* Artwork Inspection Modal */}
      {selectedArtworkOrder && (
        <ArtworkPreviewModal
          isOpen={true}
          onClose={() => setSelectedArtworkOrder(null)}
          title={`ตรวจไฟล์งานพิมพ์ ${selectedArtworkOrder.id} - ${selectedArtworkOrder.clientName}`}
          fileName={selectedArtworkOrder.fileName || 'Corporate_Vector_Proof.ai'}
          previewUrl={selectedArtworkOrder.imageUrl}
          showApproveAction={true}
          onApprove={() => handleApproveOrder(selectedArtworkOrder.id)}
        />
      )}
    </div>
  );
}
