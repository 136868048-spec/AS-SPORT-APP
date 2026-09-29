interface ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export function Toast({ message, type = 'info' }: ToastProps) {
  if (!message) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[99] max-w-sm w-[90%] bg-[#213145] text-[#eaf1ff] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-fadeIn border border-white/10">
      <span className="material-symbols-outlined text-[20px] text-[#3cccea] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
        {type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'check_circle'}
      </span>
      <span className="text-[13px] font-medium leading-tight select-none">
        {message}
      </span>
    </div>
  );
}
