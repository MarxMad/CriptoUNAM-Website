/**
 * Aliados de CriptoUNAM (sección "Nuestros Aliados").
 * Imágenes en: public/images/Aliados/ (1.svg - 23.svg).
 * Ver docs/PLAN_MEJORA_ACTUALIZACION.md
 */
export interface PartnerItem {
  img: string
  alt: string
}

const base = '/images/Aliados'
/** Lista de aliados para el ticker. Editar "alt" para el nombre de cada aliado. */
export const partnersData: PartnerItem[] = [
  { img: `${base}/1.svg`, alt: 'Aliado 1' },
  { img: `${base}/2.svg`, alt: 'Aliado 2' },
  { img: `${base}/3.svg`, alt: 'Aliado 3' },
  { img: `${base}/4.svg`, alt: 'Aliado 4' },
  { img: `${base}/5.svg`, alt: 'Aliado 5' },
  { img: `${base}/6.svg`, alt: 'Aliado 6' },
  { img: `${base}/7.svg`, alt: 'Aliado 7' },
  { img: `${base}/8.svg`, alt: 'Aliado 8' },
  { img: `${base}/9.svg`, alt: 'Aliado 9' },
  { img: `${base}/10.svg`, alt: 'Aliado 10' },
  { img: `${base}/11.svg`, alt: 'Aliado 11' },
  { img: `${base}/12.svg`, alt: 'Aliado 12' },
  { img: `${base}/13.svg`, alt: 'Aliado 13' },
  { img: `${base}/14.svg`, alt: 'Aliado 14' },
  { img: `${base}/15.svg`, alt: 'Aliado 15' },
  { img: `${base}/16.svg`, alt: 'Aliado 16' },
  { img: `${base}/17.svg`, alt: 'Aliado 17' },
  { img: `${base}/18.svg`, alt: 'Aliado 18' },
  { img: `${base}/19.svg`, alt: 'Aliado 19' },
  { img: `${base}/20.svg`, alt: 'Aliado 20' },
  { img: `${base}/21.svg`, alt: 'Aliado 21' },
  { img: `${base}/22.svg`, alt: 'Aliado 22' },
  { img: `${base}/23.svg`, alt: 'Aliado 23' },
]
