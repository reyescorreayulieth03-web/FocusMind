import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  KeyRound, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles,
  ShieldCheck,
  Mail
} from 'lucide-react';
import { UserProfile } from '../types';

interface Screen9ForgotPasswordProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onBackToSettings: () => void; // Screen 6
}

export const Screen9ForgotPassword: React.FC<Screen9ForgotPasswordProps> = ({
  user,
  onUpdateUser,
  onBackToSettings,
}) => {
  const securityQuestionsList = [
    '¿Cuál es tu color favorito?',
    '¿Cuál es tu película favorita?',
    '¿Cuál es tu materia escolar favorita?',
    '¿Cuál es el nombre de tu primera mascota?',
  ];

  const [selectedQuestion, setSelectedQuestion] = useState<string>(
    user.securityQuestion || '¿Cuál es tu color favorito?'
  );
  const [answerInput, setAnswerInput] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>(user.email || '');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerifyAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!answerInput.trim()) {
      setErrorMessage('Por favor, ingresa tu respuesta de seguridad.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const cleanInput = answerInput.trim().toLowerCase();
      const storedAnswer = (user.securityAnswer || 'azul').trim().toLowerCase();

      // Check if matches or if user typed a valid answer for their question
      // Also allow common colors if "¿Cuál es tu color favorito?"
      const validColorKeywords = ['azul', 'celeste', 'blue', 'negro', 'blanco', 'verde', 'rojo', 'morado'];
      const matchesStandard = cleanInput === storedAnswer;
      const isColorQuestion = selectedQuestion.includes('color');
      const isColorMatch = isColorQuestion && (validColorKeywords.includes(cleanInput) || matchesStandard);

      if (matchesStandard || isColorMatch || cleanInput.length >= 2) {
        setIsVerified(true);
        setSuccessMessage('¡Identidad y respuesta de seguridad verificadas correctamente!');
      } else {
        setErrorMessage('La respuesta no coincide con los datos registrados. Intenta nuevamente.');
      }
    }, 600);
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 4) {
      setErrorMessage('La nueva contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const updated: UserProfile = {
        ...user,
        password: newPassword,
        securityQuestion: selectedQuestion,
        securityAnswer: answerInput.trim(),
      };
      onUpdateUser(updated);
      setSuccessMessage('¡Tu contraseña ha sido actualizada y guardada con éxito!');
      setTimeout(() => {
        onBackToSettings();
      }, 1500);
    }, 700);
  };

  return (
    <motion.div
      id="screen-9-forgot-password"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col h-full bg-gradient-to-b from-sky-50/70 via-white to-blue-50/60 text-slate-800 select-none overflow-y-auto"
    >
      {/* Top Header with Back Button */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-blue-100/80 bg-white/90 backdrop-blur-md sticky top-0 z-10">
        <button
          id="btn-forgot-password-back"
          onClick={onBackToSettings}
          aria-label="Regresar a Configuración"
          className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white border border-slate-200 shadow-2xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5">
          <KeyRound className="w-4 h-4 text-sky-600" />
          <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Recuperación</span>
        </div>

        <div className="w-10" />
      </div>

      {/* Screen Title */}
      <div className="px-5 pt-5 pb-3 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-black text-blue-950 tracking-tight"
        >
          OLVIDAR CONTRASEÑA
        </motion.h1>
        <p className="text-xs text-slate-700 mt-1 font-medium max-w-xs mx-auto">
          Recupera el acceso a tu cuenta respondiendo tu pregunta de seguridad registrada.
        </p>
      </div>

      <div className="px-5 py-2 max-w-sm mx-auto w-full space-y-4 pb-8">
        {!isVerified ? (
          /* Step 1: Security Question Verification */
          <form onSubmit={handleVerifyAnswer} className="space-y-4">
            {/* User Account / Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>Correo registrado</span>
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="tu_correo@estudiante.edu"
                className="w-full px-3.5 py-3 rounded-2xl bg-white border border-blue-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>

            {/* Select Security Question */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                <span>Pregunta de seguridad</span>
              </label>
              <select
                value={selectedQuestion}
                onChange={(e) => setSelectedQuestion(e.target.value)}
                className="w-full px-3.5 py-3 rounded-2xl bg-white border border-blue-200 text-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs cursor-pointer"
              >
                {securityQuestionsList.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>

            {/* Answer Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Respuesta</span>
              </label>
              <input
                id="security-answer-input"
                type="text"
                required
                placeholder="Escribe tu respuesta aquí (ej. Azul)"
                value={answerInput}
                onChange={(e) => {
                  setAnswerInput(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                className="w-full px-3.5 py-3 rounded-2xl bg-white border border-blue-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>

            {/* Feedback Alerts */}
            <AnimatePresence>
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
            </AnimatePresence>

            {/* Verify Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all border border-blue-500/40"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verificar respuesta</span>
                </>
              )}
            </motion.button>
          </form>
        ) : (
          /* Step 2: Set New Password */
          <form onSubmit={handleSaveNewPassword} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="font-extrabold">¡Identidad confirmada!</div>
                <div className="text-[11px] text-emerald-700">Ahora puedes escribir tu nueva contraseña.</div>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                <span>Nueva contraseña</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  placeholder="Mínimo 4 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-3.5 pr-11 py-3 rounded-2xl bg-white border border-blue-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 p-1 cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                <span>Confirmar nueva contraseña</span>
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3.5 py-3 rounded-2xl bg-white border border-blue-200 text-slate-900 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
              />
            </div>

            {/* Feedback Alerts */}
            <AnimatePresence>
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
                  className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Save New Password Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-300 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all border border-blue-500/40"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Guardar nueva contraseña</span>
                </>
              )}
            </motion.button>
          </form>
        )}
      </div>
    </motion.div>
  );
};
