import { MascotMood } from '../types';

export interface MascotBehavior {
  id: MascotMood;
  title: string;
  emoji: string;
  expression: string;
  gesture: string;
  triggerDescription: string;
  dialogues: string[];
  sessionStartDialogues?: string[];
  sessionOngoingDialogues?: string[];
}

export const MASCOT_BEHAVIORS: Record<MascotMood, MascotBehavior> = {
  neutral: {
    id: 'neutral',
    title: 'Neutral / esperando',
    emoji: '😐',
    expression: 'Cara seria y tranquila.',
    gesture: 'Brazos cruzados, postura de espera.',
    triggerDescription: 'Cuando el usuario abre la aplicación y todavía no ha iniciado ninguna tarea ni sesión de estudio.',
    dialogues: [
      'Bueno... ¿vas a empezar o solo vas a mirar la pantalla?',
      'Tienes cosas pendientes.',
      'Estoy esperando.',
      'Cuando quieras, podemos empezar.',
      'No voy a hacer tus tareas por ti.',
      'El temporizador está listo.',
    ],
  },
  completed: {
    id: 'completed',
    title: 'Sorprendido',
    emoji: '😲',
    expression: 'Sorprendido y emocionado, manos a las mejillas, ojos grandes y brillantes.',
    gesture: 'Postura de sorpresa y celebración.',
    triggerDescription: 'Cuando el usuario completa una tarea o termina correctamente una sesión Pomodoro.',
    dialogues: [
      'Oh... sí la terminaste.',
      'Vaya, eso salió mejor de lo que esperaba.',
      'Una tarea menos.',
      'No estuvo tan mal.',
      'Bien hecho... supongo.',
      'Terminaste. Ahora sigue con la siguiente.',
    ],
  },
  sleeping: {
    id: 'sleeping',
    title: 'Inactivo / durmiendo',
    emoji: '😴',
    expression: 'Ojos cerrados.',
    gesture: 'Acostado y dormido.',
    triggerDescription: 'Cuando el usuario lleva mucho tiempo sin utilizar la aplicación o no ha realizado ninguna actividad durante un periodo determinado.',
    dialogues: [
      'Ah... ya regresaste.',
      'Me quedé esperando tanto que me dormí.',
      'Pensé que habías abandonado.',
      'Bueno, ya estás aquí. ¿Empezamos?',
      'Tu lista de tareas sigue esperándote.',
    ],
  },
  bored: {
    id: 'bored',
    title: 'Aburrido',
    emoji: '😒',
    expression: 'Ojos medio cerrados, mirada cansada y boca recta.',
    gesture: 'Una mano sosteniendo la cabeza.',
    triggerDescription: 'Cuando el usuario lleva bastante tiempo dentro de la aplicación, pero no inicia ninguna tarea ni sesión de estudio.',
    dialogues: [
      'Esto se está haciendo aburrido.',
      'Llevas rato mirando las tareas.',
      '¿Vas a empezar algún día?',
      'Podríamos estar estudiando.',
      'Solo digo...',
      'Creo que esa tarea no se va a hacer sola.',
    ],
  },
  frustrated: {
    id: 'frustrated',
    title: 'Molesto / frustrado',
    emoji: '😤',
    expression: 'Cejas fruncidas y ojos cerrados con molestia.',
    gesture: 'Brazos a los lados y puños cerrados.',
    triggerDescription: 'Cuando el usuario cancela o abandona varias sesiones de Pomodoro seguidas, elimina una tarea importante o deja repetidamente actividades sin terminar.',
    dialogues: [
      'Otra vez cancelaste.',
      'Así va a ser difícil avanzar.',
      'Respira. Puedes intentarlo otra vez.',
      'No pasa nada, pero inténtalo de nuevo.',
      'Terminemos al menos una sesión.',
      'Vamos, concéntrate.',
    ],
  },
  confused: {
    id: 'confused',
    title: 'Confundido',
    emoji: '🤨',
    expression: 'Una ceja levantada y ojos mirando hacia un lado.',
    gesture: 'Cabeza ligeramente inclinada.',
    triggerDescription: 'Cuando una tarea está incompleta, no tiene fecha, hora o información suficiente. También cuando se intenta iniciar una actividad sin haber seleccionado una tarea.',
    dialogues: [
      'Espera... creo que falta algo.',
      '¿Y cuándo se supone que tienes que hacer esto?',
      'Esta tarea necesita más información.',
      'No estoy seguro de entender el plan.',
      'Creo que olvidaste completar algo.',
      'Hmm... esto está un poco confuso.',
    ],
  },
  focused: {
    id: 'focused',
    title: 'Concentrado / estudiando',
    emoji: '🧐',
    expression: 'Mirada seria y enfocada.',
    gesture: 'Postura concentrada, mirando hacia adelante o trabajando.',
    triggerDescription: 'Mientras el temporizador Pomodoro está activo y el usuario se encuentra en una sesión de estudio.',
    dialogues: [
      'Bien. Ahora concéntrate.',
      'Nada de distracciones.',
      'Tienes tiempo. Aprovéchalo.',
      'Empezamos.',
      'Una cosa a la vez.',
      'Vamos a terminar esto.',
    ],
    sessionStartDialogues: [
      'Bien. Ahora concéntrate.',
      'Nada de distracciones.',
      'Tienes tiempo. Aprovéchalo.',
      'Empezamos.',
      'Una cosa a la vez.',
      'Vamos a terminar esto.',
    ],
    sessionOngoingDialogues: [
      'Sigue así.',
      'Todavía queda tiempo.',
      'No te distraigas.',
      'Concéntrate en lo que estás haciendo.',
    ],
  },
  impatient: {
    id: 'impatient',
    title: 'Impaciente',
    emoji: '🙄',
    expression: 'Ojos mirando hacia arriba y cejas levantadas.',
    gesture: 'Brazos cruzados y dando pequeños golpecitos con un pie.',
    triggerDescription: 'Cuando el usuario tiene una tarea importante o próxima a vencer, pero tarda demasiado en comenzar.',
    dialogues: [
      'La fecha límite se está acercando.',
      'Estoy perdiendo la paciencia.',
      '¿Empezamos ya?',
      'Esa tarea sigue ahí.',
      'No quiero presionarte, pero...',
      'Bueno... ¿qué estamos esperando?',
      'El tiempo sigue pasando.',
    ],
  },
  proud: {
    id: 'proud',
    title: 'Satisfecho / orgulloso',
    emoji: '😎',
    expression: 'Pequeña sonrisa de lado y mirada segura.',
    gesture: 'Brazos cruzados y pecho ligeramente levantado.',
    triggerDescription: 'Cuando el usuario completa todas las tareas del día, alcanza una meta, mantiene una racha de estudio o completa varias sesiones Pomodoro.',
    dialogues: [
      'Nada mal.',
      'Hoy sí hiciste las cosas bien.',
      'Misión cumplida.',
      'Sabía que podías hacerlo... más o menos.',
      'Terminaste todo. Impresionante.',
      'Puedes sentirte orgulloso de eso.',
      'Yo también estoy un poco impresionado.',
    ],
  },
};

export function getRandomDialogue(mood: MascotMood, ongoing?: boolean): string {
  const behavior = MASCOT_BEHAVIORS[mood] || MASCOT_BEHAVIORS.neutral;
  if (mood === 'focused' && ongoing && behavior.sessionOngoingDialogues) {
    const list = behavior.sessionOngoingDialogues;
    return list[Math.floor(Math.random() * list.length)];
  }
  const list = behavior.dialogues;
  return list[Math.floor(Math.random() * list.length)];
}
