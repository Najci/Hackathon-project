import React, { useEffect } from 'react';
import { createBrowserRouter, createRoutesFromChildren, Route, RouterProvider, Navigate, useNavigate, BrowserRouter } from 'react-router-dom';
import '../src/css/App.css';
import Main from './components/Main';
import SignUp from './components/SignUp';
import Footer from './components/Footer';
import Login from './components/Login';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import AddStudent from './components/AddStudent';
import { CookiesProvider, useCookies } from 'react-cookie';
import MainHeader from './components/Headers/MainHeader';
import AboutUs from './components/AboutUs';


function ProtectedRoute({ element, user }) {
  return user ? element : <Navigate to="/login" />
}

function App() {
  const [cookie, setCookie] = useCookies(['user']);

  function handleLogin(user) {
    setCookie('user', user, { path: '/' });
    console.log(cookie)
  }

  function handleLogout() {
    setCookie('user', '', { path: '/', expires: new Date(0) });
    console.log('User logged out');
  }
  

  const router = createBrowserRouter(
    createRoutesFromChildren(
      <Route element={
      <>
        <MainHeader user={cookie.user} LogOut={handleLogout} />
        <Main />
        <Footer />
      </>
      }>
        <Route path='/aboutus' element={<AboutUs />} />
        <Route path="/signup" element={<SignUp user={cookie.user} />} />
        <Route path="/login" element={<Login CreateCookie={handleLogin} user={cookie.user} />} />
        <Route path="/teacher/dashboard" element={<ProtectedRoute element={<TeacherDashboard user={cookie.user} />} user={cookie.user} />} />
        <Route path="/student/dashboard" element={<ProtectedRoute element={<StudentDashboard user={cookie.user} />} user={cookie.user} />} />
        <Route path="/teacher/dashboard/addstudents" element={<ProtectedRoute element={<AddStudent />} user={cookie.user} />} />
      </Route>
    )
  );

  return (
    <CookiesProvider>
      <RouterProvider router={router} />
    </CookiesProvider>
  );
}

export default App;
