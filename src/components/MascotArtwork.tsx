import React from 'react';
import { MascotMood } from '../types';

// The 8 exact original bear expressions with transparent backgrounds in exact requested order:
// 1. aburrido (bored)
import boredImg from '../assets/images/bear_aburrido.png';
// 2. concentrado (focused)
import focusedImg from '../assets/images/concentrado.png';
// 3. confundido (confused)
import confusedImg from '../assets/images/bear_confundido.png';
// 4. dormido (sleeping)
import sleepingImg from '../assets/images/bear_dormido.png';
// 5. frustrado (frustrated)
import frustratedImg from '../assets/images/bear_frustrado.png';
// 6. impaciente (impatient)
import impatientImg from '../assets/images/bear_impaciente.png';
// 7. neutral/esperando (neutral / waiting)
import neutralImg from '../assets/images/bear_neutral_esperando.png';
// 8. sorprendido (surprised / completed)
import surprisedImg from '../assets/images/bear_sorprendido.png';

export type MascotDisplayMood =
  | MascotMood
  | 'happy'
  | 'waiting'
  | 'surprised'
  | 'aburrido'
  | 'concentrado'
  | 'confundido'
  | 'dormido'
  | 'frustrado'
  | 'impaciente'
  | 'neutral_esperando';

interface MascotProps {
  type: MascotDisplayMood;
  className?: string;
  alt?: string;
  showDialogueBubble?: boolean;
  dialogue?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const moodImageMap: Record<MascotMood, string> = {
  bored: boredImg,
  focused: focusedImg,
  confused: confusedImg,
  sleeping: sleepingImg,
  frustrated: frustratedImg,
  impatient: impatientImg,
  neutral: neutralImg,
  completed: surprisedImg,
  proud: surprisedImg,
};

export const MascotArtwork: React.FC<MascotProps> = ({
  type,
  className = '',
  alt,
  showDialogueBubble = false,
  dialogue,
  size = 'md',
}) => {
  // Normalize types supporting both Spanish and English keys
  let normalizedType: MascotMood = 'neutral';
  const rawType = String(type).toLowerCase();

  if (rawType === 'happy' || rawType === 'completed' || rawType === 'surprised' || rawType === 'sorprendido') {
    normalizedType = 'completed';
  } else if (rawType === 'waiting' || rawType === 'neutral' || rawType === 'esperando' || rawType === 'neutral_esperando') {
    normalizedType = 'neutral';
  } else if (rawType === 'aburrido' || rawType === 'bored') {
    normalizedType = 'bored';
  } else if (rawType === 'concentrado' || rawType === 'focused') {
    normalizedType = 'focused';
  } else if (rawType === 'confundido' || rawType === 'confused') {
    normalizedType = 'confused';
  } else if (rawType === 'dormido' || rawType === 'sleeping') {
    normalizedType = 'sleeping';
  } else if (rawType === 'frustrado' || rawType === 'frustrated') {
    normalizedType = 'frustrated';
  } else if (rawType === 'impaciente' || rawType === 'impatient') {
    normalizedType = 'impatient';
  } else if (rawType === 'proud') {
    normalizedType = 'proud';
  } else {
    normalizedType = 'neutral';
  }

  const imgSrc = moodImageMap[normalizedType] || neutralImg;

  const sizeClasses = {
    sm: 'max-h-[140px]',
    md: 'max-h-[220px]',
    lg: 'max-h-[300px]',
    xl: 'max-h-[360px]',
  };

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {showDialogueBubble && dialogue && (
        <div className="relative mb-2.5 max-w-[280px] px-3.5 py-2 rounded-2xl bg-white text-slate-800 text-xs font-semibold shadow-md border border-slate-200/90 text-center animate-in fade-in zoom-in-95 duration-200">
          <span>"{dialogue}"</span>
          {/* Speech bubble pointer */}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-slate-200/90 rotate-45" />
        </div>
      )}

      <img
        src={imgSrc}
        alt={alt || `FocusMind Mascota - Osito Azul (${normalizedType})`}
        referrerPolicy="no-referrer"
        className={`w-full h-full ${sizeClasses[size]} object-contain transition-transform duration-300 drop-shadow-md`}
        onError={(e) => {
          const target = e.currentTarget;
          target.style.display = 'none';
        }}
      />
    </div>
  );
};
