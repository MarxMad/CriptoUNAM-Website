import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faCamera } from '@fortawesome/free-solid-svg-icons'
import SEOHead from '../components/SEOHead'
import '../styles/global.css'

// Mapeo de imágenes por mes
const monthImages: Record<string, string[]> = {
  ENERO: [
    '65abfefe-90b1-4122-985a-0b02dd95833e.JPG',
    'IMG_1021.HEIC',
    'IMG_1054.HEIC',
    'IMG_1061.HEIC',
    'IMG_1064.HEIC',
    'IMG_1065.HEIC'
  ],
  FEBRERO: [
    '305D7F65-74C4-412C-B606-11154F7D2FE6 2.JPG',
    '3ECEA6CC-BED8-4421-BBA2-BF6BC6669922.JPG',
    '77bb370d-c32f-42f8-aa79-87d47929b239.JPG',
    'B1F27CE8-9CBC-4D5D-9431-9EF3B19986DA.JPG',
    'camphoto_1903590565.JPG',
    'camphoto_959030623.JPG',
    'IMG_1370.HEIC',
    'IMG_1379.HEIC',
    'IMG_1407.HEIC',
    'IMG_1486.PNG',
    'IMG_1509.HEIC',
    'IMG_1516.HEIC',
    'IMG_1526.HEIC',
    'IMG_1650.HEIC',
    'IMG_1652.HEIC',
    'IMG_1655.HEIC',
    'IMG_1666.HEIC',
    'IMG_1670.HEIC',
    'IMG_1673.HEIC',
    'IMG_1674.HEIC',
    'IMG_1676.HEIC',
    'IMG_1678.HEIC',
    'IMG_1740.jpg',
    'IMG_4409.HEIF',
    'IMG_4454.HEIF'
  ],
  MARZO: [
    '16EF3BED-A9CC-4B2C-8A91-4003EBC49487.JPG',
    '784BBF1F-045F-41FC-A49C-DE177B0C5003.JPG',
    'A7CBB16B-FD9E-44A6-9DEE-AA596EE15697.JPG',
    'IMG_1801.HEIC',
    'IMG_1877.HEIC',
    'IMG_1901.HEIC',
    'IMG_1913.HEIC',
    'IMG_1922.HEIC',
    'IMG_1932.HEIC',
    'IMG_1946.JPG',
    'IMG_1947.JPG',
    'IMG_2016.HEIC',
    'IMG_2028.HEIC',
    'IMG_2031.HEIC',
    'IMG_2220.HEIC',
    'IMG_2377.HEIC',
    'IMG_2391.HEIC',
    'IMG_2431 2.HEIC',
    'IMG_2548.PNG',
    'IMG_2613.HEIC',
    'IMG_2696.HEIC',
    'IMG_2804.HEIC',
    'IMG_2862.HEIC',
    'IMG_2870.HEIC',
    'IMG_2896.HEIC',
    'IMG_2897.HEIC',
    'IMG_2901.HEIC',
    'IMG_2903.HEIC'
  ],
  ABRIL: [
    'c3eb8977-2bc8-457f-a87f-b7f17d6ed967.JPG',
    'IMG_2955.HEIC',
    'IMG_2958.HEIC',
    'IMG_2964.HEIC',
    'IMG_3002.HEIC',
    'IMG_3011.HEIC',
    'IMG_3036.JPG',
    'IMG_3043.HEIC',
    'IMG_3046.HEIC',
    'IMG_3052.JPG',
    'IMG_3090.HEIC',
    'IMG_3091.HEIC',
    'IMG_3260.HEIC',
    'IMG_3283.HEIC',
    'IMG_3329.PNG',
    'IMG_3418.HEIC',
    'IMG_3425.HEIC',
    'IMG_3429.heic',
    'IMG_3430.HEIC',
    'IMG_3433.HEIC',
    'IMG_3480.HEIC',
    'IMG_3488.HEIC',
    'IMG_3489.HEIC',
    'IMG_3508.HEIC',
    'IMG_3509.HEIC',
    'IMG_3520.HEIC',
    'IMG_3524.HEIC',
    'IMG_3529.HEIC',
    'IMG_3534.HEIC'
  ],
  MAYO: [
    '0c04b7d6-0cf1-43b4-9506-c8318a4af1ea 2.JPG',
    '4f3ba804-7c7d-4bb0-96de-6d912d5b6a4d 2.JPG',
    '5c7e70e9-fd07-4f7d-99a0-e1bcc1eab3bf 2.JPG',
    '6BDD7C54-BCDC-4682-930E-2D959357A8C4 2.JPG',
    '804ae1cf-1914-44e6-bc74-b225c7b7231e 2.JPG',
    'ABBCCA98-4998-4B87-A228-152B8ECF8587 2.JPG',
    'DFA28DF5-0D1A-40BC-B2FD-E018B3FB87A1 2.JPG',
    'e0126864-cbe4-4eb8-ab67-96e4d4270da2 2.JPG',
    'e7696d32-51e5-4b71-8902-13f2b214b0a5 2.JPG',
    'IMG_3547 2.HEIC',
    'IMG_3553 2.HEIC',
    'IMG_3557 2.HEIC',
    'IMG_3560 2.JPG',
    'IMG_3579 2.HEIC',
    'IMG_3593 2.HEIC',
    'IMG_3612 2.HEIC',
    'IMG_3617 2.HEIC',
    'IMG_3657 2.HEIC',
    'IMG_3658 2.HEIC',
    'IMG_3682 2.HEIC',
    'IMG_3722 2.JPG',
    'IMG_3725 2.JPG',
    'IMG_3753 2.HEIC',
    'IMG_3763 2.JPG',
    'IMG_3889 2.HEIC',
    'IMG_3890 2.HEIC',
    'IMG_3949 2.HEIC',
    'IMG_3950 2.HEIC',
    'IMG_3973 2.HEIC',
    'IMG_3997 2.HEIC',
    'IMG_4008 2.HEIC',
    'IMG_4104 2.HEIC',
    'IMG_4105 2.HEIC',
    'IMG_4157 2.HEIC',
    'IMG_4160 2.HEIC'
  ],
  JUNIO: [
    '55A059F5-EDEE-4124-A622-D429C35A23FE.JPG',
    '7556f6fe-e87c-4a43-b8bf-879035a20da2.JPG',
    'a1a2c0db-d26b-42ed-aa03-7a95aceb3b18.JPG',
    'IMG_4187.PNG',
    'IMG_4260.HEIC',
    'IMG_4272.HEIC',
    'IMG_4437.HEIC',
    'IMG_4458.PNG',
    'IMG_4493.JPG'
  ],
  JULIO: [
    'IMG_4561.JPG',
    'IMG_4606.HEIC',
    'IMG_4610.HEIC',
    'IMG_4623.HEIC',
    'IMG_4641.HEIC',
    'IMG_4662.HEIC',
    'IMG_4677.HEIC',
    'IMG_4688.PNG',
    'IMG_4689.HEIC',
    'IMG_4712.JPG',
    'IMG_4764.HEIC',
    'IMG_4796.HEIC',
    'IMG_4807.HEIC',
    'IMG_4829.HEIC',
    'IMG_4855.HEIC',
    'IMG_4864.HEIC',
    'IMG_4905.HEIC',
    'IMG_4935.HEIC',
    'IMG_4940.HEIC'
  ],
  AGOSTO: [
    'camphoto_1804928587 2.JPG',
    'camphoto_1804928587.JPG',
    'camphoto_33463914 2.JPG',
    'camphoto_959030623 2.JPG',
    'IMG_5117.HEIC',
    'IMG_5195.HEIC',
    'IMG_5210.HEIC',
    'IMG_5214.HEIC',
    'IMG_5220.HEIC',
    'IMG_5269.HEIC',
    'IMG_5273.HEIC',
    'IMG_5279.HEIC',
    'IMG_5289.HEIC',
    'IMG_5322.HEIC',
    'IMG_5324.HEIC',
    'IMG_5329.HEIC',
    'IMG_5358.HEIC',
    'IMG_5363.HEIC',
    'IMG_5371.HEIC',
    'IMG_5376.HEIC',
    'IMG_5426.HEIC',
    'IMG_5429.JPG',
    'IMG_5455 2.HEIC',
    'IMG_5456 2.HEIC',
    'IMG_5465.HEIC',
    'IMG_5471.HEIC',
    'IMG_5474.HEIC',
    'IMG_5479.HEIC',
    'IMG_5489.HEIC',
    'IMG_5494.HEIC',
    'IMG_5515.JPG',
    'IMG_5516.JPG',
    'IMG_5525.JPG'
  ],
  SEPTIEMBRE: [
    'camphoto_33463914 3.JPG',
    'camphoto_959030623 3.JPG',
    'IMG_5753 3.jpg',
    'IMG_5799 3.HEIC',
    'IMG_5847 3.JPG',
    'IMG_5922 3.HEIC',
    'IMG_5977 3.HEIC',
    'IMG_5979 3.HEIC',
    'IMG_6014 3.HEIC',
    'IMG_6025 3.HEIC',
    'IMG_6042 3.HEIC',
    'IMG_6046 3.HEIC',
    'IMG_6063 3.HEIC',
    'IMG_6102 3.HEIC',
    'IMG_6116 3.HEIC',
    'IMG_6217 3.HEIC',
    'IMG_6417 3.HEIC',
    'IMG_6462 3.HEIC',
    'IMG_6493 3.HEIC'
  ],
  OCTUBRE: [
    '57b46d46-8f91-44c5-b7f6-868620625819.JPG',
    'IMG_6538.HEIC',
    'IMG_6539.HEIC',
    'IMG_6710.HEIC',
    'IMG_6717.HEIC',
    'IMG_6727.JPG',
    'IMG_6784.HEIC',
    'IMG_6787.HEIC',
    'IMG_6799.PNG',
    'IMG_6805.PNG',
    'IMG_6914.PNG',
    'IMG_6954.HEIC',
    'IMG_6958.HEIC',
    'IMG_6960.HEIC',
    'IMG_6983 2.JPG',
    'IMG_7006.HEIC',
    'IMG_7009.HEIC'
  ],
  NOVIEMBRE: [
    '007f7872bdaaf1719ef62595f2f2bd39 2.JPG',
    'IMG_7079 2.JPG',
    'IMG_7081 2.HEIC',
    'IMG_7092 2.HEIC',
    'IMG_7185 2.HEIC',
    'IMG_7222 2.HEIC',
    'IMG_7251 2.HEIC',
    'IMG_7277 2.HEIC',
    'IMG_7283 2.JPG',
    'IMG_7306 2.HEIC',
    'IMG_7326 2.HEIC',
    'IMG_7346 2.HEIC',
    'IMG_7382 2.HEIC',
    'IMG_7418 2.HEIC',
    'IMG_7432 2.HEIC',
    'IMG_7477 2.HEIC',
    'IMG_7509 2.PNG',
    'IMG_7518 2.HEIC',
    'IMG_7519 2.HEIC',
    'IMG_7526 2.HEIC',
    'IMG_7569 2.HEIC',
    'IMG_7581 2.HEIC',
    'IMG_7595 2.PNG',
    'IMG_7596 2.PNG',
    'IMG_7598 2.PNG',
    'IMG_7647 2.HEIC',
    'IMG_7658 2.HEIC',
    'IMG_7795 2.HEIC',
    'IMG_7929 2.HEIC',
    'IMG_7934 2.HEIC'
  ],
  DICIEMBRE: [
    'IMG_8034.JPG',
    'IMG_8049.HEIC',
    'IMG_8062.PNG',
    'IMG_8088.PNG',
    'IMG_8129.PNG',
    'IMG_8156.HEIC',
    'IMG_8164.JPG'
  ]
}

const YearInReview: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 18

  // Función helper para obtener la ruta de la imagen
  const getImagePath = (month: string, filename: string) => {
    // En Vite, las rutas desde /public se sirven desde la raíz
    // No codificar aquí, dejar que el navegador maneje la codificación
    return `/images/${month}_CRIPTOUNAM/${filename}`
  }

  // Componente de galería de imágenes
  const ImageGallery: React.FC<{ month: string }> = ({ month }) => {
    const images = monthImages[month] || []
    
    // Procesar imágenes: convertir HEIC/HEIF a JPG y filtrar solo compatibles
    const compatibleImages = images
      .map(filename => {
        const ext = filename.toLowerCase()
        // Si es HEIC/HEIF, buscar versión JPG equivalente (ya convertida)
        if (ext.endsWith('.heic') || ext.endsWith('.heif')) {
          const baseName = filename.replace(/\.(heic|HEIC|heif|HEIF)$/i, '')
          return `${baseName}.jpg` // Usar versión JPG convertida
        }
        return filename
      })
      .filter(filename => {
        const ext = filename.toLowerCase()
        return ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png') || ext.endsWith('.gif') || ext.endsWith('.webp')
      })
      // Eliminar duplicados (por si hay tanto HEIC como JPG en la lista)
      .filter((value, index, self) => self.indexOf(value) === index)
    
    if (compatibleImages.length === 0) {
      return (
        <div className="image-placeholder">
          <FontAwesomeIcon icon={faCamera} />
          <p>No hay imágenes compatibles disponibles</p>
          <p style={{ fontSize: '12px', marginTop: '10px', opacity: 0.6 }}>
            (Los archivos HEIC no se pueden mostrar en navegadores web)
          </p>
        </div>
      )
    }

    return (
      <div className="image-gallery">
        <div className="image-gallery-grid">
          {compatibleImages.map((filename, index) => {
            // Codificar el nombre del archivo para manejar espacios y caracteres especiales
            const encodedFilename = encodeURIComponent(filename)
            const imagePath = `/images/${month}_CRIPTOUNAM/${encodedFilename}`
            
            // Función para intentar diferentes variaciones del nombre
            const tryAlternatives = (target: HTMLImageElement, attempts: number = 0) => {
              const alternatives = [
                encodedFilename, // Primera opción: codificado
                filename, // Segunda opción: sin codificar
                filename.replace(/\s+/g, '%20'), // Tercera opción: espacios como %20
                filename.replace(/\s+/g, '+'), // Cuarta opción: espacios como +
              ]
              
              // También intentar con extensiones en minúsculas/mayúsculas
              const ext = filename.split('.').pop()?.toLowerCase()
              const baseName = filename.substring(0, filename.lastIndexOf('.'))
              if (ext) {
                alternatives.push(`${encodeURIComponent(baseName)}.${ext}`)
                alternatives.push(`${encodeURIComponent(baseName)}.${ext.toUpperCase()}`)
              }
              
              if (attempts < alternatives.length) {
                const altPath = `/images/${month}_CRIPTOUNAM/${alternatives[attempts]}`
                console.log(`🔄 Intento ${attempts + 1}: ${altPath}`)
                target.src = altPath
                target.dataset.attempt = String(attempts + 1)
              } else {
                console.error(`❌ No se pudo cargar después de ${alternatives.length} intentos: ${filename}`)
                target.style.opacity = '0.1'
                target.style.filter = 'grayscale(100%) blur(2px)'
              }
            }
            
            return (
              <div 
                key={`${month}-${index}-${filename}`} 
                className="gallery-image-wrapper"
              >
                <img
                  src={imagePath}
                  alt={`${month} ${index + 1}`}
                  className="gallery-image"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    const currentAttempt = parseInt(target.dataset.attempt || '0')
                    console.warn(`⚠️ Error cargando (intento ${currentAttempt}): ${imagePath}`, filename)
                    tryAlternatives(target, currentAttempt)
                  }}
                  onLoad={(e) => {
                    // Cuando carga correctamente
                    const target = e.currentTarget as HTMLImageElement
                    target.style.opacity = '1'
                    target.style.filter = 'none'
                    // Solo log en desarrollo para no saturar la consola
                    if (import.meta.env.DEV) {
                      console.log(`✅ Imagen cargada: ${filename}`)
                    }
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        prevSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const progress = ((currentSlide + 1) / totalSlides) * 100

  return (
    <>
      <SEOHead 
        title="CriptoUNAM Executive Recap 2024-2025"
        description="Resumen ejecutivo del año 2024-2025 de CriptoUNAM"
      />
      <div className="year-review-container">
        <style>{`
          :root {
            --unam-blue: #002B7A;
            --unam-gold: #D4AF37;
            --bg-dark: #0a0a0c;
            --card-bg: rgba(255, 255, 255, 0.03);
            --transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          }

          .year-review-container {
            background-color: var(--bg-dark);
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            color: #fff;
            overflow: hidden;
            height: 100vh;
            width: 100vw;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            isolation: isolate;
          }

          .year-review-container * {
            box-sizing: border-box;
          }

          .presentation {
            width: 100vw;
            height: 100vh;
            position: relative;
          }

          .slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 60px;
            opacity: 0;
            pointer-events: none;
            transform: translateY(20px);
            transition: var(--transition);
            z-index: 1;
          }

          .slide.active {
            opacity: 1;
            pointer-events: all;
            transform: translateY(0);
            z-index: 10;
          }

          .slide-title {
            font-family: 'Urbanist', 'Orbitron', sans-serif;
            font-size: 56px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: -2px;
            margin-bottom: 20px;
            text-align: center;
            line-height: 1;
          }

          .slide-subtitle {
            font-size: 20px;
            color: var(--unam-gold);
            text-transform: uppercase;
            letter-spacing: 4px;
            margin-bottom: 40px;
            font-weight: 600;
          }

          .content-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            width: 100%;
            max-width: 1100px;
            align-items: center;
          }

          .card {
            background: var(--card-bg);
            border: 1px solid rgba(255,255,255,0.1);
            padding: 40px;
            border-radius: 24px;
            backdrop-filter: blur(10px);
          }

          .logo-main {
            height: 180px;
            margin-bottom: 30px;
            filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.3));
          }

          .floating-logo {
            position: absolute;
            top: 40px;
            left: 40px;
            height: 50px;
            z-index: 100;
            opacity: 0.6;
          }

          .month-badge {
            background: var(--unam-gold);
            color: #000;
            padding: 5px 15px;
            border-radius: 4px;
            font-weight: 900;
            font-size: 14px;
            margin-bottom: 15px;
            display: inline-block;
          }

          .stats-huge {
            font-size: 140px;
            font-weight: 900;
            color: var(--unam-gold);
            line-height: 1;
            font-family: 'Urbanist', 'Orbitron', sans-serif;
          }

          .project-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            width: 100%;
            max-width: 1200px;
          }

          .project-tile {
            background: rgba(255,255,255,0.05);
            padding: 25px;
            border-radius: 16px;
            border-top: 4px solid var(--unam-gold);
          }

          .project-tile h3 {
            font-size: 22px;
            margin-bottom: 10px;
            color: var(--unam-gold);
          }

          .project-tile p {
            font-size: 14px;
            opacity: 0.8;
            line-height: 1.4;
          }

          .team-section {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            width: 100%;
            max-width: 1000px;
          }

          .team-member {
            text-align: center;
          }

          .team-member h4 {
            color: var(--unam-gold);
            font-size: 18px;
            margin-bottom: 5px;
          }

          .team-member p {
            font-size: 14px;
            opacity: 0.7;
          }

          .controls {
            position: absolute;
            bottom: 40px;
            display: flex;
            align-items: center;
            gap: 20px;
            z-index: 100;
          }

          .nav-btn {
            background: rgba(255,255,255,0.1);
            border: none;
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            cursor: pointer;
            transition: 0.3s;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .nav-btn:hover {
            background: var(--unam-gold);
            color: black;
          }

          .progress-bar {
            width: 300px;
            height: 4px;
            background: rgba(255,255,255,0.1);
            border-radius: 2px;
            position: relative;
          }

          .progress-fill {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            background: var(--unam-gold);
            transition: 0.3s;
          }

          .bg-glow {
            position: absolute;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(0, 43, 122, 0.2) 0%, transparent 70%);
            border-radius: 50%;
            z-index: 0;
            pointer-events: none;
          }

          .image-placeholder {
            width: 100%;
            height: 350px;
            background: #111;
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border: 1px dashed rgba(255,255,255,0.2);
            color: rgba(255,255,255,0.3);
          }

          .image-placeholder svg {
            font-size: 48px;
            margin-bottom: 10px;
          }

          .image-gallery {
            width: 100%;
            max-height: 500px;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 10px;
            background: rgba(0,0,0,0.2);
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.1);
          }

          .image-gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 12px;
            padding: 10px;
          }

          .gallery-image {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 8px;
            border: 2px solid rgba(212, 175, 55, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
            display: block !important;
            background: rgba(255,255,255,0.02);
            opacity: 1 !important;
            visibility: visible !important;
          }

          .gallery-image:hover {
            transform: scale(1.05);
            border-color: var(--unam-gold);
            box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
          }

          .gallery-image[src=""] {
            display: none;
          }

          .gallery-image-wrapper {
            position: relative;
            width: 100%;
            min-height: 150px;
            background: rgba(0,0,0,0.2);
            border-radius: 8px;
            overflow: hidden;
          }

          .image-gallery::-webkit-scrollbar {
            width: 8px;
          }

          .image-gallery::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.05);
            border-radius: 4px;
          }

          .image-gallery::-webkit-scrollbar-thumb {
            background: var(--unam-gold);
            border-radius: 4px;
          }

          .image-gallery::-webkit-scrollbar-thumb:hover {
            background: #F4C842;
          }

          @media (max-width: 768px) {
            .slide {
              padding: 30px 20px;
            }

            .slide-title {
              font-size: 36px;
            }

            .content-grid {
              grid-template-columns: 1fr;
              gap: 20px;
            }

            .project-grid {
              grid-template-columns: 1fr;
            }

            .team-section {
              grid-template-columns: 1fr;
            }

            .stats-huge {
              font-size: 80px;
            }

            .progress-bar {
              width: 150px;
            }

            .image-gallery {
              max-height: 400px;
            }

            .image-gallery-grid {
              grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
              gap: 8px;
            }

            .gallery-image {
              height: 100px;
            }
          }
        `}</style>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;700;900&family=Inter:wght@300;400;600&display=swap" rel="stylesheet" />

        <img 
          src="/images/LogosCriptounam3.svg" 
          className="floating-logo" 
          alt="CriptoUNAM" 
        />

        <div className="bg-glow" style={{ top: '-200px', left: '-200px' }}></div>
        <div className="bg-glow" style={{ bottom: '-200px', right: '-200px' }}></div>

        <div className="presentation">
          {/* SLIDE 1: PORTADA */}
          <div className={`slide ${currentSlide === 0 ? 'active' : ''}`}>
            <img 
              src="/images/LogosCriptounam3.svg" 
              className="logo-main" 
              alt="CriptoUNAM" 
            />
            <h1 className="slide-title" style={{ fontSize: '90px' }}>
              RECAP<span style={{ color: 'var(--unam-gold)' }}>CRIPTOUNAM 2025</span>
            </h1>
            <p className="slide-subtitle">ESTO FUE LO QUE HICIMOS EN 2025 🎉</p>
            <p style={{ opacity: 0.6 }}></p>
          </div>

          

          {/* SLIDES MENSUALES (1-12) */}
          <div className={`slide ${currentSlide === 1 ? 'active' : ''}`}>
            <div className="month-badge">ENERO</div>
            <h2 className="slide-title">
              Planeación <span style={{ color: 'var(--unam-gold)' }}>Estratégica</span>
            </h2>
            <div className="content-grid">
              <div className="card">
                <p>Definición del Roadmap Anual. Establecimiento de gobernanza interna y diseño de identidad visual para redes sociales.</p>
              </div>
              <ImageGallery month="ENERO" />
            </div>
          </div>

          <div className={`slide ${currentSlide === 2 ? 'active' : ''}`}>
            <div className="month-badge">FEBRERO</div>
            <h2 className="slide-title">
              Lanzamiento <span style={{ color: 'var(--unam-gold)' }}>Educativo</span>
            </h2>
            <div className="content-grid">
              <ImageGallery month="FEBRERO" />
              <div className="card">
                <p>Lanzamiento oficial del Newsletter CriptoUNAM. Alcanzamos los primeros 200 suscriptores interesados en tecnología L2.</p>
              </div>
            </div>
          </div>

          <div className={`slide ${currentSlide === 3 ? 'active' : ''}`}>
            <div className="month-badge">MARZO</div>
            <h2 className="slide-title">
              Bitcoin Day <span style={{ color: 'var(--unam-gold)' }}>UNAM</span>
            </h2>
            <div className="content-grid">
              <div className="card">
                <p>Evento masivo en la Facultad de Ingeniería. Onboarding de más de 300 estudiantes a la red Ethereum.</p>
              </div>
              <ImageGallery month="MARZO" />
            </div>
          </div>

          <div className={`slide ${currentSlide === 4 ? 'active' : ''}`}>
            <div className="month-badge">ABRIL</div>
            <h2 className="slide-title">
              Expansión <span style={{ color: 'var(--unam-gold)' }}>Interuniversitaria</span>
            </h2>
            <div className="content-grid">
              <ImageGallery month="ABRIL" />
              <div className="card">
                <p>Alianzas con ITAM e IPN. Participación como Community Partners en BlockchainCoin, liderando el diálogo académico.</p>
              </div>
            </div>
          </div>

          <div className={`slide ${currentSlide === 5 ? 'active' : ''}`}>
            <div className="month-badge">MAYO</div>
            <h2 className="slide-title">
              Base Batch <span style={{ color: 'var(--unam-gold)' }}>LatAm</span>
            </h2>
            <div className="content-grid">
              <div className="card">
                <p><strong>CampusCoin</strong> seleccionado como finalista. Además, celebramos el Bitcoin Pizza Day con una gran convocatoria en Ingeniería.</p>
              </div>
              <ImageGallery month="MAYO" />
            </div>
          </div>

          <div className={`slide ${currentSlide === 6 ? 'active' : ''}`}>
            <div className="month-badge">JUNIO</div>
            <h2 className="slide-title">
              ETH <span style={{ color: 'var(--unam-gold)' }}>Mérida</span>
            </h2>
            <div className="content-grid">
              <ImageGallery month="JUNIO" />
              <div className="card">
                <p>Participación destacada en ETH Mérida. Networking con protocolos globales para traer recursos a la comunidad local.</p>
              </div>
            </div>
          </div>

          <div className={`slide ${currentSlide === 7 ? 'active' : ''}`}>
            <div className="month-badge">JULIO</div>
            <h2 className="slide-title">
              Summer <span style={{ color: 'var(--unam-gold)' }}>Builders</span>
            </h2>
            <div className="content-grid">
              <div className="card">
                <p>Mes de inmersión técnica intensiva en Rust y Solidity. Preparación de los equipos para la temporada de hackathons.</p>
              </div>
              <ImageGallery month="JULIO" />
            </div>
          </div>

          <div className={`slide ${currentSlide === 8 ? 'active' : ''}`}>
            <div className="month-badge">AGOSTO</div>
            <h2 className="slide-title">
              Bitso Win & <span style={{ color: 'var(--unam-gold)' }}>Unlock</span>
            </h2>
            <div className="content-grid">
              <ImageGallery month="AGOSTO" />
              <div className="card">
                <p>Ganadores del Bitso Hackathon con <strong>La Kiniela</strong>. Apoyo organizacional en Unlock Summit Zacatlán.</p>
              </div>
            </div>
          </div>

          <div className={`slide ${currentSlide === 9 ? 'active' : ''}`}>
            <div className="month-badge">SEPTIEMBRE</div>
            <h2 className="slide-title">
              Meridian <span style={{ color: 'var(--unam-gold)' }}>Rio</span>
            </h2>
            <div className="content-grid">
              <div className="card">
                <p>CriptoUNAM en Río de Janeiro para Stellar Meridian. Desarrollo de Soroswap en Telegram y semifinalistas en CoreDAO.</p>
              </div>
              <ImageGallery month="SEPTIEMBRE" />
            </div>
          </div>

          <div className={`slide ${currentSlide === 10 ? 'active' : ''}`}>
            <div className="month-badge">OCTUBRE</div>
            <h2 className="slide-title">
              Starknet re&#123;solve&#125; & <span style={{ color: 'var(--unam-gold)' }}>Islas</span>
            </h2>
            <div className="content-grid">
              <ImageGallery month="OCTUBRE" />
              <div className="card">
                <p>Ganadores Starknet re&#123;solve&#125; (NearMint). Impacto masivo en la Feria de Comunidades de la UNAM en Las Islas.</p>
              </div>
            </div>
          </div>

          <div className={`slide ${currentSlide === 11 ? 'active' : ''}`}>
            <div className="month-badge">NOVIEMBRE</div>
            <h2 className="slide-title">
              Hazaña en <span style={{ color: 'var(--unam-gold)' }}>Monterrey</span>
            </h2>
            <div className="content-grid">
              <div className="card">
                <p><strong>Verifica.xyz</strong> gana 3 Tracks en ETH México Monterrey. Gerry imparte taller de VibeCoding Sold-Out.</p>
              </div>
              <ImageGallery month="NOVIEMBRE" />
            </div>
          </div>

          <div className={`slide ${currentSlide === 12 ? 'active' : ''}`}>
            <div className="month-badge">DICIEMBRE</div>
            <h2 className="slide-title">
              Cierre & <span style={{ color: 'var(--unam-gold)' }}>Localism</span>
            </h2>
            <div className="content-grid">
              <ImageGallery month="DICIEMBRE" />
              <div className="card">
                <p>Recap anual y selección oficial para el Localism Fund. Preparación de la agenda de Mini-Hackathons 2026.</p>
              </div>
            </div>
          </div>

          {/* SLIDE: IMPACTO EN CIFRAS (después de Diciembre) */}
          <div className={`slide ${currentSlide === 13 ? 'active' : ''}`}>
            <h2 className="slide-title">
              IMPACTO EN <span style={{ color: 'var(--unam-gold)' }}>CIFRAS</span>
            </h2>
            <div className="content-grid">
              <div style={{ textAlign: 'center' }}>
                <div className="stats-huge">$65K+</div>
                <p className="slide-subtitle">USD Generados en Premios</p>
              </div>
              <div className="card">
                <p style={{ marginBottom: '20px' }}><strong>7 Hackathons</strong> Atendidos</p>
                <p style={{ marginBottom: '20px' }}><strong>12 Tracks</strong> Ganados</p>
                <p style={{ marginBottom: '20px' }}><strong>+500 Miembros</strong> en la comunidad</p>
                <p><strong>100%</strong> de compromiso con la educación</p>
              </div>
            </div>
          </div>

          {/* SLIDE 15: HALL OF FAME (PROYECTOS) */}
          <div className={`slide ${currentSlide === 14 ? 'active' : ''}`}>
            <h2 className="slide-title">
              HALL OF <span style={{ color: 'var(--unam-gold)' }}>FAME</span>
            </h2>
            <p className="slide-subtitle">Soluciones On-Chain de Alto Nivel</p>
            <div className="project-grid">
              <div className="project-tile">
                <h3>Verifica.xyz</h3>
                <p>Transparencia institucional con ENS. Ganador de 3 tracks en ETH México Monterrey.</p>
              </div>
              <div className="project-tile">
                <h3>La Kiniela</h3>
                <p>Predicciones descentralizadas en Arbitrum. Ganadores del Bitso Hackathon 2025.</p>
              </div>
              <div className="project-tile">
                <h3>NearMint</h3>
                <p>Protección de coleccionables físicos en Starknet. Ganador de Starknet re&#123;solve&#125;.</p>
              </div>
              <div className="project-tile">
                <h3>CampusCoin</h3>
                <p>Gestión de gastos académicos on-chain. Finalista en Base Batch LatAm.</p>
              </div>
              <div className="project-tile">
                <h3>UnBoX</h3>
                <p>Tokenización de streetwear y art toys en Solana. Pitched en Solana Founders House.</p>
              </div>
              <div className="project-tile">
                <h3>CoreWeave</h3>
                <p>Agentes inteligentes para lanzamiento de tokens. Semifinalistas en CoreDAO.</p>
              </div>
            </div>
          </div>

          {/* SLIDE 17: EL DREAM TEAM */}
          <div className={`slide ${currentSlide === 15 ? 'active' : ''}`}>
            <h2 className="slide-title">
              EL <span style={{ color: 'var(--unam-gold)' }}>DREAM TEAM</span>
            </h2>
            <div className="team-section">
              <div className="team-member">
                <h4>Fernanda Tello</h4>
                <p>Project Manager</p>
              </div>
              <div className="team-member">
                <h4>Adrián Armenta</h4>
                <p>CTO & Workshop Lead</p>
              </div>
              <div className="team-member">
                <h4>Andrés Rodríguez</h4>
                <p>Technical Lead</p>
              </div>
              <div className="team-member">
                <h4>Gerry</h4>
                <p>UI/UX & VibeCoding</p>
              </div>
              <div className="team-member">
                <h4>Ian & Elías</h4>
                <p>Smart Contract Builders</p>
              </div>
              <div className="team-member">
                <h4>Nayeli & Kubs</h4>
                <p>Operations & Logistics</p>
              </div>
            </div>
            <div className="card" style={{ marginTop: '40px', padding: '20px', fontSize: '16px', textAlign: 'center', borderColor: 'var(--unam-gold)' }}>
              Agradecimiento especial a Daniel y a todos los voluntarios que sudaron la camiseta.
            </div>
          </div>

          {/* SLIDE 18: VISIÓN 2026 */}
          <div className={`slide ${currentSlide === 16 ? 'active' : ''}`}>
            <h2 className="slide-title">
              MISIÓN <span style={{ color: 'var(--unam-gold)' }}>2026</span>
            </h2>
            <div className="content-grid">
              <div className="card">
                <h3 style={{ color: 'var(--unam-gold)', marginBottom: '15px' }}>Localism Fund</h3>
                <p>Escalaremos los Mini-Hackathons dentro de Ciudad Universitaria para que el talento local tenga incentivos de construcción directa.</p>
              </div>
              <div className="card">
                <h3 style={{ color: 'var(--unam-gold)', marginBottom: '15px' }}>Escalabilidad</h3>
                <p>Establecer el primer laboratorio físico de desarrollo Web3 en la Facultad de Ingeniería para incubar proyectos nativos UNAM.</p>
              </div>
            </div>
          </div>

          {/* SLIDE 19: GRACIAS */}
          <div className={`slide ${currentSlide === 17 ? 'active' : ''}`}>
            <h1 className="slide-title" style={{ fontSize: '100px' }}>GRACIAS</h1>
            <p className="slide-subtitle" style={{ color: 'white', fontSize: '24px' }}>
              ¡NOS VEMOS EN EL CÓDIGO!
            </p>
            <div style={{ display: 'flex', gap: '40px', marginTop: '50px', opacity: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
              <span>Arbitrum</span> • <span>Scroll</span> • <span>ENS</span> • <span>Eth 5 de Mayo</span> • <span>Frutero Club</span>
            </div>
          </div>

          {/* CONTROLES */}
          <div className="controls">
            <button className="nav-btn" onClick={prevSlide}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <button className="nav-btn" onClick={nextSlide}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default YearInReview

