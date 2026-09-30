import { useState } from 'react';
import { AS_SPORT_LOGOS } from '../../data/mockData';
import { PortalRole } from '../../types';

interface LoginScreenProps {
  currentRole: PortalRole;
  onLoginSuccess: (role: PortalRole, email: string) => void;
  onClose?: () => void;
  onContinueAsGuest: () => void;
  showToast: (msg: string) => void;
}

export function LoginScreen({
  currentRole,
  onLoginSuccess,
  onClose,
  onContinueAsGuest,
  showToast,
}: LoginScreenProps) {
  const [selectedPortal, setSelectedPortal] = useState<'customer' | 'admin'>(
    currentRole === 'admin' ? 'admin' : 'customer'
  );
  const [email, setEmail] = useState(
    selectedPortal === 'admin' ? 'admin@subliprint-admin.com' : 'name@example.com'
  );
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // -------------------------------------------------------------
  // ฟังก์ชันตรวจสอบรูปแบบอีเมลจริง (Email Format & Domain Check)
  // -------------------------------------------------------------
  const validateRealEmail = (inputEmail: string) => {
    // 1. ตรวจสอบโครงสร้างอีเมลเบื้องต้นด้วย Regular Expression (ต้องมี @ และ .นามสกุล)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(inputEmail)) {
      return { valid: false, message: 'รูปแบบอีเมลไม่ถูกต้อง กรุณากรอกอีเมลจริง (เช่น name@gmail.com)' };
    }

    // 2. ตรวจสอบกรณีการพิมพ์โดเมนปลอม/สุ่ม (เช่น test@test.com, abc@123.com)
    const domain = inputEmail.split('@')[1]?.toLowerCase();
    const fakeDomains = ['test.com', 'example.com', 'mailinator.com', 'tempmail.com', '123.com'];
    if (fakeDomains.includes(domain)) {
      return { valid: false, message: 'กรุณาใช้อีเมลจริง ไม่ใช้อีเมลสำหรับทดสอบหรืออีเมลชั่วคราว' };
    }

    return { valid: true, message: '' };
  };

  const handlePortalSwitch = (portal: 'customer' | 'admin') => {
    setSelectedPortal(portal);
    if (portal === 'admin') {
      setEmail('admin@subliprint-admin.com');
    } else {
      setEmail('customer@sportclub.co.th');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // --- เพิ่มการตรวจสอบอีเมลจริงก่อนดำเนินการล็อกอิน ---
    const emailCheck = validateRealEmail(email);
    if (!emailCheck.valid) {
      showToast(emailCheck.message);
      return;
    }

    if (selectedPortal === 'admin') {
      if (!email.toLowerCase().includes('admin')) {
        showToast('กรุณาใช้อีเมลทางการของแอดมิน (@subliprint-admin.com)');
        return;
      }
      showToast('กำลังตรวจสอบสิทธิ์ Admin Portal...');
      setTimeout(() => {
        onLoginSuccess('admin', email);
        showToast('เข้าสู่ระบบผู้ดูแลหลังบ้านเรียบร้อยแล้ว');
      }, 600);
    } else {
      showToast('ยินดีต้อนรับกลับสู่ AS SPORT!');
      setTimeout(() => {
        onLoginSuccess('customer', email);
      }, 600);
    }
  };

  const handleSocialLogin = (provider: string) => {
    showToast(`กำลังเชื่อมต่อ ${provider}...`);
    setTimeout(() => {
      onLoginSuccess('customer', `${provider.toLowerCase()}@social.user`);
      showToast(`เข้าสู่ระบบด้วย ${provider} สำเร็จ`);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f8f9ff] flex flex-col justify-center items-center px-4 py-8 overflow-y-auto animate-fadeIn">
      {onClose && (
        <button
          onClick={onClose}
          aria-label="ปิดหน้าจอ"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-[#565e74] hover:text-[#0b1c30] transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      )}

      <div className="w-full max-w-sm flex flex-col items-center">
        {/* Brand Header & Dynamic Logo Showcase */}
        <div className="flex flex-col items-center justify-center pt-2 pb-5 text-center">
          <div className="relative flex items-center justify-center w-24 h-24 mb-4 rounded-2xl overflow-hidden shadow-sm bg-[#eff4ff] border border-[#d3e4fe]">
            <img
              src={AS_SPORT_LOGOS.mainSquare}
              alt="AS SPORT Logo"
              className="w-full h-full object-contain rounded-2xl p-1"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dae2fd] text-[#131b2e] mb-2">
            <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider">
              ระบบสั่งผลิตเสื้อพิมพ์ลายคุณภาพสูง
            </span>
          </div>

          <h1 className="text-[26px] font-extrabold text-[#0b1c30] tracking-tight">
            AS SPORT
          </h1>
          <p className="text-[13px] text-[#444653] max-w-xs mt-0.5">
            เข้าสู่ระบบเพื่อจัดการออเดอร์ ออกแบบลายเสื้อ และตรวจสอบสถานะงานพิมพ์
          </p>
        </div>

        {/* Role Switcher Segmented Control */}
        <div className="w-full bg-[#eff4ff] p-1.5 rounded-2xl mb-4 shadow-xs border border-[#d3e4fe]">
          <div className="grid grid-cols-2 gap-1.5" role="tablist">
            {/* Customer Tab Button */}
            <button
              onClick={() => handlePortalSwitch('customer')}
              aria-selected={selectedPortal === 'customer'}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all duration-200 ${
                selectedPortal === 'customer'
                  ? 'bg-white text-[#00288e] shadow-sm font-bold'
                  : 'text-[#444653] hover:text-[#0b1c30]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
              <div className="flex flex-col text-left">
                <span className="text-[12px] font-semibold leading-tight">ลูกค้า (สั่งผลิตเสื้อ)</span>
                <span className="text-[10px] text-[#565e74] leading-none">Customer Portal</span>
              </div>
            </button>

            {/* Admin Tab Button */}
            <button
              onClick={() => handlePortalSwitch('admin')}
              aria-selected={selectedPortal === 'admin'}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl transition-all duration-200 ${
                selectedPortal === 'admin'
                  ? 'bg-white text-[#00288e] shadow-sm font-bold'
                  : 'text-[#444653] hover:text-[#0b1c30]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">shield_person</span>
              <div className="flex flex-col text-left">
                <span className="text-[12px] font-semibold leading-tight">เจ้าของเว็ป / แอดมิน</span>
                <span className="text-[10px] text-[#565e74] leading-none">Owner Dashboard</span>
              </div>
            </button>
          </div>
        </div>

        {/* Notice Banner for Admin (Toggleable) */}
        {selectedPortal === 'admin' && (
          <div className="w-full bg-[#dce9ff] rounded-2xl p-3.5 mb-4 text-[#0b1c30] animate-fadeIn border border-[#b8c4ff]">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#00288e] text-white shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-[#00288e] font-bold">ระบบเฉพาะเจ้าของร้าน &amp; ผู้จัดการฝ่ายผลิต</p>
                <p className="text-[12px] text-[#444653] mt-0.5 leading-snug">
                  สำหรับตรวจสอบยอดขาย คุมคิวพิมพ์ Mimaki ตรวจไฟล์เวกเตอร์ และสต็อกหมึก{' '}
                  <span className="font-semibold text-[#00288e]">(@subliprint-admin.com)</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Login Form Card */}
        <div className="w-full bg-white rounded-3xl p-5 shadow-md border border-[#e5eeff]">
          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1.5 px-0.5">
                <label className="text-[12px] text-[#0b1c30] font-semibold" htmlFor="input-email">
                  {selectedPortal === 'admin' ? 'อีเมลแอดมินผู้ดูแลระบบ' : 'อีเมลบัญชีผู้ใช้'}
                </label>
                <span className="text-[11px] text-[#565e74]">
                  {selectedPortal === 'admin' ? 'สิทธิ์เจ้าหน้าที่' : 'สมาชิกทั่วไป'}
                </span>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[#444653] pointer-events-none text-[20px]">
                  alternate_email
                </span>
                <input
                  id="input-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={selectedPortal === 'admin' ? 'admin@subliprint-admin.com' : 'name@example.com'}
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#eff4ff] text-[#0b1c30] text-[14px] placeholder:text-[#444653]/60 focus:outline-none focus:bg-[#e5eeff] focus:ring-2 focus:ring-[#00288e] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-1.5 px-0.5">
                <label className="text-[12px] text-[#0b1c30] font-semibold" htmlFor="input-password">
                  รหัสผ่าน
                </label>
                <button
                  type="button"
                  onClick={() => showToast('ระบบได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณ')}
                  className="text-[12px] text-[#00288e] hover:underline"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[#444653] pointer-events-none text-[20px]">
                  lock_open
                </span>
                <input
                  id="input-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-12 pl-11 pr-11 rounded-xl bg-[#eff4ff] text-[#0b1c30] text-[14px] placeholder:text-[#444653]/60 focus:outline-none focus:bg-[#e5eeff] focus:ring-2 focus:ring-[#00288e] transition-all"
                />
                <button
                  type="button"
                  aria-label="สลับแสดงรหัสผ่าน"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1.5 rounded-lg text-[#444653] hover:text-[#0b1c30] transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me & Security Status */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#00288e] focus:ring-0 cursor-pointer accent-[#00288e]"
                />
                <span className="text-[12px] text-[#444653]">จำการเข้าสู่ระบบไว้</span>
              </label>
              <div className="flex items-center gap-1 text-[#003a46]">
                <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  enhanced_encryption
                </span>
                <span className="text-[11px] font-semibold">256-bit SSL</span>
              </div>
            </div>

            {/* Primary Log In Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-12 rounded-xl bg-[#00288e] text-white text-[14px] font-bold flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-[0.99] transition-all"
              >
                <span>
                  {selectedPortal === 'admin'
                    ? 'เข้าสู่ระบบจัดการร้าน (Admin)'
                    : 'เข้าสู่ระบบ (Log In)'}
                </span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>
          </form>

          {/* Social / Fast Login Section (Customer Mode) */}
          {selectedPortal === 'customer' && (
            <div className="flex flex-col mt-5">
              <div className="relative flex items-center justify-center mb-4">
                <div className="w-full h-[1px] bg-[#dce9ff] absolute"></div>
                <span className="relative px-3 bg-white text-[11px] text-[#565e74]">
                  หรือเข้าสู่ระบบด่วนด้วย
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* LINE */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('LINE')}
                  className="flex items-center justify-center gap-1.5 h-11 px-2 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] transition-all active:scale-[0.98] border border-[#d3e4fe]/50"
                >
                  <svg className="w-5 h-5 fill-[#06C755] shrink-0" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 5.92 2 10.75C2 13.92 3.84 16.68 6.64 18.17C7.03 18.37 7.21 18.77 7.15 19.19L6.72 21.64C6.63 22.14 7.18 22.52 7.6 22.25L10.97 20.08C11.3 19.87 11.69 19.78 12.08 19.79C17.52 19.79 22 15.87 22 10.75C22 5.92 17.52 2 12 2Z" />
                  </svg>
                  <span className="text-[12px] font-semibold text-[#0b1c30]">LINE</span>
                </button>

                {/* Google */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  className="flex items-center justify-center gap-1.5 h-11 px-2 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] transition-all active:scale-[0.98] border border-[#d3e4fe]/50"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  <span className="text-[12px] font-semibold text-[#0b1c30]">Google</span>
                </button>

                {/* Facebook */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Facebook')}
                  className="flex items-center justify-center gap-1.5 h-11 px-2 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#0b1c30] transition-all active:scale-[0.98] border border-[#d3e4fe]/50"
                >
                  <svg className="w-5 h-5 fill-[#1877F2] shrink-0" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-[12px] font-semibold text-[#0b1c30]">Facebook</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Secondary Actions */}
        <div className="flex flex-col items-center gap-3 mt-6">
          <div className="flex items-center gap-1.5 text-[13px] text-[#444653]">
            <span>ยังไม่มีบัญชี AS SPORT?</span>
            <button
              type="button"
              onClick={() => showToast('เปิดฟอร์มลงทะเบียนสมาชิกใหม่')}
              className="text-[13px] font-bold text-[#00288e] hover:underline"
            >
              สมัครสมาชิกใหม่
            </button>
          </div>

          {/* Quick Guest Access Button */}
          <button
            type="button"
            onClick={onContinueAsGuest}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-[#565e74] hover:bg-[#eff4ff] transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[17px]">visibility</span>
            <span className="text-[12px] font-semibold">ทดลองออกแบบเสื้อลายพิมพ์แบบ Guest</span>
          </button>
        </div>
      </div>
    </div>
  );
}
