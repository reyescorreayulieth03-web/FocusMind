import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { AppScreen, UserProfile, StudyTask } from './types';
import { ScreenWelcome } from './components/ScreenWelcome';
import { ScreenAccess } from './components/ScreenAccess';
import { ScreenLogin } from './components/ScreenLogin';
import { ScreenRegister } from './components/ScreenRegister';
import { Screen5Dashboard } from './components/Screen5Dashboard';
import { Screen6Settings } from './components/Screen6Settings';
import { Screen8WeeklyChallenge } from './components/Screen8WeeklyChallenge';
import { Screen9ForgotPassword } from './components/Screen9ForgotPassword';
import { Screen10Pomodoro } from './components/Screen10Pomodoro';

const STORAGE_IS_LOGGED_IN_KEY = 'focusmind_is_logged_in';
const STORAGE_USERS_KEY = 'focusmind_saved_users';
const STORAGE_CURRENT_USER_KEY = 'focusmind_current_user';
const STORAGE_TASKS_KEY = 'focusmind_study_tasks';

export default function App() {
  // Check persisted auth session on launch
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_IS_LOGGED_IN_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // If user is already authenticated, land DIRECTLY on Screen 5 (Dashboard)
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(() => {
    try {
      const isAuth = localStorage.getItem(STORAGE_IS_LOGGED_IN_KEY) === 'true';
      return isAuth ? 'screen5_dashboard' : 'welcome';
    } catch {
      return 'welcome';
    }
  });

  const [savedUsers, setSavedUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    name: 'Sofía Martínez',
    birthdate: '2004-05-18',
    email: 'sofia@estudiante.edu',
    password: 'estudio123',
    registeredAt: '28 de agosto de 2026',
    studyGoal: 'Mejorar hábitos diarios',
    avatarMood: 'happy',
    securityQuestion: '¿Cuál es tu color favorito?',
    securityAnswer: 'Azul',
    fishCookies: 5,
    studyMinutes: 0,
    streakDays: 0,
    studyLogs: [],
  });

  const [tasks, setTasks] = useState<StudyTask[]>([]);

  // Helper to remove any old mock/dummy tasks from storage
  const sanitizeTasks = (taskList: unknown): StudyTask[] => {
    if (!Array.isArray(taskList)) return [];
    return taskList.filter((t: StudyTask) => {
      if (!t || typeof t !== 'object' || !t.id || !t.title) return false;
      const isOldMockId = ['task-1', 'task-2', 'task-3'].includes(t.id) || t.id.startsWith('task-');
      const isOldMockTitle = [
        'Repaso de Matemáticas (Álgebra lineal)',
        'Resumen de Historia Universal',
        'Lectura de Biología Celular',
        'Organizar mi primera sesión de estudio',
        'Repaso de apuntes y lectura',
      ].includes(t.title);
      return !isOldMockId && !isOldMockTitle;
    });
  };

  // Load saved users, current user, tasks, and auth state from localStorage
  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem(STORAGE_USERS_KEY);
      if (storedUsers) {
        setSavedUsers(JSON.parse(storedUsers));
      } else {
        const initialUser: UserProfile = {
          name: 'Sofía Martínez',
          birthdate: '2004-05-18',
          email: 'sofia@estudiante.edu',
          password: 'estudio123',
          registeredAt: '28 de agosto de 2026',
          studyGoal: 'Mejorar hábitos diarios',
          avatarMood: 'happy',
          securityQuestion: '¿Cuál es tu color favorito?',
          securityAnswer: 'Azul',
          fishCookies: 5,
          studyMinutes: 0,
          streakDays: 0,
          studyLogs: [],
        };
        setSavedUsers([initialUser]);
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify([initialUser]));
      }

      const activeSession = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      if (activeSession) {
        const parsed = JSON.parse(activeSession);
        const resolvedUser: UserProfile = {
          ...parsed,
          studyMinutes: typeof parsed.studyMinutes === 'number' ? parsed.studyMinutes : 0,
          streakDays: typeof parsed.streakDays === 'number' ? parsed.streakDays : 0,
          studyLogs: Array.isArray(parsed.studyLogs) ? parsed.studyLogs : [],
        };
        setCurrentUser(resolvedUser);

        // Load tasks specifically scoped to active user
        if (parsed.email) {
          const userTasksKey = `focusmind_tasks_${parsed.email.toLowerCase()}`;
          const storedUserTasks = localStorage.getItem(userTasksKey);
          if (storedUserTasks) {
            const cleaned = sanitizeTasks(JSON.parse(storedUserTasks));
            setTasks(cleaned);
            localStorage.setItem(userTasksKey, JSON.stringify(cleaned));
            localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(cleaned));
          } else {
            setTasks([]);
            localStorage.setItem(userTasksKey, JSON.stringify([]));
            localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify([]));
          }
        } else {
          setTasks([]);
        }
      } else {
        setTasks([]);
        localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify([]));
      }

      const storedAuth = localStorage.getItem(STORAGE_IS_LOGGED_IN_KEY);
      if (storedAuth === 'true') {
        setIsAuthenticated(true);
      }
    } catch (e) {
      console.error('Error loading data from localStorage:', e);
      setTasks([]);
    }
  }, []);

  // Save new user profile from Registration screen and mark as logged in with everything saved
  const handleRegisterSuccess = (newUser: UserProfile) => {
    try {
      const enrichedUser: UserProfile = {
        ...newUser,
        securityQuestion: newUser.securityQuestion || '¿Cuál es tu color favorito?',
        securityAnswer: newUser.securityAnswer || 'Azul',
        fishCookies: 3,
        studyMinutes: 0, // Inicia estrictamente en cero
        streakDays: 0,   // Inicia en cero
        studyLogs: [],   // Inicia en cero
      };

      const updatedList = [enrichedUser, ...savedUsers.filter((u) => u.email.toLowerCase() !== newUser.email.toLowerCase())];
      setSavedUsers(updatedList);
      setCurrentUser(enrichedUser);
      // Clean start: tasks & notes strictly empty until user writes them
      setTasks([]);
      setIsAuthenticated(true);

      // Persist everything immediately in localStorage
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedList));
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(enrichedUser));
      localStorage.setItem(STORAGE_IS_LOGGED_IN_KEY, 'true');
      localStorage.setItem(`focusmind_tasks_${newUser.email.toLowerCase()}`, JSON.stringify([]));
      localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify([]));

      // Direct navigation to SCREEN 5
      setCurrentScreen('screen5_dashboard');
    } catch (e) {
      console.error('Error saving user to storage:', e);
      setCurrentUser(newUser);
      setTasks([]);
      setIsAuthenticated(true);
      setCurrentScreen('screen5_dashboard');
    }
  };

  // Handle Login success and mark as logged in
  const handleLoginSuccess = (user: UserProfile) => {
    try {
      const resolvedUser: UserProfile = {
        ...user,
        studyMinutes: typeof user.studyMinutes === 'number' ? user.studyMinutes : 0,
        streakDays: typeof user.streakDays === 'number' ? user.streakDays : 0,
        studyLogs: Array.isArray(user.studyLogs) ? user.studyLogs : [],
      };
      setCurrentUser(resolvedUser);
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(resolvedUser));
      localStorage.setItem(STORAGE_IS_LOGGED_IN_KEY, 'true');

      // Load user-specific tasks if existing (sanitizing any old mock tasks), otherwise empty []
      const userTasksKey = `focusmind_tasks_${user.email.toLowerCase()}`;
      const storedUserTasks = localStorage.getItem(userTasksKey);
      if (storedUserTasks) {
        const cleaned = sanitizeTasks(JSON.parse(storedUserTasks));
        setTasks(cleaned);
        localStorage.setItem(userTasksKey, JSON.stringify(cleaned));
        localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(cleaned));
      } else {
        setTasks([]);
        localStorage.setItem(userTasksKey, JSON.stringify([]));
        localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify([]));
      }

      // Direct navigation to SCREEN 5
      setCurrentScreen('screen5_dashboard');
    } catch (e) {
      console.error('Error saving session:', e);
      setCurrentUser(user);
      setTasks([]);
      setIsAuthenticated(true);
      setCurrentScreen('screen5_dashboard');
    }
  };

  // Handle Log Out: User returns to Screen 2 (Acceso) and active tasks are cleared
  const handleLogout = () => {
    try {
      setIsAuthenticated(false);
      setTasks([]);
      localStorage.setItem(STORAGE_IS_LOGGED_IN_KEY, 'false');
      setCurrentScreen('access');
    } catch (e) {
      console.error('Error during logout:', e);
      setIsAuthenticated(false);
      setTasks([]);
      setCurrentScreen('access');
    }
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(updatedUser));
    const updatedList = savedUsers.map((u) => 
      u.email.toLowerCase() === updatedUser.email.toLowerCase() ? updatedUser : u
    );
    setSavedUsers(updatedList);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedList));
  };

  // Task Handlers with user isolation
  const handleAddTask = (newTask: StudyTask) => {
    const updated = [newTask, ...tasks];
    setTasks(updated);
    localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(updated));
    if (currentUser?.email) {
      localStorage.setItem(`focusmind_tasks_${currentUser.email.toLowerCase()}`, JSON.stringify(updated));
    }
  };

  const handleToggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    setTasks(updated);
    localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(updated));
    if (currentUser?.email) {
      localStorage.setItem(`focusmind_tasks_${currentUser.email.toLowerCase()}`, JSON.stringify(updated));
    }
  };

  const handleDeleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(updated));
    if (currentUser?.email) {
      localStorage.setItem(`focusmind_tasks_${currentUser.email.toLowerCase()}`, JSON.stringify(updated));
    }
  };

  return (
    <main className="w-full min-h-[100dvh] h-[100dvh] max-w-md mx-auto flex flex-col bg-white overflow-hidden relative shadow-none sm:shadow-lg sm:border-x sm:border-slate-200">
      <AnimatePresence mode="wait">
        {/* SCREEN 1: BIENVENIDA */}
        {currentScreen === 'welcome' && (
          <ScreenWelcome
            key="screen-welcome"
            onStart={() => setCurrentScreen('access')}
          />
        )}

        {/* SCREEN 2: ACCESO */}
        {currentScreen === 'access' && (
          <ScreenAccess
            key="screen-access"
            onGoToLogin={() => setCurrentScreen('login')}
            onGoToRegister={() => setCurrentScreen('register')}
            onBackToWelcome={() => setCurrentScreen('welcome')}
          />
        )}

        {/* SCREEN 3: LOGIN */}
        {currentScreen === 'login' && (
          <ScreenLogin
            key="screen-login"
            onBack={() => setCurrentScreen('access')}
            onLoginSuccess={handleLoginSuccess}
            savedUsers={savedUsers}
          />
        )}

        {/* SCREEN 4: REGISTRO */}
        {currentScreen === 'register' && (
          <ScreenRegister
            key="screen-register"
            onBack={() => setCurrentScreen('access')}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}

        {/* SCREEN 5: PANTALLA PRINCIPAL */}
        {currentScreen === 'screen5_dashboard' && currentUser && (
          <Screen5Dashboard
            key="screen-5-dashboard"
            user={currentUser}
            onGoToSettings={() => setCurrentScreen('screen6_settings')}
            onGoToPomodoro={() => setCurrentScreen('screen10_pomodoro')}
            onGoToWeeklyChallenge={() => setCurrentScreen('screen8_weekly_challenge')}
            onUpdateUser={handleUpdateUser}
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onLogout={handleLogout}
          />
        )}

        {/* SCREEN 6: CONFIGURACIÓN */}
        {currentScreen === 'screen6_settings' && (
          <Screen6Settings
            key="screen-6-settings"
            onBackToDashboard={() => setCurrentScreen('screen5_dashboard')}
            onGoToWeeklyChallenge={() => setCurrentScreen('screen8_weekly_challenge')}
            onGoToForgotPassword={() => setCurrentScreen('screen9_forgot_password')}
            onGoToPomodoro={() => setCurrentScreen('screen10_pomodoro')}
          />
        )}

        {/* SCREEN 8: RETO SEMANAL */}
        {currentScreen === 'screen8_weekly_challenge' && currentUser && (
          <Screen8WeeklyChallenge
            key="screen-8-weekly-challenge"
            user={currentUser}
            onUpdateUser={handleUpdateUser}
            onBackToSettings={() => setCurrentScreen('screen6_settings')}
            onBackToDashboard={() => setCurrentScreen('screen5_dashboard')}
          />
        )}

        {/* SCREEN 9: OLVIDAR CONTRASEÑA */}
        {currentScreen === 'screen9_forgot_password' && currentUser && (
          <Screen9ForgotPassword
            key="screen-9-forgot-password"
            user={currentUser}
            onUpdateUser={handleUpdateUser}
            onBackToSettings={() => setCurrentScreen('screen6_settings')}
          />
        )}

        {/* SCREEN 10: MÉTODO POMODORO */}
        {currentScreen === 'screen10_pomodoro' && (
          <Screen10Pomodoro
            key="screen-10-pomodoro"
            user={currentUser}
            onUpdateUser={handleUpdateUser}
            onBackToSettings={() => setCurrentScreen('screen6_settings')}
            onBackToDashboard={() => setCurrentScreen('screen5_dashboard')}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
