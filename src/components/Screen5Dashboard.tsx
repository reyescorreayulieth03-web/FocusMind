import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, 
  Heart, 
  Clock, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Check, 
  Trash2, 
  Calendar as CalendarIcon, 
  X,
  Fish,
  Flame,
  Award,
  Sparkles,
  BookOpen,
  Coffee,
  CheckCircle2,
  CalendarCheck,
  LogOut,
  Smile,
  AlertCircle,
  HelpCircle,
  Timer,
  RotateCcw,
  Trophy
} from 'lucide-react';
import { UserProfile, StudyTask, MascotMood } from '../types';
import { MascotArtwork } from './MascotArtwork';
import { getRandomDialogue } from '../data/mascotSystem';

interface Screen5DashboardProps {
  user: UserProfile;
  onGoToSettings: () => void; // Screen 6
  onGoToPomodoro?: () => void; // Screen 10
  onGoToWeeklyChallenge?: () => void; // Screen 8
  onUpdateUser: (updatedUser: UserProfile) => void;
  tasks: StudyTask[];
  onAddTask: (task: StudyTask) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onLogout: () => void;
}

export const Screen5Dashboard: React.FC<Screen5DashboardProps> = ({
  user,
  onGoToSettings,
  onGoToPomodoro,
  onGoToWeeklyChallenge,
  onUpdateUser,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onLogout,
}) => {
  // Navigation & Modals
  const [activeModal, setActiveModal] = useState<'none' | 'pet' | 'study_log' | 'profile' | 'new_task'>('none');

  // Mascot Behavior State
  const [mascotMood, setMascotMood] = useState<MascotMood>('neutral');
  const [mascotDialogue, setMascotDialogue] = useState<string>(
    tasks.length === 0
      ? '¡Bienvenido! Aún no tienes tareas ni notas escritas. Pulsa "+ Nueva nota" para empezar.'
      : 'Bueno... ¿vas a empezar o solo vas a mirar la pantalla?'
  );
  const [selectedPetDetailMood, setSelectedPetDetailMood] = useState<MascotMood>('neutral');

  // Calendar State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // New Task Form State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('25 min');
  const [newTaskDate, setNewTaskDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [newTaskNotes, setNewTaskNotes] = useState('');

  // Pet Feeding State
  const [petHappyEffect, setPetHappyEffect] = useState(false);
  const [fedCount, setFedCount] = useState(0);

  // Inactivity / Idle Timer Handler
  const lastActivityRef = useRef<number>(Date.now());
  const isSleepingRef = useRef<boolean>(false);

  useEffect(() => {
    const handleUserActivity = () => {
      const now = Date.now();
      const inactiveDuration = now - lastActivityRef.current;
      lastActivityRef.current = now;

      // If he was sleeping and user interacts, wake up with sarcastic greeting
      if (isSleepingRef.current || inactiveDuration > 70000) {
        isSleepingRef.current = false;
        setMascotMood('sleeping');
        setMascotDialogue('Ah... ya regresaste. Bueno, ya estás aquí. ¿Empezamos?');
        setTimeout(() => {
          setMascotMood('neutral');
          setMascotDialogue(getRandomDialogue('neutral'));
        }, 5000);
      }
    };

    window.addEventListener('click', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    // Periodic idle checker
    const interval = setInterval(() => {
      const idleTime = Date.now() - lastActivityRef.current;
      const pendingTasksCount = tasks.filter(t => !t.completed).length;

      if (idleTime > 80000 && !isSleepingRef.current) {
        // 80s+ -> Sleeping
        isSleepingRef.current = true;
        setMascotMood('sleeping');
        setMascotDialogue(getRandomDialogue('sleeping'));
      } else if (idleTime > 45000 && !isSleepingRef.current && pendingTasksCount > 0) {
        // 45s+ with pending tasks -> Impatient
        setMascotMood('impatient');
        setMascotDialogue(getRandomDialogue('impatient'));
      } else if (idleTime > 25000 && !isSleepingRef.current) {
        // 25s+ without doing tasks -> Bored
        setMascotMood('bored');
        setMascotDialogue(
          tasks.length === 0
            ? '¿Aún no has escrito tus tareas? Pulsa "+ Nueva nota" para empezar.'
            : getRandomDialogue('bored')
        );
      }
    }, 10000);

    return () => {
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      clearInterval(interval);
    };
  }, [tasks]);

  // Calendar Generation
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Days in month
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon ...
  const startingOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // convert Mon to 0
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Filter tasks for selected date
  const filteredTasks = tasks.filter(t => t.date === selectedDateStr);
  const totalCompletedCount = tasks.filter(t => t.completed).length;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setMascotMood('confused');
      setMascotDialogue(getRandomDialogue('confused'));
      return;
    }

    const newTask: StudyTask = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      category: newTaskCategory.trim() || 'Estudio General',
      date: newTaskDate,
      timeEstimate: newTaskTime,
      completed: false,
      notes: newTaskNotes.trim() || undefined,
    };

    onAddTask(newTask);
    setNewTaskTitle('');
    setNewTaskCategory('');
    setNewTaskNotes('');
    setActiveModal('none');

    // Reaction when task added
    setMascotMood('neutral');
    setMascotDialogue('Guardada. A ver si esta vez sí la haces.');
  };

  const handleToggleTaskWithReaction = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const willBeCompleted = !task.completed;
    onToggleTask(id);

    // Calculate minutes from timeEstimate (e.g. '25 min', '45 min', '15 min', '60 min', '1 hora', etc.)
    let taskMinutes = 25;
    if (task.timeEstimate) {
      const match = task.timeEstimate.match(/(\d+)/);
      if (match) {
        taskMinutes = parseInt(match[1], 10);
      } else if (task.timeEstimate.toLowerCase().includes('hora')) {
        taskMinutes = 60;
      }
    }

    const currentMinutes = user.studyMinutes || 0;
    const currentLogs = user.studyLogs || [];

    if (willBeCompleted) {
      const newMinutes = currentMinutes + taskMinutes;
      const newLog = {
        id: `task-log-${Date.now()}`,
        title: `Tarea: ${task.title}`,
        minutes: taskMinutes,
        date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        type: 'task' as const,
      };

      const updatedUser: UserProfile = {
        ...user,
        studyMinutes: newMinutes,
        studyLogs: [newLog, ...currentLogs].slice(0, 50),
      };

      // Check if all today's tasks are done
      const remaining = filteredTasks.filter((t) => t.id !== id && !t.completed);
      if (remaining.length === 0 && filteredTasks.length > 0) {
        setMascotMood('proud');
        setMascotDialogue(getRandomDialogue('proud'));
        if ((user.streakDays || 0) === 0) {
          updatedUser.streakDays = 1;
        }
      } else {
        setMascotMood('completed');
        setMascotDialogue(getRandomDialogue('completed'));
      }
      onUpdateUser(updatedUser);
    } else {
      // Uncompleted: deduct study minutes and remove log
      const newMinutes = Math.max(0, currentMinutes - taskMinutes);
      const filteredLogs = currentLogs.filter((l) => !l.title.includes(task.title));
      onUpdateUser({
        ...user,
        studyMinutes: newMinutes,
        studyLogs: filteredLogs,
      });
      setMascotMood('neutral');
      setMascotDialogue('Desmarcada. Tienes cosas pendientes.');
    }
  };

  const handleDeleteTaskWithReaction = (id: string) => {
    onDeleteTask(id);
    setMascotMood('frustrated');
    setMascotDialogue(getRandomDialogue('frustrated'));
  };

  const handleFeedPet = () => {
    const currentCookies = user.fishCookies || 0;
    if (currentCookies <= 0) return;

    const updatedUser = {
      ...user,
      fishCookies: currentCookies - 1,
    };
    onUpdateUser(updatedUser);
    setFedCount(prev => prev + 1);
    setPetHappyEffect(true);
    setMascotMood('proud');
    setMascotDialogue('Mmh... gracias por la galleta. Supongo que te ganaste un descanso.');

    setTimeout(() => {
      setPetHappyEffect(false);
      setMascotMood('neutral');
      setMascotDialogue(getRandomDialogue('neutral'));
    }, 2500);
  };

  const allMoodKeys: MascotMood[] = [
    'neutral',
    'completed',
    'sleeping',
    'bored',
    'frustrated',
    'confused',
    'focused',
    'impatient',
    'proud'
  ];

  return (
    <div
      id="screen-5-dashboard"
      className="flex flex-col h-full bg-gradient-to-b from-sky-50/70 via-white to-blue-50/50 text-slate-800 select-none overflow-hidden relative"
    >
      {/* 1. TOP BAR WITH 4 REQUIRED BUTTONS */}
      <header className="px-4 pt-3 pb-3 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-xs z-20 shrink-0">
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {/* Left Group: Configuración, Mascota, Registro de estudio */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {/* Botón: Configuración */}
            <button
              id="btn-nav-configuracion"
              onClick={onGoToSettings}
              aria-label="Abrir Configuración"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200/80 font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Settings className="w-3.5 h-3.5 text-blue-600" />
              <span>Configuración</span>
            </button>

            {/* Botón: Retos Semanales */}
            <button
              id="btn-nav-retos"
              onClick={onGoToWeeklyChallenge || onGoToSettings}
              aria-label="Ver Retos Semanales"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200/80 font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>Retos</span>
              <span className="px-1.5 py-0.2 rounded-full bg-amber-200/70 text-amber-900 text-[10px] font-black">
                25 Retos 🐟
              </span>
            </button>

            {/* Botón: Mascota */}
            <button
              id="btn-nav-mascota"
              onClick={() => {
                setSelectedPetDetailMood(mascotMood);
                setActiveModal('pet');
              }}
              aria-label="Ver Mascota"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-950 border border-sky-200/80 font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Mascota</span>
              {(user.fishCookies || 0) > 0 && (
                <span className="flex items-center gap-0.5 px-1 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">
                  <Fish className="w-2.5 h-2.5 text-amber-600" />
                  {user.fishCookies}
                </span>
              )}
            </button>

            {/* Botón: Registro de estudio */}
            <button
              id="btn-nav-registro-estudio"
              onClick={() => setActiveModal('study_log')}
              aria-label="Ver Registro de estudio"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200/80 font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>Registro de estudio</span>
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-200/70 text-indigo-900 text-[10px] font-black">
                {((user.studyMinutes || 0) / 60).toFixed(1)}h
              </span>
            </button>
          </div>

          {/* Right: Botón Perfil */}
          <button
            id="btn-nav-perfil"
            onClick={() => setActiveModal('profile')}
            aria-label="Ver Perfil"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Perfil</span>
          </button>
        </div>
      </header>

      {/* MAIN SCROLLABLE CONTENT */}
      <main className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-20">
        {/* Welcome Student Greeting Banner */}
        <section aria-label="Resumen de bienvenida" className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 rounded-2xl p-3.5 text-white shadow-sm flex items-center justify-between">
          <div>
            <div className="text-[11px] font-medium text-blue-100 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-200" />
              <span>¡Hola, {user.name.split(' ')[0]}!</span>
            </div>
            <h1 className="text-base font-extrabold tracking-tight">Panel de Hábitos & Estudio</h1>
            <p className="text-[11px] text-blue-100 mt-0.5">
              {tasks.filter(t => !t.completed).length} tareas pendientes en total
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-xl text-xs font-bold border border-white/30">
              <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>{user.streakDays || 0} {user.streakDays === 1 ? 'día' : 'días'}</span>
            </div>
            <span className="text-[10px] text-blue-100 mt-0.5">Constancia</span>
          </div>
        </section>

        {/* COMPAÑERO: OSITO AZUL */}
        <section 
          aria-label="Comportamiento del Osito"
          onClick={() => {
            setSelectedPetDetailMood(mascotMood);
            setActiveModal('pet');
          }}
          className="bg-white rounded-2xl p-3 border border-blue-100 shadow-2xs flex items-center gap-3 cursor-pointer hover:border-blue-300 transition-all group relative overflow-hidden"
        >
          <div className="w-20 h-20 shrink-0 relative flex items-center justify-center">
            <MascotArtwork 
              type={mascotMood} 
              size="sm" 
              className="w-full h-full transform group-hover:scale-105 transition-transform"
            />
          </div>

          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-blue-950">
                Tu Compañero
              </span>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-600 transition-colors flex items-center gap-0.5">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> Mascota
              </span>
            </div>
            
            <div className="bg-sky-50/80 rounded-xl p-2.5 border border-sky-100 relative">
              <p className="text-xs text-slate-700 font-medium leading-snug italic">
                “{mascotDialogue}”
              </p>
            </div>
          </div>
        </section>

        {/* 2. CALENDARIO EN EL CENTRO DE LA PANTALLA */}
        <section id="focusmind-calendar-section" aria-label="Calendario de estudio" className="bg-white rounded-2xl p-3.5 border border-blue-100 shadow-2xs">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-blue-950">
                {monthNames[month]} {year}
              </h2>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={prevMonth}
                aria-label="Mes anterior"
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                aria-label="Mes siguiente"
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-slate-700 mb-1">
            {dayLabels.map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty slots for offset */}
            {Array.from({ length: startingOffset }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-8" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: totalDaysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = selectedDateStr === dateStr;
              const todayStr = new Date().toISOString().split('T')[0];
              const isToday = todayStr === dateStr;

              // Check if any tasks exist on this date
              const dayTasks = tasks.filter(t => t.date === dateStr);
              const hasTasks = dayTasks.length > 0;
              const hasPending = dayTasks.some(t => !t.completed);

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-8 rounded-xl flex flex-col items-center justify-center relative transition-all text-xs font-semibold cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs scale-105 z-10'
                      : isToday
                      ? 'bg-blue-100/80 text-blue-900 font-bold border border-blue-300/80'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <span>{dayNum}</span>

                  {/* Task Indicator Dot */}
                  {hasTasks && (
                    <span
                      className={`absolute bottom-1 w-1 h-1 rounded-full ${
                        isSelected
                          ? 'bg-white'
                          : hasPending
                          ? 'bg-blue-600'
                          : 'bg-emerald-500'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Date Summary */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-700">
            <span className="font-medium flex items-center gap-1">
              <CalendarCheck className="w-3.5 h-3.5 text-blue-600" />
              Fecha: {selectedDateStr}
            </span>
            <span className="font-semibold text-blue-900">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'nota/tarea' : 'notas/tareas'}
            </span>
          </div>
        </section>

        {/* 3. NOTAS DE LAS TAREAS PENDIENTES */}
        <section id="focusmind-tasks-section" aria-label="Tareas pendientes" className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Notas & Tareas Pendientes
              </h2>
            </div>
            <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60">
              {filteredTasks.filter(t => !t.completed).length} por hacer
            </span>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 border border-dashed border-blue-200 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-800">
                  No hay notas ni tareas pendientes
                </p>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Tu lista comienza vacía. Las notas y tareas aparecerán aquí tan pronto como las escribas.
                </p>
              </div>
              <div>
                <button
                  onClick={() => setActiveModal('new_task')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 transition-all cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Escribir primera nota</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {filteredTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      task.completed
                        ? 'bg-blue-50/40 border-blue-100 text-slate-500'
                        : 'bg-white border-blue-100 shadow-2xs text-slate-800'
                    }`}
                  >
                    {/* Checkbox button */}
                    <button
                      onClick={() => handleToggleTaskWithReaction(task.id)}
                      aria-label={task.completed ? 'Marcar incompleta' : 'Marcar completada'}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 mt-0.5 ${
                        task.completed
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'border-2 border-blue-300 hover:border-blue-500 bg-white'
                      }`}
                    >
                      {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    {/* Task details */}
                    <div className="flex-1 min-w-0" onClick={() => handleToggleTaskWithReaction(task.id)}>
                      <h4
                        className={`text-xs font-bold leading-snug cursor-pointer ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </h4>

                      {task.notes && (
                        <p className="text-[11px] text-slate-700 mt-1 leading-relaxed line-clamp-2">
                          {task.notes}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-100/80 text-blue-800">
                          {task.category}
                        </span>
                        <span className="text-[10px] text-slate-700 flex items-center gap-1 font-medium">
                          <Clock className="w-2.5 h-2.5" /> {task.timeEstimate}
                        </span>
                        {task.completed && (
                          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> ¡Completada!
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteTaskWithReaction(task.id)}
                      aria-label={`Eliminar nota ${task.title}`}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </main>

      {/* 4. BOTÓN FIJO EN LA ESQUINA INFERIOR DERECHA: NUEVA NOTA */}
      <div className="absolute bottom-4 right-4 z-30">
        <motion.button
          id="btn-nueva-nota"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveModal('new_task')}
          className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 cursor-pointer border border-blue-500/30"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Nueva nota</span>
        </motion.button>
      </div>

      {/* ================= MODALS ================= */}
      <AnimatePresence>
        {/* MODAL: NUEVA NOTA / TAREA */}
        {activeModal === 'new_task' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-3"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-blue-100 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-blue-950">Crear Nueva Nota de Estudio</h3>
                </div>
                <button
                  onClick={() => setActiveModal('none')}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Título de la tarea o tema a estudiar *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Repasar Capítulo 4 de Biología"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                {/* Materia / Asignatura escrita por el usuario */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-800">
                      Materia *
                    </label>
                    <span className="text-[11px] text-blue-600 font-bold">
                      Escribe la materia que quieras
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Escribe tu materia (ej. Matemáticas, Biología, Filosofía, etc.)"
                    value={newTaskCategory}
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 placeholder:text-slate-400 bg-white"
                  />
                  {/* Sugerencias rápidas para autocompletar con un toque */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="text-[10px] text-slate-500 font-bold">Sugerencias:</span>
                    {['Matemáticas', 'Biología', 'Historia', 'Inglés', 'Química', 'Física', 'Lenguaje', 'Filosofía'].map((mat) => (
                      <button
                        type="button"
                        key={mat}
                        onClick={() => setNewTaskCategory(mat)}
                        className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                          newTaskCategory.toLowerCase() === mat.toLowerCase()
                            ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                            : 'bg-slate-50 hover:bg-blue-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">
                      Tiempo estimado
                    </label>
                    <select
                      value={newTaskTime}
                      onChange={(e) => setNewTaskTime(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 bg-white"
                    >
                      <option value="15 min">15 min</option>
                      <option value="25 min">25 min (Pomodoro)</option>
                      <option value="45 min">45 min</option>
                      <option value="60 min">1 hora</option>
                      <option value="90 min">1.5 horas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-800 mb-1">
                      Fecha programada
                    </label>
                    <input
                      type="date"
                      required
                      value={newTaskDate}
                      onChange={(e) => setNewTaskDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    Detalles / Apuntes adicionales (opcional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Escribe notas clave, páginas a leer o recordatorios..."
                    value={newTaskNotes}
                    onChange={(e) => setNewTaskNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 resize-none"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal('none')}
                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 cursor-pointer"
                  >
                    Guardar nota
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL: INTERACCIÓN Y ALIMENTACIÓN DE LA MASCOTA */}
        {activeModal === 'pet' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-blue-100 space-y-4 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <h3 className="text-base font-bold text-blue-950">Tu Mascota FocusMind</h3>
                </div>
                <button
                  onClick={() => setActiveModal('none')}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Pet Display in live mood */}
              <div className="relative py-2 flex flex-col items-center bg-gradient-to-b from-sky-50 via-white to-sky-50/50 rounded-2xl border border-sky-100 p-4">
                <div className="w-36 h-44 relative flex items-center justify-center">
                  <MascotArtwork 
                    type={petHappyEffect ? 'proud' : mascotMood} 
                    size="md"
                    className="w-full h-full" 
                  />
                </div>

                {petHappyEffect && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: -15, scale: 1.05 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-2 px-3.5 py-1.5 bg-amber-400 text-amber-950 font-extrabold rounded-full text-xs shadow-lg flex items-center gap-1.5"
                  >
                    <span>¡Yummy! +Felicidad ❤️</span>
                  </motion.div>
                )}

                {/* Frase actual del oso */}
                <div className="mt-3 w-full bg-white rounded-2xl p-3 border border-sky-200/80 shadow-xs text-center">
                  <p className="text-xs font-medium text-slate-700 italic">
                    “{mascotDialogue}”
                  </p>
                </div>

                {/* Quick interaction buttons */}
                <div className="mt-2.5 w-full">
                  <button
                    onClick={() => {
                      setMascotMood('proud');
                      setMascotDialogue('Bueno... tampoco te acostumbres a consentirme tanto. ¡A estudiar!');
                      setPetHappyEffect(true);
                      setTimeout(() => setPetHappyEffect(false), 2000);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-950 border border-sky-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>Acariciar a la mascota</span>
                  </button>
                </div>
              </div>

              {/* Feed Pet Section */}
              <div className="bg-amber-50/90 rounded-2xl p-3.5 border border-amber-200/80 text-xs space-y-2.5">
                <div className="flex items-center justify-between font-bold text-amber-950">
                  <span className="text-xs font-extrabold">Galletas de pescado disponibles:</span>
                  <span className="text-sm font-extrabold text-amber-800 flex items-center gap-1 bg-amber-100/90 px-2.5 py-1 rounded-xl">
                    <Fish className="w-4 h-4 text-amber-600" />
                    {user.fishCookies || 0}
                  </span>
                </div>
                <button
                  disabled={(user.fishCookies || 0) <= 0}
                  onClick={handleFeedPet}
                  className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-amber-950 font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Fish className="w-4 h-4" />
                  <span>{(user.fishCookies || 0) > 0 ? 'Alimentar con galleta de pescado (-1)' : 'Sin galletas de pescado'}</span>
                </button>

                {onGoToWeeklyChallenge && (
                  <button
                    onClick={() => {
                      setActiveModal('none');
                      onGoToWeeklyChallenge();
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-amber-100/60 text-amber-900 border border-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98"
                  >
                    <Trophy className="w-3.5 h-3.5 text-amber-600" />
                    <span>Ganar galletas en el Reto Semanal (25 Retos 🐟)</span>
                  </button>
                )}
              </div>

              {/* Mascot Companion Stats */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-2xl bg-blue-50/70 border border-blue-100">
                  <div className="text-sm font-black text-blue-900">
                    {user.streakDays || 0} {user.streakDays === 1 ? 'Día' : 'Días'}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-600">Racha de compañía</div>
                </div>
                <div className="p-2.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                  <div className="text-sm font-black text-emerald-900">{totalCompletedCount} Tareas</div>
                  <div className="text-[10px] font-semibold text-slate-600">Completadas juntos</div>
                </div>
              </div>

              {/* Information Link Notice -> Redirects to Configuración */}
              <div className="p-3 bg-indigo-50/80 rounded-2xl border border-indigo-100 flex items-center justify-between gap-2">
                <div className="text-[11px] text-indigo-950 font-medium">
                  <span className="font-bold block text-indigo-900">¿Quieres conocer más sobre tu mascota?</span>
                  Consulta la guía completa en Configuración.
                </div>
                <button
                  onClick={() => {
                    setActiveModal('none');
                    onGoToSettings();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] whitespace-nowrap cursor-pointer shadow-xs transition-all active:scale-95"
                >
                  Ver Guía
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* MODAL: REGISTRO DE ESTUDIO */}
        {activeModal === 'study_log' && (() => {
          const totalMins = user.studyMinutes || 0;
          const studyHours = Math.floor(totalMins / 60);
          const remainingMins = totalMins % 60;
          const decimalHours = (totalMins / 60).toFixed(1);
          const logs = user.studyLogs || [];

          const handleAddQuickMinutes = (mins: number, title: string) => {
            const newMinutes = totalMins + mins;
            const newLog = {
              id: `log-manual-${Date.now()}`,
              title,
              minutes: mins,
              date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
              type: 'manual' as const,
            };
            onUpdateUser({
              ...user,
              studyMinutes: newMinutes,
              studyLogs: [newLog, ...logs].slice(0, 50),
            });
          };

          const handleResetHours = () => {
            if (window.confirm('¿Deseas reiniciar tu contador de horas de estudio a 0?')) {
              onUpdateUser({
                ...user,
                studyMinutes: 0,
                studyLogs: [],
              });
            }
          };

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-blue-100 space-y-3.5 max-h-[92vh] overflow-y-auto"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <div>
                      <h3 className="text-base font-bold text-blue-950 leading-tight">Registro de Estudio</h3>
                      <p className="text-[11px] text-slate-500">Comienza desde cero y suma tus horas</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveModal('none')}
                    aria-label="Cerrar modal"
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Big Stat Counters: Starts strictly from 0 */}
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/70 border border-blue-100/90 shadow-2xs">
                    <div className="text-2xl font-black text-blue-900 tracking-tight">
                      {decimalHours} <span className="text-sm font-bold text-blue-600">h</span>
                    </div>
                    <div className="text-[11px] font-bold text-blue-950 mt-0.5">
                      Horas de estudio
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {studyHours}h {remainingMins}m ({totalMins} min)
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/70 border border-emerald-100/90 shadow-2xs">
                    <div className="text-2xl font-black text-emerald-900 tracking-tight">
                      {totalCompletedCount}
                    </div>
                    <div className="text-[11px] font-bold text-emerald-950 mt-0.5">
                      Tareas logradas
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {tasks.length - totalCompletedCount} pendientes
                    </div>
                  </div>
                </div>

                {/* Progress / Status Explanation Banner */}
                {totalMins === 0 ? (
                  <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200/70 text-xs text-blue-950 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-blue-900">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Tu registro inicia en 0 horas</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Al completar tareas o sesiones Pomodoro, el sistema irá contabilizando automáticamente cada hora y minuto de estudio enfocado.
                    </p>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-2xl bg-indigo-50/80 border border-indigo-200/70 text-xs text-indigo-950 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="text-[11px] font-semibold">
                        Llevas <strong>{decimalHours} horas ({totalMins} min)</strong> de estudio acumuladas.
                      </span>
                    </div>
                  </div>
                )}

                {/* Quick Add / Acciones de estudio */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                    <span>Sumar tiempo de estudio:</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      onClick={() => handleAddQuickMinutes(15, 'Repaso rápido (15 min)')}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-800 hover:text-blue-900 text-center font-bold text-[11px] border border-slate-200/80 transition-all cursor-pointer active:scale-95"
                    >
                      +15m
                    </button>
                    <button
                      onClick={() => handleAddQuickMinutes(25, 'Bloque Pomodoro (25 min)')}
                      className="p-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[11px] border border-blue-200 transition-all cursor-pointer active:scale-95"
                    >
                      +25m
                    </button>
                    <button
                      onClick={() => handleAddQuickMinutes(45, 'Sesión de lectura (45 min)')}
                      className="p-1.5 rounded-xl bg-slate-100 hover:bg-blue-100 text-slate-800 hover:text-blue-900 text-center font-bold text-[11px] border border-slate-200/80 transition-all cursor-pointer active:scale-95"
                    >
                      +45m
                    </button>
                    <button
                      onClick={() => handleAddQuickMinutes(60, 'Bloque intensivo (1 hora)')}
                      className="p-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-[11px] border border-indigo-200 transition-all cursor-pointer active:scale-95"
                    >
                      +1h
                    </button>
                  </div>
                </div>

                {/* Pomodoro shortcut */}
                {onGoToPomodoro && (
                  <button
                    onClick={() => {
                      setActiveModal('none');
                      onGoToPomodoro();
                    }}
                    className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
                  >
                    <Timer className="w-3.5 h-3.5" />
                    <span>Iniciar Temporizador Pomodoro</span>
                  </button>
                )}

                {/* Historial de sesiones de estudio */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
                    <span>Historial de sesiones:</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {logs.length} {logs.length === 1 ? 'registro' : 'registros'}
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {logs.length === 0 ? (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center text-slate-500 text-xs">
                        No hay sesiones registradas aún. Completa una tarea o sesión Pomodoro para comenzar a sumar.
                      </div>
                    ) : (
                      logs.map((log) => (
                        <div
                          key={log.id}
                          className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/70 flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <div className="truncate">
                              <div className="font-semibold text-slate-800 truncate leading-tight">
                                {log.title}
                              </div>
                              <div className="text-[10px] text-slate-400">{log.date}</div>
                            </div>
                          </div>
                          <span className="font-extrabold text-blue-700 whitespace-nowrap text-[11px]">
                            +{log.minutes} min
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="pt-2 flex items-center gap-2 border-t border-slate-100">
                  {totalMins > 0 && (
                    <button
                      onClick={handleResetHours}
                      className="px-3 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reiniciar</span>
                    </button>
                  )}
                  <button
                    onClick={() => setActiveModal('none')}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer shadow-xs transition-all active:scale-95"
                  >
                    Cerrar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}

        {/* MODAL: PERFIL */}
        {activeModal === 'profile' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-blue-100 space-y-4"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-blue-600" />
                  <h3 className="text-base font-bold text-blue-950">Perfil del Estudiante</h3>
                </div>
                <button
                  onClick={() => setActiveModal('none')}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-3 p-3 bg-blue-50/70 rounded-2xl border border-blue-100">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-bold text-blue-950">{user.name}</div>
                  <div className="text-[11px] text-slate-500 font-medium">{user.email}</div>
                  <div className="text-[10px] text-blue-700 font-semibold mt-0.5">
                    Nacimiento: {user.birthdate}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-600 font-medium">Meta de estudio:</span>
                  <span className="font-bold text-blue-900">{user.studyGoal || '2 horas / día'}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-600 font-medium">Galletas ganadas:</span>
                  <span className="font-bold text-amber-600 flex items-center gap-1">
                    <Fish className="w-3.5 h-3.5" /> {user.fishCookies || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-600 font-medium">Racha de constancia:</span>
                  <span className="font-bold text-amber-600 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {user.streakDays || 0} {user.streakDays === 1 ? 'día' : 'días'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={onLogout}
                  className="flex-1 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar sesión</span>
                </button>
                <button
                  onClick={() => setActiveModal('none')}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
                >
                  Aceptar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
