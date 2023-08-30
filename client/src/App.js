import './App.css';
import {Routes, Route, Navigate} from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <>
      <Routes>
        <Route path = '/' element={<ProtectedRoutes> <HomePage/> </ProtectedRoutes>} />
        <Route path = '/register' element={<RegisterPage/>} />
        <Route path = '/login' element={<LoginPage/>} />
      </Routes>
    </>
  );
}

export function ProtectedRoutes(props){
  if(localStorage.getItem('user')){
    return props.children;
  }
  else{
    return <Navigate to="/login"/>
  }
}

export default App;
