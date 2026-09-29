import { useState, useRef, useEffect } from 'react';
import { ChatMessage, ScreenTab } from '../../types';

interface ChatScreenProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, isCustomer?: boolean) => void;
  onTabChange: (tab: ScreenTab) => void;
  showToast: (msg: string) => void;
  onOpenSizeChart: () => void;
  onOpenQuoteModal: () => void;
}

export function ChatScreen({
  messages,
  onSendMessage,
  onTabChange,
  showToast,
  onOpenSizeChart,
  onOpenQuoteModal,
}: ChatScreenProps) {
  const [inputText, setInputText] = useState('');
  const [isToolTrayOpen, setIsToolTrayOpen] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    onSendMessage(text, true);

    // Auto-respond from AS SPORT technician
    setTimeout(() => {
      let reply = 'ขอบคุณที่ติดต่อสอบถามครับ ทีมช่างพิมพ์ได้รับข้อความแล้ว กำลังตรวจสอบไฟล์และรายละเอียดให้ทันทีครับผม 👍';
      if (text.includes('เสนอราคา') || text.includes('ราคา')) {
        reply = 'สำหรับการสั่งผลิต 20 ตัวขึ้นไป ราคาจะอยู่ที่ ฿290 / ตัว พร้อมฟรีสกรีนชื่อ-เบอร์นักวิ่งทุกตำแหน่งครับผม!';
      } else if (text.includes('ไซส์') || text.includes('ขนาด')) {
        reply = 'ตารางไซส์ของเราเป็นมาตรฐานทรงสปอร์ตสากลครับ รอบอก S=36", M=38", L=40", XL=42", 2XL=44", 3XL=46" นิ้ว ผ้า Micro-Smooth ทรงสวยไม่หดครับ';
      } else if (text.includes('ฟอนต์') || text.includes('เบอร์') || text.includes('ชื่อ')) {
        reply = 'ทางร้านมีแบบฟอนต์ตัวเลขและชื่อนักฟุตบอลมาตรฐานไทยลีกและพรีเมียร์ลีกให้เลือกกว่า 30 แบบ ส่งรายชื่อนักกีฬามาทางนี้ได้เลยครับ ช่างจะวางแบบ Mockup 3D ให้ดูฟรีก่อนผลิตครับ';
      } else if (text.includes('คิว') || text.includes('จัดส่ง') || text.includes('กี่วัน')) {
        reply = 'คิวผลิตปัจจุบันอยู่ที่ 3-5 วันทำการครับ หากต้องการงานด่วนแจ้งทีมงานได้ทันที มีบริการ Express Delivery จัดส่งถึงที่ครับ';
      }
      onSendMessage(reply, false);
    }, 1200);
  };

  const handleQuickChipClick = (text: string) => {
    if (text.includes('ใบเสนอราคา')) {
      onOpenQuoteModal();
      return;
    }
    if (text.includes('ตารางเทียบไซส์')) {
      onOpenSizeChart();
      return;
    }
    setInputText(text);
  };

  const handleAttach = (type: string) => {
    setIsToolTrayOpen(false);
    if (type === 'file') {
      showToast('ระบบรองรับการส่งไฟล์เวกเตอร์ AI/PDF สูงสุด 50MB');
    } else if (type === 'image') {
      showToast('เลือกรูปภาพเสื้อจากอัลบั้มเพื่อตรวจความคมชัด');
    } else if (type === 'camera') {
      showToast('เปิดกล้องถ่ายภาพตัวอย่างชิ้นงานจริง');
    } else {
      showToast('แชร์พิกัดสถานที่จัดส่งพัสดุ');
    }
  };

  return (
    <div className="flex flex-col w-full pb-28 animate-fadeIn">
      {/* Pinned Chat Context / Order Header */}
      <div className="relative bg-white p-3.5 rounded-2xl shadow-xs border border-[#e5eeff] mb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-[#1e40af] flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[22px]">support_agent</span>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold text-[#0b1c30] truncate">
                  ช่างพิมพ์ &amp; แอดมิน AS SPORT
                </span>
                <span className="bg-[#00288e]/10 text-[#00288e] text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                  เจ้าหน้าที่
                </span>
              </div>
              <div className="flex items-center gap-1 text-[#444653] text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>ตอบกลับภายใน 1-2 นาที</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              aria-label="โทรติดต่อด่วน"
              onClick={() => {
                setIsCalling(true);
                showToast('กำลังโทรติดต่อช่างพิมพ์ห้องคลีนรูม AS SPORT...');
                setTimeout(() => setIsCalling(false), 2500);
              }}
              className="w-9 h-9 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#00288e] hover:bg-[#dce9ff] transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[19px]">
                {isCalling ? 'ring_volume' : 'call'}
              </span>
            </button>
            <button
              type="button"
              aria-label="ประวัติคำสั่งซื้อ"
              onClick={() => onTabChange('cart-and-quote')}
              className="w-9 h-9 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#565e74] hover:bg-[#dce9ff] transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[19px]">receipt_long</span>
            </button>
          </div>
        </div>

        {/* Pinned Order Tracking Snippet */}
        <div className="mt-2.5 bg-[#eff4ff] rounded-xl p-2.5 flex items-center justify-between gap-2 border border-[#d3e4fe]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[#00288e] text-[20px] shrink-0">
              inventory_2
            </span>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-[#00288e]">
                อ้างอิง: #AS-2024-8891
              </div>
              <p className="text-[12px] text-[#444653] truncate">
                เสื้อพิมพ์ลาย PSU 24 ตัว (สีกรม-ม่วง)
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold bg-[#acedff] text-[#004e5c] px-2.5 py-0.5 rounded-full shrink-0">
            ตรวจไฟล์กราฟิก
          </span>
        </div>
      </div>

      {/* Chat Timeline / Date Separator */}
      <div className="flex items-center justify-center my-1 mb-3">
        <span className="bg-[#dce9ff] text-[#444653] text-[11px] font-semibold px-3 py-1 rounded-full shadow-xs">
          วันนี้ 24 พฤษภาคม 2024
        </span>
      </div>

      {/* Message Stream */}
      <div className="flex flex-col gap-3 pb-2">
        {messages.map((msg) => {
          const isAdmin = msg.sender === 'admin';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${
                isAdmin ? 'self-start max-w-[92%]' : 'self-end max-w-[88%] flex-row-reverse'
              }`}
            >
              {/* Avatar for Admin */}
              {isAdmin && (
                <div className="w-8 h-8 rounded-full bg-[#00288e] text-white flex items-center justify-center text-[12px] font-extrabold shrink-0 mt-1 shadow-xs">
                  {msg.avatarText || 'AS'}
                </div>
              )}

              <div className={`flex flex-col gap-1 ${isAdmin ? 'items-start' : 'items-end'}`}>
                {/* Standard Text Bubble */}
                {msg.text && (
                  <div
                    className={`p-3.5 rounded-2xl shadow-xs leading-relaxed text-[13px] ${
                      isAdmin
                        ? 'bg-white text-[#0b1c30] rounded-tl-xs border border-[#e5eeff]'
                        : 'bg-[#00288e] text-white rounded-tr-xs'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* Color Proof Note if present */}
                    {msg.colorProofNote && (
                      <div className="mt-2.5 flex items-center gap-2 bg-[#eff4ff] p-2 rounded-xl border border-[#d3e4fe]">
                        <span className="material-symbols-outlined text-[#00288e] text-[20px] shrink-0">
                          verified
                        </span>
                        <div className="text-[11px] text-[#0b1c30]">
                          <span className="font-bold text-[#00288e]">ตรวจสอบเฉดสี:</span>{' '}
                          สีกรม #172554 และเฉดม่วงคอนทราสต์ชัดเจน
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Customer Shared Image Mockup */}
                {msg.hasMockupImage && (
                  <div className="bg-white rounded-2xl rounded-tr-xs p-2 shadow-xs border border-[#e5eeff] overflow-hidden max-w-sm">
                    <div className="relative rounded-xl overflow-hidden bg-[#eff4ff]">
                      <img
                        src={msg.mockupImageUrl}
                        alt="Mockup เสื้อพิมพ์ลาย"
                        className="w-full h-auto max-h-56 object-cover rounded-lg"
                      />
                      <div className="absolute bottom-2 left-2 bg-[#213145]/85 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-[#acedff]">
                          palette
                        </span>
                        <span>{msg.mockupBadge || '300 DPI Sublimation'}</span>
                      </div>
                    </div>
                    <div className="p-2 pt-2.5">
                      <p className="text-[13px] font-bold text-[#0b1c30]">
                        {msg.mockupTitle}
                      </p>
                      <p className="text-[11px] text-[#565e74]">
                        {msg.mockupSubtitle}
                      </p>
                    </div>
                  </div>
                )}

                {/* Dual photo comparison card */}
                {msg.hasTechComparison && (
                  <div className="bg-white rounded-2xl rounded-tl-xs p-3 shadow-xs border border-[#e5eeff] w-full max-w-sm">
                    <div className="flex items-center justify-between pb-2 mb-2 bg-[#eff4ff] px-2.5 py-1.5 rounded-xl border border-[#d3e4fe]">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[#00288e] text-[18px]">
                          texture
                        </span>
                        <span className="text-[12px] font-bold text-[#0b1c30]">
                          ตัวอย่างเนื้อผ้าและการเย็บจริง
                        </span>
                      </div>
                      <span className="bg-[#1e40af] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        AS Tech
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col bg-[#eff4ff] rounded-xl overflow-hidden p-1.5 border border-[#d3e4fe]">
                        <img
                          src={msg.fabricImage}
                          alt="ภาพซูมเนื้อผ้า Micro-Smooth"
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <div className="mt-1 px-1">
                          <span className="text-[11px] font-bold text-[#0b1c30] block truncate">
                            Micro-Smooth
                          </span>
                          <span className="text-[10px] text-[#565e74] block truncate">
                            รวงผึ้งระบายอากาศ
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col bg-[#eff4ff] rounded-xl overflow-hidden p-1.5 border border-[#d3e4fe]">
                        <img
                          src={msg.seamImage}
                          alt="งานเย็บตะเข็บคู่มาตรฐานนักกีฬา"
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <div className="mt-1 px-1">
                          <span className="text-[11px] font-bold text-[#0b1c30] block truncate">
                            Flatlock 2-Needle
                          </span>
                          <span className="text-[10px] text-[#565e74] block truncate">
                            ตะเข็บด้ายคู่ทนทาน
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 bg-[#eff4ff] p-2 rounded-xl flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#00288e] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-emerald-600">
                          check_circle
                        </span>
                        งานตัดเย็บเกรดแข่งขันพร้อมส่งขึ้นบล็อกพิมพ์
                      </span>
                      <button
                        type="button"
                        onClick={() => onTabChange('apparel-customizer')}
                        className="text-[#003a46] hover:text-[#00288e] font-bold flex items-center gap-0.5"
                      >
                        <span>ดูสเปกผ้า</span>
                        <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Timestamp & Role/Read Indicator */}
                <div className="flex items-center gap-1.5 px-1 text-[11px] text-[#757684]">
                  <span>{msg.time}</span>
                  {isAdmin && msg.roleBadge && (
                    <span className="text-[#003a46] font-medium">• {msg.roleBadge}</span>
                  )}
                  {!isAdmin && (
                    <span
                      className="material-symbols-outlined text-[14px] text-[#00288e]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      done_all
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Action Chips */}
      <div className="my-2 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <button
          type="button"
          onClick={() => handleQuickChipClick('ขอสรุปใบเสนอราคา สำหรับ 24 ตัวหน่อยครับ')}
          className="shrink-0 bg-white hover:bg-[#eff4ff] text-[#0b1c30] px-3.5 py-1.5 rounded-full shadow-xs text-[12px] font-semibold flex items-center gap-1.5 border border-[#e5eeff] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[#00288e] text-[17px]">request_quote</span>
          <span>สรุปใบเสนอราคา</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickChipClick('ขอดูตารางเทียบไซส์เสื้อ (S-3XL) ครับ')}
          className="shrink-0 bg-white hover:bg-[#eff4ff] text-[#0b1c30] px-3.5 py-1.5 rounded-full shadow-xs text-[12px] font-semibold flex items-center gap-1.5 border border-[#e5eeff] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[#00288e] text-[17px]">straighten</span>
          <span>ตารางเทียบไซส์</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickChipClick('ต้องการปรับแต่งชื่อและเบอร์ด้านหลังเสื้อเพิ่มเติมครับ')}
          className="shrink-0 bg-white hover:bg-[#eff4ff] text-[#0b1c30] px-3.5 py-1.5 rounded-full shadow-xs text-[12px] font-semibold flex items-center gap-1.5 border border-[#e5eeff] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[#00288e] text-[17px]">edit_note</span>
          <span>ขอปรับฟอนต์/ชื่อหลัง</span>
        </button>

        <button
          type="button"
          onClick={() => handleQuickChipClick('ระยะเวลาผลิตและคิวจัดส่งรอบนี้ประมาณกี่วันครับ?')}
          className="shrink-0 bg-white hover:bg-[#eff4ff] text-[#0b1c30] px-3.5 py-1.5 rounded-full shadow-xs text-[12px] font-semibold flex items-center gap-1.5 border border-[#e5eeff] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[#00288e] text-[17px]">local_shipping</span>
          <span>เช็กคิวจัดส่ง</span>
        </button>
      </div>

      {/* Integrated Bottom Chat Input Component */}
      <div className="bg-white rounded-2xl shadow-md p-2.5 flex flex-col gap-2 border border-[#e5eeff]">
        {/* Attachment & Tool Tray */}
        {isToolTrayOpen && (
          <div className="grid grid-cols-4 gap-2 py-2 px-1 bg-[#eff4ff] rounded-xl animate-fadeIn border border-[#d3e4fe]">
            <button
              type="button"
              onClick={() => handleAttach('image')}
              className="flex flex-col items-center gap-1 text-[#0b1c30] hover:text-[#00288e] transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#00288e] shadow-xs">
                <span className="material-symbols-outlined text-[20px]">image</span>
              </div>
              <span className="text-[11px] font-bold">อัลบั้มรูป</span>
            </button>

            <button
              type="button"
              onClick={() => handleAttach('file')}
              className="flex flex-col items-center gap-1 text-[#0b1c30] hover:text-[#00288e] transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#00288e] shadow-xs">
                <span className="material-symbols-outlined text-[20px]">upload_file</span>
              </div>
              <span className="text-[11px] font-bold">ไฟล์ AI/PDF</span>
            </button>

            <button
              type="button"
              onClick={() => handleAttach('camera')}
              className="flex flex-col items-center gap-1 text-[#0b1c30] hover:text-[#00288e] transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#00288e] shadow-xs">
                <span className="material-symbols-outlined text-[20px]">photo_camera</span>
              </div>
              <span className="text-[11px] font-bold">ถ่ายรูปเสื้อ</span>
            </button>

            <button
              type="button"
              onClick={() => handleAttach('location')}
              className="flex flex-col items-center gap-1 text-[#0b1c30] hover:text-[#00288e] transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#00288e] shadow-xs">
                <span className="material-symbols-outlined text-[20px]">location_on</span>
              </div>
              <span className="text-[11px] font-bold">แชร์พิกัด</span>
            </button>
          </div>
        )}

        {/* Active Input Bar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="เมนูแนบไฟล์"
            onClick={() => setIsToolTrayOpen(!isToolTrayOpen)}
            className="w-10 h-10 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#00288e] hover:bg-[#dce9ff] transition-transform active:scale-95 shrink-0"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isToolTrayOpen ? 'close' : 'add'}
            </span>
          </button>

          <div className="flex-1 bg-[#eff4ff] rounded-xl px-3 py-2 flex items-center gap-2 focus-within:bg-[#e5eeff] transition-colors border border-[#d3e4fe]">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="พิมพ์ข้อความสอบถามแอดมิน AS SPORT..."
              className="w-full bg-transparent text-[#0b1c30] placeholder:text-[#757684] text-[13px] focus:outline-none"
            />
            <button
              type="button"
              aria-label="ส่งข้อความเสียง"
              onClick={() => showToast('กดเพื่อบันทึกเสียงสนทนา')}
              className="text-[#565e74] hover:text-[#00288e] transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">mic</span>
            </button>
          </div>

          <button
            type="button"
            aria-label="ส่งข้อความ"
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="w-10 h-10 rounded-full bg-[#00288e] text-white flex items-center justify-center hover:bg-[#1e40af] shadow-md transition-all active:scale-95 shrink-0 disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
