import React, { useState } from 'react';
import { playPopSound } from '../services/sound';
import { X, Share2, Copy, Check, MessageCircle, Smartphone } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://petualangan-huruf-ajaib.app';

  const shareText = `🐰 *Petualangan Huruf Ajaib - Belajar Bersama Kiko!* 🔤\n\nAplikasi belajar huruf A–Z interaktif untuk anak usia 4 tahun (PAUD/TK):\n• Mengenal huruf kapital & kecil berdampingan\n• Suara ramah Kiko si Kelinci berbahasa Indonesia\n• 7 Menu permainan seru tanpa hukuman & penuh bintang apresiasi!\n\n👉 *Buka dan mainkan di sini:* ${currentUrl}`;

  const handleCopyLink = () => {
    playPopSound();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsAppShare = () => {
    playPopSound();
    const encoded = encodeURIComponent(shareText);
    const waUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full border-4 border-amber-300 shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={() => {
            playPopSound();
            onClose();
          }}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex p-3 bg-sky-50 text-sky-500 rounded-2xl mb-2">
            <Share2 size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            Bagikan ke Siswa & Orang Tua
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-500">
            Kirimkan tautan ini agar anak bisa bermain dari rumah
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-5">
          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppShare}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2.5 shadow-md border-b-4 border-emerald-700 btn-chunky cursor-pointer text-base"
          >
            <MessageCircle size={22} />
            <span>Bagikan ke Grup WhatsApp</span>
          </button>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="w-full bg-sky-50 hover:bg-sky-100 text-sky-800 border-2 border-sky-300 font-black py-3 px-5 rounded-2xl flex items-center justify-center gap-2.5 shadow-xs transition-colors cursor-pointer text-sm sm:text-base"
          >
            {copied ? (
              <>
                <Check size={20} className="text-emerald-600" />
                <span className="text-emerald-700">Tautan Berhasil Disalin!</span>
              </>
            ) : (
              <>
                <Copy size={20} />
                <span>Salin Tautan Website</span>
              </>
            )}
          </button>
        </div>

        {/* Home Screen Shortcut Tip */}
        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-left text-xs sm:text-sm text-slate-700">
          <div className="flex items-center gap-2 font-black text-amber-900 mb-1">
            <Smartphone size={16} />
            <span>Tips Pasang di Layar Utama HP:</span>
          </div>
          <p className="leading-relaxed">
            Di browser Chrome HP atau Safari, ketuk menu <strong>(Titik Tiga / Bagikan)</strong> lalu pilih <strong>"Tambahkan ke Layar Utama" (Add to Home screen)</strong> agar aplikasi muncul seperti aplikasi sungguhan di layar HP anak!
          </p>
        </div>

        {/* Close Button */}
        <div className="mt-5 text-center">
          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2 rounded-full text-sm cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
