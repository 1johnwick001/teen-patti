import axios from 'axios';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import API_BASE_URL from '../config/Config';
import { toast } from 'react-toastify';


interface User{
    _id: number;
    username: string;
    email: string;
    countryCode:string;
    phoneNumber:string;
}

function EditClient() {

    const {id} = useParams<{id: string}>()
    
    const navigate = useNavigate();

    const [username, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [countryCode, setCountryCode] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/user/userListById/${id}`);
                const userData = response.data;
                console.log('Fetched user data:', userData);

                //update state with fetched data
                setUserName(userData?.data?.username);
                setEmail(userData.data.email);
                setCountryCode(userData.data.countryCode);
                setPhoneNumber(userData.data.phoneNumber);
                

            } catch (error) {
                console.error("error fetching list of user based on id",error);
                
            }
        }
        fetchUser()
    },[id]);
console.log("setUserName",username)

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const data = {
                phoneNumber,
                countryCode,
                email,
                username
            }

            const token = localStorage.getItem('token');
            // console.log(formData)
           const response = await axios.put(`${API_BASE_URL}/user/updateUser`,data,{
                headers: {
                    'Authorization': `Bearer ${token}`
                }
           })
            console.log(response);
            toast("Client data edited successfully✨")
            navigate('/clientList')

        } catch (error) {
            console.error("error updating user",error);
            
        }
    }


  return (
    <>
        <Header/>
        <div className="d-flex justify-content-center p-1" style={{ color: 'black', backgroundColor: '#4fc9d1' }}>
            <h1>Edit User Profile</h1>
      </div>
      <div className='container'>
        <div className="row justify-content-center p-3 ">
            <div className='col-lg-8'>
                <div className='ezy__contact8-form-card position-relative'>
                    <div className='card-body p-md-3'>
                        <form onSubmit={handleSubmit}>
                            <div className='mb-3'>
                                <label htmlFor="username"
                                className='form-label'>
                                    user name
                                </label>
                                <input type="text"
                                className='form-control'
                                id='username'
                                required
                                value={username}
                                onChange={(e) => setUserName(e.target.value)}
                                />
                            </div>
                            <div className='mb-3'>
                                <label htmlFor="email"
                                className='form-label'>
                                    email
                                </label>
                                <input type="email"
                                className='form-control'
                                id='email'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            
                            <div className='mb-3'>
                                <label htmlFor="phoneNumber"
                                className='form-label'>
                                    mobile
                                </label>
                                <input type="text"
                                className='form-control'
                                required
                                pattern='^\d{10}$'
                                placeholder='10 digit mobile number without country code'
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>
                            <button type='submit' className='btn btn-primary' style={{
                                backgroundColor:'#4fc9d1',color:'#fff',border:'none'
                            }}>
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </>
  )
}

export default EditClient