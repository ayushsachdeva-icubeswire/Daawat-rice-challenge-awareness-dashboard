import AppProvidersWrapper from './components/wrapper/AppProvidersWrapper'
import configureFakeBackend from './helpers/fake-backend'
import AppRouter from './routes/router'
import '@/assets/scss/style.scss'
import '@fortawesome/fontawesome-free/css/all.css'

configureFakeBackend()

function App() {
  return (
    <>
      <AppProvidersWrapper>
        <AppRouter />
      </AppProvidersWrapper>
    </>
  )
}

export default App
