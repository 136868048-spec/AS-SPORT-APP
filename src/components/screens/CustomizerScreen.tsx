import { useState, useRef } from 'react';
import { ProductItem, CartItem, ScreenTab } from '../../types';
import { SizeChartModal } from '../SizeChartModal';

interface CustomizerScreenProps {
  product: ProductItem;
  onAddToCartCustom: (item: CartItem) => void;
  onBuyNowCustom: (item: CartItem) => void;
  onTabChange: (tab: ScreenTab) => void;
  showToast: (msg: string) => void;
}

export function CustomizerScreen({
  product,
  onAddToCartCustom,
  onBuyNowCustom,
  onTabChange,
  showToast,
}: CustomizerScreenProps) {
  // Gallery state
  const [activeThumb, setActiveThumb] = useState<'front' | 'back' | 'fabric' | 'seam'>('front');
  const [isFavorite, setIsFavorite] = useState(false);

  // Configuration state
  const [collarStyle, setCollarStyle] = useState('คอกลมมาตรฐาน');
  const [collarExtraCost, setCollarExtraCost] = useState(0);
  const [selectedSize, setSelectedSize] = useState('L');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [customDesignNote, setCustomDesignNote] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Modals & Accordions
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isFaq1Open, setIsFaq1Open] = useState(true);
  const [isFaq2Open, setIsFaq2Open] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const BASE_PRICE = 350;
  const BULK_PRICE = 290;
  const BULK_THRESHOLD = 20;

  const isBulk = quantity >= BULK_THRESHOLD;
  const currentUnitPrice = (isBulk ? BULK_PRICE : BASE_PRICE) + collarExtraCost;
  const subtotal = currentUnitPrice * quantity;

  const sizeDetailsMap: Record<string, string> = {
    S: 'รอบอก 36 นิ้ว ยาว 26 นิ้ว',
    M: 'รอบอก 38 นิ้ว ยาว 27 นิ้ว',
    L: 'รอบอก 40 นิ้ว ยาว 28 นิ้ว',
    XL: 'รอบอก 42 นิ้ว ยาว 29 นิ้ว',
    '2XL': 'รอบอก 44 นิ้ว ยาว 30 นิ้ว',
    '3XL': 'รอบอก 46 นิ้ว ยาว 31 นิ้ว',
  };

  const galleryImages = {
    front: product.detailImages?.front || product.imageUrl,
    back: product.detailImages?.back || product.imageUrl,
    fabric: product.detailImages?.fabric || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw2FQRvxj_t_sJ1uoK7nSyJxCtKcZCYaMLREF5H4IDHMB5REVm46nIL2ZICdQrJRF11tmMHum3vRPXh9KtNUfSrlZlfdbLC1j23VQURfZxoxv00WP49NihCTRIt7Zw5v19f7oJDsp36Rg2A6K6Knl0jIeDKOkFG-UHDnr6VWT6fi7TdrAf-qLvWBrMto3r_6gPYK-F4Y3HbAWy0HcPmsMatB_PDe7pFr_3EqhcAAHcD_-W2m-VTbjC',
    seam: product.detailImages?.seam || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO1EyIldefQV9ymlQlSwcOgWpxLFsPgES1nGQrHyh0oEGox5Bm4JFzArV88Fw5lQneFEqYvtuAsQzbJaJbTzB738oOXGy5fB-35KIKl55fmrhU4MgFkJG8j2kaUaAVOsR0nTXUMrQolAUVsnYETpCE-gWEhHcRU8xfpZdasXSuC4Gpjg0KS1vDVnqK4gZZIUZ_RMK_beECs8J07v-YAj57OTWT-LDCuXf2f24oSPDG87RD3MW4wqXG',
  };

  const handleCollarSelect = (name: string, extraCost: number) => {
    setCollarStyle(name);
    setCollarExtraCost(extraCost);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      showToast(`อัปโหลดไฟล์ "${file.name}" เรียบร้อย`);
    }
  };

  const buildCartItem = (): CartItem => {
    return {
      id: `custom-${Date.now()}`,
      productId: product.id,
      title: product.name,
      categoryTag: 'Full Sublimation Pro',
      specs: `ผ้า Micro Smooth 160g • ${collarStyle.split(' ')[0]}`,
      sizeBreakdown: `ไซส์ ${selectedSize} (${quantity} ตัว)`,
      quantity,
      unitPrice: currentUnitPrice,
      totalPrice: subtotal,
      imageUrl: galleryImages.front,
      artworkName: uploadedFile ? uploadedFile.name : undefined,
      collarStyle,
      customNote: customDesignNote.trim() || undefined,
    };
  };

  const handleAddToCart = () => {
    const item = buildCartItem();
    onAddToCartCustom(item);
    showToast(`เพิ่ม ${quantity} ตัว (${selectedSize}, ${collarStyle.split(' ')[0]}) ลงในตะกร้าแล้ว`);
  };

  const handleBuyNow = () => {
    const item = buildCartItem();
    onBuyNowCustom(item);
    showToast('กำลังนำเข้าสู่ระบบตรวจสอบ Mockup & สั่งซื้อด่วน...');
  };

  return (
    <div className="flex flex-col w-full pb-36 animate-fadeIn">
      {/* Top Visual Gallery */}
      <section className="relative w-full rounded-2xl overflow-hidden bg-[#eff4ff] shadow-xs border border-[#d3e4fe]">
        <div className="relative w-full aspect-[4/3] bg-[#eff4ff] flex items-center justify-center p-2">
          <img
            src={galleryImages[activeThumb]}
            alt="Garment Preview"
            className="w-full h-full object-contain transition-all duration-300"
          />

          {/* Badges Overlay */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span className="px-2.5 py-1 rounded-full bg-[#00288e] text-white text-[11px] font-bold shadow-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#acedff] animate-pulse"></span>
              Full Sublimation
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-[#00288e] text-[11px] font-bold shadow-xs">
              ลด 22%
            </span>
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <button
              type="button"
              onClick={() => {
                setIsFavorite(!isFavorite);
                showToast(isFavorite ? 'นำออกจากรายการโปรด' : 'บันทึกในรายการโปรดแล้ว');
              }}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur text-[#565e74] hover:text-[#ba1a1a] shadow-xs flex items-center justify-center active:scale-90 transition-transform"
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isFavorite ? 'text-[#ba1a1a]' : ''
                }`}
                style={isFavorite ? { fontVariationSettings: "'FILL' 1" } : {}}
              >
                favorite
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: product.name, url: window.location.href });
                } else {
                  showToast('คัดลอกลิงก์แบบเสื้อเรียบร้อย');
                }
              }}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur text-[#565e74] shadow-xs flex items-center justify-center active:scale-90 transition-transform"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
          </div>

          {/* Watermark Tech Guarantee Pill */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-black/5">
            <span className="material-symbols-outlined text-[16px] text-[#003a46]">verified</span>
            <span className="text-[11px] font-bold text-[#0b1c30]">
              UltraHD 1440dpi Digital Print
            </span>
          </div>
        </div>

        {/* Thumbnails Switcher */}
        <div className="p-3 bg-white flex items-center justify-center gap-2.5 border-t border-[#e5eeff]">
          {/* Front */}
          <button
            type="button"
            onClick={() => setActiveThumb('front')}
            className={`relative w-14 h-14 rounded-xl overflow-hidden bg-[#eff4ff] p-0.5 transition-all shadow-xs ${
              activeThumb === 'front'
                ? 'ring-2 ring-[#00288e] scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={galleryImages.front}
              alt="ด้านหน้า"
              className="w-full h-full object-cover rounded-lg"
              style={{ objectPosition: '25% center' }}
            />
            <span className="absolute bottom-0 inset-x-0 bg-[#00288e]/90 text-white text-[9px] text-center py-0.5 font-bold leading-none">
              หน้า
            </span>
          </button>

          {/* Back */}
          <button
            type="button"
            onClick={() => setActiveThumb('back')}
            className={`relative w-14 h-14 rounded-xl overflow-hidden bg-[#eff4ff] p-0.5 transition-all shadow-xs ${
              activeThumb === 'back'
                ? 'ring-2 ring-[#00288e] scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={galleryImages.back}
              alt="ด้านหลัง"
              className="w-full h-full object-cover rounded-lg"
              style={{ objectPosition: '75% center' }}
            />
            <span className="absolute bottom-0 inset-x-0 bg-[#213145]/90 text-white text-[9px] text-center py-0.5 font-bold leading-none">
              หลัง
            </span>
          </button>

          {/* Fabric */}
          <button
            type="button"
            onClick={() => setActiveThumb('fabric')}
            className={`relative w-14 h-14 rounded-xl overflow-hidden bg-[#eff4ff] p-0.5 transition-all shadow-xs ${
              activeThumb === 'fabric'
                ? 'ring-2 ring-[#00288e] scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={galleryImages.fabric}
              alt="เนื้อผ้า Micro-Smooth"
              className="w-full h-full object-cover rounded-lg"
            />
            <span className="absolute bottom-0 inset-x-0 bg-[#213145]/90 text-white text-[9px] text-center py-0.5 font-bold leading-none">
              เนื้อผ้า
            </span>
          </button>

          {/* Seam */}
          <button
            type="button"
            onClick={() => setActiveThumb('seam')}
            className={`relative w-14 h-14 rounded-xl overflow-hidden bg-[#eff4ff] p-0.5 transition-all shadow-xs ${
              activeThumb === 'seam'
                ? 'ring-2 ring-[#00288e] scale-105'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={galleryImages.seam}
              alt="ตะเข็บ Flatlock"
              className="w-full h-full object-cover rounded-lg"
            />
            <span className="absolute bottom-0 inset-x-0 bg-[#213145]/90 text-white text-[9px] text-center py-0.5 font-bold leading-none">
              ตะเข็บ
            </span>
          </button>
        </div>
      </section>

      {/* Title, Pricing & Value Pitch */}
      <section className="mt-4 p-4 rounded-2xl bg-white shadow-xs flex flex-col gap-3 border border-[#e5eeff]">
        <div className="flex items-center justify-between text-[#565e74]">
          <span className="text-[11px] tracking-wider uppercase text-[#003a46] font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">inventory_2</span>
            SKU: SP-2024-DRY
          </span>
          <span className="text-[11px] font-semibold text-[#00288e] bg-[#eff4ff] px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">bolt</span> สั่งผลิตด่วน 3-5 วัน
          </span>
        </div>

        <div>
          <h2 className="text-[18px] font-bold text-[#0b1c30] leading-snug">
            {product.name}
          </h2>
          <p className="text-[13px] text-[#444653] mt-1 leading-relaxed">
            นวัตกรรมพิมพ์ลายดิจิทัลไร้รอยต่อ ซึมเข้าเส้นใยผ้า 100% ระบายความร้อนดีเยี่ยม เหมาะสำหรับทีมกีฬา องค์กร และอีสปอร์ต
          </p>
        </div>

        {/* Pricing Row & Tier Highlight */}
        <div className="p-3 rounded-xl bg-[#eff4ff] flex flex-col gap-2.5 border border-[#d3e4fe]">
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-[24px] font-extrabold text-[#00288e]">
                ฿{currentUnitPrice}
              </span>
              <span className="text-[14px] text-[#757684] line-through">฿450</span>
              <span className="text-[11px] font-bold text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5 rounded">
                -฿100
              </span>
            </div>
            <span className="text-[12px] text-[#565e74]">ขั้นต่ำ 1 ตัว</span>
          </div>

          {/* Bulk Promo Banner */}
          <div className="p-2.5 rounded-lg bg-[#dce9ff] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#00288e] flex items-center justify-center text-white shrink-0">
                <span className="material-symbols-outlined text-[16px]">groups</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-[#0b1c30]">สั่งเป็นทีม 20 ตัวขึ้นไป</span>
                <span className="text-[12px] text-[#003a46] font-semibold">
                  ลดเหลือเพียง ฿290 / ตัว
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#00288e] bg-white px-2 py-1 rounded-md shadow-xs">
              ประหยัด ฿1,200+
            </span>
          </div>
        </div>
      </section>

      {/* Fabric Technology Callouts */}
      <section className="mt-3 p-4 rounded-2xl bg-white shadow-xs flex flex-col gap-3 border border-[#e5eeff]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00288e] text-[20px]">science</span>
          <h3 className="text-[14px] font-bold text-[#0b1c30]">เทคโนโลยีเนื้อผ้า &amp; สเปกการผลิต</h3>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-2.5 rounded-xl bg-[#eff4ff] flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#00288e]">
              <span className="material-symbols-outlined text-[18px]">air</span>
              <span className="text-[12px] font-bold">Micro Smooth 160g</span>
            </div>
            <p className="text-[11px] text-[#444653] leading-tight">
              ระบายเหงื่อไวขึ้น 3 เท่า เส้นด้ายละเอียด นุ่มลื่นไม่บาดผิว
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#eff4ff] flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#003a46]">
              <span className="material-symbols-outlined text-[18px]">colors</span>
              <span className="text-[12px] font-bold">หมึก Ultra-Subli</span>
            </div>
            <p className="text-[11px] text-[#444653] leading-tight">
              สีสดทนทานระดับพรีเมียม ซักเครื่อง 100+ ครั้งไม่แตกลอก
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#eff4ff] flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#0b1c30]">
              <span className="material-symbols-outlined text-[18px]">shield</span>
              <span className="text-[12px] font-bold">Anti-UV UPF 40+</span>
            </div>
            <p className="text-[11px] text-[#444653] leading-tight">
              ปกป้องแสงแดด เหมาะสำหรับกิจกรรมกลางแจ้งและการแข่งขัน
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-[#eff4ff] flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-[#00288e]">
              <span className="material-symbols-outlined text-[18px]">auto_fix_high</span>
              <span className="text-[12px] font-bold">ฟรี! เช็กไฟล์ก่อนผลิต</span>
            </div>
            <p className="text-[11px] text-[#444653] leading-tight">
              ทีมกราฟิกตรวจขนาด Color Proof และความคมชัด 100%
            </p>
          </div>
        </div>

        {/* Dual macro photo comparison */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <div className="rounded-xl overflow-hidden bg-[#eff4ff] flex flex-col shadow-xs border border-[#d3e4fe]">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src={galleryImages.fabric}
                alt="สัมผัสเนื้อผ้า Micro Smooth"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#213145]/80 backdrop-blur-md text-white text-[9px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-[#acedff]">zoom_in</span>
                ซูมเนื้อผ้าจริง
              </span>
            </div>
            <div className="p-2 flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-[#0b1c30]">สัมผัสเนื้อผ้า Micro Smooth</span>
              <span className="text-[10px] text-[#565e74] leading-tight">
                ทอละเอียดพิเศษ ระบายอากาศรวดเร็ว นุ่มสบาย
              </span>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden bg-[#eff4ff] flex flex-col shadow-xs border border-[#d3e4fe]">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img
                src={galleryImages.seam}
                alt="ตะเข็บเย็บคู่ Flatlock"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-[#213145]/80 backdrop-blur-md text-white text-[9px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-[#acedff]">verified</span>
                ฝีเข็มระดับพรีเมียม
              </span>
            </div>
            <div className="p-2 flex flex-col gap-0.5">
              <span className="text-[11px] font-bold text-[#0b1c30]">ตะเข็บเย็บคู่ Flatlock</span>
              <span className="text-[10px] text-[#565e74] leading-tight">
                ทนทาน แน่นหนา ยืดหยุ่น ไม่ระคายเคืองผิว
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Customization Panel */}
      <section className="mt-3 p-4 rounded-2xl bg-white shadow-xs flex flex-col gap-4 border border-[#e5eeff]">
        {/* Step 1: Collar Style */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-[#0b1c30] font-bold flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#dce9ff] text-[#00288e] flex items-center justify-center text-[11px] font-bold">
                1
              </span>
              เลือกประเภทคอเสื้อ (Collar Style)
            </label>
            <span className="text-[11px] font-bold text-[#00288e]">{collarStyle}</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Round collar */}
            <button
              type="button"
              onClick={() => handleCollarSelect('คอกลมมาตรฐาน', 0)}
              className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition-all ${
                collarStyle === 'คอกลมมาตรฐาน'
                  ? 'bg-[#dce9ff] ring-2 ring-[#00288e] shadow-xs'
                  : 'bg-[#eff4ff] hover:bg-[#e5eeff]'
              }`}
            >
              <span className={`material-symbols-outlined text-[24px] ${collarStyle === 'คอกลมมาตรฐาน' ? 'text-[#00288e]' : 'text-[#565e74]'}`}>
                circle
              </span>
              <span className="text-[12px] font-bold text-[#0b1c30]">คอกลม</span>
              <span className="text-[10px] text-[#565e74]">คลาสสิก ยอดนิยม</span>
            </button>

            {/* V-neck */}
            <button
              type="button"
              onClick={() => handleCollarSelect('คอวีสปอร์ต', 0)}
              className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition-all ${
                collarStyle === 'คอวีสปอร์ต'
                  ? 'bg-[#dce9ff] ring-2 ring-[#00288e] shadow-xs'
                  : 'bg-[#eff4ff] hover:bg-[#e5eeff]'
              }`}
            >
              <span className={`material-symbols-outlined text-[24px] ${collarStyle === 'คอวีสปอร์ต' ? 'text-[#00288e]' : 'text-[#565e74]'}`}>
                change_history
              </span>
              <span className="text-[12px] font-bold text-[#0b1c30]">คอวีสปอร์ต</span>
              <span className="text-[10px] text-[#565e74]">คล่องตัว ดูเพรียว</span>
            </button>

            {/* Polo collar */}
            <button
              type="button"
              onClick={() => handleCollarSelect('คอปกโปโล (+฿25)', 25)}
              className={`p-2.5 rounded-xl flex flex-col items-center gap-1 transition-all ${
                collarStyle.includes('คอปก')
                  ? 'bg-[#dce9ff] ring-2 ring-[#00288e] shadow-xs'
                  : 'bg-[#eff4ff] hover:bg-[#e5eeff]'
              }`}
            >
              <span className={`material-symbols-outlined text-[24px] ${collarStyle.includes('คอปก') ? 'text-[#00288e]' : 'text-[#565e74]'}`}>
                checkroom
              </span>
              <span className="text-[12px] font-bold text-[#0b1c30]">คอปกโปโล</span>
              <span className="text-[10px] font-bold text-[#003a46]">+฿25 / ตัว</span>
            </button>
          </div>
        </div>

        {/* Step 2: Size Matrix */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#e5eeff]">
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-[#0b1c30] font-bold flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#dce9ff] text-[#00288e] flex items-center justify-center text-[11px] font-bold">
                2
              </span>
              เลือกไซส์ (Size)
            </label>
            <button
              type="button"
              onClick={() => setIsSizeChartOpen(true)}
              className="text-[12px] font-bold text-[#00288e] flex items-center gap-1 hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">straighten</span>
              ตารางขนาด Size Chart
            </button>
          </div>

          <div className="grid grid-cols-6 gap-1.5">
            {['S', 'M', 'L', 'XL', '2XL', '3XL'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSize(s)}
                className={`py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                  selectedSize === s
                    ? 'bg-[#00288e] text-white shadow-sm'
                    : 'bg-[#eff4ff] text-[#0b1c30] hover:bg-[#e5eeff]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <p className="text-[12px] text-[#444653] flex items-center gap-1.5 pt-1">
            <span className="material-symbols-outlined text-[16px] text-[#003a46]">
              check_circle
            </span>
            ไซส์ที่เลือก: <strong className="text-[#0b1c30]">{selectedSize} ({sizeDetailsMap[selectedSize]})</strong>
          </p>
        </div>

        {/* Step 3: Artwork & Design Upload */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-[#e5eeff]">
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-[#0b1c30] font-bold flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#dce9ff] text-[#00288e] flex items-center justify-center text-[11px] font-bold">
                3
              </span>
              อัปโหลดไฟล์ลายพิมพ์ / ข้อความสั่งทำ
            </label>
            <span className="text-[11px] font-bold text-[#003a46] bg-[#eff4ff] px-2 py-0.5 rounded-full">
              AI / PDF / PNG
            </span>
          </div>

          {/* Upload Dropzone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-xl bg-[#eff4ff] border-2 border-dashed border-[#b8c4ff] hover:border-[#00288e] flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-colors active:bg-[#e5eeff]"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".ai,.pdf,.png,.jpg,.psd,.svg"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="w-12 h-12 rounded-full bg-[#dce9ff] flex items-center justify-center text-[#00288e] shadow-xs">
              <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-[#0b1c30]">
                แตะเพื่ออัปโหลดไฟล์ออกแบบของคุณ
              </span>
              <span className="text-[11px] text-[#565e74]">
                รองรับไฟล์ AI, PDF, PNG สูงสุด 50MB
              </span>
            </div>

            {uploadedFile && (
              <div
                className="w-full p-2 rounded-lg bg-white text-[#00288e] text-[12px] flex items-center justify-between shadow-xs mt-1"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="material-symbols-outlined text-[16px]">task</span>
                  <span className="truncate font-semibold">{uploadedFile.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadedFile(null)}
                  className="text-[#ba1a1a] hover:bg-[#ffdad6] rounded p-1"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            )}
          </div>

          {/* Free Designer Service Note */}
          <div className="p-3 rounded-xl bg-[#eff4ff] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-[#0b1c30] flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px] text-[#003a46]">
                  design_services
                </span>
                ไม่มีไฟล์ลายพิมพ์? ให้ช่างออกแบบให้ฟรี
              </span>
              <span className="text-[11px] font-bold text-[#00288e]">ฟรีบริการ</span>
            </div>
            <input
              type="text"
              value={customDesignNote}
              onChange={(e) => setCustomDesignNote(e.target.value)}
              placeholder="ระบุโทนสี ชื่อทีม หรือสไตล์ที่ต้องการ (เช่น สีกรมท่าตัดขาว สไตล์ Esports)"
              className="w-full h-10 px-3 rounded-lg bg-white text-[13px] text-[#0b1c30] placeholder:text-[#757684] focus:outline-none focus:ring-2 focus:ring-[#00288e] transition-colors border border-[#d3e4fe]"
            />
          </div>
        </div>

        {/* Step 4: Quantity & Live Calculator */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-[#e5eeff]">
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-[#0b1c30] font-bold flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#dce9ff] text-[#00288e] flex items-center justify-center text-[11px] font-bold">
                4
              </span>
              จำนวนที่สั่งผลิต (Quantity)
            </label>
            <span
              className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                isBulk
                  ? 'bg-[#b8c4ff] text-[#001453]'
                  : 'bg-[#e5eeff] text-[#565e74]'
              }`}
            >
              {isBulk
                ? `ประหยัดราคาส่งทีม ฿${((BASE_PRICE - BULK_PRICE) * quantity).toLocaleString()}`
                : `สั่งอีก ${BULK_THRESHOLD - quantity} ตัวเพื่อราคา ฿${BULK_PRICE}`}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] border border-[#d3e4fe]">
            <div className="flex flex-col">
              <span className="text-[11px] text-[#565e74]">ยอดรวมคำนวณทันที</span>
              <span className="text-[20px] font-extrabold text-[#0b1c30]">
                ฿{subtotal.toLocaleString()}
              </span>
            </div>

            {/* Stepper Controller */}
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-xs border border-[#d3e4fe]">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-9 h-9 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#0b1c30] active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <input
                type="number"
                min="1"
                max="999"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 text-center text-[18px] text-[#00288e] font-bold bg-transparent focus:outline-none"
              />
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-9 h-9 rounded-lg bg-[#eff4ff] flex items-center justify-center text-[#0b1c30] active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live FAQ & Guarantee Accordion */}
      <section className="mt-3 p-4 rounded-2xl bg-white shadow-xs flex flex-col gap-2 border border-[#e5eeff]">
        {/* Accordion 1 */}
        <div
          onClick={() => setIsFaq1Open(!isFaq1Open)}
          className="flex items-center justify-between py-1 cursor-pointer select-none"
        >
          <span className="text-[13px] font-bold text-[#0b1c30] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00288e] text-[18px]">verified_user</span>
            ขั้นตอนการส่งตรวจแบบ Mockup 3D ก่อนสกรีนจริง
          </span>
          <span
            className={`material-symbols-outlined text-[#565e74] text-[20px] transition-transform ${
              isFaq1Open ? 'rotate-180' : ''
            }`}
          >
            expand_more
          </span>
        </div>
        {isFaq1Open && (
          <div className="text-[#444653] text-[12px] pl-6 pr-2 pb-2 leading-relaxed animate-fadeIn">
            เมื่อชำระเงินหรือสั่งซื้อเรียบร้อย ทีมช่างพิมพ์จะส่งไฟล์จำลอง 3D Mockup เสมือนจริงผ่านไลน์หรือแชทให้คุณตรวจสอบตำแหน่งและชื่อเบอร์จนพอใจ ก่อนเริ่มกระบวนการพิมพ์ซับลิเมชันทุกครั้ง มั่นใจไม่ผิดพลาด 100%
          </div>
        )}

        {/* Accordion 2 */}
        <div
          onClick={() => setIsFaq2Open(!isFaq2Open)}
          className="flex items-center justify-between py-1 cursor-pointer select-none border-t border-[#e5eeff] pt-2"
        >
          <span className="text-[13px] font-bold text-[#0b1c30] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00288e] text-[18px]">local_shipping</span>
            ระยะเวลาจัดส่งและคิวการผลิต
          </span>
          <span
            className={`material-symbols-outlined text-[#565e74] text-[20px] transition-transform ${
              isFaq2Open ? 'rotate-180' : ''
            }`}
          >
            expand_more
          </span>
        </div>
        {isFaq2Open && (
          <div className="text-[#444653] text-[12px] pl-6 pr-2 pb-2 leading-relaxed animate-fadeIn">
            ออเดอร์ทั่วไปใช้เวลา 3-5 วันทำการ ออเดอร์ทีมงานขนาดใหญ่ (50-200+ ตัว) ใช้เวลา 7 วัน จัดส่งผ่านขนส่งด่วนพร้อม Tracking Number ทันทีหลัง QC ตรวจสอบชิ้นงาน
          </div>
        )}
      </section>

      {/* Sticky Bottom Bar for Purchase */}
      <div className="fixed bottom-16 inset-x-0 z-40 bg-white/95 backdrop-blur-xl shadow-xl px-4 py-3 border-t border-[#e5eeff]">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          {/* Quick Chat Link & Price Summary */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => onTabChange('live-support-chat')}
              className="w-11 h-11 shrink-0 rounded-xl bg-[#eff4ff] flex flex-col items-center justify-center text-[#0b1c30] hover:bg-[#dce9ff] transition-colors"
              title="ปรึกษาช่างพิมพ์ฟรี"
            >
              <span className="material-symbols-outlined text-[20px] text-[#003a46]">chat</span>
              <span className="text-[9px] text-[#565e74] font-bold leading-none">คุยช่าง</span>
            </button>

            <div className="flex flex-col min-w-0">
              <span className="text-[11px] text-[#565e74] truncate">
                รวม <strong>{quantity}</strong> ตัว ({selectedSize}, {collarStyle.split(' ')[0]})
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-[20px] font-extrabold text-[#00288e]">
                  ฿{subtotal.toLocaleString()}
                </span>
                {isBulk && (
                  <span className="text-[10px] text-[#003a46] font-bold bg-[#acedff]/40 px-1.5 py-0.2 rounded">
                    (ราคาส่ง)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons Pair */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleAddToCart}
              className="h-11 px-3.5 rounded-xl bg-[#dce9ff] text-[#00288e] text-[13px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all hover:bg-[#d3e4fe]"
            >
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              <span>ใส่ตะกร้า</span>
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              className="h-11 px-4 rounded-xl bg-[#00288e] text-white text-[13px] font-bold flex items-center justify-center gap-1 shadow-md shadow-[#00288e]/20 active:scale-95 transition-all hover:bg-[#1e40af]"
            >
              <span>สั่งทันที</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Size Chart Modal Dialog */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        onSelectSize={(size) => setSelectedSize(size)}
      />
    </div>
  );
}
