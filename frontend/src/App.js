import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Room, Star } from '@mui/icons-material';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import './App.css';
import Register from './Components/Register';
import Login from './Components/Login.js';

function App() {
  const myStorage = window.localStorage;
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user") || null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [rating, setRating] = useState(1);
  const [newPlace, setNewPlace] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [viewport, setViewport] = useState({
    latitude: 46,
    longitude: 17,
    zoom: 4,
  });

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/pins`);
        setPins(res.data);
      } catch (error) {
        console.error("Error fetching pins:", error);
      }
    };
    fetchPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport(prev => ({ ...prev, latitude: lat, longitude: long }));
  };

  const handleAddClick = (event) => {
    if (event?.lngLat) {
      setNewPlace({ lat: event.lngLat.lat, long: event.lngLat.lng });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("You must be logged in to add a pin.");
      return;
    }
    if (!newPlace) {
      alert("Please click on the map to add a location.");
      return;
    }
    
    const newPin = { username: currentUser, title, desc, rating, lat: newPlace.lat, long: newPlace.long };

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/pins`, newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
      setTitle('');
      setDesc('');
      setRating(1);
      alert("Pin added successfully!");
    } catch (error) {
      console.error("Error posting pin:", error);
      alert("Failed to add pin. Please try again.");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      myStorage.removeItem("user");
      setCurrentUser(null);
    }
  };

  return (
    <Map
      {...viewport}
      mapboxAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
      style={{ width: '100vw', height: '100vh' }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      onDblClick={handleAddClick}
      onMove={(evt) => setViewport(evt.viewState)}
    >
      {pins.map((p) => (
        <React.Fragment key={p._id}>
          <Marker latitude={p.lat} longitude={p.long}>
            <Room
              style={{ fontSize: 50, color: p.username === currentUser ? 'tomato' : 'slateblue', cursor: 'pointer' }}
              onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
            />
          </Marker>
          {p._id === currentPlaceId && (
            <Popup latitude={p.lat} longitude={p.long} closeButton closeOnClick={false} onClose={() => setCurrentPlaceId(null)} anchor="left">
              <div className="card">
                <label>Place</label>
                <h4>{p.title}</h4>
                <label>Review</label>
                <p>{p.desc}</p>
                <label>Rating</label>
                <div>{[...Array(p.rating)].map((_, i) => (<Star className="star" key={i} />))}</div>
                <label>Information</label>
                <span>Created By <b>{p.username}</b></span>
                <span>{p.createdAt ? formatDistanceToNow(new Date(p.createdAt), { addSuffix: true }) : "Unknown date"}</span>
              </div>
            </Popup>
          )}
        </React.Fragment>
      ))}

      {newPlace && (
        <Popup latitude={newPlace.lat} longitude={newPlace.long} closeButton closeOnClick={false} onClose={() => setNewPlace(null)} anchor="left">
          <form onSubmit={handleSubmit}>
            <label>Title</label>
            <input type="text" placeholder="Enter a Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <label>Review</label>
            <textarea placeholder="Say something about this place" value={desc} onChange={(e) => setDesc(e.target.value)} />
            <label>Rating</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>{[1, 2, 3, 4, 5].map((num) => (<option key={num} value={num}>{num}</option>))}</select>
            <button type="submit">Add Pin</button>
          </form>
        </Popup>
      )}

      {currentUser ? (
        <button className="button logout" onClick={handleLogout}>Log Out</button>
      ) : (
        <div className="buttons">
          <button className="button login" onClick={() => setShowLogin(true)}>Login</button>
          <button className="button register" onClick={() => setShowRegister(true)}>Register</button>
        </div>
      )}

      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && <Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser} />}
    </Map>
  );
}

export default App;
