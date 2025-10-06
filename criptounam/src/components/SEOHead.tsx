import { Helmet } from 'react-helmet-async'

interface SEOHeadProps {
  title: string
  description: string
  image?: string
  url?: string
  type?: string
}

const SEOHead = ({ 
  title, 
  description, 
  image = 'https://criptounam.xyz/images/LogosCriptounam.svg', 
  url = 'https://criptounam.xyz',
  type = 'article'
}: SEOHeadProps) => {
  return (
    <Helmet>
      {/* Meta tags básicos */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="CriptoUNAM, blockchain, educación, UNAM, criptomonedas, Web3" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="CriptoUNAM" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@Cripto_UNAM" />
      <meta name="twitter:creator" content="@Cripto_UNAM" />
      
      {/* WhatsApp */}
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:alt" content={title} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  )
}

export default SEOHead
