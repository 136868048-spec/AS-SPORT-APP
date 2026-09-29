import { useState } from 'react';
import { CartItem, ScreenTab } from '../../types';
import { PromptPayModal } from '../PromptPayModal';
import { ArtworkPreviewModal } from '../ArtworkPreviewModal';

interface CartScreenProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onTabChange: (tab: ScreenTab) => void;
  showToast: (msg: string) => void;
  onOrderSuccess: (orderId: string, total: number) => void;
}

export function CartScreen({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onTabChange,
  showToast,
  onOrderSuccess,
}: CartScreenProps) {
  // Shipping form fields
  const [recipientName, setRecipientName] = useState('กฤษณะ วงศ์วารินทร์ (ฝ่ายประสานงาน)');
  const [phone, setPhone] = useState('089-456-7890');
  const [address, setAddress] = useState('อาคารซิลลิคเฮ้าส์ ชั้น 8 เลขที่ 1/4 ถนนสีลม แขวงสีลม เขตบางรัก กทม. 10500');
  const [requestTaxInvoice, setRequestTaxInvoice] = useState(true);

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'promptpay' | 'cod' | 'bank_transfer'>('promptpay');

  // Modals
  const [isPromptPayModalOpen, setIsPromptPayModalOpen] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<{ title: string; fileName: string; previewUrl?: string } | null>(null);

  // Calculation
  const totalPieces = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const rawSubtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  // Volume discount tier (Tier 2: 20+ pieces saves ฿1,200)
  const isTier2 = totalPieces >= 20;
  const volumeDiscount = isTier2 ? 1200 : totalPieces >= 10 ? 500 : 0;
  const shippingFee = 0; // Free for 5+ pcs
  const netTotal = Math.max(0, rawSubtotal - volumeDiscount + shippingFee);
  const vatAmount = (netTotal * 0.07);
  const averagePricePerShirt = totalPieces > 0 ? Math.round(netTotal / totalPieces) : 0;

  const handleCheckoutSubmit = () => {
    if (cartItems.length === 0) {
      showToast('ตะกร้าสินค้าว่างเปล่า กรุณาเลือกสินค้าก่อน');
      return;
    }

    if (paymentMethod === 'promptpay') {
      setIsPromptPayModalOpen(true);
    } else if (paymentMethod === 'cod') {
      showToast('ยืนยันคำสั่งซื้อแบบเก็บเงินปลายทางสำเร็จ');
      const orderId = `#SP-${Math.floor(1000 + Math.random() * 9000)}`;
      onOrderSuccess(orderId, netTotal);
    } else {
      showToast('สร้างใบสั่งซื้อเรียบร้อย กรุณาแนบสลิปในหน้าแชท');
      const orderId = `#SP-${Math.floor(1000 + Math.random() * 9000)}`;
      onOrderSuccess(orderId, netTotal);
    }
  };

  const handlePromptPaySuccess = () => {
    setIsPromptPayModalOpen(false);
    showToast('ชำระเงินผ่านพร้อมเพย์สำเร็จ! ระบบกำลังส่งไฟล์เข้าคิวพิมพ์');
    const orderId = `#SP-${Math.floor(1000 + Math.random() * 9000)}`;
    onOrderSuccess(orderId, netTotal);
  };

  return (
    <div className="flex flex-col w-full pb-32 animate-fadeIn">
      {/* Header & Cart Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1e40af] text-white">
            <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
          </span>
          <div>
            <h2 className="text-[18px] font-bold text-[#0b1c30]">
              ตะกร้าสั่งผลิต ({cartItems.length} แบบ)
            </h2>
            <p className="text-[12px] text-[#565e74]">
              รวม {totalPieces} ตัว • สั่งผลิตงานซับลิเมชันคุณภาพสูง
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eff4ff] text-[#003a46] border border-[#d3e4fe]">
          <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
          <span className="text-[11px] font-bold">เช็คพรีไฟล์ผ่านแล้ว</span>
        </div>
      </div>

      {/* Tier Unlock Notification */}
      {isTier2 ? (
        <div className="flex items-center gap-2 p-3 mb-5 rounded-2xl bg-[#eff4ff] text-[#003a46] border border-[#d3e4fe]">
          <span className="material-symbols-outlined text-[20px] text-[#00288e]" style={{ fontVariationSettings: "'FILL' 1" }}>
            celebration
          </span>
          <p className="text-[12px] flex-1 leading-snug">
            ปลดล็อกส่วนลดระดับ <strong>Tier 2 (20+ ตัว)</strong> ลดทันที ฿1,200 และรับบริการจัดส่งด่วนฟรี!
          </p>
        </div>
      ) : (
        <div className="flex items-center gap-2 p-3 mb-5 rounded-2xl bg-[#eff4ff] text-[#003a46] border border-[#d3e4fe]">
          <span className="material-symbols-outlined text-[20px] text-[#00288e]">info</span>
          <p className="text-[12px] flex-1">
            สั่งเพิ่มอีก {Math.max(1, 20 - totalPieces)} ตัวเพื่อรับส่วนลด Tier 2 ทันที ฿1,200
          </p>
        </div>
      )}

      {/* Cart Items List */}
      <div className="flex flex-col gap-4 mb-6">
        {cartItems.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl text-center border border-[#e5eeff] flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-[48px] text-[#565e74]">
              remove_shopping_cart
            </span>
            <span className="text-[15px] font-bold text-[#0b1c30]">
              ไม่มีสินค้าในตะกร้า
            </span>
            <button
              onClick={() => onTabChange('home-and-catalog')}
              className="px-4 py-2 bg-[#00288e] text-white rounded-xl text-[13px] font-bold shadow-xs active:scale-95"
              type="button"
            >
              เลือกแบบเสื้อสั่งพิมพ์
            </button>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col p-4 rounded-2xl bg-white shadow-xs border border-[#e5eeff]"
            >
              <div className="flex gap-3">
                <div className="relative w-20 h-24 rounded-xl bg-[#eff4ff] overflow-hidden shrink-0 border border-[#d3e4fe]">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedArtwork({
                        title: item.title,
                        fileName: item.artworkName || 'artwork-proof.ai',
                        previewUrl: item.imageUrl,
                      });
                    }}
                    className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[#213145]/80 text-white text-[10px] font-semibold flex items-center gap-0.5 backdrop-blur-xs"
                  >
                    <span className="material-symbols-outlined text-[12px]">visibility</span>
                    <span>ลาย</span>
                  </button>
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#eff4ff] text-[#00288e] uppercase">
                        {item.categoryTag}
                      </span>
                      <h3 className="text-[14px] font-bold text-[#0b1c30] truncate mt-0.5">
                        {item.title}
                      </h3>
                      <p className="text-[12px] text-[#565e74] truncate">
                        {item.specs}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label="ลบรายการ"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[#565e74] hover:text-[#ba1a1a] transition-colors p-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[12px] text-[#565e74]">{item.sizeBreakdown}</span>
                    <div className="text-right">
                      <span className="text-[15px] font-extrabold text-[#00288e]">
                        ฿{item.totalPrice.toLocaleString()}
                      </span>
                      <span className="block text-[11px] text-[#565e74]">
                        ฿{item.unitPrice} / ตัว
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card Utility Row */}
              <div className="mt-3 pt-3 flex items-center justify-between bg-[#eff4ff]/70 -mx-4 -mb-4 px-4 py-2.5 rounded-b-2xl border-t border-[#e5eeff]">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedArtwork({
                      title: item.title,
                      fileName: item.artworkName || 'Vector_Print_Layout.pdf',
                      previewUrl: item.imageUrl,
                    });
                  }}
                  className="flex items-center gap-1 text-[#00288e] text-[12px] font-bold hover:underline"
                >
                  <span className="material-symbols-outlined text-[16px]">art_track</span>
                  <span>ดูไฟล์ Artwork &amp; ตำแหน่งพิมพ์ (PDF)</span>
                </button>

                {/* Stepper */}
                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl shadow-xs border border-[#d3e4fe]">
                  <button
                    type="button"
                    aria-label="ลดจำนวน"
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="w-6 h-6 flex items-center justify-center rounded text-[#0b1c30] hover:bg-[#eff4ff] active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[14px]">remove</span>
                  </button>
                  <span className="text-[13px] font-bold px-1">{item.quantity}</span>
                  <button
                    type="button"
                    aria-label="เพิ่มจำนวน"
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="w-6 h-6 flex items-center justify-center rounded text-[#0b1c30] hover:bg-[#eff4ff] active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Shipping & Invoice Info Section */}
      <div className="flex flex-col p-4 mb-6 rounded-2xl bg-white shadow-xs border border-[#e5eeff]">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-[#00288e] text-[20px]">local_shipping</span>
          <h3 className="text-[16px] font-bold text-[#0b1c30]">ข้อมูลการจัดส่งและใบเสร็จ</h3>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-[11px] font-bold text-[#565e74] mb-1">
              ชื่อ-นามสกุล / ผู้ติดต่อ
            </label>
            <div className="flex items-center px-3 h-11 rounded-xl bg-[#eff4ff] border border-[#d3e4fe]">
              <span className="material-symbols-outlined text-[18px] text-[#565e74] mr-2">person</span>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="bg-transparent w-full outline-none text-[13px] text-[#0b1c30]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#565e74] mb-1">
              เบอร์โทรศัพท์มือถือ
            </label>
            <div className="flex items-center px-3 h-11 rounded-xl bg-[#eff4ff] border border-[#d3e4fe]">
              <span className="material-symbols-outlined text-[18px] text-[#565e74] mr-2">phone</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-transparent w-full outline-none text-[13px] text-[#0b1c30]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#565e74] mb-1">
              ที่อยู่จัดส่งสินค้า
            </label>
            <div className="flex items-start p-3 rounded-xl bg-[#eff4ff] border border-[#d3e4fe]">
              <span className="material-symbols-outlined text-[18px] text-[#565e74] mr-2 mt-0.5">
                location_on
              </span>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-transparent w-full outline-none text-[13px] text-[#0b1c30] resize-none"
              />
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={requestTaxInvoice}
                onChange={(e) => setRequestTaxInvoice(e.target.checked)}
                className="w-4 h-4 rounded text-[#00288e] focus:ring-0 accent-[#00288e]"
              />
              <span className="text-[13px] font-semibold text-[#0b1c30]">
                ออกใบกำกับภาษีเต็มรูปแบบ (e-Tax Invoice)
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Payment Method Selector */}
      <div className="flex flex-col p-4 mb-6 rounded-2xl bg-white shadow-xs border border-[#e5eeff]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00288e] text-[20px]">payments</span>
            <h3 className="text-[16px] font-bold text-[#0b1c30]">เลือกวิธีชำระเงิน</h3>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#eff4ff] text-[#00288e]">
            ปลอดภัย 100%
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* PromptPay */}
          <label
            onClick={() => setPaymentMethod('promptpay')}
            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
              paymentMethod === 'promptpay'
                ? 'bg-[#dce9ff] border-[#00288e] shadow-xs'
                : 'bg-[#eff4ff] border-[#d3e4fe] hover:bg-[#e5eeff]'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment_method"
                checked={paymentMethod === 'promptpay'}
                onChange={() => setPaymentMethod('promptpay')}
                className="w-4 h-4 accent-[#00288e]"
              />
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-[#0b1c30] flex items-center gap-1.5">
                  พร้อมเพย์ QR Code (PromptPay)
                  <span className="bg-[#3cccea]/30 text-[#003a46] px-1.5 py-0.5 rounded text-[10px] font-extrabold">
                    แนะนำ เร็วสุด
                  </span>
                </span>
                <span className="text-[12px] text-[#565e74]">
                  สแกนจ่ายได้ทุกแอปธนาคาร ยืนยันยอดอัตโนมัติ
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#00288e] text-[24px]">
              qr_code_scanner
            </span>
          </label>

          {/* COD */}
          <label
            onClick={() => setPaymentMethod('cod')}
            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
              paymentMethod === 'cod'
                ? 'bg-[#dce9ff] border-[#00288e] shadow-xs'
                : 'bg-[#eff4ff] border-[#d3e4fe] hover:bg-[#e5eeff]'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment_method"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="w-4 h-4 accent-[#00288e]"
              />
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-[#0b1c30]">
                  เก็บเงินปลายทาง (COD)
                </span>
                <span className="text-[12px] text-[#565e74]">
                  ชำระเงินสดหรือสแกนจ่ายเมื่อได้รับพัสดุ
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#565e74] text-[24px]">
              local_shipping
            </span>
          </label>

          {/* Bank Transfer */}
          <label
            onClick={() => setPaymentMethod('bank_transfer')}
            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
              paymentMethod === 'bank_transfer'
                ? 'bg-[#dce9ff] border-[#00288e] shadow-xs'
                : 'bg-[#eff4ff] border-[#d3e4fe] hover:bg-[#e5eeff]'
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="payment_method"
                checked={paymentMethod === 'bank_transfer'}
                onChange={() => setPaymentMethod('bank_transfer')}
                className="w-4 h-4 accent-[#00288e]"
              />
              <div className="flex flex-col">
                <span className="text-[14px] font-bold text-[#0b1c30]">
                  โอนผ่านธนาคาร &amp; แนบสลิป
                </span>
                <span className="text-[12px] text-[#565e74]">
                  บัญชี บจก. ซับลิ พริ้นท์ แล็บ (กสิกรไทย)
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#565e74] text-[24px]">
              account_balance
            </span>
          </label>
        </div>
      </div>

      {/* Summary Cost Breakdown */}
      <div className="flex flex-col p-4 mb-6 rounded-2xl bg-white shadow-xs border border-[#e5eeff]">
        <h3 className="text-[16px] font-bold text-[#0b1c30] mb-3">สรุปยอดชำระเงิน</h3>
        <div className="flex flex-col gap-2.5 text-[13px]">
          <div className="flex justify-between text-[#565e74]">
            <span>รวมค่าสินค้าสั่งผลิต ({totalPieces} ตัว)</span>
            <span className="text-[#0b1c30] font-semibold">฿{rawSubtotal.toLocaleString()}</span>
          </div>

          {volumeDiscount > 0 && (
            <div className="flex justify-between text-[#173bab]">
              <span className="flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[16px]">sell</span>
                ส่วนลดจำนวนผลิต (Volume Discount 20+ ตัว)
              </span>
              <span className="font-bold text-[#003a46]">-฿{volumeDiscount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between text-[#565e74]">
            <span>ค่าจัดส่งด่วน Express (Kerry / Flash)</span>
            <div className="flex items-center gap-1.5">
              <span className="line-through text-[12px]">฿150</span>
              <span className="text-[#003a46] font-bold">ฟรี</span>
            </div>
          </div>

          <div className="flex justify-between text-[#565e74]">
            <span>ภาษีมูลค่าเพิ่ม (VAT 7% รวมแล้ว)</span>
            <span className="text-[#0b1c30]">฿{vatAmount.toFixed(2)}</span>
          </div>

          <div className="my-2 h-[1px] bg-[#d3e4fe]"></div>

          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[16px] font-bold text-[#0b1c30]">ยอดรวมสุทธิ</span>
              <span className="block text-[11px] text-[#565e74]">
                เฉลี่ยเพียง ฿{averagePricePerShirt} / ตัว
              </span>
            </div>
            <div className="text-right">
              <span className="text-[24px] font-extrabold text-[#00288e]">
                ฿{netTotal.toLocaleString()}
              </span>
              {volumeDiscount > 0 && (
                <span className="block text-[11px] text-[#003a46] font-bold">
                  ประหยัดไปได้รวม ฿{(volumeDiscount + 150).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#eff4ff] border border-[#d3e4fe]">
          <span className="material-symbols-outlined text-[#00288e] text-[20px]">high_quality</span>
          <div>
            <span className="block text-[12px] font-bold text-[#0b1c30]">
              สีสด คมชัดระดับ UltraHD
            </span>
            <span className="block text-[11px] text-[#565e74]">
              หมึกแท้ซับลิเมชัน 100%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#eff4ff] border border-[#d3e4fe]">
          <span className="material-symbols-outlined text-[#00288e] text-[20px]">schedule</span>
          <div>
            <span className="block text-[12px] font-bold text-[#0b1c30]">
              ผลิตไว จัดส่งตรงเวลา
            </span>
            <span className="block text-[11px] text-[#565e74]">
              พร้อมส่งภายใน 5-7 วันทำการ
            </span>
          </div>
        </div>
      </div>

      {/* Confirmation Button */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleCheckoutSubmit}
          className="w-full h-14 rounded-2xl bg-[#00288e] text-white text-[16px] font-bold shadow-md hover:bg-[#1e40af] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">lock</span>
          <span>ยืนยันการสั่งซื้อและชำระเงิน (฿{netTotal.toLocaleString()})</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[#565e74] text-[12px]">
          <span className="material-symbols-outlined text-[15px]">security</span>
          <span>ระบบชำระเงินเข้ารหัสความปลอดภัย 256-bit SSL</span>
        </div>
      </div>

      {/* PromptPay Modal */}
      <PromptPayModal
        isOpen={isPromptPayModalOpen}
        onClose={() => setIsPromptPayModalOpen(false)}
        totalAmount={netTotal}
        onPaymentSuccess={handlePromptPaySuccess}
      />

      {/* Artwork Preview Modal */}
      {selectedArtwork && (
        <ArtworkPreviewModal
          isOpen={true}
          onClose={() => setSelectedArtwork(null)}
          title={selectedArtwork.title}
          fileName={selectedArtwork.fileName}
          previewUrl={selectedArtwork.previewUrl}
        />
      )}
    </div>
  );
}
