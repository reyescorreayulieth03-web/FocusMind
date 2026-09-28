import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  BookOpen, 
  BrainCircuit,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { MascotMood, UserProfile } from '../types';
import { MascotArtwork } from './MascotArtwork';
import { getRandomDialogue } from '../data/mascotSystem';

interface Screen10PomodoroProps {
  user?: UserProfile;
  onUpdateUser?: (updatedUser: UserProfile) => void;
  onBackToSettings: () => void; // Screen 6
  onBackToDashboard?: () => void;
}

type PomodoroMode = 'study' | 'short_break' | 'long_break';

export const Screen10Pomodoro: React.FC<Screen10PomodoroProps> = ({
  user,
  onUpdateUser,
  onBackToSettings,
  onBackToDashboard,
}) => {
  const [mode, setMode] = useState<PomodoroMode>('study');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [cycleCount, setCycleCount] = useState<number>(1);
  const [cancelCount, setCancelCount] = useState<number>(0);
  const [manualSuccessMsg, setManualSuccessMsg] = useState<string | null>(null);
  const [studySubject, setStudySubject] = useState<string>('');

  // Mascot state inside Pomodoro
  const [mascotMood, setMascotMood] = useState<MascotMood>('neutral');
  const [mascotDialogue, setMascotDialogue] = useState<string>(
    'El temporizador está listo. Cuando quieras, podemos empezar.'
  );

  // Mode durations in seconds
  const modeDurations = {
    study: 25 * 60,
    short_break: 5 * 60,
    long_break: 15 * 60,
  };

  // Timer loop
  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      if (mode === 'study') {
        setMascotMood('completed');
        setMascotDialogue(getRandomDialogue('completed'));

        // Automatically accumulate 25 minutes of study into user profile
        if (onUpdateUser && user) {
          const currentMins = user.studyMinutes || 0;
          const currentLogs = user.studyLogs || [];
          const subjectLabel = studySubject.trim() ? `: ${studySubject.trim()}` : '';
          const newLog = {
            id: `pomodoro-${Date.now()}`,
            title: `Ciclo Pomodoro #${cycleCount}${subjectLabel} (25 min)`,
            minutes: 25,
            date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
            type: 'pomodoro' as const,
          };
          onUpdateUser({
            ...user,
            studyMinutes: currentMins + 25,
            studyLogs: [newLog, ...currentLogs].slice(0, 50),
          });
        }

        if (cycleCount % 4 === 0) {
          setMode('long_break');
          setTimeLeft(modeDurations.long_break);
        } else {
          setMode('short_break');
          setTimeLeft(modeDurations.short_break);
        }
      } else {
        setMode('study');
        setTimeLeft(modeDurations.study);
        setCycleCount((prev) => prev + 1);
        setMascotMood('neutral');
        setMascotDialogue('Terminaste el descanso. Ahora sigue con la siguiente sesión.');
      }
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, timeLeft, mode, cycleCount, onUpdateUser, user]);

  // Periodic focused dialogue while running study session
  useEffect(() => {
    if (!isRunning || mode !== 'study') return;
    const interval = setInterval(() => {
      setMascotDialogue(getRandomDialogue('focused', true));
    }, 45000);
    return () => clearInterval(interval);
  }, [isRunning, mode]);

  const handleTogglePlay = () => {
    if (!isRunning) {
      // Starting session
      setIsRunning(true);
      if (mode === 'study') {
        setMascotMood('focused');
        setMascotDialogue(getRandomDialogue('focused'));
      } else {
        setMascotMood('neutral');
        setMascotDialogue('Aprovecha el descanso.');
      }
    } else {
      // Pausing
      setIsRunning(false);
      const newCancels = cancelCount + 1;
      setCancelCount(newCancels);
      if (newCancels >= 2) {
        setMascotMood('frustrated');
        setMascotDialogue(getRandomDialogue('frustrated'));
      } else {
        setMascotMood('impatient');
        setMascotDialogue(getRandomDialogue('impatient'));
      }
    }
  };

  const handleSelectMode = (newMode: PomodoroMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(modeDurations[newMode]);
    if (newMode === 'study') {
      setMascotMood('neutral');
      setMascotDialogue('El temporizador está listo. Cuando quieras, podemos empezar.');
    } else {
      setMascotMood('neutral');
      setMascotDialogue('Tiempo de despejar la mente antes de la siguiente sesión.');
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(modeDurations[mode]);
    setCancelCount(prev => prev + 1);
    setMascotMood('frustrated');
    setMascotDialogue(getRandomDialogue('frustrated'));
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = ((modeDurations[mode] - timeLeft) / modeDurations[mode]) * 100;

  return (
    <motion.div
      id="screen-10-pomodoro"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col h-full bg-gradient-to-b from-sky-50/70 via-white to-blue-50/60 text-slate-800 select-none overflow-y-auto"
    >
      {/* Top Header with Back Button */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-blue-100/80 bg-white/90 backdrop-blur-md sticky top-0 z-10">
        <button
          id="btn-pomodoro-back"
          onClick={onBackToDashboard || onBackToSettings}
          aria-label="Regresar"
          className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white border border-slate-200 shadow-2xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5">
          <Timer className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Técnica Pomodoro</span>
        </div>

        {/* Live accumulated hours */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-900 text-xs font-bold">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>{((user?.studyMinutes || 0) / 60).toFixed(1)} h</span>
        </div>
      </div>

      {/* Screen Title */}
      <div className="px-5 pt-4 pb-2 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-black text-blue-950 tracking-tight"
        >
          MÉTODO POMODORO
        </motion.h1>
      </div>

      {/* Main Content */}
      <div className="px-4 py-2 max-w-md mx-auto w-full space-y-4 pb-8">
        {/* COMPAÑERO MASCOTA REACTIVO EN POMODORO */}
        <section 
          aria-label="Compañero de estudio"
          className="bg-white rounded-3xl p-4 border border-blue-100 shadow-xs flex items-center gap-3.5"
        >
          <div className="w-24 h-24 shrink-0 relative flex items-center justify-center">
            <MascotArtwork 
              type={mascotMood} 
              size="sm" 
              className="w-full h-full"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-1.5">
              <span className="text-xs font-bold text-blue-950">
                Compañero FocusMind
              </span>
            </div>
            <div className="bg-sky-50/80 rounded-2xl p-2.5 border border-sky-200/80 relative">
              <p className="text-xs font-medium text-slate-700 leading-snug italic">
                “{mascotDialogue}”
              </p>
            </div>
          </div>
        </section>

        {/* Interactive Pomodoro Practice Widget */}
        <section aria-label="Temporizador interactivo" className="bg-white rounded-3xl p-5 border border-blue-100 shadow-xs space-y-4 text-center">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Temporizador de Estudio
            </span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              Ciclo #{cycleCount}
            </span>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-2xl gap-1">
            <button
              onClick={() => handleSelectMode('study')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'study'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Estudio (25m)
            </button>
            <button
              onClick={() => handleSelectMode('short_break')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'short_break'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Descanso (5m)
            </button>
            <button
              onClick={() => handleSelectMode('long_break')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === 'long_break'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Largo (15m)
            </button>
          </div>

          {/* Materia / Tema a estudiar escrito por el usuario */}
          {mode === 'study' && (
            <div className="bg-sky-50/70 p-3 rounded-2xl border border-sky-100 text-left space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-blue-950">
                  Materia a estudiar:
                </label>
                <span className="text-[10px] text-blue-600 font-semibold">
                  Escribe la materia que quieras
                </span>
              </div>
              <input
                type="text"
                value={studySubject}
                onChange={(e) => setStudySubject(e.target.value)}
                placeholder="Escribe tu materia (ej. Matemáticas, Biología, Historia...)"
                className="w-full px-3 py-2 rounded-xl border border-sky-200 bg-white text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
              <div className="flex items-center gap-1 flex-wrap pt-0.5">
                <span className="text-[9px] text-slate-400 font-bold">Sugerencias:</span>
                {['Matemáticas', 'Ciencias', 'Historia', 'Inglés', 'Química', 'Física', 'Biología', 'Filosofía'].map((mat) => (
                  <button
                    type="button"
                    key={mat}
                    onClick={() => setStudySubject(mat)}
                    className={`text-[9px] px-1.5 py-0.5 rounded-md border transition-all cursor-pointer ${
                      studySubject.toLowerCase() === mat.toLowerCase()
                        ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                        : 'bg-white hover:bg-sky-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Big Time Display with Circular Progress Ring */}
          <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="stroke-slate-100"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className={`${
                  mode === 'study' ? 'stroke-blue-600' : mode === 'short_break' ? 'stroke-emerald-500' : 'stroke-indigo-600'
                } transition-all duration-500`}
                strokeWidth="6"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * progressPercent) / 100}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-slate-900 tracking-tight">
                {formattedTime}
              </span>
              <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1 mt-0.5">
                {mode === 'study' ? (
                  <>
                    <BookOpen className="w-3 h-3 text-blue-600" /> Tiempo de Estudio
                  </>
                ) : (
                  <>
                    <Coffee className="w-3 h-3 text-emerald-600" /> Tiempo de Descanso
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={handleReset}
              aria-label="Reiniciar temporizador"
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleTogglePlay}
              className={`px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95 ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" /> Pausar
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" /> Iniciar Pomodoro
                </>
              )}
            </button>
          </div>

          {/* Quick manual logging button for Pomodoro session */}
          <div className="pt-2 border-t border-slate-100 flex flex-col items-center gap-2">
            <button
              onClick={() => {
                if (onUpdateUser && user) {
                  const currentMins = user.studyMinutes || 0;
                  const currentLogs = user.studyLogs || [];
                  const subjectLabel = studySubject.trim() ? `: ${studySubject.trim()}` : '';
                  const newLog = {
                    id: `pomodoro-manual-${Date.now()}`,
                    title: `Sesión Pomodoro${subjectLabel} (25 min)`,
                    minutes: 25,
                    date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
                    type: 'pomodoro' as const,
                  };
                  onUpdateUser({
                    ...user,
                    studyMinutes: currentMins + 25,
                    studyLogs: [newLog, ...currentLogs].slice(0, 50),
                  });
                  setMascotMood('completed');
                  setMascotDialogue('¡Excelente! He sumado 25 minutos a tus horas de estudio.');
                  setManualSuccessMsg('¡+25 min sumados a tu registro de estudio!');
                  setTimeout(() => setManualSuccessMsg(null), 3000);
                }
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-blue-200/70 transition-all cursor-pointer active:scale-98"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Registrar 25 min completados en mi cuenta</span>
            </button>

            {manualSuccessMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200"
              >
                {manualSuccessMsg}
              </motion.div>
            )}
          </div>
        </section>

        {/* Core Method Explanation Card */}
        <section aria-label="Explicación del método Pomodoro" className="bg-white rounded-3xl p-5 border border-blue-100 shadow-xs space-y-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-extrabold text-blue-950">
              ¿En qué consiste el Método?
            </h2>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed font-medium">
            <p className="bg-blue-50/60 p-3 rounded-2xl border border-blue-100/80 text-blue-950 font-semibold">
              “El método Pomodoro es una técnica de estudio y concentración que consiste en dividir el tiempo de trabajo en períodos de estudio y descanso.”
            </p>

            <p>
              Consiste en enfocarse en una tarea durante un tiempo determinado, normalmente <strong className="text-blue-900 font-bold">25 minutos</strong>, y luego tomar un descanso corto de <strong className="text-blue-900 font-bold">5 minutos</strong>. Después de repetir este ciclo varias veces, se realiza un descanso más largo.
            </p>
          </div>

          {/* 3 Step Visual Pills */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2.5 rounded-2xl bg-sky-50 border border-sky-100">
              <div className="text-xs font-black text-sky-900">25 min</div>
              <div className="text-[10px] font-semibold text-slate-700">Estudio total</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100">
              <div className="text-xs font-black text-emerald-900">5 min</div>
              <div className="text-[10px] font-semibold text-slate-700">Descanso corto</div>
            </div>
            <div className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100">
              <div className="text-xs font-black text-indigo-900">15-30 min</div>
              <div className="text-[10px] font-semibold text-slate-700">Descanso largo</div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};
