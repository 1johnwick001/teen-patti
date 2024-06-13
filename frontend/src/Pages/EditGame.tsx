import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import API_BASE_URL from '../config/Config';
import { toast } from 'react-toastify';

interface Game {
  _id: number;
  gameName: string;
  gameType: string;
  gamePhoto: string;
}

const EditGame = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [gameName, setGameName] = useState('');
  const [gameType, setGameType] = useState('');
  const [gamePhoto, setGamePhoto] = useState<File | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/gamelistbyid/${id}`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
        const gameData = response;

        // Ensure that the response data is valid
        // console.log('Fetched game data:', gameData);

        // Update state with fetched data
        setGameName(gameData?.data?.data?.gameName);
        setGameType(gameData?.data?.data?.gameType);
        setGamePhoto(gameData?.data?.data?.gamePhoto);
        // console.log("phoito",gameData?.data?.data?.gamePhoto);
        

      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };

    fetchGame();
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setGamePhoto(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('gameName', gameName);
      formData.append('gameType', gameType);
      if (gamePhoto) {
        formData.append('gamePhoto', gamePhoto);
      }

      await axios.put(`${API_BASE_URL}/api/admin/updategame/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
           'Authorization': `Bearer ${token}`
        },
      });
      toast("✨Game data edited successfully✨")
      navigate('/GamesList');
    } catch (error) {
      console.error('Error updating game:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="d-flex justify-content-center p-1" style={{ color: 'black', backgroundColor: '#4fc9d1' }}>
        <h1>Edit Game</h1>
      </div>
      <div className="container">
        <div className="row justify-content-center p-3 ">
          <div className="col-lg-8">
            <div className="ezy__contact8-form-card position-relative">
              <div className="card-body p-md-3">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="gameName" className="form-label">
                      Game Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="gameName"
                      required
                      value={gameName}
                      onChange={(event) => setGameName(event.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="gameType" className="form-label">
                      Game Type
                    </label>
                    <select
                      className="form-select"
                      id="gameType"
                      required
                      value={gameType}
                      onChange={(e) => setGameType(e.target.value)}
                    >
                      <option value="" disabled>Select game type</option>
                      <option value="AK47">AK47</option>
                      <option value="999">999</option>
                      <option value="In-out">In-out</option>
                      <option value="Draw">Draw</option>
                      <option value="High wild">High wild</option>
                      <option value="Rotating Jokers">Rotating Jokers</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="gamePhoto" className="form-label">
                      Game Photo <br/>
                    ~~ if you wont select a new image , prev img will be taken as a default img ~~
                    </label>
                    <input
                      type="file"
                      className="form-control"
                     
                      id="gamePhoto"
                      name="gamePhoto"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{backgroundColor:'#4fc9d1',color:'#fff',border:'none'}}>
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditGame;
