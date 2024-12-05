import React, { useEffect, useState } from 'react';
import { createBrowserRouter, createRoutesFromChildren, Route, RouterProvider, Navigate, useNavigate, BrowserRouter, useSearchParams, useParams } from 'react-router-dom';
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
import { ViewStudents } from './components/ViewStudents';
import CreateQuiz from './components/CreateQuiz';
import AddAssignment from './components/AddAssignment';
import MiddleDashboard from './components/MiddleDashboard';
import StudentQuiz from './components/StudentQuiz';
import PastAssignment from './components/PastAssignment';
import Profile from './components/Profile';

const ProtectedRoute = ({ element, user, username}) => {
  if (!user) {
    return <Navigate to="/" />;
  }

  if (username){
    const requiredRole = element.props.username;
    const hasAccess = user.username === requiredRole;

    return hasAccess ? element : <Navigate to="/" />;
  }

  if(element.props.id){
    const hasAccess = user.role === element.props.id;
  
    return hasAccess ? element : <Navigate to="/" />;
  }
};


function App() {
  const [cookie, setCookie] = useCookies(['user']);

  const StudentAssignment = () => {
    const { assignmentid}= useParams();
    return (
        <ProtectedRoute
          element={<StudentQuiz cookie={cookie.user} assignmentId={assignmentid} id="student"/>}
          user={cookie.user}
        />
    );
  };

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
        <MainHeader cookie={cookie.user} LogOut={handleLogout} />
        <Main />
        <Footer />
      </>
      }>
        <Route path='/aboutus' element={<AboutUs />} />
        <Route path="/signup" element={<SignUp CreateCookie={handleLogin} user={cookie.user} />} />
        <Route path="/" element={<Login CreateCookie={handleLogin} user={cookie.user} />} />
        <Route path="/teacher/addstudent" element={<ProtectedRoute element={<AddStudent cookie={cookie}  id='teacher'/>} user={cookie.user} />} />
        <Route path='/teacher/createquiz' element={<ProtectedRoute element={<CreateQuiz cookie={cookie} id='teacher' />} user={cookie.user}/>} />
        <Route path={`/dashboard`} element={<MiddleDashboard cookie={cookie.user} />} user={cookie.user} />
        <Route path={`student/profile/${cookie.user?.username}`} element={<ProtectedRoute element={<Profile cookie={cookie.user} id='student' username={cookie.user?.username} />} user={cookie.user} />} />
        <Route path={`teacher/profile/${cookie.user?.username}`} element={<ProtectedRoute element={<Profile cookie={cookie.user} id='teacher' username={cookie.user?.username} />} user={cookie.user} />} />
        <Route path={`/teacher/viewstudents/${cookie.user?.username}`} element={<ProtectedRoute element={<ViewStudents cookie={cookie} id="teacher" username={cookie.user?.username} />} user={cookie.user} />} />
        <Route path={`/teacher/assign/${cookie.user?.username}`} element={<ProtectedRoute element={<AddAssignment cookie={cookie} id='teacher' username={cookie.user?.username} />} user={cookie.user} />} />
        <Route path={`/teacher/dashboard/${cookie.user?.username}`} element={<ProtectedRoute element={<TeacherDashboard cookie={cookie.user} id='teacher' username={cookie.user?.username} />} user={cookie.user} />} />
        <Route path={`/student/dashboard/${cookie.user?.username}`} element={<ProtectedRoute element={<StudentDashboard cookie={cookie.user} id='student' username={cookie.user?.username}/>} user={cookie.user} />} />
        <Route path={`/student/pastassignments/${cookie.user?.username}`} element={<ProtectedRoute element={<PastAssignment cookie={cookie.user} id='student' username={cookie.user?.username}/>} user={cookie.user} />} />
        <Route path="/student/:studentid/assignment/:assignmentid" element={<StudentAssignment />} />
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
