import { Navigate } from 'react-router-dom'

/** La página de comunidad se fusionó con `/eventos` (ancla `#comunidad`). */
const Comunidad = () => <Navigate to="/eventos#comunidad" replace />

export default Comunidad
