/**
 * 24 fotos de la comunidad para la landing (grid 4×6).
 * Combinación de meses: febrero, mayo, julio y noviembre 2025.
 * Rutas: public/images/{carpeta}/{archivo}
 */
export interface FotoComunidadItem {
  src: string
  alt: string
}

const FEBRERO = 'FEBRERO_CRIPTOUNAM'
const MAYO = 'MAYO_CRIPTOUNAM'
const JULIO = 'JULIO_CRIPTOUNAM'
const AGOSTO = 'AGOSTO_CRIPTOUNAM'
const NOVIEMBRE = 'NOVIEMBRE_CRIPTOUNAM'

function foto(carpeta: string, archivo: string, alt: string): FotoComunidadItem {
  return {
    src: `/images/${carpeta}/${encodeURIComponent(archivo)}`,
    alt
  }
}

export const fotosComunidadLanding: FotoComunidadItem[] = [
  // Febrero 2025 (6)
  foto(FEBRERO, '305D7F65-74C4-412C-B606-11154F7D2FE6 2.JPG', 'Eventos Economía UNAM - Feb 2025'),
  foto(FEBRERO, '3ECEA6CC-BED8-4421-BBA2-BF6BC6669922.JPG', 'CriptoUNAM Febrero 2025'),
  foto(FEBRERO, '77bb370d-c32f-42f8-aa79-87d47929b239.JPG', 'Comunidad Feb 2025'),
  foto(FEBRERO, 'B1F27CE8-9CBC-4D5D-9431-9EF3B19986DA.JPG', 'Evento Economía UNAM'),
  foto(FEBRERO, 'IMG_1370.jpg', 'Actividad CriptoUNAM'),
  foto(FEBRERO, 'IMG_1740.jpg', 'Eventos Febrero 2025'),
  // Mayo 2025 (6)
  foto(MAYO, '0c04b7d6-0cf1-43b4-9506-c8318a4af1ea 2.JPG', 'Hackathon LatAm Mayo 2025'),
  foto(MAYO, '4f3ba804-7c7d-4bb0-96de-6d912d5b6a4d 2.JPG', 'Comunidad Mayo 2025'),
  foto(MAYO, '5c7e70e9-fd07-4f7d-99a0-e1bcc1eab3bf 2.JPG', 'Evento Mayo'),
  foto(MAYO, 'IMG_3560 2.JPG', 'CriptoUNAM Mayo'),
  foto(MAYO, 'IMG_3722 2.JPG', 'Taller Mayo 2025'),
  foto(MAYO, 'IMG_3763 2.JPG', 'Hackathones LatAm'),
  // Julio 2025 (5 — se quitó la que estaba antes del banner)
  foto(JULIO, 'IMG_4561.JPG', 'Summer Builders Julio 2025'),
  foto(JULIO, 'IMG_4688.PNG', 'Evento Julio 2025'),
  foto(JULIO, 'IMG_4677.jpg', 'CriptoUNAM Julio'),
  foto(JULIO, 'IMG_4610.jpg', 'Actividad Summer'),
  foto(JULIO, 'IMG_4641.jpg', 'Julio 2025'),
  // Noviembre 2025 (6)
  foto(NOVIEMBRE, '007f7872bdaaf1719ef62595f2f2bd39 2.JPG', 'Devconnect / ETH Global Argentina'),
  foto(AGOSTO, 'camphoto_1804928587.JPG', 'Agosto 2025 - CriptoUNAM'),
  foto(AGOSTO, 'IMG_5429.JPG', 'Bitso Win / ETH Global NYC'),
  foto(AGOSTO, 'IMG_5515.JPG', 'Eventos Agosto 2025'),
  foto(FEBRERO, 'IMG_1379.jpg', 'Eventos Febrero 2025'),
  foto(FEBRERO, 'IMG_1486.PNG', 'Economía UNAM Feb 2025'),
  foto(FEBRERO, 'IMG_1509.jpg', 'CriptoUNAM Feb 2025')
]
