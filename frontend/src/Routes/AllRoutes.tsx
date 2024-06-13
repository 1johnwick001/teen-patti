import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../Pages/Login';
import SignUp from '../Pages/SignUp';
import AdminHome from '../Pages/AdminHome';
import AddGames from '../Pages/AddGames';
import GamesList from '../Pages/GamesList';
import EditGame from '../Pages/EditGame';
import ClientList from '../Pages/ClientList';
import TandC from '../Pages/Terms&condition';
import AboutUs from '../Pages/AboutUs';
import PrivacyPolicy from '../Pages/PrivacyPolicy';
import EditClient from '../Pages/EditClient';


function AllRoutes() {
  return (
    <div>
        <Routes>
            <Route path='/' element={<Login/>} />
            <Route path='/SignUp' element={<SignUp />} />
            <Route path='/AdminHome' element={ localStorage.getItem("is_Admin_loggedIn") ? <AdminHome /> : <Navigate to ="/" />} />
            <Route path='/AddGames'  element={ localStorage.getItem("is_Admin_loggedIn") ? <AddGames /> :  <Navigate to ="/" />} />
            <Route path='/GamesList' element={ localStorage.getItem("is_Admin_loggedIn") ? <GamesList /> : <Navigate to ="/" />} />
            <Route path='/edit/:id' element={ localStorage.getItem("is_Admin_loggedIn") ? <EditGame /> : <Navigate to ="/" />} />
            <Route path='/clientList' element={ localStorage.getItem("is_Admin_loggedIn") ? <ClientList /> : <Navigate to ="/" />} />
            <Route path='/editclientList/:id' element={ localStorage.getItem("is_Admin_loggedIn") ? <EditClient /> : <Navigate to ="/" />} />
            <Route path='/t&c' element={ <TandC/> } />
            <Route path='/AboutUs' element={ <AboutUs/> } />
            <Route path='/PrivacyPolicy' element={ <PrivacyPolicy/> } />
        </Routes>
    </div>
  )
}

export default AllRoutes