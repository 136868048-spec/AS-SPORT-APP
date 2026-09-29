interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize?: (size: string) => void;
}

export function SizeChartModal({ isOpen, onClose, onSelectSize }: SizeChartModalProps) {
  if (!isOpen) return null;

  const sizeRows = [
    { size: 'S', chest: '36"', length: '26"', weight: '45-55 กก.' },
    { size: 'M', chest: '38"', length: '27"', weight: '55-65 กก.' },
    { size: 'L', chest: '40"', length: '28"', weight: '65-75 กก.' },
    { size: 'XL', chest: '42"', length: '29"', weight: '75-85 กก.' },
    { size: '2XL', chest: '44"', length: '30"', weight: '85-95 กก.' },
    { size: '3XL', chest: '46"', length: '31"', weight: '95+ กก.' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#213145]/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-1 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00288e] text-[24px]">straighten</span>
            <h4 className="text-[18px] text-[#0b1c30] font-bold">ตารางขนาดเสื้อ (Size Chart)</h4>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#444653] hover:text-[#0b1c30] active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-[13px] text-[#444653] leading-relaxed">
          หน่วยวัดเป็นนิ้ว (Inches) ผ้า Micro Smooth ยืดหยุ่น 4 ทิศทาง แนะนำวัดรอบอกเสื้อตัวโปรดของคุณ เพื่อไซส์ที่พอดีที่สุด
        </p>

        <div className="overflow-x-auto rounded-xl bg-[#eff4ff] p-2">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="text-[12px] font-bold text-[#00288e] border-b border-[#d3e4fe]">
                <th className="p-2">ไซส์</th>
                <th className="p-2">รอบอก (นิ้ว)</th>
                <th className="p-2">ความยาว (นิ้ว)</th>
                <th className="p-2">น้ำหนักแนะนำ</th>
                <th className="p-2 text-center">เลือก</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5eeff]">
              {sizeRows.map((row) => (
                <tr key={row.size} className="hover:bg-white/70 transition-colors">
                  <td className="p-2.5 font-bold text-[#00288e]">{row.size}</td>
                  <td className="p-2.5 font-semibold text-[#0b1c30]">{row.chest}</td>
                  <td className="p-2.5 text-[#444653]">{row.length}</td>
                  <td className="p-2.5 text-[#565e74]">{row.weight}</td>
                  <td className="p-2.5 text-center">
                    <button
                      onClick={() => {
                        if (onSelectSize) onSelectSize(row.size);
                        onClose();
                      }}
                      className="px-2.5 py-1 text-[11px] font-bold bg-white text-[#00288e] rounded-lg shadow-xs hover:bg-[#00288e] hover:text-white transition-all active:scale-95"
                      type="button"
                    >
                      เลือก
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 rounded-xl bg-[#eff4ff] flex items-center gap-2 text-[12px] text-[#003a46]">
          <span className="material-symbols-outlined text-[18px] text-[#00288e]">info</span>
          <span>ต้องการไซส์พิเศษเด็ก หรือไซส์ใหญ่ 4XL - 8XL สั่งตัดพิเศษได้ฟรีในแชท</span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#00288e] text-white text-[14px] font-bold active:scale-[0.99] transition-all shadow-md"
          type="button"
        >
          เข้าใจแล้ว เลือกไซส์ต่อ
        </button>
      </div>
    </div>
  );
}
