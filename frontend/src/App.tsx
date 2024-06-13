import React from 'react'
import '@coreui/coreui/dist/css/coreui.min.css'
import AllRoutes from './Routes/AllRoutes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {
  return (
    <div>
      <AllRoutes/>
      <ToastContainer/>
    </div>
  )
}

export default App