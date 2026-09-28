import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, User, Calendar, Mail, Lock, Eye, EyeOff, Save, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { RegisterFormState, UserProfile } from '../types';

interface ScreenRegisterProps {
  onBack: () => void;
  onRegisterSuccess: (user: UserProfile) => void;
}

export const ScreenRegister: React.FC<ScreenRegisterProps> = ({
  onBack,
  onRegisterSuccess,
}) => {
  const [form, setForm] = useState<RegisterFormState>({
    name: '',
    birthdate: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!form.name.trim()) {
      setErrorMessage('Por favor, ingresa tu nombre.');
      return;
    }
    if (!form.birthdate) {
      setErrorMessage('Por favor, ingresa tu fecha de cumpleaños.');
      return;
    }
    if (!form.email.trim()) {
      setErrorMessage('Por favor, ingresa tu correo electrónico.');
      return;
    }
    if (!form.password || form.password.length < 4) {
      setErrorMessage('La contraseña debe tener al menos 4 caracteres.');
      return;
    }

    setIsSaving(true);

    const newUser: UserProfile = {
      name: form.name.trim(),
      birthdate: form.birthdate,
      email: form.email.trim(),
      password: form.password,
      registeredAt: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      studyGoal: 'Mantener hábitos constantes',
      avatarMood: 'happy',
      fishCookies: 3,
      studyMinutes: 0,
      streakDays: 0,
      studyLogs: [],
    };

    setTimeout(() => {
      setIsSaving(false);
      setSuccessMessage('¡Cuenta creada y datos guardados exitosamente!');
      setTimeout(() => {
        onRegisterSuccess(newUser);
      }, 500);
    }, 400);
  };

  return (
    <motion.div
      id="screen-register"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col justify-between h-full px-6 py-6 text-slate-800 bg-gradient-to-b from-sky-50 via-white to-blue-50/60 select-none overflow-y-auto"
    >
      {/* Top Bar with Back Button */}
      <div className="w-full flex items-center justify-between pt-1">
        <button
          id="btn-register-back"
          onClick={onBack}
          aria-label="Volver"
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/90 border border-slate-200 shadow-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-blue-950">Crear cuenta</h2>
        <div className="w-10" />
      </div>

      {/* Center Registration Form */}
      <div className="my-auto w-full max-w-sm mx-auto py-4">
        <div className="mb-5 text-center">
          <div className="inline-flex items-center gap-1 px-3 py-1 mb-1 rounded-full bg-blue-100/70 border border-blue-200/60 text-blue-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Perfil de Estudiante</span>
          </div>
          <p className="text-xs text-slate-700">
            Completa tus datos para personalizar tus metas de estudio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nombre */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="register-name-input"
              className="text-sm font-semibold text-slate-900 flex items-center gap-1.5"
            >
              <User className="w-4 h-4 text-blue-600" />
              <span>Nombre</span>
            </label>
            <input
              id="register-name-input"
              type="text"
              required
              placeholder="Tu nombre completo"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (errorMessage) setErrorMessage(null);
              }}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-blue-200/90 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all text-base"
            />
          </div>

          {/* Fecha de cumpleaños */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="register-birthdate-input"
              className="text-sm font-semibold text-slate-900 flex items-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Fecha de cumpleaños</span>
            </label>
            <input
              id="register-birthdate-input"
              type="date"
              required
              value={form.birthdate}
              onChange={(e) => {
                setForm({ ...form, birthdate: e.target.value });
                if (errorMessage) setErrorMessage(null);
              }}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-blue-200/90 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all text-base"
            />
          </div>

          {/* Correo electrónico */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="register-email-input"
              className="text-sm font-semibold text-slate-900 flex items-center gap-1.5"
            >
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Correo electrónico</span>
            </label>
            <input
              id="register-email-input"
              type="email"
              required
              placeholder="estudiante@focusmind.app"
              value={form.email}
              onChange={(e) => {
                setForm({ ...form, email: e.target.value });
                if (errorMessage) setErrorMessage(null);
              }}
              className="w-full px-4 py-3 rounded-2xl bg-white border border-blue-200/90 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all text-base"
            />
          </div>

          {/* Contraseña */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="register-password-input"
              className="text-sm font-semibold text-slate-900 flex items-center gap-1.5"
            >
              <Lock className="w-4 h-4 text-blue-600" />
              <span>Contraseña</span>
            </label>
            <div className="relative">
              <input
                id="register-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Mínimo 4 caracteres"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full pl-4 pr-12 py-3 rounded-2xl bg-white border border-blue-200/90 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all text-base"
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

          {/* Feedback Messages */}
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

          {/* Botón Guardar Información */}
          <motion.button
            id="btn-register-save"
            type="submit"
            disabled={isSaving}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-2 py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-bold text-lg shadow-lg shadow-blue-500/25 flex items-center justify-center gap-3 transition-all cursor-pointer border border-blue-500/40"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Guardar información</span>
              </>
            )}
          </motion.button>
        </form>
      </div>

      {/* Footer Info */}
      <div className="w-full text-center pb-2">
        <p className="text-xs text-slate-700">
          Tu información se guarda de forma segura en tu dispositivo.
        </p>
      </div>
    </motion.div>
  );
};
