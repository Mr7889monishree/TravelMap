import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Room, Star } from '@mui/icons-material';
import axios from 'axios';
import { format } from 'timeago.js';
import './App.css';
import Register from './Components/Register';
import Login from './Components/Login';
import API_URL from '../src/Config';

function App() {
  const myStorage = window.localStorage;
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating, setRating] = useState(null); 
  const [newplace, setNewplace] = useState(null);
  const [showregister, setShowregister] = useState(false);
  const [showlogin, setShowlogin] = useState(false); // Ensure state is correctly defined

  const [viewport, setViewport] = useState({
    latitude: 46,
    longitude: 17,
    zoom: 4,
  });

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const res = await axios.get(`${API_URL}/pins`); // Use full URL here
        setPins(res.data); // Getting pin data from backend
      } catch (error) {
        console.log(error);
      }
    };
    fetchPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long }); // Update viewport when marker clicked
  };

  const handleAddClick = (event) => {
    console.log(event);
    if (event.lngLat && typeof event.lngLat === 'object') {
      const { lng, lat } = event.lngLat;
      setNewplace({ lat, long: lng });
      setViewport({ ...viewport, latitude: lat, longitude: lng });
    } else {
      console.error('lngLat is not defined or is not an object in the event:', event);
    }
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      lat: newplace.lat,
      long: newplace.long,
    };
    try {
      const res = await axios.post(`${API_URL}/pins`, newPin);
      setPins([...pins, res.data]);
      setNewplace(null); 
    } catch (error) {
      console.log(error);
    }
  };
  const handelLogout=()=>{
    myStorage.removeItem("user");
    currentUser(null);
  }

  return (
    <Map
      {...viewport}
      mapboxAccessToken={process.env.REACT_APP_MAPBOXURL}
      style={{ width: '100vw', height: '100vh' }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onDblClick={handleAddClick}
      onMove={(evt) => setViewport(evt.viewState)}
    >
      {pins.map((p) => (
        <React.Fragment key={p._id}>
          <Marker
            latitude={p.lat}
            longitude={p.long}
            offsetLeft={-viewport.zoom * 3.5}
            offsetTop={-viewport.zoom * 7}
          >
            <Room
              style={{
                fontSize: 50,
                color: p.username === currentUser ? 'tomato' : 'slateblue',
                cursor: 'pointer',
              }}
              onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
            />
          </Marker>

          {p._id === currentPlaceId && (
            <Popup
              latitude={p.lat}
              longitude={p.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setCurrentPlaceId(null)}
              anchor="left"
            >
              <div className="card">
                <label>Place</label>
                <h4 className="place">{p.title}</h4>
                <label>Review</label>
                <p className="desc">{p.desc}</p>
                <label>Rating</label>
                <div className="stars">
                  {Array(p.rating).fill(<Star className='star' />)}
                </div>
                <label>Information</label>
                <span className="username">
                  Created By <b>{p.username}</b>
                </span>
                <span className="date">{format(p.createdAt)}</span>
              </div>
            </Popup>
          )}
        </React.Fragment>
      ))}

      {newplace && (
        <Popup
          latitude={newplace.lat}
          longitude={newplace.long}
          closeButton={true}
          closeOnClick={false}
          onClose={() => setNewplace(null)}
          anchor="left"
        >
          <div>
            <form onSubmit={handelSubmit}>
              <label>Title</label>
              <input type="text" placeholder='Enter a Title' onChange={(e) => setTitle(e.target.value)} />
              <label>Review</label>
              <textarea placeholder='Say us Something About This place' onChange={(e) => setDesc(e.target.value)}></textarea>
              <label>Rating</label>
              <select onChange={(e) => setRating(e.target.value)}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <button className='submit-btn' type='submit'>Add pin</button>
            </form>
          </div>
        </Popup>
      )}

      {/* Conditional rendering for login and register buttons */}
      {currentUser ? (
        <button className="button logout" onClick={() => handelLogout()}>Log Out</button>
      ) : (
        <div className='buttons'>
          <button className="button login" onClick={() => setShowlogin(true)}>Login</button>
          <button className="button register" onClick={() => setShowregister(true)}>Register</button>
        </div>
      )}
      
      {/* Show Register and Login components */}
      {showregister && <Register setShowregister={setShowregister} />}
      {showlogin && <Login setShowlogin={setShowlogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />}
    </Map>
  );
}

export default App;
