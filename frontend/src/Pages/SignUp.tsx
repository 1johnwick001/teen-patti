import React, { useState, ChangeEvent, FormEvent } from 'react';
import img1 from '../assets/images/bgimage.jpg';
import { Link, useNavigate } from 'react-router-dom';
import {toast} from "react-toastify"
import axios from 'axios';
import API_BASE_URL from '../config/Config';

const SignUp: React.FC = () => {

const navigate = useNavigate()
  const [username, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)

  const handleEmailChange = (e:ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (e.target.value.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    } 
      
      try {
        const response = await axios.post(`${API_BASE_URL}/admin/register`,{
          username,
          email,
          password
        })

        const data = response?.data;
        console.log(data);
        

        if (response.status === 201) {
          localStorage.setItem('token',data.token) //saving token in localstorage
          toast("🤖 You have been sucessfully registered!! 🤖",{ position: "top-center"})
          navigate('/AdminHome') //redirecting user to dashboard/adminhomepage.
        } else {
          toast.error(data.message || "registration failed")
        }

      } catch (error) {
        console.error("error while sending form data in api",error)
        toast.error("server error during registration")
      }
    }

  

  return (
    <div>
      <div className="container-fluid p-0">
        <div className="row g-0">
          <div className="col-xl-8">
            <div className="image-container" style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
              <img src={img1} alt="Main Content Image" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
          </div>
          {/* end col */}
          <div className="col-xl-4 d-flex justify-content-center align-items-center bg-light" >
            <div className="auth-full-page-content w-100 p-5">
              <div className="w-100">
                <div className="d-flex flex-column h-100">
                  <div className="my-auto">
                    <div>
                      <h3 style={{ color: '#ff735c' }}>Welcome !</h3>
                      <p className="text" style={{ fontSize: '25px', color: '#1a2e35' }}>Create an Account.</p>
                    </div>
                    <div className="mt-4">
                      
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label htmlFor="username" className="form-label" style={{ fontSize: 'large', height: '10px' }}>Username</label>
                          <input
                            type="text"
                            name='username'
                            className="form-control"
                            id="username"
                            placeholder="Enter username"
                            value={username}
                            onChange={handleUsernameChange}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label" style={{ fontSize: 'large', height: '10px' }}>Email</label>
                          <div className="input-group auth-pass-inputgroup">
                            <input
                              type="email"
                              name='email'
                              className="form-control"
                              placeholder="Enter Email"
                              value={email}
                              onChange={handleEmailChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label" style={{ fontSize: 'large', height: '10px' }}>Password</label>
                          <div className="input-group auth-pass-inputgroup">
                            <input
                              type= 'password'
                              name='password'
                              className="form-control"
                              placeholder="Enter password"
                              value={password}
                              onChange={handlePasswordChange}
                              required
                            />
                            
                          </div>
                          {passwordError && <div style={{ color: 'red', fontSize: '14px' }}>{passwordError}</div>}
                        </div>
                        <div className="mt-3 d-grid">
                          <button className="btn btn waves-effect waves-light" type="submit" style={{ fontSize: '20px', color: '#1a2e35', backgroundColor: '#ff735c' }}>Register</button>
                        </div>
                      </form>
                      <div className="mt-3 text-center">
                        <p>Already have an account? <Link to="/" className="fw-large text-primary"> Login now </Link></p>
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
  );
}

export default SignUp;
