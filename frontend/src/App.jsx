import React, { useState, useEffect } from "react";

const API_AUTH = "http://localhost:3001";
const API_EVENTS = "http://localhost:3002";
const API_REG = "http://localhost:3003";

function App() {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState({ msg: '', type: '' });
  const [isSignup, setIsSignup] = useState(false); // Toggle between Login/Signup

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
          setStatus({ msg: "Account created! Now please login.", type: 'success' });
          setIsSignup(false); // Switch to login mode after signup
        } else {
          setUser(data.user);
          setStatus({ msg: "Welcome back!", type: 'success' });
        }
      } else {
        setStatus({ msg: data.message, type: 'error' });
      }
    } catch (err) {
      setStatus({ msg: "Auth Service Offline", type: 'error' });
    }
  };

  const register = async (event) => {
    if (!user) return;
    try {
      const res = await fetch(`${API_REG}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user.name, eventId: event._id, maxSeats: event.seats })
      });
      const data = await res.json();
      setStatus({ msg: `${data.message} (${data.status})`, type: 'success' });
      fetchEvents();
    } catch (err) { setStatus({ msg: "Reg Service Offline", type: 'error' }); }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>🎓 CampusConnect</h1>

      {status.msg && (
        <div style={{
          background: status.type === 'error' ? '#ffdce0' : '#d4edda',
          color: status.type === 'error' ? '#af1921' : '#155724',
          padding: '10px', borderRadius: '5px', marginBottom: '20px', textAlign: 'center'
        }}>
          {status.msg}
        </div>
      )}

      {!user ? (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginTop: 0 }}>{isSignup ? "Create Student Account" : "Student Login"}</h2>
          <form onSubmit={handleAuth}>
            {isSignup && (
              <input name="name" placeholder="Full Name" required style={inputStyle} />
            )}
            <input name="email" type="email" placeholder="College Email" required style={inputStyle} />
            <input name="password" type="password" placeholder="Password" required style={inputStyle} />
            <button type="submit" style={btnStyle}>{isSignup ? "Sign Up" : "Login"}</button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '14px' }}>
            {isSignup ? "Already have an account?" : "New student?"}
            <span
              onClick={() => setIsSignup(!isSignup)}
              style={{ color: '#007bff', cursor: 'pointer', marginLeft: '5px', fontWeight: 'bold' }}
            >
              {isSignup ? "Login here" : "Create account"}
            </span>
          </p>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Available Events</h2>
            <button onClick={() => setUser(null)} style={{ height: '30px' }}>Logout</button>
          </div>
          {events.length === 0 && <p>No events found. Use the curl command to add one!</p>}
          {events.map(ev => (
            <div key={ev._id} style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '15px', borderRadius: '8px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{ev.title}</h3>
              <p style={{ color: '#666' }}>{ev.description}</p>
              <p><strong>Capacity:</strong> {ev.seats} seats</p>
              <button
                onClick={() => register(ev)}
                style={{ ...btnStyle, backgroundColor: '#28a745' }}
              >
                Register Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputStyle = { display: 'block', width: '100%', padding: '12px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' };
const btnStyle = { width: '100%', padding: '12px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' };

export default App;