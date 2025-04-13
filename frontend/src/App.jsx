import AppRoutes from './routes/routes.jsx';
import { CookiesProvider } from "react-cookie";


function App() {
  return (
    <>
      <CookiesProvider> {/* Permite usar cookies */}
        <AppRoutes /> {/* Permite gestionar las rutas*/}
      </CookiesProvider>
    </>
  )
}

export default App