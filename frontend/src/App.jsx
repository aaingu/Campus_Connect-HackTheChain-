import React, { useState, useEffect } from "react";

const API_AUTH = "http://localhost:3001";
const API_EVENTS = "http://localhost:3002";
const API_REG = "http://localhost:3003";

function App() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState({ msg: '', type: '' });
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_EVENTS}/events`);
      const data = await res.json();
      setEvents(data.data || []);
    } catch (err) { console.error("Event Service Offline"); }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isSignup ? "/signup" : "/login";
    const payload = isSignup
      ? { name: e.target.name.value, email: e.target.email.value, password: e.target.password.value }
      : { email: e.target.email.value, password: e.target.password.value };

    try {
      const res = await fetch(`${API_AUTH}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        if (isSignup) {
          setStatus({ msg: "Success! You can now login.", type: 'success' });
          setIsSignup(false);
        } else {
          setUser(data.user);
          setStatus({ msg: `Logged in as ${data.user.name}`, type: 'success' });
        }
      } else { setStatus({ msg: data.message, type: 'error' }); }
    } catch (err) { setStatus({ msg: "Connection Failed", type: 'error' }); }
    setLoading(false);
  };

  const register = async (event) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_REG}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name, eventId: event._id, maxSeats: event.seats })
      });
      const data = await res.json();
      setStatus({ msg: `${data.message}`, type: data.status === 'confirmed' ? 'success' : 'warning' });
      fetchEvents();
    } catch (err) { setStatus({ msg: "Registration Offline", type: 'error' }); }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={{ margin: 0 }}>CampusConnect 🚀</h1>
        {user && <button onClick={() => setUser(null)} style={logoutBtn}>Logout</button>}
      </header>

      {status.msg && (
        <div style={{ ...alertStyle, backgroundColor: status.type === 'error' ? '#fee' : status.type === 'warning' ? '#fff3cd' : '#e6fffa' }}>
          {status.msg}
        </div>
      )}

      {!user ? (
        <div style={cardStyle}>
          <h2 style={{ marginTop: 0 }}>{isSignup ? "Join the Community" : "Welcome Back"}</h2>
          <form onSubmit={handleAuth}>
            {isSignup && <input name="name" placeholder="Full Name" required style={inputStyle} />}
            <input name="email" type="email" placeholder="College Email" required style={inputStyle} />
            <input name="password" type="password" placeholder="Password" required style={inputStyle} />
            <button type="submit" disabled={loading} style={mainBtn}>
              {loading ? "Processing..." : isSignup ? "Create Account" : "Login"}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '15px' }}>
            {isSignup ? "Already have an account?" : "First time here?"}
            <span onClick={() => setIsSignup(!isSignup)} style={toggleLink}>
              {isSignup ? " Login" : " Sign Up"}
            </span>
          </p>
        </div>
      ) : (
        <div style={gridStyle}>
          {events.map(ev => (
            <div key={ev._id} style={eventCardStyle}>
              <h3 style={{ marginTop: 0 }}>{ev.title}</h3>
              <p style={{ color: '#666', fontSize: '14px' }}>{ev.description}</p>
              <div style={statsBox}>
                <span>Capacity: <strong>{ev.seats}</strong></span>
                <span>Filled: <strong>{ev.registered || 0}</strong></span>
              </div>
              <button
                onClick={() => register(ev)}
                disabled={loading}
                style={{ ...mainBtn, backgroundColor: '#4a90e2' }}
              >
                Book My Seat
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// STYLES
const containerStyle = { minHeight: '100vh', backgroundColor: '#f5f7fa', fontFamily: 'system-ui, sans-serif', padding: '20px' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1000px', margin: '0 auto 40px' };
const cardStyle = { backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', maxWidth: '400px', margin: 'auto' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '1000px', margin: 'auto' };
const eventCardStyle = { backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e1e4e8', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' };
const inputStyle = { display: 'block', width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };
const mainBtn = { width: '100%', padding: '12px', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const logoutBtn = { padding: '8px 16px', backgroundColor: 'transparent', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer' };
const toggleLink = { color: '#4a90e2', cursor: 'pointer', fontWeight: 'bold' };
const alertStyle = { maxWidth: '400px', margin: '0 auto 20px', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid #ddd' };
const statsBox = { display: 'flex', justifyContent: 'space-between', margin: '15px 0', fontSize: '14px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px' };

export default App;