import { useState } from 'react';
import { PRODUCTS } from '../data/mockData';
import { ProductItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (productId: string) => void;
  onSearchSubmit: (query: string) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  onSelectProduct,
  onSearchSubmit,
}: SearchModalProps) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const quickKeywords = ['เสื้อวิ่ง', 'เสื้อโปโล', 'Micro Dry-Fit', 'กัน UV', 'Esports', 'ลายไทย'];

  const matched = PRODUCTS.filter(
    (p) =>
      !query.trim() ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      p.features.some((f) => f.toLowerCase().includes(query.toLowerCase()))
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearchSubmit(query.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#213145]/70 backdrop-blur-xs flex items-start justify-center pt-16 px-4 animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-4 flex flex-col gap-3 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
          <span className="text-[14px] font-bold text-[#0b1c30]">ค้นหาแบบเสื้อและลายพิมพ์</span>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#565e74]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-[#565e74] text-[20px]">
            search
          </span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อรุ่น, ชนิดผ้า, สไตล์..."
            className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#eff4ff] text-[13px] text-[#0b1c30] placeholder:text-[#565e74] focus:outline-none focus:ring-2 focus:ring-[#00288e]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 text-[#565e74] hover:text-[#0b1c30]"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
            </button>
          )}
        </form>

        {/* Quick keywords */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-[#565e74]">คำค้นยอดฮิต:</span>
          {quickKeywords.map((kw) => (
            <button
              key={kw}
              type="button"
              onClick={() => {
                setQuery(kw);
                onSearchSubmit(kw);
                onClose();
              }}
              className="text-[11px] px-2.5 py-1 rounded-full bg-[#eff4ff] text-[#00288e] hover:bg-[#dce9ff] font-semibold transition-colors"
            >
              {kw}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#e5eeff]">
          <span className="text-[11px] font-bold text-[#565e74]">
            ผลลัพธ์ ({matched.length} รายการ)
          </span>

          {matched.map((prod: ProductItem) => (
            <div
              key={prod.id}
              onClick={() => {
                onSelectProduct(prod.id);
                onClose();
              }}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#eff4ff] cursor-pointer transition-colors"
            >
              <img
                src={prod.imageUrl}
                alt={prod.name}
                className="w-12 h-12 object-contain bg-[#eff4ff] rounded-lg shrink-0"
              />
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[13px] font-bold text-[#0b1c30] truncate">
                  {prod.name}
                </span>
                <span className="text-[11px] text-[#565e74] truncate">
                  {prod.subtitle}
                </span>
              </div>
              <span className="text-[13px] font-extrabold text-[#00288e] shrink-0">
                ฿{prod.price}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
