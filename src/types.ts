export type AppScreen =
  | 'welcome'                // Screen 1
  | 'access'                 // Screen 2
  | 'login'                  // Screen 3
  | 'register'               // Screen 4
  | 'screen5_dashboard'      // Screen 5
  | 'screen6_settings'       // Screen 6
  | 'screen8_weekly_challenge' // Screen 8
  | 'screen9_forgot_password' // Screen 9
  | 'screen10_pomodoro';     // Screen 10

export type MascotMood =
  | 'neutral'      // 1. 😐 Neutral / esperando
  | 'completed'    // 2. 😲 Tarea completada / sorprendido
  | 'sleeping'     // 3. 😴 Inactivo / durmiendo
  | 'bored'        // 4. 😒 Aburrido
  | 'frustrated'   // 5. 😤 Molesto / frustrado
  | 'confused'     // 6. 🤨 Confundido
  | 'focused'      // 7. 🧐 Concentrado / estudiando
  | 'impatient'    // 8. 🙄 Impaciente
  | 'proud';       // 9. 😎 Satisfecho / orgulloso

export interface StudyLogEntry {
  id: string;
  title: string;
  minutes: number;
  date: string;
  type: 'pomodoro' | 'task' | 'manual';
}

export interface UserProfile {
  name: string;
  birthdate: string;
  email: string;
  password?: string;
  registeredAt?: string;
  studyGoal?: string;
  avatarMood?: MascotMood | 'happy' | 'waiting';
  securityQuestion?: string;
  securityAnswer?: string;
  fishCookies?: number;
  studyMinutes?: number;
  streakDays?: number;
  studyLogs?: StudyLogEntry[];
}

export interface LoginFormState {
  email: string;
  password: string;
}

export interface RegisterFormState {
  name: string;
  birthdate: string;
  email: string;
  password: string;
  securityQuestion?: string;
  securityAnswer?: string;
}

export interface StudyTask {
  id: string;
  title: string;
  category: string;
  date: string; // YYYY-MM-DD
  timeEstimate: string;
  completed: boolean;
  notes?: string;
}

export interface DailyChallenge {
  id: string;
  day: string; // 'Lunes' | 'Martes' | ...
  title: string;
  rewardCookies: number;
  completed: boolean;
  description: string;
}

export interface BlockedApp {
  id: string;
  name: string;
  iconName: 'tiktok' | 'facebook' | 'instagram' | 'whatsapp' | 'twitter';
  blocked: boolean;
  category: string;
}
