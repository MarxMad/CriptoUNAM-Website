import type { PreguntaCuestionario } from '../constants/cursosData'

/**
 * PRNG determinístico (mulberry32). Permite reproducir el mismo orden
 * dado un seed, lo que mantiene estable el shuffle durante una sesión.
 */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Devuelve una nueva pregunta con las opciones barajeadas. El índice
 * `correcta` se reindexa para que siga apuntando a la respuesta correcta
 * después del shuffle. Misma semilla → mismo orden.
 */
export function shuffleOpciones(
  p: PreguntaCuestionario,
  seed: number,
): PreguntaCuestionario {
  const rng = mulberry32(seed)
  const indexed = p.opciones.map((text, idx) => ({ text, originalIdx: idx }))
  // Fisher-Yates
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[indexed[i], indexed[j]] = [indexed[j], indexed[i]]
  }
  return {
    pregunta: p.pregunta,
    opciones: indexed.map((o) => o.text),
    correcta: indexed.findIndex((o) => o.originalIdx === p.correcta),
  }
}

/**
 * Baraja todas las opciones de cada pregunta del cuestionario.
 * Cada pregunta usa una semilla derivada para que el resultado sea
 * determinístico pero distinto pregunta a pregunta.
 */
export function shuffleCuestionario(
  preguntas: PreguntaCuestionario[],
  seed: number,
): PreguntaCuestionario[] {
  return preguntas.map((p, i) => shuffleOpciones(p, seed + i * 31 + 7))
}

/** Genera una semilla pseudo-aleatoria para una nueva sesión. */
export function nuevaSemilla(): number {
  return Math.floor(Math.random() * 1_000_000_000) + 1
}
