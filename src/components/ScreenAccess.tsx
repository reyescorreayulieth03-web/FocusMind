import React from 'react';
import { motion } from 'motion/react';
import { LogIn, UserPlus, Sparkles, ChevronLeft } from 'lucide-react';
import { MascotArtwork } from './MascotArtwork';

interface ScreenAccessProps {
  onGoToLogin: () => void;
  onGoToRegister: () => void;
  onBackToWelcome?: () => void;
}

export const ScreenAccess: React.FC<ScreenAccessProps> = ({
  onGoToLogin,
  onGoToRegister,
  onBackToWelcome,
}) => {
  return (
    <motion.div
      id="screen-access"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col items-center justify-between h-full px-6 py-6 text-slate-800 bg-gradient-to-b from-sky-50 via-white to-blue-50/70 select-none overflow-y-auto"
    >
      {/* Header bar with optional quick back */}
      <div className="w-full flex items-center justify-between pt-1">
        {onBackToWelcome ? (
          <button
            id="btn-access-back"
            onClick={onBackToWelcome}
            aria-label="Volver a bienvenida"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/80 border border-slate-200/80 shadow-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-10" />
        )}

        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200/60 text-blue-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Acceso FocusMind</span>
        </div>

        <div className="w-10" />
      </div>

      {/* Center Section: Second Image (Waiting Mascot) */}
      <motion.div
        id="access-mascot-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.45, type: 'spring', stiffness: 220, damping: 20 }}
        className="my-auto py-2 flex flex-col items-center justify-center w-full max-w-[280px]"
      >
        <div className="relative w-56 h-64 sm:w-64 sm:h-72 flex items-center justify-center">
          <MascotArtwork type="waiting" className="w-full h-full" alt="FocusMind Waiting Mascot" />
        </div>
      </motion.div>

      {/* Bottom Section: Two Large Buttons */}
      <div className="w-full max-w-sm flex flex-col gap-3.5 pb-2">
        <motion.button
          id="btn-access-login"
          onClick={onGoToLogin}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.35 }}
          className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-lg shadow-lg shadow-blue-500/25 flex items-center justify-center gap-3 transition-all cursor-pointer border border-blue-500/40"
        >
          <LogIn className="w-5 h-5" />
          <span>Iniciar sesión</span>
        </motion.button>

        <motion.button
          id="btn-access-register"
          onClick={onGoToRegister}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.35 }}
          className="w-full py-4 px-6 rounded-2xl bg-sky-100 hover:bg-sky-200 active:bg-sky-300 text-blue-900 font-bold text-lg shadow-sm border border-sky-300/80 flex items-center justify-center gap-3 transition-all cursor-pointer"
        >
          <UserPlus className="w-5 h-5 text-blue-700" />
          <span>Registrarte</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
