import React, { useState } from 'react';
import "../assets/css/patti.css";
import videoFile from "../assets/videos/gifcards.mp4";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import API_BASE_URL from '../config/Config';

function Login() {
  const navigate = useNavigate();

  const [email,setEmail] = useState('');
  const [password, setPassword] = useState('')

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()

    const loadingToastId = toast.loading("Logging in..."); // Show loading toast
    
    try {

      
      const response = await axios.post(`${API_BASE_URL}/admin/login`,{
        email:email,
        password:password
      })
      setEmail('');
      setPassword('');
      console.log("response of form:",response.data);

      const token = response.data.token;

      localStorage.setItem("is_Admin_loggedIn", true.toString());
      localStorage.setItem("Admin_Email", email);
      localStorage.setItem("token", token); // Save the token in local storage

      toast.update(loadingToastId,{
        render:`Admin ${email} logged in successfully`,
        type:"success",
        isLoading:false,
        autoClose:3000,
        position:'top-center'
      })
      navigate("/AdminHome") 
      
      
    } catch (error) {
      console.log("error while submitting details",error);
      // Display error toast for network or server errors
      toast.update(loadingToastId,{
        render:'Incorrrect email or password. Please try again later.',
        type:'error',
        isLoading:false,
        autoClose:3000,
        position:'top-center'
      })
    }

  }

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
  <div>
    <div className="container-fluid p-0">
      <div className="row g-0">
        <div className="col-xl-8 bg-dark">
          <div className="video-container" style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
            <video src={videoFile}
              autoPlay 
              loop 
              muted  
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
          </div>
        </div>
        {/* end col */}
        <div className="col-xl-4 d-flex justify-content-center align-items-center bg-light">
          <div className="auth-full-page-content w-100 p-5">
            <div className="w-100">
              <div className="d-flex flex-column h-100">
                
                <div className="my-auto">
                  <div>
                    <h3 style={{  color: '#ff735c' }}>Welcome Back !</h3>
                    <p className="text" style={{fontSize: '25px', color:'#1a2e35'}}>Sign in to continue.</p>
                  </div>
                  <div className="mt-4">
                    <form action="post" onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label htmlFor="username" className="form-label" style={{fontSize:'large',height:'10px'}}>Email</label>
                        <input 
                        value={email}
                        onChange = {(e) => setEmail(e.target.value)}
                        name='email'
                        type="email" className="form-control" id="email" placeholder="Enter your email here..." />
                      </div>
                      <div className="mb-2">
                        <div className="float-end">
                          <a href="auth-recoverpw-2.html" className="text-muted" style={{fontSize:'16px'}}>Forgot password?</a>
                        </div>
                        <label className="form-label"style={{fontSize:'large',height:'10px'}}>Password</label>
                        <div className="input-group auth-pass-inputgroup">
                          <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)} 
                          name='password'
                          type={passwordVisible ? "text" : "password"}
                          className="form-control" placeholder="Enter password" aria-label="Password" aria-describedby="password-addon" />
                          <button
                              className="btn btn-light"
                              type="button"
                              id="password-addon"
                              onClick={togglePasswordVisibility}
                            >
                              <i className={`mdi ${passwordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'}`} />
                            </button>
                        </div>
                      </div>
                      {/* label for remember me */}
                      <div className="mt-3 d-grid">
                        <button className="btn btn waves-effect waves-light" type="submit" style={{fontSize: '20px', color:'#1a2e35',backgroundColor:'#ff735c'}}>Log In</button>
                      </div>
                    
                    </form>
                    <div className="mt-3 text-center">
                      <p>Don't have an account? <Link to="/signup" className="fw-medium text-primary"> Signup now </Link></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* end col */}
      </div>
  {/* end row */}
  </div>

  {/* end container-fluid */}
  </div>


  )
}

export default Login