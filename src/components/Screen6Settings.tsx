import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Trophy, 
  KeyRound, 
  Timer, 
  ChevronRight, 
  Sparkles,
  Settings,
  Heart,
  X,
  BookOpen,
  Info,
  CheckCircle2,
  Smile
} from 'lucide-react';
import { MascotMood } from '../types';
import { MascotArtwork } from './MascotArtwork';
import { MASCOT_BEHAVIORS } from '../data/mascotSystem';

interface Screen6SettingsProps {
  onBackToDashboard: () => void; // Return to Screen 5
  onGoToWeeklyChallenge: () => void; // Screen 8
  onGoToForgotPassword: () => void; // Screen 9
  onGoToPomodoro: () => void; // Screen 10
}

export const Screen6Settings: React.FC<Screen6SettingsProps> = ({
  onBackToDashboard,
  onGoToWeeklyChallenge,
  onGoToForgotPassword,
  onGoToPomodoro,
}) => {
  // Mascot Info Guide Modal state
  const [showMascotInfo, setShowMascotInfo] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<MascotMood>('neutral');

  // Exactly the 8 expressions in the user requested order:
  // 1. aburrido, 2. concentrado, 3. confundido, 4. dormido, 5. frustrado, 6. impaciente, 7. neutral/esperando, 8. sorprendido
  const allMoodKeys: MascotMood[] = [
    'bored',       // 1. Aburrido
    'focused',     // 2. Concentrado
    'confused',    // 3. Confundido
    'sleeping',    // 4. Dormido
    'frustrated',  // 5. Frustrado
    'impatient',   // 6. Impaciente
    'neutral',     // 7. Neutral / esperando
    'completed',   // 8. Sorprendido
  ];

  const menuOptions = [
    {
      id: 'option-reto-semanal',
      title: 'RETO SEMANAL',
      description: 'Supera metas diarias y gana galletas de pescado para tu mascota',
      icon: Trophy,
      iconBg: 'bg-amber-100 text-amber-600',
      badge: 'Recompensas 🐟',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      action: onGoToWeeklyChallenge,
    },
    {
      id: 'option-info-mascota',
      title: 'INFORMACIÓN DE LA MASCOTA',
      description: 'Personalidad, situaciones de acompañamiento y frases del compañero',
      icon: Heart,
      iconBg: 'bg-indigo-100 text-indigo-600',
      badge: 'Guía del Osito 🐻',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      action: () => setShowMascotInfo(true),
    },
    {
      id: 'option-metodo-pomodoro',
      title: 'MÉTODO POMODORO',
      description: 'Técnica de 25 min de enfoque y descansos inteligentes',
      icon: Timer,
      iconBg: 'bg-blue-100 text-blue-600',
      badge: 'Técnica de Estudio',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      action: onGoToPomodoro,
    },
    {
      id: 'option-olvidar-password',
      title: 'OLVIDAR CONTRASEÑA',
      description: 'Recupera o actualiza el acceso a tu cuenta de estudiante',
      icon: KeyRound,
      iconBg: 'bg-sky-100 text-sky-600',
      badge: 'Seguridad',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      action: onGoToForgotPassword,
    },
  ];

  const currentBehavior = MASCOT_BEHAVIORS[selectedMood];

  return (
    <motion.div
      id="screen-6-settings"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col h-full bg-gradient-to-b from-sky-50/80 via-white to-blue-50/60 text-slate-800 select-none overflow-y-auto relative"
    >
      {/* Top Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-blue-100/80 bg-white/90 backdrop-blur-md sticky top-0 z-10">
        <button
          id="btn-settings-back"
          onClick={onBackToDashboard}
          aria-label="Regresar a la Pantalla Principal"
          className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white border border-slate-200 shadow-2xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-blue-600" />
          <h2 className="text-base font-extrabold text-blue-950">CONFIGURACIÓN</h2>
        </div>

        <div className="w-10" />
      </div>

      {/* Intro section */}
      <div className="px-5 pt-4 pb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 border border-blue-200/60 text-blue-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Ajustes y Herramientas FocusMind</span>
        </div>
        <p className="text-xs text-slate-700 mt-1.5">
          Selecciona una opción para personalizar tu experiencia de estudio y hábitos.
        </p>
      </div>

      {/* Menu Options List */}
      <div className="px-5 py-3 space-y-3">
        {menuOptions.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <motion.button
              key={item.id}
              id={item.id}
              onClick={item.action}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.3 }}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="w-full p-4 rounded-3xl bg-white border border-blue-100 hover:border-blue-300 shadow-xs hover:shadow-md transition-all flex items-center gap-3.5 text-left group cursor-pointer"
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}>
                <IconComp className="w-6 h-6" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h3 className="text-sm font-extrabold text-blue-950 tracking-tight">
                    {item.title}
                  </h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-snug line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Arrow */}
              <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors shrink-0">
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Bottom info note */}
      <div className="mt-auto px-5 py-4 text-center">
        <p className="text-[11px] font-medium text-slate-700">
          FocusMind • Diseñado para la constancia del estudiante
        </p>
      </div>

      {/* ================= MODAL: INFORMACIÓN COMPLETA DE LA MASCOTA ================= */}
      <AnimatePresence>
        {showMascotInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 15 }}
              className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-blue-100 space-y-4 max-h-[92vh] overflow-y-auto text-slate-800"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-blue-950 leading-tight">
                      Información de la Mascota
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Personalidad y expresiones del compañero
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMascotInfo(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Personality & Concept Overview Card */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-4 text-white space-y-2 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🐻</span>
                  <h4 className="text-xs font-black uppercase tracking-wider text-sky-200">
                    Concepto & Personalidad
                  </h4>
                </div>
                <p className="text-xs text-blue-50 leading-relaxed">
                  Un <strong>osito azul de personalidad gruñona, seria, sarcástica y un poco impaciente</strong>. 
                  No busca ser condescendiente ni felicitar con exageración: te acompaña de forma divertida, directa y honesta para evitar que procrastines.
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-sky-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Compañero constante enfocado en tus metas diarias.</span>
                </div>
              </div>

              {/* Interactive Artwork Preview */}
              <div className="relative py-2 flex flex-col items-center bg-gradient-to-b from-sky-50 to-white rounded-2xl border border-sky-100 p-4">
                <div className="w-32 h-40 relative flex items-center justify-center">
                  <MascotArtwork 
                    type={selectedMood} 
                    size="md"
                    className="w-full h-full" 
                  />
                </div>

                {/* Frase actual en esta situación */}
                <div className="mt-2.5 w-full bg-white rounded-2xl p-3 border border-sky-200/80 shadow-xs text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-extrabold text-blue-700 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Frase que te da el oso</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 italic">
                    “{currentBehavior.dialogues[0]}”
                  </p>
                </div>
              </div>

              {/* Situation Selector */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                  Selecciona una situación para ver sus frases:
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {allMoodKeys.map((moodKey) => {
                    const situationMap: Record<string, { label: string; icon: string }> = {
                      neutral: { label: 'Al iniciar', icon: '👋' },
                      completed: { label: 'Al terminar', icon: '🎉' },
                      sleeping: { label: 'Inactividad', icon: '⏰' },
                      bored: { label: 'Sin empezar', icon: '⏳' },
                      frustrated: { label: 'Al cancelar', icon: '⚠️' },
                      confused: { label: 'Nota vacía', icon: '📝' },
                      focused: { label: 'En Pomodoro', icon: '🎯' },
                      impatient: { label: 'Por vencer', icon: '📅' },
                      proud: { label: 'Día listo', icon: '⭐' },
                    };
                    const info = situationMap[moodKey] || { label: moodKey, icon: '🐻' };
                    const isSelected = selectedMood === moodKey;
                    return (
                      <button
                        key={moodKey}
                        onClick={() => setSelectedMood(moodKey)}
                        className={`p-2 rounded-xl text-center border transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200/80'
                        }`}
                      >
                        <span className="text-base">{info.icon}</span>
                        <span className="text-[10px] font-bold leading-tight mt-0.5">{info.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Behavioral Details and Phrases */}
              <div className="bg-sky-50/70 rounded-2xl p-3.5 border border-sky-200/80 text-xs space-y-3 text-left">
                <div>
                  <span className="font-extrabold text-blue-900 block mb-0.5">¿Cuándo te acompaña?:</span>
                  <span className="text-slate-700">{currentBehavior.triggerDescription}</span>
                </div>
                <div>
                  <span className="font-extrabold text-blue-900 block mb-1.5">Frases que te da el oso en esta situación:</span>
                  <div className="space-y-1.5">
                    {currentBehavior.dialogues.slice(0, 4).map((dialogue, idx) => (
                      <div key={idx} className="bg-white/90 rounded-xl px-3 py-2 border border-blue-100 text-slate-700 italic text-[11px] flex items-start gap-1.5 shadow-2xs">
                        <span className="text-blue-500 font-bold not-italic">“</span>
                        <span className="flex-1 font-medium">{dialogue}</span>
                        <span className="text-blue-500 font-bold not-italic">”</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rules & Guidelines Note */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <div className="font-extrabold text-slate-800 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  <span>Regla general del personaje</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  El osito debe sentirse como un compañero que no quiere admitir que le importa tu progreso, pero siempre está atento a que cumplas tus sesiones Pomodoro y tareas.
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowMascotInfo(false)}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-blue-500/20"
              >
                Entendido
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

