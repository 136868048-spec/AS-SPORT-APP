import { useState } from 'react';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: { name: string; phone: string; qty: number; note: string }) => void;
}

export function QuoteModal({ isOpen, onClose, onSubmit }: QuoteModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [qty, setQty] = useState(50);
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, phone, qty, note });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#213145]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white rounded-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00288e] text-[24px]">request_quote</span>
            <h4 className="text-[18px] text-[#0b1c30] font-bold">ขอใบเสนอราคาโปรโมชั่นทีม</h4>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#444653] hover:text-[#0b1c30] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="text-[13px] text-[#444653]">
          สั่งผลิต 50 ตัวขึ้นไป รับราคาส่งโรงงาน ออกแบบ 3D Mockup ฟรี และจัดส่งตัวอย่างผ้าจริงฟรีถึงที่
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-[12px] font-bold text-[#0b1c30] mb-1">
              ชื่อองค์กร / ชื่อผู้ติดต่อ *
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น บริษัท เอเอส ซับลิเมชั่น เทค จำกัด"
              className="w-full h-11 px-3 rounded-xl bg-[#eff4ff] text-[14px] text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#00288e]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#0b1c30] mb-1">
              เบอร์โทรศัพท์ / LINE ID *
            </label>
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08X-XXX-XXXX หรือ LINE ID"
              className="w-full h-11 px-3 rounded-xl bg-[#eff4ff] text-[14px] text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#00288e]"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#0b1c30] mb-1">
              จำนวนตัวโดยประมาณ (ตัว)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="50"
                value={qty}
                onChange={(e) => setQty(Math.max(50, parseInt(e.target.value) || 50))}
                className="w-32 h-11 px-3 rounded-xl bg-[#eff4ff] text-[15px] font-bold text-[#00288e] focus:outline-none focus:ring-2 focus:ring-[#00288e]"
              />
              <span className="text-[12px] text-[#003a46] font-medium bg-[#eff4ff] px-2.5 py-1.5 rounded-lg">
                ลดสูงสุด 40% (฿220 - ฿250 / ตัว)
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-[#0b1c30] mb-1">
              รายละเอียดเพิ่มเติม / โทนสี / สเปกผ้าที่ต้องการ
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="เช่น เสื้อวิ่งงานมาราธอน ผ้า Micro Smooth รวงผึ้ง พร้อมเบอร์นักวิ่ง"
              className="w-full p-3 rounded-xl bg-[#eff4ff] text-[13px] text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#00288e] resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 mt-2 rounded-xl bg-[#00288e] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-md hover:bg-[#1e40af] active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            ส่งคำขอใบเสนอราคาด่วน
          </button>
        </form>
      </div>
    </div>
  );
}
