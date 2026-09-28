import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Trophy, 
  Fish, 
  Check, 
  Sparkles, 
  Calendar, 
  Gift, 
  RotateCcw,
  Flame,
  Star,
  Zap,
  Target,
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UserProfile, DailyChallenge } from '../types';
import { MascotArtwork } from './MascotArtwork';

interface Screen8WeeklyChallengeProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onBackToSettings: () => void;
  onBackToDashboard?: () => void;
}

export interface ExtendedChallenge extends DailyChallenge {
  categoryGroup?: string;
  tierName: string;
  tierBadgeColor: string;
  iconType: 'star' | 'flame' | 'zap' | 'target' | 'trophy';
}

// 25 Core Weekly Challenges (>20 challenges in system, starting strictly from zero)
const DEFAULT_WEEKLY_CHALLENGES: ExtendedChallenge[] = [
  // Grupo 1: Organización y Planificación (+1 🐟)
  {
    id: 'sem-1',
    day: 'Semanal',
    categoryGroup: 'Organización',
    title: '1. Planificar todas las materias y notas de la semana',
    rewardCookies: 1,
    completed: false,
    description: 'Escribe y programa en tu lista al menos una nota o meta de estudio para organizar tus próximos 7 días.',
    tierName: 'Nivel 1 • Inicial (+1 🐟)',
    tierBadgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    iconType: 'star',
  },
  {
    id: 'sem-2',
    day: 'Semanal',
    categoryGroup: 'Organización',
    title: '2. Despejar y ordenar tu espacio de estudio',
    rewardCookies: 1,
    completed: false,
    description: 'Mantén tu escritorio limpio, cuadernos a mano y un vaso de agua antes de iniciar cualquier sesión.',
    tierName: 'Nivel 1 • Inicial (+1 🐟)',
    tierBadgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    iconType: 'star',
  },
  {
    id: 'sem-3',
    day: 'Semanal',
    categoryGroup: 'Organización',
    title: '3. Fijar la gran prioridad académica de la semana',
    rewardCookies: 1,
    completed: false,
    description: 'Identifica cuál es el examen o entrega más importante y dale lugar preferencial en tu agenda.',
    tierName: 'Nivel 1 • Inicial (+1 🐟)',
    tierBadgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    iconType: 'star',
  },
  {
    id: 'sem-4',
    day: 'Semanal',
    categoryGroup: 'Organización',
    title: '4. Auditoría de deberes y fechas de entrega',
    rewardCookies: 1,
    completed: false,
    description: 'Revisa plataformas y cuadernos para asegurar que no se pase por alto ningún plazo escolar.',
    tierName: 'Nivel 1 • Inicial (+1 🐟)',
    tierBadgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    iconType: 'star',
  },
  {
    id: 'sem-5',
    day: 'Semanal',
    categoryGroup: 'Organización',
    title: '5. Separar apuntes y guías por carpetas o materias',
    rewardCookies: 1,
    completed: false,
    description: 'Organiza tus archivos físicos o digitales para encontrar cualquier tema en menos de 30 segundos.',
    tierName: 'Nivel 1 • Inicial (+1 🐟)',
    tierBadgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    iconType: 'star',
  },

  // Grupo 2: Técnicas de Estudio y Comprensión (+2 🐟)
  {
    id: 'sem-6',
    day: 'Semanal',
    categoryGroup: 'Técnicas',
    title: '6. Lectura activa y síntesis de apuntes (45 min acumulados)',
    rewardCookies: 2,
    completed: false,
    description: 'Subraya ideas principales, formula 3 preguntas clave y resume los puntos esenciales.',
    tierName: 'Nivel 2 • Hábito (+2 🐟)',
    tierBadgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    iconType: 'flame',
  },
  {
    id: 'sem-7',
    day: 'Semanal',
    categoryGroup: 'Técnicas',
    title: '7. Diseñar un mapa conceptual o esquema visual',
    rewardCookies: 2,
    completed: false,
    description: 'Sintetiza un tema extenso en un diagrama que conecte causas, conceptos y consecuencias.',
    tierName: 'Nivel 2 • Hábito (+2 🐟)',
    tierBadgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    iconType: 'flame',
  },
  {
    id: 'sem-8',
    day: 'Semanal',
    categoryGroup: 'Técnicas',
    title: '8. Explicación en voz alta (Técnica Feynman)',
    rewardCookies: 2,
    completed: false,
    description: 'Explica el tema más difícil con tus propias palabras como si le dieras clase a un principiante.',
    tierName: 'Nivel 2 • Hábito (+2 🐟)',
    tierBadgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    iconType: 'flame',
  },
  {
    id: 'sem-9',
    day: 'Semanal',
    categoryGroup: 'Técnicas',
    title: '9. Crear 15 tarjetas de memoria (Flashcards)',
    rewardCookies: 2,
    completed: false,
    description: 'Redacta tarjetas con preguntas al frente y respuestas al reverso para autoevaluarte.',
    tierName: 'Nivel 2 • Hábito (+2 🐟)',
    tierBadgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    iconType: 'flame',
  },
  {
    id: 'sem-10',
    day: 'Semanal',
    categoryGroup: 'Técnicas',
    title: '10. Repaso espaciado de conceptos de semanas anteriores',
    rewardCookies: 2,
    completed: false,
    description: 'Dedica 20 minutos a refrescar un tema visto hace 15 días para evitar la curva del olvido.',
    tierName: 'Nivel 2 • Hábito (+2 🐟)',
    tierBadgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    iconType: 'flame',
  },

  // Grupo 3: Pomodoro y Enfoque Profundo (+3 🐟)
  {
    id: 'sem-11',
    day: 'Semanal',
    categoryGroup: 'Pomodoro',
    title: '11. Completar 3 bloques de Pomodoro continuos (75 min)',
    rewardCookies: 3,
    completed: false,
    description: 'Estudia con el temporizador sin mirar el móvil ni redes durante 3 bloques completos.',
    tierName: 'Nivel 3 • Enfoque (+3 🐟)',
    tierBadgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    iconType: 'zap',
  },
  {
    id: 'sem-12',
    day: 'Semanal',
    categoryGroup: 'Pomodoro',
    title: '12. Sesión matutina de estudio profundo',
    rewardCookies: 3,
    completed: false,
    description: 'Estudia durante la primera hora del día con enfoque y cero interrupciones.',
    tierName: 'Nivel 3 • Enfoque (+3 🐟)',
    tierBadgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    iconType: 'zap',
  },
  {
    id: 'sem-13',
    day: 'Semanal',
    categoryGroup: 'Pomodoro',
    title: '13. Acumular 5 bloques de concentración en la semana',
    rewardCookies: 3,
    completed: false,
    description: 'Alcanza al menos 125 minutos acumulados de estudio enfocado con descansos medidos.',
    tierName: 'Nivel 3 • Enfoque (+3 🐟)',
    tierBadgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    iconType: 'zap',
  },
  {
    id: 'sem-14',
    day: 'Semanal',
    categoryGroup: 'Pomodoro',
    title: '14. Afrontar la tarea más pesada en los primeros 30 min',
    rewardCookies: 3,
    completed: false,
    description: 'Supera la procrastinación completando tu deber más intimidante a primera hora.',
    tierName: 'Nivel 3 • Enfoque (+3 🐟)',
    tierBadgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    iconType: 'zap',
  },
  {
    id: 'sem-15',
    day: 'Semanal',
    categoryGroup: 'Pomodoro',
    title: '15. Jornada sin multitasking ni cambios de pestaña innecesarios',
    rewardCookies: 3,
    completed: false,
    description: 'Mantén una sola tarea abierta hasta finalizarla por completo.',
    tierName: 'Nivel 3 • Enfoque (+3 🐟)',
    tierBadgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    iconType: 'zap',
  },

  // Grupo 4: Práctica, Ejercicios y Exámenes (+4 🐟)
  {
    id: 'sem-16',
    day: 'Semanal',
    categoryGroup: 'Práctica',
    title: '16. Resolver guía práctica de 12 ejercicios sin ayuda',
    rewardCookies: 4,
    completed: false,
    description: 'Realiza los problemas paso a paso antes de verificar el solucionario.',
    tierName: 'Nivel 4 • Desafío (+4 🐟)',
    tierBadgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    iconType: 'target',
  },
  {
    id: 'sem-17',
    day: 'Semanal',
    categoryGroup: 'Práctica',
    title: '17. Simulacro de examen con cronómetro en tiempo real',
    rewardCookies: 4,
    completed: false,
    description: 'Ponte a prueba simulando las condiciones exactas de una evaluación escolar.',
    tierName: 'Nivel 4 • Desafío (+4 🐟)',
    tierBadgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    iconType: 'target',
  },
  {
    id: 'sem-18',
    day: 'Semanal',
    categoryGroup: 'Práctica',
    title: '18. Corrección profunda de errores de trabajos anteriores',
    rewardCookies: 4,
    completed: false,
    description: 'Analiza por qué fallaste en preguntas pasadas y redacta la respuesta perfecta.',
    tierName: 'Nivel 4 • Desafío (+4 🐟)',
    tierBadgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    iconType: 'target',
  },
  {
    id: 'sem-19',
    day: 'Semanal',
    categoryGroup: 'Práctica',
    title: '19. Redactar síntesis formal de investigación o ensayo',
    rewardCookies: 4,
    completed: false,
    description: 'Estructura introducción, argumentos y conclusiones con citas y orden claro.',
    tierName: 'Nivel 4 • Desafío (+4 🐟)',
    tierBadgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    iconType: 'target',
  },
  {
    id: 'sem-20',
    day: 'Semanal',
    categoryGroup: 'Práctica',
    title: '20. Dejar listos todos los trabajos 24 horas antes del plazo',
    rewardCookies: 4,
    completed: false,
    description: 'Evita el estrés de última hora entregando o teniendo listas tus tareas con anticipación.',
    tierName: 'Nivel 4 • Desafío (+4 🐟)',
    tierBadgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    iconType: 'target',
  },

  // Grupo 5: Constancia Épica y Gran Desempeño (+5 a +10 🐟)
  {
    id: 'sem-21',
    day: 'Semanal',
    categoryGroup: 'Constancia',
    title: '21. Racha de estudio de 3 días consecutivos',
    rewardCookies: 5,
    completed: false,
    description: 'Cumple tus metas de estudio durante al menos 3 días sin romper tu constancia.',
    tierName: 'Nivel 5 • Gran Premio (+5 🐟)',
    tierBadgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    iconType: 'trophy',
  },
  {
    id: 'sem-22',
    day: 'Semanal',
    categoryGroup: 'Constancia',
    title: '22. Semana Escolar Completa: Estudiar 5 días seguidos',
    rewardCookies: 5,
    completed: false,
    description: 'Estudia de lunes a viernes y mantén activo tu compromiso diario con tu mascota.',
    tierName: 'Nivel 5 • Gran Premio (+5 🐟)',
    tierBadgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    iconType: 'trophy',
  },
  {
    id: 'sem-23',
    day: 'Semanal',
    categoryGroup: 'Constancia',
    title: '23. Acumular más de 180 minutos totales de estudio semanal',
    rewardCookies: 5,
    completed: false,
    description: 'Supera 3 horas completas de preparación activa durante los 7 días.',
    tierName: 'Nivel 5 • Gran Premio (+5 🐟)',
    tierBadgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    iconType: 'trophy',
  },
  {
    id: 'sem-24',
    day: 'Semanal',
    categoryGroup: 'Constancia',
    title: '24. 100% de tareas de la lista tachadas y terminadas',
    rewardCookies: 5,
    completed: false,
    description: 'Llega al fin de semana sin deberes atrasados ni notas pendientes.',
    tierName: 'Nivel 5 • Gran Premio (+5 🐟)',
    tierBadgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    iconType: 'trophy',
  },
  {
    id: 'sem-25',
    day: 'Semanal',
    categoryGroup: 'Constancia',
    title: '25. ¡Maestría Semanal Suprema! Campeón de Concentración',
    rewardCookies: 10,
    completed: false,
    description: 'Supera el reto cumbre de la semana: combina racha perfecta, pomodoros y exámenes aprobados.',
    tierName: 'Nivel Épico Legendario (+10 🐟)',
    tierBadgeColor: 'bg-gradient-to-r from-amber-200 to-yellow-300 text-amber-950 border-amber-400 font-black shadow-xs',
    iconType: 'trophy',
  },
];

// Daily challenges for each day of the week (5 per day = 35 daily challenges)
const DEFAULT_DAILY_CHALLENGES: Record<string, ExtendedChallenge[]> = {
  Lunes: [
    {
      id: 'lun-1',
      day: 'Lunes',
      title: 'Despejar el escritorio y preparar materiales',
      rewardCookies: 1,
      completed: false,
      description: 'Prepara tus cuadernos y un vaso de agua antes de iniciar tu sesión.',
      tierName: 'Hábito rápido (+1 🐟)',
      tierBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconType: 'star',
    },
    {
      id: 'lun-2',
      day: 'Lunes',
      title: 'Revisión y notas de las clases del día',
      rewardCookies: 2,
      completed: false,
      description: 'Anota los puntos clave de las materias vistas hoy para no olvidarlos.',
      tierName: 'Constancia (+2 🐟)',
      tierBadgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      iconType: 'flame',
    },
    {
      id: 'lun-3',
      day: 'Lunes',
      title: '2 Bloques de Pomodoro concentrado (50 min)',
      rewardCookies: 3,
      completed: false,
      description: 'Estudia tu materia más retadora sin mirar notificaciones.',
      tierName: 'Enfoque profundo (+3 🐟)',
      tierBadgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconType: 'zap',
    },
    {
      id: 'lun-4',
      day: 'Lunes',
      title: 'Completar y tachar tu tarea más pesada del día',
      rewardCookies: 4,
      completed: false,
      description: 'Aplica el principio de "tragarse el sapo": termina lo difícil primero.',
      tierName: 'Desafío alto (+4 🐟)',
      tierBadgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      iconType: 'target',
    },
    {
      id: 'lun-5',
      day: 'Lunes',
      title: 'Sesión intensiva completa: 60 min de estudio enfocado',
      rewardCookies: 5,
      completed: false,
      description: 'Completa una hora entera de estudio registrado en la aplicación.',
      tierName: 'Gran Premio (+5 🐟)',
      tierBadgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold',
      iconType: 'trophy',
    },
  ],
  Martes: [
    {
      id: 'mar-1',
      day: 'Martes',
      title: 'Silenciar notificaciones y redes al estudiar',
      rewardCookies: 1,
      completed: false,
      description: 'Silencia notificaciones y evita distracciones de redes sociales al estudiar.',
      tierName: 'Hábito rápido (+1 🐟)',
      tierBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconType: 'star',
    },
    {
      id: 'mar-2',
      day: 'Martes',
      title: 'Crear un esquema visual o mapa conceptual',
      rewardCookies: 2,
      completed: false,
      description: 'Organiza la información visualmente para recordar mejor.',
      tierName: 'Constancia (+2 🐟)',
      tierBadgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      iconType: 'flame',
    },
    {
      id: 'mar-3',
      day: 'Martes',
      title: 'Resolver 8 ejercicios prácticos sin mirar ayuda',
      rewardCookies: 3,
      completed: false,
      description: 'Pon a prueba tu habilidad práctica en ejercicios de tu materia principal.',
      tierName: 'Enfoque profundo (+3 🐟)',
      tierBadgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconType: 'zap',
    },
    {
      id: 'mar-4',
      day: 'Martes',
      title: 'Explicar el tema en voz alta (Técnica Feynman)',
      rewardCookies: 4,
      completed: false,
      description: 'Explica lo aprendido como si le enseñaras a alguien más desde cero.',
      tierName: 'Desafío alto (+4 🐟)',
      tierBadgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      iconType: 'target',
    },
    {
      id: 'mar-5',
      day: 'Martes',
      title: 'Dominar un tema difícil y redactar una nota completa',
      rewardCookies: 5,
      completed: false,
      description: 'Dedica tiempo a aclarar todas las dudas pendientes de la semana.',
      tierName: 'Gran Premio (+5 🐟)',
      tierBadgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold',
      iconType: 'trophy',
    },
  ],
  Miércoles: [
    {
      id: 'mie-1',
      day: 'Miércoles',
      title: 'Repaso rápido de 15 minutos de temas anteriores',
      rewardCookies: 1,
      completed: false,
      description: 'Repasa con repaso espaciado para que la curva del olvido no borre lo aprendido.',
      tierName: 'Hábito rápido (+1 🐟)',
      tierBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconType: 'star',
    },
    {
      id: 'mie-2',
      day: 'Miércoles',
      title: 'Lectura activa de un capítulo escolar',
      rewardCookies: 2,
      completed: false,
      description: 'Subraya conceptos clave y escribe 3 preguntas sobre el texto.',
      tierName: 'Constancia (+2 🐟)',
      tierBadgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      iconType: 'flame',
    },
    {
      id: 'mie-3',
      day: 'Miércoles',
      title: 'Completar 3 notas de tareas escolares pendientes',
      rewardCookies: 3,
      completed: false,
      description: 'Avanza y tacha 3 deberes de tu lista de pendientes en la app.',
      tierName: 'Enfoque profundo (+3 🐟)',
      tierBadgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconType: 'zap',
    },
    {
      id: 'mie-4',
      day: 'Miércoles',
      title: 'Autoevaluación con tarjetas de memoria (Flashcards)',
      rewardCookies: 4,
      completed: false,
      description: 'Ponte a prueba con al menos 15 preguntas y respuestas rápidas.',
      tierName: 'Desafío alto (+4 🐟)',
      tierBadgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      iconType: 'target',
    },
    {
      id: 'mie-5',
      day: 'Miércoles',
      title: 'Superar el punto medio de la semana sin tareas atrasadas',
      rewardCookies: 5,
      completed: false,
      description: 'Ten todas tus entregas al día antes del anochecer.',
      tierName: 'Gran Premio (+5 🐟)',
      tierBadgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold',
      iconType: 'trophy',
    },
  ],
  Jueves: [
    {
      id: 'jue-1',
      day: 'Jueves',
      title: 'Revisar la lista de pendientes y priorizar metas',
      rewardCookies: 1,
      completed: false,
      description: 'Marca las 2 tareas más urgentes que debes entregar mañana.',
      tierName: 'Hábito rápido (+1 🐟)',
      tierBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconType: 'star',
    },
    {
      id: 'jue-2',
      day: 'Jueves',
      title: 'Sesión de concentración de 30 minutos sin interrupciones',
      rewardCookies: 2,
      completed: false,
      description: 'Mantén los ojos en el cuaderno o pantalla de estudio sin mirar el móvil.',
      tierName: 'Constancia (+2 🐟)',
      tierBadgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      iconType: 'flame',
    },
    {
      id: 'jue-3',
      day: 'Jueves',
      title: 'Resolver problemas difíciles con apuntes de apoyo',
      rewardCookies: 3,
      completed: false,
      description: 'Afronta el tema que más te cuesta hasta comprenderlo a fondo.',
      tierName: 'Enfoque profundo (+3 🐟)',
      tierBadgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconType: 'zap',
    },
    {
      id: 'jue-4',
      day: 'Jueves',
      title: 'Simulacro de preguntas tipo prueba o examen (40 min)',
      rewardCookies: 4,
      completed: false,
      description: 'Cronometra tu tiempo y responde como si estuvieras en el aula.',
      tierName: 'Desafío alto (+4 🐟)',
      tierBadgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      iconType: 'target',
    },
    {
      id: 'jue-5',
      day: 'Jueves',
      title: 'Dejar listos y corregidos todos los trabajos de viernes',
      rewardCookies: 5,
      completed: false,
      description: 'Llega al viernes con todo listo para disfrutar el fin de semana sin estrés.',
      tierName: 'Gran Premio (+5 🐟)',
      tierBadgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold',
      iconType: 'trophy',
    },
  ],
  Viernes: [
    {
      id: 'vie-1',
      day: 'Viernes',
      title: 'Archivar y ordenar los apuntes de la semana',
      rewardCookies: 1,
      completed: false,
      description: 'Mantén carpetas y cuadernos organizados por materias.',
      tierName: 'Hábito rápido (+1 🐟)',
      tierBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconType: 'star',
    },
    {
      id: 'vie-2',
      day: 'Viernes',
      title: 'Verificación final de entregas escolares',
      rewardCookies: 2,
      completed: false,
      description: 'Confirma que no quede ninguna tarea pendiente para la semana.',
      tierName: 'Constancia (+2 🐟)',
      tierBadgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      iconType: 'flame',
    },
    {
      id: 'vie-3',
      day: 'Viernes',
      title: '2 Bloques Pomodoro de cierre y consolidación',
      rewardCookies: 3,
      completed: false,
      description: 'Repasa los puntos más importantes que aprendiste de lunes a viernes.',
      tierName: 'Enfoque profundo (+3 🐟)',
      tierBadgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconType: 'zap',
    },
    {
      id: 'vie-4',
      day: 'Viernes',
      title: 'Resumen semanal consolidado de conocimientos',
      rewardCookies: 4,
      completed: false,
      description: 'Escribe una síntesis de 1 página con lo más valioso aprendido en la semana.',
      tierName: 'Desafío alto (+4 🐟)',
      tierBadgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      iconType: 'target',
    },
    {
      id: 'vie-5',
      day: 'Viernes',
      title: '¡Semana Escolar Perfecta! 100% de deberes al día',
      rewardCookies: 5,
      completed: false,
      description: 'Celebra tu constancia y alimenta a tu mascota con las galletas ganadas.',
      tierName: 'Gran Premio (+5 🐟)',
      tierBadgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold',
      iconType: 'trophy',
    },
  ],
  Sábado: [
    {
      id: 'sab-1',
      day: 'Sábado',
      title: 'Planificar horario equilibrado de estudio y ocio',
      rewardCookies: 1,
      completed: false,
      description: 'Define qué momento del día destinarás al descanso y cuál al repaso.',
      tierName: 'Hábito rápido (+1 🐟)',
      tierBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconType: 'star',
    },
    {
      id: 'sab-2',
      day: 'Sábado',
      title: '25 minutos de lectura enriquecedora libre',
      rewardCookies: 2,
      completed: false,
      description: 'Lee un libro, artículo científico o tema cultural de tu interés.',
      tierName: 'Constancia (+2 🐟)',
      tierBadgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      iconType: 'flame',
    },
    {
      id: 'sab-3',
      day: 'Sábado',
      title: 'Fortalecer la materia más difícil con calma',
      rewardCookies: 3,
      completed: false,
      description: 'Sin la prisa del aula, analiza los conceptos que no te quedaron claros.',
      tierName: 'Enfoque profundo (+3 🐟)',
      tierBadgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconType: 'zap',
    },
    {
      id: 'sab-4',
      day: 'Sábado',
      title: 'Desarrollo de proyecto práctico o habilidades clave',
      rewardCookies: 4,
      completed: false,
      description: 'Avanza en maquetas, investigaciones o proyectos a mediano plazo.',
      tierName: 'Desafío alto (+4 🐟)',
      tierBadgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      iconType: 'target',
    },
    {
      id: 'sab-5',
      day: 'Sábado',
      title: 'Masterclass de fin de semana: Sesión completa de repaso',
      rewardCookies: 5,
      completed: false,
      description: 'Supera 50 minutos de estudio activo durante el fin de semana.',
      tierName: 'Gran Premio (+5 🐟)',
      tierBadgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold',
      iconType: 'trophy',
    },
  ],
  Domingo: [
    {
      id: 'dom-1',
      day: 'Domingo',
      title: 'Dejar mochila y útiles listos para el lunes',
      rewardCookies: 1,
      completed: false,
      description: 'Prepara cuadernos, libros y bolígrafos la noche anterior sin apuros.',
      tierName: 'Hábito rápido (+1 🐟)',
      tierBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconType: 'star',
    },
    {
      id: 'dom-2',
      day: 'Domingo',
      title: 'Repaso ligero de 20 minutos de temas clave',
      rewardCookies: 2,
      completed: false,
      description: 'Dale una leída rápida a tus notas para despertar la memoria para mañana.',
      tierName: 'Constancia (+2 🐟)',
      tierBadgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      iconType: 'flame',
    },
    {
      id: 'dom-3',
      day: 'Domingo',
      title: 'Definir las 3 prioridades principales de la nueva semana',
      rewardCookies: 3,
      completed: false,
      description: 'Identifica los 3 exámenes o entregas más importantes que vienen.',
      tierName: 'Enfoque profundo (+3 🐟)',
      tierBadgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconType: 'zap',
    },
    {
      id: 'dom-4',
      day: 'Domingo',
      title: 'Planificar el calendario y metas de la nueva semana',
      rewardCookies: 4,
      completed: false,
      description: 'Configura tus horarios y objetivos en la aplicación.',
      tierName: 'Desafío alto (+4 🐟)',
      tierBadgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      iconType: 'target',
    },
    {
      id: 'dom-5',
      day: 'Domingo',
      title: 'Cierre de ciclo semanal: Compromiso con tu racha de constancia',
      rewardCookies: 5,
      completed: false,
      description: 'Empieza la nueva semana con la mente despejada y lista para triunfar.',
      tierName: 'Gran Premio (+5 🐟)',
      tierBadgeColor: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold',
      iconType: 'trophy',
    },
  ],
};

export const Screen8WeeklyChallenge: React.FC<Screen8WeeklyChallengeProps> = ({
  user,
  onUpdateUser,
  onBackToSettings,
  onBackToDashboard,
}) => {
  const tabsList = ['⭐ Retos de la Semana', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const [activeTab, setActiveTab] = useState<string>('⭐ Retos de la Semana');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Todos');
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);
  const [resetNotification, setResetNotification] = useState<string | null>(null);

  // Storage key: v2 ensures clean start from zero for every user
  const storageKey = `focusmind_challenges_status_v2_${user.email.toLowerCase()}`;

  // State for weekly challenges and daily challenges: ALL INITIALIZE STRICTLY AT ZERO
  const [weeklyChallenges, setWeeklyChallenges] = useState<ExtendedChallenge[]>(DEFAULT_WEEKLY_CHALLENGES);
  const [dailyChallenges, setDailyChallenges] = useState<Record<string, ExtendedChallenge[]>>(DEFAULT_DAILY_CHALLENGES);
  const [rewardClaimEffect, setRewardClaimEffect] = useState<{ cookies: number; title: string } | null>(null);

  // Load saved challenges status from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.weekly) {
          setWeeklyChallenges((prev) =>
            prev.map((c) => ({
              ...c,
              completed: Boolean(parsed.weekly[c.id]),
            }))
          );
        }
        if (parsed.daily) {
          setDailyChallenges((prev) => {
            const next = { ...prev };
            Object.keys(next).forEach((day) => {
              if (parsed.daily[day]) {
                next[day] = next[day].map((c) => ({
                  ...c,
                  completed: Boolean(parsed.daily[day]?.[c.id]),
                }));
              }
            });
            return next;
          });
        }
      } else {
        // Explicitly write initial zero state to storage
        persistState(DEFAULT_WEEKLY_CHALLENGES, DEFAULT_DAILY_CHALLENGES);
      }
    } catch (e) {
      console.error('Error loading challenge state:', e);
    }
  }, [storageKey]);

  // Persist challenge completion status helper
  const persistState = (newWeekly: ExtendedChallenge[], newDaily: Record<string, ExtendedChallenge[]>) => {
    try {
      const weeklyMap: Record<string, boolean> = {};
      newWeekly.forEach((c) => {
        weeklyMap[c.id] = c.completed;
      });

      const dailyMap: Record<string, Record<string, boolean>> = {};
      Object.keys(newDaily).forEach((day) => {
        dailyMap[day] = {};
        newDaily[day].forEach((c) => {
          dailyMap[day][c.id] = c.completed;
        });
      });

      localStorage.setItem(storageKey, JSON.stringify({ weekly: weeklyMap, daily: dailyMap }));
    } catch (e) {
      console.error('Error persisting challenge state:', e);
    }
  };

  // Reset all challenges completely back to zero
  const handleResetToZero = () => {
    const resetWeekly = weeklyChallenges.map((c) => ({ ...c, completed: false }));
    const resetDaily: Record<string, ExtendedChallenge[]> = {};
    Object.keys(dailyChallenges).forEach((day) => {
      resetDaily[day] = dailyChallenges[day].map((c) => ({ ...c, completed: false }));
    });

    setWeeklyChallenges(resetWeekly);
    setDailyChallenges(resetDaily);
    persistState(resetWeekly, resetDaily);
    setShowResetConfirm(false);
    setResetNotification('¡Retos reiniciados a cero (0) exitosamente!');
    setTimeout(() => setResetNotification(null), 3000);
  };

  // Toggle a weekly challenge
  const handleToggleWeekly = (id: string) => {
    const target = weeklyChallenges.find((c) => c.id === id);
    if (!target) return;

    const willBeCompleted = !target.completed;
    const cookieDelta = willBeCompleted ? target.rewardCookies : -target.rewardCookies;

    const updated = weeklyChallenges.map((c) => (c.id === id ? { ...c, completed: willBeCompleted } : c));
    setWeeklyChallenges(updated);
    persistState(updated, dailyChallenges);

    const newCookies = Math.max(0, (user.fishCookies || 0) + cookieDelta);
    onUpdateUser({
      ...user,
      fishCookies: newCookies,
    });

    if (willBeCompleted) {
      setRewardClaimEffect({ cookies: target.rewardCookies, title: target.title });
      setTimeout(() => setRewardClaimEffect(null), 2500);
    }
  };

  // Toggle a daily challenge
  const handleToggleDaily = (day: string, id: string) => {
    const list = dailyChallenges[day] || [];
    const target = list.find((c) => c.id === id);
    if (!target) return;

    const willBeCompleted = !target.completed;
    const cookieDelta = willBeCompleted ? target.rewardCookies : -target.rewardCookies;

    const updatedList = list.map((c) => (c.id === id ? { ...c, completed: willBeCompleted } : c));
    const updatedDaily = {
      ...dailyChallenges,
      [day]: updatedList,
    };
    setDailyChallenges(updatedDaily);
    persistState(weeklyChallenges, updatedDaily);

    const newCookies = Math.max(0, (user.fishCookies || 0) + cookieDelta);
    onUpdateUser({
      ...user,
      fishCookies: newCookies,
    });

    if (willBeCompleted) {
      setRewardClaimEffect({ cookies: target.rewardCookies, title: target.title });
      setTimeout(() => setRewardClaimEffect(null), 2500);
    }
  };

  // Determine current active list
  const isWeeklyTab = activeTab === '⭐ Retos de la Semana';
  const baseList: ExtendedChallenge[] = isWeeklyTab
    ? weeklyChallenges
    : dailyChallenges[activeTab] || [];

  // Filter weekly challenges if a category is selected
  const currentList = isWeeklyTab && selectedCategoryFilter !== 'Todos'
    ? baseList.filter((c) => c.categoryGroup === selectedCategoryFilter)
    : baseList;

  const totalWeeklyDone = weeklyChallenges.filter((c) => c.completed).length;
  const completedInView = currentList.filter((c) => c.completed).length;
  const progressPercent = currentList.length > 0 ? Math.round((completedInView / currentList.length) * 100) : 0;

  // Compute total potential cookies in active list
  const totalPotentialCookies = currentList.reduce((acc, c) => acc + c.rewardCookies, 0);
  const earnedInCurrentTab = currentList.filter((c) => c.completed).reduce((acc, c) => acc + c.rewardCookies, 0);

  // Render icon helper
  const renderTierIcon = (iconType: ExtendedChallenge['iconType']) => {
    switch (iconType) {
      case 'star':
        return <Star className="w-3.5 h-3.5 text-emerald-600 fill-emerald-500" />;
      case 'flame':
        return <Flame className="w-3.5 h-3.5 text-blue-600 fill-blue-500" />;
      case 'zap':
        return <Zap className="w-3.5 h-3.5 text-indigo-600 fill-indigo-500" />;
      case 'target':
        return <Target className="w-3.5 h-3.5 text-purple-600" />;
      case 'trophy':
      default:
        return <Trophy className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />;
    }
  };

  const categories = ['Todos', 'Organización', 'Técnicas', 'Pomodoro', 'Práctica', 'Constancia'];

  return (
    <motion.div
      id="screen-8-weekly-challenge"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col h-full bg-gradient-to-b from-sky-50/70 via-white to-blue-50/60 text-slate-800 select-none overflow-y-auto"
    >
      {/* Top Header with Back Button and Reset action */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-blue-100/80 bg-white/90 backdrop-blur-md sticky top-0 z-10">
        <button
          id="btn-weekly-challenge-back"
          onClick={onBackToDashboard || onBackToSettings}
          aria-label="Regresar"
          className="w-10 h-10 rounded-2xl flex items-center justify-center bg-white border border-slate-200 shadow-2xs text-slate-700 hover:bg-blue-50 hover:text-blue-600 active:scale-95 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            25 Retos Semanales
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Reset to Zero Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            title="Reiniciar retos a cero"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-[11px] font-bold text-slate-600 transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-3 h-3" />
            <span>A cero (0)</span>
          </button>

          {/* Live cookies count badge */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-black shadow-2xs">
            <Fish className="w-3.5 h-3.5 text-amber-600" />
            <span>{user.fishCookies || 0} 🐟</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Reset to Zero */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              className="bg-white rounded-3xl p-5 max-w-sm w-full border border-slate-200 shadow-xl space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="text-base font-black text-slate-900">¿Reiniciar retos desde cero?</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Todos los retos semanales y diarios quedarán desmarcados (0 completados), listos para comenzar una nueva semana desde cero.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleResetToZero}
                  className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 cursor-pointer"
                >
                  Sí, reiniciar a 0
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reset Notification Toast */}
      <AnimatePresence>
        {resetNotification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-5 mt-2 p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2 shadow-2xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{resetNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Title */}
      <div className="px-5 pt-3 pb-1 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-black text-blue-950 tracking-tight"
        >
          SISTEMA DE RETOS SEMANALES
        </motion.h1>
        <p className="text-xs text-slate-600 mt-1 font-medium max-w-md mx-auto">
          <strong>25 retos en el sistema</strong> con premios de <strong>1 a 10 galletas de pescado 🐟</strong>. Inicia desde cero y avanza a tu ritmo.
        </p>
      </div>

      {/* Main Banner: 25 Challenges / Rewards up to 75+ cookies */}
      <div className="px-5 pt-2">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 rounded-3xl p-4 text-white shadow-md shadow-blue-900/20 relative overflow-hidden">
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                <Gift className="w-3 h-3 text-amber-300" />
                <span>Catálogo Completo: 25 Retos Semanales</span>
              </div>
              <div className="text-xs text-blue-100 font-medium">
                Comienza en <strong className="text-amber-300">0 completados</strong> • Gana hasta <strong className="text-amber-300">{totalPotentialCookies} 🐟 galletas</strong>
              </div>
              <div className="text-[11px] text-blue-200">
                Estado: <strong>{totalWeeklyDone} de 25</strong> retos semanales completados
              </div>
            </div>

            {/* Mascot Avatar */}
            <div className="w-14 h-16 bg-white/10 rounded-2xl p-1 border border-white/20 flex items-center justify-center shrink-0">
              <MascotArtwork type={totalWeeklyDone > 0 ? 'proud' : 'neutral'} className="w-full h-full" />
            </div>
          </div>

          {/* Differentiated values indicator */}
          <div className="grid grid-cols-5 gap-1 mt-3 pt-3 border-t border-white/15 text-center">
            <div className="p-1 rounded-xl bg-white/10 border border-white/10">
              <div className="text-[9px] text-blue-200 font-semibold">Básico</div>
              <div className="text-xs font-black text-amber-300">+1 🐟</div>
            </div>
            <div className="p-1 rounded-xl bg-white/10 border border-white/10">
              <div className="text-[9px] text-blue-200 font-semibold">Hábito</div>
              <div className="text-xs font-black text-amber-300">+2 🐟</div>
            </div>
            <div className="p-1 rounded-xl bg-white/10 border border-white/10">
              <div className="text-[9px] text-blue-200 font-semibold">Enfoque</div>
              <div className="text-xs font-black text-amber-300">+3 🐟</div>
            </div>
            <div className="p-1 rounded-xl bg-white/10 border border-white/10">
              <div className="text-[9px] text-blue-200 font-semibold">Desafío</div>
              <div className="text-xs font-black text-amber-300">+4 a +5 🐟</div>
            </div>
            <div className="p-1 rounded-xl bg-amber-400/25 border border-amber-300/40">
              <div className="text-[9px] text-amber-200 font-bold">Épico</div>
              <div className="text-xs font-black text-amber-300">+10 🐟</div>
            </div>
          </div>

          {/* Floating Reward Animation */}
          <AnimatePresence>
            {rewardClaimEffect && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.8 }}
                animate={{ opacity: 1, y: -4, scale: 1.02 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mt-2.5 p-2 rounded-xl bg-amber-400 text-amber-950 text-xs font-black flex items-center justify-center gap-1.5 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-amber-950 animate-spin" />
                <span>¡+{rewardClaimEffect.cookies} Galleta(s) de Pescado sumadas a tu mascota! 🐟</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Tab Selector: Retos de la Semana + Días */}
      <div className="px-5 pt-3 pb-1">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Pestañas del Sistema</span>
          </div>
          <span className="text-[11px] font-bold text-blue-600">
            {isWeeklyTab ? '25 Retos Semanales' : '5 Retos Diarios'}
          </span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {tabsList.map((tabName) => {
            const isSelected = activeTab === tabName;
            const tabChallenges = tabName === '⭐ Retos de la Semana'
              ? weeklyChallenges
              : dailyChallenges[tabName] || [];
            const doneCount = tabChallenges.filter((c) => c.completed).length;

            return (
              <button
                key={tabName}
                onClick={() => setActiveTab(tabName)}
                className={`px-3 py-2 rounded-2xl text-xs font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs scale-102 ring-2 ring-blue-400/40'
                    : 'bg-white text-slate-700 hover:bg-blue-50 border border-blue-100'
                }`}
              >
                <span>{tabName}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {doneCount}/{tabChallenges.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter Chips for the 25 Weekly Challenges */}
      {isWeeklyTab && (
        <div className="px-5 py-1">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
              <Filter className="w-3 h-3 text-slate-400" />
              Filtrar:
            </span>
            {categories.map((cat) => {
              const active = selectedCategoryFilter === cat;
              const count = cat === 'Todos'
                ? weeklyChallenges.length
                : weeklyChallenges.filter((c) => c.categoryGroup === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all shrink-0 cursor-pointer border ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Progress Bar for Active Tab */}
      <div className="px-5 py-1">
        <div className="bg-white p-3 rounded-2xl border border-blue-100 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>Progreso actual ({activeTab})</span>
            <span className="text-blue-600">
              {completedInView} de {currentList.length} completados ({progressPercent}%) • +{earnedInCurrentTab} 🐟 ganadas
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Challenges List: 25 Challenges strictly starting from zero */}
      <div className="px-5 py-2 space-y-2.5 pb-10">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            {isWeeklyTab
              ? `Retos Semanales (${currentList.length} disponibles)`
              : `5 Retos de ${activeTab}`}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">
            {completedInView === 0 ? 'Iniciando en 0' : `${completedInView} completado(s)`}
          </span>
        </div>

        {currentList.map((challenge, index) => {
          const isDone = challenge.completed;

          return (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.02, 0.3) }}
              className={`p-3.5 rounded-3xl border transition-all flex items-start justify-between gap-3 ${
                isDone
                  ? 'bg-amber-50/60 border-amber-300 text-slate-700 ring-1 ring-amber-400/20'
                  : 'bg-white border-blue-100 shadow-2xs hover:border-blue-200 text-slate-900'
              }`}
            >
              {/* Interactive Checkbox */}
              <button
                onClick={() =>
                  isWeeklyTab
                    ? handleToggleWeekly(challenge.id)
                    : handleToggleDaily(activeTab, challenge.id)
                }
                aria-label={isDone ? 'Desmarcar reto' : 'Completar reto y ganar galletas'}
                className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 mt-0.5 ${
                  isDone
                    ? 'bg-amber-500 text-white shadow-xs scale-105'
                    : 'border-2 border-slate-300 hover:border-amber-500 hover:bg-amber-50 bg-white'
                }`}
              >
                {isDone && <Check className="w-4 h-4 stroke-[3]" />}
              </button>

              {/* Challenge Body */}
              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() =>
                  isWeeklyTab
                    ? handleToggleWeekly(challenge.id)
                    : handleToggleDaily(activeTab, challenge.id)
                }
              >
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Distinct Tier Badge */}
                  <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border ${challenge.tierBadgeColor}`}>
                    {renderTierIcon(challenge.iconType)}
                    <span>{challenge.tierName}</span>
                  </span>

                  {/* Fish Cookie Reward Pill */}
                  <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    <Fish className="w-3 h-3 text-amber-600" />
                    +{challenge.rewardCookies} {challenge.rewardCookies === 1 ? 'galleta' : 'galletas'}
                  </span>
                </div>

                <h3
                  className={`text-xs font-bold leading-snug mt-1.5 ${
                    isDone ? 'line-through text-slate-500' : 'text-slate-900'
                  }`}
                >
                  {challenge.title}
                </h3>

                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                  {challenge.description}
                </p>

                {isDone && (
                  <div className="mt-2 flex items-center gap-1 text-[10px] font-black text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-lg w-fit">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>¡Recompensa ganada (+{challenge.rewardCookies} 🐟)!</span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
