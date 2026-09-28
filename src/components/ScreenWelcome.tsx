import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { MascotArtwork } from './MascotArtwork';

interface ScreenWelcomeProps {
  onStart: () => void;
}

export const ScreenWelcome: React.FC<ScreenWelcomeProps> = ({ onStart }) => {
  return (
    <motion.div
      id="screen-welcome"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col items-center justify-between h-full px-6 py-8 text-slate-800 bg-gradient-to-b from-sky-50 via-white to-blue-50/60 select-none overflow-y-auto"
    >
      {/* Top Section */}
      <div className="w-full text-center pt-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 mb-2.5 rounded-full bg-blue-100/70 border border-blue-200/60 text-blue-700 text-xs font-semibold tracking-wide"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
          <span>FocusMind • Hábitos & Estudio</span>
        </motion.div>

        <motion.h1
          id="welcome-title"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight"
        >
          Bienvenidos
        </motion.h1>
      </div>

      {/* Center Section: Main Logo Image */}
      <motion.div
        id="welcome-mascot-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.45, type: 'spring', stiffness: 220, damping: 20 }}
        className="my-auto py-2 flex flex-col items-center justify-center w-full max-w-[280px]"
      >
        <div className="relative w-56 h-64 sm:w-64 sm:h-72 flex items-center justify-center">
          <MascotArtwork type="happy" className="w-full h-full" alt="FocusMind Mascot Logo" />
        </div>
      </motion.div>

      {/* Bottom Section: Slogan & Action Button */}
      <div className="w-full max-w-sm flex flex-col items-center gap-6 pb-2">
        <motion.p
          id="welcome-slogan"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="text-center text-base sm:text-lg font-medium text-slate-700 leading-relaxed px-2"
        >
          “El secreto del éxito es ser constante”
        </motion.p>

        <motion.button
          id="btn-welcome-start"
          onClick={onStart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="w-full py-4 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-lg shadow-lg shadow-blue-500/25 flex items-center justify-center gap-3 transition-colors duration-200 cursor-pointer border border-blue-500/40"
        >
          <span>Iniciar</span>
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>
    </motion.div>
  );
};
