import { useState, useEffect } from 'react';

interface PromptPayModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onPaymentSuccess: () => void;
}

export function PromptPayModal({
  isOpen,
  onClose,
  totalAmount,
  onPaymentSuccess,
}: PromptPayModalProps) {
  const [timeLeft, setTimeLeft] = useState(899); // 14:59
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleSimulatePayment = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onPaymentSuccess();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#213145]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-2xl flex flex-col items-center gap-3.5 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex items-center justify-between pb-2 border-b border-[#e5eeff]">
          <div className="flex items-center gap-1.5 text-[#00288e] font-bold text-[15px]">
            <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
            <span>พร้อมเพย์ (PromptPay QR)</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#565e74]"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* QR Code Container */}
        <div className="relative p-4 rounded-2xl bg-[#eff4ff] border-2 border-[#1e40af]/30 shadow-inner flex flex-col items-center">
          <div className="bg-[#00288e] text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px]">payments</span>
            THAI QR PAYMENT
          </div>

          {/* QR Pattern visual */}
          <div className="w-48 h-48 bg-white p-2 rounded-xl shadow-xs flex items-center justify-center relative overflow-hidden border border-[#d3e4fe]">
            <svg viewBox="0 0 100 100" className="w-full h-full text-[#0b1c30]">
              <path fill="currentColor" d="M10 10h25v25h-25zM15 15v15h15v-15zM20 20h5v5h-5z M65 10h25v25h-25zM70 15v15h15v-15zM75 20h5v5h-5z M10 65h25v25h-25zM15 70v15h15v-15zM20 75h5v5h-5z M45 10h10v10h-10z M45 30h10v15h-10z M45 65h10v25h-10z M65 45h25v10h-25z M65 65h10v10h-10z M80 75h10v15h-10z M25 45h15v10h-15z M10 45h10v10h-10z M60 80h10v10h-10z M75 60h15v10h-15z M35 75h5v15h-5z" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 bg-white rounded-lg p-0.5 shadow-md flex items-center justify-center border border-[#1e40af]">
                <span className="text-[10px] font-black text-[#00288e]">AS</span>
              </div>
            </div>
          </div>

          <div className="mt-2 text-[12px] font-bold text-[#00288e]">
            บจก. ซับลิ พริ้นท์ แล็บ (AS SPORT)
          </div>
          <div className="text-[11px] text-[#565e74]">
            เลขอ้างอิง: 0105567089921
          </div>
        </div>

        {/* Amount & Timer */}
        <div className="w-full bg-[#eff4ff] p-3 rounded-xl flex items-center justify-between">
          <div className="text-left">
            <span className="text-[11px] text-[#565e74] block">ยอดชำระสุทธิ</span>
            <span className="text-[20px] font-extrabold text-[#00288e]">
              ฿{totalAmount.toLocaleString()}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-[#ba1a1a] font-bold block">หมดอายุใน</span>
            <span className="text-[15px] font-mono font-bold text-[#0b1c30]">
              {timeString}
            </span>
          </div>
        </div>

        <button
          onClick={handleSimulatePayment}
          disabled={isVerifying}
          className="w-full h-12 rounded-xl bg-[#00288e] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-md hover:bg-[#1e40af] active:scale-95 transition-all disabled:opacity-75"
          type="button"
        >
          {isVerifying ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>กำลังตรวจสอบยอดโอน...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>จำลองการโอนชำระเงินสำเร็จ</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
