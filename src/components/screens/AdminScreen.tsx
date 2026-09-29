import { useState } from 'react';
import { ProductionOrder, ScreenTab, PortalRole } from '../../types';
import { ArtworkPreviewModal } from '../ArtworkPreviewModal';

interface AdminScreenProps {
  orders: ProductionOrder[];
  onTabChange: (tab: ScreenTab) => void;
  onLogout: () => void;
  showToast: (msg: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: ProductionOrder['status'], statusText: string) => void;
}

export function AdminScreen({
  orders,
  onTabChange,
  onLogout,
  showToast,
  onUpdateOrderStatus,
}: AdminScreenProps) {
  const [selectedArtworkOrder, setSelectedArtworkOrder] = useState<ProductionOrder | null>(null);
  const [inkRestockAlert, setInkRestockAlert] = useState(false);
  const [isCallingTech, setIsCallingTech] = useState(false);

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

      {/* Inventory Quick Status Alert Banner */}
      <div className="bg-white p-4 rounded-2xl shadow-xs border border-[#e5eeff] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00288e] text-[20px]">inventory_2</span>
            <h2 className="text-[15px] font-bold text-[#0b1c30]">สถานะคลังวัสดุพิมพ์</h2>
          </div>
          <span className="text-[11px] text-[#565e74]">คลังหลัก (Factory A)</span>
        </div>

        {/* Fabric Status */}
        <div className="p-3 bg-[#eff4ff] rounded-xl flex items-center justify-between border border-[#d3e4fe]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#d3e4fe] flex items-center justify-center text-[#00288e] shrink-0">
              <span className="material-symbols-outlined text-[20px]">texture</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-bold text-[#0b1c30] truncate">
                ผ้า Micro Dry-Fit ขาวโอโม่
              </span>
              <span className="text-[11px] text-[#565e74]">สำหรับเสื้อกีฬาซับลิเมชั่นเต็มตัว</span>
            </div>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[13px] font-bold text-[#00288e]">1,200 หลา</span>
            <span className="text-[10px] font-semibold bg-[#d3e4fe] text-[#004e5c] px-2 py-0.5 rounded-full">
              ระดับปกติ
            </span>
          </div>
        </div>

        {/* Sublimation Ink Warning */}
        <div className="p-3 bg-[#ffdad6]/40 rounded-xl flex items-center justify-between border border-[#ffdad6]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#ffdad6] flex items-center justify-center text-[#ba1a1a] shrink-0">
              <span className="material-symbols-outlined text-[20px]">warning</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-bold text-[#0b1c30] truncate">
                หมึก Sublimation CMYK
              </span>
              <span className="text-[11px] text-[#ba1a1a] font-semibold">
                {inkRestockAlert
                  ? '✓ ส่งใบเบิกด่วนแล้ว กำลังจัดส่ง'
                  : 'หมึกฟ้า Cyan ต่ำกว่าเกณฑ์ (15%)'}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleOrderInk}
            disabled={inkRestockAlert}
            className="px-3 py-1.5 bg-[#00288e] text-white rounded-xl text-[12px] font-bold active:scale-95 transition-transform shrink-0 disabled:opacity-50"
          >
            {inkRestockAlert ? 'เบิกแล้ว' : 'สั่งเพิ่มด่วน'}
          </button>
        </div>
      </div>

      {/* Orders Queue & Pre-flight File Verification Section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#00288e] text-[20px]">assignment</span>
            <h2 className="text-[15px] font-bold text-[#0b1c30]">คิวสั่งผลิต &amp; ตรวจไฟล์พิมพ์</h2>
          </div>
          <span className="px-2.5 py-0.5 bg-[#dde1ff] text-[#00288e] rounded-full text-[11px] font-bold">
            {orders.length} รอดำเนินการ
          </span>
        </div>

        {orders.map((order) => (
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
