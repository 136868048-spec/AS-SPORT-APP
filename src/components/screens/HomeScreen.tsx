import { useState } from 'react';
import { CATEGORIES, PRODUCTS } from '../../data/mockData';
import { ProductItem, ScreenTab } from '../../types';

interface HomeScreenProps {
  onTabChange: (tab: ScreenTab) => void;
  onSelectProductForCustomizer: (productId: string) => void;
  onAddToCart: (product: ProductItem) => void;
  cartCount: number;
  cartTotal: number;
  onOpenQuoteModal: () => void;
  searchQuery: string;
  onClearSearch: () => void;
}

export function HomeScreen({
  onTabChange,
  onSelectProductForCustomizer,
  onAddToCart,
  cartCount,
  cartTotal,
  onOpenQuoteModal,
  searchQuery,
  onClearSearch,
}: HomeScreenProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const filterChips = [
    { id: 'all', label: 'ทั้งหมด (All)' },
    { id: 'micro', label: 'ผ้าไมโครระบายเหงื่อ' },
    { id: 'uv', label: 'กัน UV 50+' },
    { id: 'sport', label: 'สปอร์ต/วิ่ง' },
    { id: 'corporate', label: 'องค์กร & กิจกรรม' },
  ];

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const filteredProducts = PRODUCTS.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.features.some((f) => f.toLowerCase().includes(q))
      );
    }
    if (activeFilter === 'sport') return p.category === 'sport-jersey';
    if (activeFilter === 'corporate') return p.category === 'corporate-polo';
    if (activeFilter === 'uv') return p.features.some((f) => f.includes('UV'));
    if (activeFilter === 'micro') return p.features.some((f) => f.includes('ไมโคร'));
    return true;
  });

  return (
    <div className="flex flex-col w-full gap-5 pb-36">
      {/* Search status bar if filtered */}
      {searchQuery && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] border border-[#d3e4fe] animate-fadeIn">
          <div className="flex items-center gap-2 text-[13px] text-[#00288e]">
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span>
              ผลการค้นหาสำหรับ: <strong>&ldquo;{searchQuery}&rdquo;</strong>
            </span>
          </div>
          <button
            onClick={onClearSearch}
            className="text-[12px] font-bold text-[#ba1a1a] hover:underline"
            type="button"
          >
            ล้างค้นหา
          </button>
        </div>
      )}

      {/* Promotional Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00288e] via-[#1e40af] to-[#003a46] text-white shadow-lg p-5 flex flex-col gap-3.5">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-[#acedff]/15 blur-2xl pointer-events-none"></div>
        <div className="absolute -left-10 -bottom-10 w-48 h-48 rounded-full bg-[#3cccea]/10 blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between gap-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#acedff] animate-ping"></span>
            <span className="text-[11px] font-bold text-[#acedff] tracking-wide uppercase">
              Dye-Sub Precision Lab
            </span>
          </div>
          <div className="inline-flex items-center gap-1 bg-white text-[#00288e] px-2.5 py-1 rounded-full shadow-sm">
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_offer
            </span>
            <span className="text-[11px] font-bold">SUBLI50</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 relative z-10">
          <h2 className="text-[24px] font-black text-white tracking-tight leading-tight">
            เสื้อพิมพ์ลายสั่งผลิต <br />
            <span className="text-[#acedff]">สีสดคมชัด ไม่ซีดจาง</span>
          </h2>
          <p className="text-[13px] text-[#e5eeff]/90 leading-relaxed">
            เทคโนโลยี Ultra-HD Sublimation เส้นใยแห้งไว สัมผัสเบาสบาย ระบายอากาศสูง สั่งผลิตไม่มีขั้นต่ำ ยิ่งสั่งเยอะยิ่งลด
          </p>
        </div>

        {/* Feature Icons Grid */}
        <div className="grid grid-cols-3 gap-2 pt-1 relative z-10">
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/10 backdrop-blur-sm text-center">
            <span className="material-symbols-outlined text-[20px] text-[#acedff]">
              all_inclusive
            </span>
            <span className="text-[11px] font-semibold mt-1">ไม่มีขั้นต่ำ</span>
            <span className="text-[10px] text-[#d3e4fe]/80">เริ่ม 1 ตัว</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/10 backdrop-blur-sm text-center">
            <span className="material-symbols-outlined text-[20px] text-[#acedff]">
              groups
            </span>
            <span className="text-[11px] font-semibold mt-1">ส่วนลดทีม</span>
            <span className="text-[10px] text-[#d3e4fe]/80">ลดสูงสุด 40%</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/10 backdrop-blur-sm text-center">
            <span className="material-symbols-outlined text-[20px] text-[#acedff]">
              water_drop
            </span>
            <span className="text-[11px] font-semibold mt-1">เนื้อผ้า Dry-Tech</span>
            <span className="text-[10px] text-[#d3e4fe]/80">ป้องกัน UV</span>
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[18px] font-bold text-[#0b1c30]">หมวดหมู่เสื้อยอดนิยม</h3>
            <p className="text-[12px] text-[#565e74]">ออกแบบได้ตามธีมการแข่งขันหรือองค์กร</p>
          </div>
          <button
            onClick={() => setActiveFilter('all')}
            className="text-[12px] font-semibold text-[#00288e] flex items-center hover:underline"
            type="button"
          >
            ดูทั้งหมด <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectProductForCustomizer('hyperspeed-dryfit')}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-xs hover:shadow-md transition-all p-3 flex flex-col gap-2 cursor-pointer border border-[#e5eeff]"
            >
              <div className="relative w-full h-24 rounded-xl overflow-hidden bg-[#eff4ff]">
                <img
                  src={cat.imageUrl}
                  alt={cat.title}
                  className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#213145]/60 via-transparent to-transparent"></div>
                <span className="absolute bottom-1.5 left-2 text-[11px] font-bold text-white">
                  {cat.title}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#0b1c30] truncate">
                  {cat.name}
                </span>
                <span className="w-6 h-6 rounded-full bg-[#dae2fd] text-[#00288e] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Filter & Style Selector Chips */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-bold text-[#0b1c30]">ตัวอย่างผลงานพิมพ์จริง</span>
          <span className="text-[12px] text-[#565e74]">
            แสดง {filteredProducts.length} รายการ
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {filterChips.map((chip) => {
            const isSelected = activeFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium shadow-xs shrink-0 active:scale-95 transition-all ${
                  isSelected
                    ? 'bg-[#00288e] text-white shadow-sm'
                    : 'bg-[#dce9ff] text-[#444653] hover:bg-[#d3e4fe]'
                }`}
                type="button"
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Product Showcase Grid */}
      <section className="flex flex-col gap-4">
        {filteredProducts.map((product) => {
          const isFav = favorites[product.id];
          return (
            <div
              key={product.id}
              className="rounded-2xl bg-white shadow-xs p-4 flex flex-col gap-3 transition-shadow hover:shadow-md border border-[#e5eeff]"
            >
              {/* Product Preview Image with Badges */}
              <div className="relative w-full h-56 rounded-xl overflow-hidden bg-[#eff4ff] flex items-center justify-center">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-contain p-2"
                />

                {/* Badges Overlay */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                  {product.tag && (
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] shadow-xs ${
                        product.tagColor || 'bg-[#1e40af] text-white'
                      }`}
                    >
                      {product.tag}
                    </span>
                  )}
                  {product.tierNotice && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#213145]/85 backdrop-blur-md text-white text-[11px]">
                      {product.tierNotice}
                    </span>
                  )}
                </div>

                {/* Heart Favorite Button */}
                <button
                  type="button"
                  onClick={(e) => toggleFavorite(product.id, e)}
                  aria-label="บันทึกในรายการโปรด"
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/85 backdrop-blur-md text-[#565e74] hover:text-[#ba1a1a] flex items-center justify-center transition-colors shadow-xs active:scale-90"
                >
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      isFav ? 'text-[#ba1a1a]' : ''
                    }`}
                    style={isFav ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    favorite
                  </span>
                </button>
              </div>

              {/* Product Specs & Title */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {product.features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#dce9ff] text-[#003a46]"
                    >
                      {feat}
                    </span>
                  ))}
                </div>

                <div className="pt-1">
                  <h4 className="text-[17px] font-bold text-[#0b1c30] leading-snug">
                    {product.name}
                  </h4>
                  <p className="text-[13px] text-[#565e74] mt-0.5 leading-tight">
                    {product.subtitle}
                  </p>
                </div>

                <div className="flex items-baseline gap-2 pt-1">
                  <span className="text-[22px] font-extrabold text-[#00288e]">
                    ฿{product.price}
                  </span>
                  <span className="text-[12px] text-[#565e74]">
                    / ตัว {product.originalPrice && `(ปกติ ฿${product.originalPrice})`}
                  </span>
                  {product.badge && (
                    <span className="ml-auto text-[11px] font-bold text-[#003a46] bg-[#acedff]/30 px-2 py-0.5 rounded-full">
                      {product.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onAddToCart(product)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#dce9ff] text-[#00288e] text-[13px] font-bold hover:bg-[#d3e4fe] active:scale-95 transition-transform"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    add_shopping_cart
                  </span>
                  <span>ใส่ตะกร้าด่วน</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectProductForCustomizer(product.id)}
                  className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#00288e] text-white text-[13px] font-bold shadow-xs hover:bg-[#1e40af] active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">brush</span>
                  <span>สั่งสกรีนลายนี้</span>
                </button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Fabric & Tech Spotlight Bar */}
      <section className="rounded-2xl bg-[#eff4ff] p-4 flex flex-col gap-3 border border-[#d3e4fe]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00288e] text-[24px]">verified</span>
          <h4 className="text-[16px] font-bold text-[#0b1c30]">
            มาตรฐานเส้นใย &amp; สีพิมพ์มาตรฐานสากล
          </h4>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white p-3 rounded-xl flex flex-col gap-1 shadow-xs">
            <span className="text-[13px] font-bold text-[#00288e]">Ultra-HD Ink</span>
            <p className="text-[11px] text-[#565e74] leading-relaxed">
              หมึกแท้นำเข้าจากญี่ปุ่น ปลอดภัยต่อผิวหนังเด็กและไร้สารก่อมะเร็ง
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl flex flex-col gap-1 shadow-xs">
            <span className="text-[13px] font-bold text-[#003a46]">Fast-Dry Woven</span>
            <p className="text-[11px] text-[#565e74] leading-relaxed">
              โครงสร้างรังผึ้งถ่ายเทความร้อน ระบายเหงื่อใน 0.3 วินาที
            </p>
          </div>
        </div>
      </section>

      {/* Team Bulk Quotation Prompt Banner */}
      <section className="rounded-2xl bg-gradient-to-r from-[#e5eeff] to-[#d3e4fe] p-4 flex items-center justify-between gap-3 shadow-xs border border-[#b8c4ff]">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[11px] font-bold text-[#00288e] uppercase tracking-wider">
            ใบเสนอราคาออนไลน์ทันใจ
          </span>
          <h5 className="text-[16px] font-bold text-[#0b1c30] truncate">
            สั่งพิมพ์จำนวน 50 ตัวขึ้นไป?
          </h5>
          <p className="text-[12px] text-[#565e74] truncate">
            ประเมินราคาโปรโมชั่นทีม รับตัวอย่างผ้าฟรี
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenQuoteModal}
          className="px-3.5 py-2.5 rounded-xl bg-[#00288e] text-white text-[13px] font-bold whitespace-nowrap active:scale-95 transition-all shadow-sm shrink-0"
        >
          ขอใบเสนอราคา
        </button>
      </section>

      {/* Sticky Bottom Cart & Checkout Bar (Floating above Nav) */}
      <div className="fixed bottom-16 left-0 right-0 z-40 px-4 py-2.5 pointer-events-none transition-all duration-300">
        <div className="max-w-md mx-auto pointer-events-auto rounded-2xl bg-[#213145]/95 backdrop-blur-xl text-white p-3 shadow-xl flex items-center justify-between gap-3 border border-white/10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-[#acedff] shrink-0">
              <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#acedff] text-[#003a46] text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[11px] text-[#d3e4fe]/80">ยอดรวม</span>
                <span className="text-[18px] font-extrabold text-white">
                  ฿{cartTotal.toLocaleString()}
                </span>
              </div>
              <span className="text-[10px] text-[#4cd7f6] truncate">
                {cartCount >= 5 ? '✓ ฟรีค่าจัดส่งด่วนแล้ว' : 'ฟรีค่าจัดส่งเมื่อสั่ง 5 ชิ้นขึ้นไป'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onTabChange('cart-and-quote')}
              className="h-10 px-3 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[12px] font-bold active:scale-95 transition-all"
            >
              ดูตะกร้า
            </button>
            <button
              type="button"
              onClick={() => onTabChange('cart-and-quote')}
              className="h-10 px-3.5 rounded-xl bg-[#3cccea] hover:bg-[#acedff] text-[#003a46] text-[13px] font-extrabold shadow-md active:scale-95 transition-all flex items-center gap-1"
            >
              <span>ชำระเงิน</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
