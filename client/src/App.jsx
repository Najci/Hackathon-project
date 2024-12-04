import React from 'react'
import { createBrowserRouter, createRoutesFromChildren, Route, RouterProvider } from 'react-router-dom';
import '../src/css/App.css'
import Main from './components/Main'
import Header from './components/HeaderStudent'
import SignUp from './components/SignUp'
import Footer from './components/Footer'
import Login from './components/Login'
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import AddStudent from './components/AddStudent';

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
      <Route path='/teacher/dashboard' element={<TeacherDashboard />} />
      <Route path='/student/dashboard' element={<StudentDashboard />} />
      <Route path='/teacher/dashboard/addstudents' element={<AddStudent />} />
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
