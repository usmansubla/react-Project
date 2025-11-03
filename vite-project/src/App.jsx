import React, {useState,useEffect} from 'react';
import './App.css'
import { useDispatch } from 'react-redux';
import authservice from './appwrite/auth';
import { login,logout } from './store/authSlice.js';
import Header from './components/container/header/Header.jsx';
import Footer from './components/container/footer/Footer.jsx';
import { Outlet } from 'react-router-dom';



function App() {
  const[loading,setloading]=useState(true)
  
const dispatch=useDispatch()
useEffect(()=>{
  authservice.getcurrentuser()
  .then((userdata)=>{
    if (userdata) {
      dispatch(login(userdata))
    } else {
      dispatch(logout())
    }
    
  })
  .finally(()=>{
    setloading(false)
  })
},[])
  return !loading ? (
  
<div className='w-full bg-amber-600 min-h-screen'>
  <div className='w-[80%] m-auto bg-red-500 '>
<Header/>
<main>
  TODO:<Outlet/>
</main>
<Footer/>

  </div>
</div>

) 
  :null
}

export default App
