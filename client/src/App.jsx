import { createBrowserRouter, createRoutesFromChildren, Route, RouterProvider } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import '../src/css/App.css'
import Main from './components/Main'
import Header from './components/HeaderStudent'
import SignUp from './components/SignUp'
import Footer from './components/Footer'
import Login from './components/Login'
import Dashboard from './components/Dashboard'


const router = createBrowserRouter(
  createRoutesFromChildren(
    <Route element={
      <>
        <Header />
        <Main />
        <Footer />
      </>
    }>
      <Route path='https://warm-dango-3d4265.netlify.app//signup' element={<SignUp />} />
      <Route path='https://warm-dango-3d4265.netlify.app//login' element={<Login />} />
      <Route path='https://warm-dango-3d4265.netlify.app//dashboard' element={<Dashboard />} />
    </Route>
  )
)

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
