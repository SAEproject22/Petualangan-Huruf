import React from 'react';
import { playPopSound } from '../services/sound';
import { X, BookOpen, Volume2, ShieldCheck, Share2, Lightbulb } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShare: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
  onOpenShare,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border-4 border-amber-300 shadow-2xl p-6 relative">
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

        {/* Title */}
        <div className="text-center mb-5">
          <div className="inline-flex p-3 bg-amber-50 text-amber-500 rounded-2xl mb-2">
            <BookOpen size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            Panduan Bermain & Belajar
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-500">
            Petunjuk Praktis untuk Bunda, Ayah, dan Guru PAUD/TK
          </p>
        </div>

        {/* Guide Content Sections */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed text-left">
          {/* Section 1: Audio */}
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl shrink-0 mt-0.5">
              <Volume2 size={18} />
            </div>
            <div>
              <h4 className="font-black text-emerald-900 mb-1">
                1. Suara Ramah Bahasa Indonesia (Web Speech)
              </h4>
              <p>
                Aplikasi ini dilengkapi suara pemandu <strong>Kiko si Kelinci</strong> yang membacakan huruf dan nama benda. Jika suara belum terdengar di awal, cukup sentuh tombol hijau 🔊 di samping Kiko sekali untuk memberikan izin audio browser.
              </p>
            </div>
          </div>

          {/* Section 2: No Punishment */}
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl shrink-0 mt-0.5">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="font-black text-amber-900 mb-1">
                2. Apresiasi Penuh & Bantuan Adaptif
              </h4>
              <p>
                Tidak ada hukuman, suara seram, atau pengurangan nilai! Jika anak mencoba 2 kali dan belum tepat, tombol jawaban yang benar akan <strong>berkedip lembut dengan cahaya hijau</strong> untuk menuntun anak secara mandiri tanpa membuat mereka frustrasi.
              </p>
            </div>
          </div>

          {/* Section 3: Confusing Letters */}
          <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 flex items-start gap-3">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-xl shrink-0 mt-0.5">
              <Lightbulb size={18} />
            </div>
            <div>
              <h4 className="font-black text-rose-900 mb-1">
                3. Mengatasi Huruf yang Mirip (B, D, P)
              </h4>
              <p>
                Gunakan <strong>Menu D (Huruf Awal Apa?)</strong> secara berkala. Menu ini sengaja membedakan huruf-huruf yang rawan tertukar oleh anak 4 tahun dengan asosiasi gambar fisik (Bola berporos dua perut, Dadu berperut satu, Pisang berkepala atas).
              </p>
            </div>
          </div>

          {/* Section 4: Sharing to Parents */}
          <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-200 flex items-start gap-3">
            <div className="p-2 bg-sky-100 text-sky-700 rounded-xl shrink-0 mt-0.5">
              <Share2 size={18} />
            </div>
            <div>
              <h4 className="font-black text-sky-900 mb-1">
                4. Membagikan Aplikasi ke Siswa / WhatsApp
              </h4>
              <p>
                Guru dapat membagikan tautan web aplikasi ini langsung ke grup WhatsApp wali murid. Aplikasi bisa dibuka langsung di HP orang tua tanpa perlu unduh aplikasi dari Play Store.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-5 mt-5 border-t border-slate-100">
          <button
            onClick={() => {
              playPopSound();
              onClose();
              onOpenShare();
            }}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-700 bg-sky-50 px-3.5 py-2 rounded-xl border border-sky-200 transition-colors cursor-pointer"
          >
            <Share2 size={16} />
            <span>Bagikan Link</span>
          </button>

          <button
            onClick={() => {
              playPopSound();
              onClose();
            }}
            className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-black px-6 py-2.5 rounded-full text-sm sm:text-base border-b-2 border-amber-600 btn-chunky cursor-pointer"
          >
            Saya Mengerti 👍
          </button>
        </div>
      </div>
    </div>
  );
};
