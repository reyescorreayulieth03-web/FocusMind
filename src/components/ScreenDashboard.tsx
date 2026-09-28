import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Calendar, 
  Mail, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Plus, 
  LogOut, 
  Sparkles, 
  Check, 
  Trash2,
  Trophy,
  Flame,
  BarChart3
} from 'lucide-react';
import { UserProfile } from '../types';
import { MascotArtwork } from './MascotArtwork';

interface ScreenDashboardProps {
  user: UserProfile;
  onLogout: () => void;
  onNavigateToScreen: (screen: 'welcome' | 'access' | 'login' | 'register') => void;
}

interface TaskItem {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  timeEstimate: string;
}

export const ScreenDashboard: React.FC<ScreenDashboardProps> = ({
  user,
  onLogout,
  onNavigateToScreen,
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'profile'>('tasks');
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [streakDays] = useState(0);

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const newTask: TaskItem = {
      id: Date.now().toString(),
      title: newTaskInput.trim(),
      category: 'Estudio',
      completed: false,
      timeEstimate: '25m',
    };
    setTasks([newTask, ...tasks]);
    setNewTaskInput('');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <motion.div
      id="screen-dashboard"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col h-full bg-slate-50 text-slate-800 select-none overflow-hidden"
    >
      {/* Top Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 text-white px-5 pt-4 pb-4 rounded-b-3xl shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white shadow-sm overflow-hidden">
              <MascotArtwork type="happy" className="w-9 h-9" />
            </div>
            <div>
              <div className="text-xs text-blue-100 font-medium">Panel de Estudiante</div>
              <h2 className="text-lg font-extrabold tracking-tight">{user.name}</h2>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Cerrar sesión"
            className="p-2 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-white border border-white/20 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Motivational Card */}
        <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold text-blue-100 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>Racha de constancia</span>
            </div>
            <div className="text-xl font-extrabold text-white">
              {streakDays} {streakDays === 1 ? 'día' : 'días'} <span className="text-xs font-normal text-blue-100">seguidos</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-blue-100">Meta Diaria</div>
            <div className="text-sm font-bold text-white">{completedCount}/{tasks.length} tareas</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 px-5 pt-3 pb-1">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'tasks'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Mis Tareas & Hábitos</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'profile'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Datos Guardados</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-5 py-3 overflow-y-auto space-y-4">
        {activeTab === 'tasks' ? (
          <>
            {/* Progress bar */}
            <div className="bg-white p-3.5 rounded-2xl border border-blue-100 shadow-xs">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1">
                  <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                  Progreso de hoy
                </span>
                <span className="text-blue-600">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full"
                />
              </div>
            </div>

            {/* Add Task Form */}
            <form onSubmit={addTask} className="flex gap-2">
              <input
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                placeholder="Nueva tarea o hábito de estudio..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-blue-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
              <button
                type="submit"
                className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar</span>
              </button>
            </form>

            {/* Task List */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tareas programadas ({tasks.length})
              </div>

              <AnimatePresence>
                {tasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      task.completed
                        ? 'bg-blue-50/50 border-blue-100 text-slate-500'
                        : 'bg-white border-slate-200 shadow-xs text-slate-800'
                    }`}
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        task.completed
                          ? 'bg-blue-600 text-white'
                          : 'border-2 border-slate-300 hover:border-blue-500 bg-white'
                      }`}
                    >
                      {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>

                    <div className="flex-1 min-w-0" onClick={() => toggleTask(task.id)}>
                      <p
                        className={`text-xs font-semibold leading-tight cursor-pointer ${
                          task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-100/70 text-blue-700 font-medium">
                          {task.category}
                        </span>
                        <span className="text-[10px] text-slate-700 flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> {task.timeEstimate}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-300 hover:text-red-500 p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        ) : (
          /* Profile & Saved Data Tab */
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-blue-100 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900 border-b border-slate-100 pb-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Información del Estudiante Guardada</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-start justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-500" /> Nombre
                  </span>
                  <span className="font-semibold text-slate-900 text-right">{user.name}</span>
                </div>

                <div className="flex items-start justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" /> Fecha de cumpleaños
                  </span>
                  <span className="font-semibold text-slate-900 text-right">{user.birthdate}</span>
                </div>

                <div className="flex items-start justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-500" /> Correo electrónico
                  </span>
                  <span className="font-semibold text-slate-900 text-right truncate max-w-[180px]">{user.email}</span>
                </div>

                {user.registeredAt && (
                  <div className="flex items-start justify-between py-1">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Registrado el
                    </span>
                    <span className="font-medium text-slate-700 text-right">{user.registeredAt}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation back to other screens */}
            <div className="bg-sky-50/70 p-3.5 rounded-2xl border border-sky-200/70 space-y-2">
              <div className="text-xs font-bold text-sky-950">Navegación de prueba</div>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                <button
                  onClick={() => onNavigateToScreen('welcome')}
                  className="p-2 rounded-xl bg-white border border-sky-200 text-sky-900 hover:bg-sky-100 transition-colors"
                >
                  Ver Screen 1
                </button>
                <button
                  onClick={() => onNavigateToScreen('access')}
                  className="p-2 rounded-xl bg-white border border-sky-200 text-sky-900 hover:bg-sky-100 transition-colors"
                >
                  Ver Screen 2
                </button>
                <button
                  onClick={() => onNavigateToScreen('login')}
                  className="p-2 rounded-xl bg-white border border-sky-200 text-sky-900 hover:bg-sky-100 transition-colors"
                >
                  Ver Screen 3
                </button>
                <button
                  onClick={() => onNavigateToScreen('register')}
                  className="p-2 rounded-xl bg-white border border-sky-200 text-sky-900 hover:bg-sky-100 transition-colors"
                >
                  Ver Screen 4
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Quote */}
      <div className="bg-white border-t border-slate-100 px-5 py-2.5 text-center">
        <p className="text-[11px] font-medium text-slate-500 italic">
          “El secreto del éxito es ser constante”
        </p>
      </div>
    </motion.div>
  );
};
