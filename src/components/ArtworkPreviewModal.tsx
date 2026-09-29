interface ArtworkPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fileName: string;
  previewUrl?: string;
  onApprove?: () => void;
  showApproveAction?: boolean;
}

export function ArtworkPreviewModal({
  isOpen,
  onClose,
  title,
  fileName,
  previewUrl,
  onApprove,
  showApproveAction = false,
}: ArtworkPreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#213145]/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#e5eeff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00288e] text-[24px]">art_track</span>
            <div>
              <h4 className="text-[16px] text-[#0b1c30] font-bold">{title}</h4>
              <p className="text-[11px] text-[#565e74] truncate max-w-xs">{fileName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#444653] hover:text-[#0b1c30] transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Artwork Inspection Box */}
        <div className="relative rounded-xl overflow-hidden bg-[#eff4ff] border border-[#d3e4fe] flex flex-col items-center justify-center p-3">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Artwork preview"
              className="max-h-72 w-full object-contain rounded-lg"
            />
          ) : (
            <div className="py-12 flex flex-col items-center gap-2 text-[#565e74]">
              <span className="material-symbols-outlined text-[48px] text-[#00288e]">description</span>
              <span className="text-[13px] font-bold">{fileName}</span>
              <span className="text-[11px]">Adobe Illustrator Vector Art • 300 DPI CMYK</span>
            </div>
          )}

          <div className="w-full mt-3 p-2.5 rounded-lg bg-white shadow-xs flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1 text-[#003a46] font-semibold">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
              Pre-flight Checklist ผ่าน (CMYK, 300 DPI, Outlined Fonts)
            </span>
            <span className="px-2 py-0.5 rounded bg-[#eff4ff] text-[#00288e] font-bold">100% Vector</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[12px]">
          <div className="p-2.5 rounded-lg bg-[#eff4ff] flex flex-col">
            <span className="text-[#565e74]">โหมดสีงานพิมพ์:</span>
            <span className="font-bold text-[#00288e]">CMYK Japan Subli-Grade</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#eff4ff] flex flex-col">
            <span className="text-[#565e74]">ระยะตกเลือด (Bleed):</span>
            <span className="font-bold text-[#00288e]">รอบตัว 1.5 cm สำหรับเย็บชิดขอบ</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-[#eff4ff] text-[#0b1c30] text-[13px] font-bold hover:bg-[#dce9ff] transition-colors"
            type="button"
          >
            ปิดหน้าต่าง
          </button>
          {showApproveAction && onApprove && (
            <button
              onClick={() => {
                onApprove();
                onClose();
              }}
              className="flex-1 py-2.5 rounded-xl bg-[#00288e] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-md hover:bg-[#1e40af] transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              อนุมัติไฟล์ขึ้นแท่นพิมพ์
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
