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
import axios from 'axios';
import Quiz from './components/Quiz';
import { ViewStudents } from './components/ViewStudents';
import AddAssignment from './components/AddAssignment';


const ProtectedRoute = ({ element, user, requiredRole, requiredUsername }) => {
  if (!user) return <Navigate to="/login" />;
  
  const hasAccess = requiredRole 
    ? user.role === requiredRole 
    : requiredUsername 
      ? user.username === requiredUsername 
      : true;
  
  return hasAccess ? element : <Navigate to="/login" />;
};

function App() {
  const [cookie, setCookie] = useCookies(['user']);

  function handleLogin(user) {
    setCookie('user', user, { path: '/' });
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
        <Route path="/teacher/dashboard" element={<ProtectedRoute element={<TeacherDashboard user={cookie.user} id='teacher' />} user={cookie.user} />} />
        <Route path="/student/dashboard" element={<ProtectedRoute element={<StudentDashboard user={cookie.user} id='student'/>} user={cookie.user} />} />
        <Route path="/teacher/addstudent" element={<ProtectedRoute element={<AddStudent cookie={cookie}  id='teacher'/>} user={cookie.user} />} />
        <Route path='/student/dashboard/quiz' element={<ProtectedRoute element={<Quiz id='student' />} user={cookie.user} />} />
        <Route path={`/teacher/viewstudents/${cookie.user?.username}`} element={<ProtectedRoute element={<ViewStudents cookie={cookie} id="teacher" username={cookie.user?.username} />} user={cookie.user} />} />
        <Route path='/teacher/addassignment' element={<ProtectedRoute element={<AddAssignment cookie={cookie} id='teacher' />} user={cookie.user}/>} />
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
