import React from 'react'
import { createBrowserRouter, createRoutesFromChildren, Route, RouterProvider } from 'react-router-dom';
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
      <Route path='/signup' element={<SignUp />} />
      <Route path='/login' element={<Login />} />
      <Route path='/dashboard' element={<Dashboard />} />
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
