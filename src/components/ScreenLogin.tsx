import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, LogIn, CheckCircle2, AlertCircle } from 'lucide-react';
import { LoginFormState, UserProfile } from '../types';

interface ScreenLoginProps {
  onBack: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  savedUsers: UserProfile[];
}

export const ScreenLogin: React.FC<ScreenLoginProps> = ({
  onBack,
  onLoginSuccess,
  savedUsers,
}) => {
  const [form, setForm] = useState<LoginFormState>({
    email: savedUsers.length > 0 ? savedUsers[0].email : '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedEmail = form.email.trim();
    if (!trimmedEmail) {
      setErrorMessage('Por favor, escribe tu correo electrónico.');
      return;
    }
    if (!form.password) {
      setErrorMessage('Por favor, escribe tu contraseña.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Check if user exists in saved list
      const matchedUser = savedUsers.find(
        (u) => u.email.toLowerCase() === trimmedEmail.toLowerCase()
      );

      if (matchedUser) {
        if (matchedUser.password && matchedUser.password !== form.password) {
          setErrorMessage('Contraseña incorrecta. Por favor, verifica tus datos.');
          return;
        }
        setSuccessMessage(`¡Bienvenido de nuevo, ${matchedUser.name}!`);
        setTimeout(() => {
          onLoginSuccess(matchedUser);
        }, 900);
      } else {
        // Allow guest/demo login or create transient profile
        const guestUser: UserProfile = {
          name: trimmedEmail.split('@')[0] || 'Estudiante',
          birthdate: '2005-01-01',
          email: trimmedEmail,
          password: form.password,
          registeredAt: new Date().toLocaleDateString('es-ES'),
          studyMinutes: 0,
          streakDays: 0,
          studyLogs: [],
          fishCookies: 3,
        };
        setSuccessMessage('¡Inicio de sesión exitoso!');
        setTimeout(() => {
          onLoginSuccess(guestUser);
        }, 400);
      }
    }, 400);
  };

  return (
    <motion.div
      id="screen-login"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col justify-between h-full px-6 py-6 text-slate-800 bg-gradient-to-b from-sky-50 via-white to-blue-50/60 select-none overflow-y-auto"
    >
      {/* Top Bar with Back Button */}
      <div className="w-full flex items-center justify-between pt-1">
        <button
          id="btn-login-back"
          onClick={onBack}
          aria-label="Volver"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/90 border border-slate-200 shadow-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-blue-950">Iniciar sesión</h2>
        <div className="w-10" />
      </div>

      {/* Center Form Content */}
      <div className="my-auto w-full max-w-sm mx-auto py-6">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-blue-100/90 text-blue-700 flex items-center justify-center border border-blue-200/80 shadow-sm">
            <LogIn className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-600">
            Ingresa tus credenciales para continuar con FocusMind
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Correo Electrónico */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-email-input"
              className="text-sm font-semibold text-slate-900 flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Correo electrónico</span>
            </label>
            <div className="relative">
              <input
                id="login-email-input"
                type="email"
                required
                placeholder="ejemplo@estudiante.edu"
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full px-4 py-3.5 rounded-2xl bg-white border border-blue-200/90 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all text-base"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="login-password-input"
              className="text-sm font-semibold text-slate-900 flex items-center gap-1.5"
            >
              <Lock className="w-4 h-4 text-blue-600" />
              <span>Contraseña</span>
            </label>
            <div className="relative">
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full pl-4 pr-12 py-3.5 rounded-2xl bg-white border border-blue-200/90 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all text-base"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Alerts / Feedback */}
          <AnimatePresence mode="wait">
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            id="btn-login-submit"
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-2 py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-bold text-lg shadow-lg shadow-blue-500/25 flex items-center justify-center gap-3 transition-all cursor-pointer border border-blue-500/40"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Iniciar sesión</span>
              </>
            )}
          </motion.button>
        </form>
      </div>

      {/* Bottom Hint */}
      <div className="w-full text-center pb-2">
        <p className="text-xs text-slate-700">
          FocusMind • Tu compañero de hábitos y productividad
        </p>
      </div>
    </motion.div>
  );
};
