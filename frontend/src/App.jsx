import React, { useState, useEffect } from 'react';

// Service ports from project parameters
const API_AUTH = "http://localhost:3001";
const API_EVENTS = "http://localhost:3002";
const API_REG = "http://localhost:3003";

function App() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState({ msg: '', type: '' });

  // Load events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_EVENTS}/events`);
      const data = await res.json();
      setEvents(data.data || []);
    } catch (err) {
      console.error("Event Service Offline");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_AUTH}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: e.target.email.value, 
          password: e.target.password.value 
        })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        setStatus({ msg: "Login Successful!", type: 'success' });
      } else {
        setStatus({ msg: data.message || "Login Failed", type: 'error' });
      }
    } catch (err) {
      setStatus({ msg: "Auth Service Offline", type: 'error' });
    }
  };

  const register = async (eventId) => {
    if (!user) return setStatus({ msg: "Login first!", type: 'error' });
    try {
      const res = await fetch(`${API_REG}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name, eventId: eventId })
      });
      const data = await res.json();
      setStatus({ msg: `${data.message} (${data.status})`, type: 'success' });
      fetchEvents(); // Refresh data to show updated counts
    } catch (err) {
      setStatus({ msg: "Registration failed", type: 'error' });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ color: '#2c3e50' }}>🎓 CampusConnect</h1>
      
      {status.msg && (
        <div style={{ padding: '10px', backgroundColor: status.type === 'error' ? '#f8d7da' : '#d4edda', borderRadius: '5px', marginBottom: '15px' }}>
          {status.msg}
        </div>
      )}

      {!user ? (
        <form onSubmit={handleLogin} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px' }}>
          <h3>Student Login</h3>
          <input name="email" type="email" placeholder="Email" style={inputStyle} required />
          <input name="password" type="password" placeholder="Password" style={inputStyle} required />
          <button type="submit" style={btnStyle}>Login</button>
        </form>
      ) : (
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Available Events</h2>
            <span>Welcome, <b>{user.name}</b></span>
          </div>
          <div style={{ display: 'grid', gap: '15px' }}>
            {events.map(ev => (
              <div key={ev.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#fff' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{ev.title}</h3>
                <p><b>Capacity:</b> {ev.seats} | <b>Filled:</b> {ev.registered}</p>
                <button 
                  onClick={() => register(ev.id)} 
                  style={{ ...btnStyle, backgroundColor: ev.registered >= ev.seats ? '#f39c12' : '#28a745' }}
                >
                  {ev.registered >= ev.seats ? "Join Waitlist" : "Register Now"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = { display: 'block', width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' };
const btnStyle = { padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default App;