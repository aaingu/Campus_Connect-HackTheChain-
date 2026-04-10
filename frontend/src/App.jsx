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

  const [theme, setTheme] = useState('light');
  const [showSettings, setShowSettings] = useState(false);

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
        if (isSignup) { setStatus({ msg: "Account created!", type: 'success' }); setIsSignup(false); }
        else { setUser(data.user); setStatus({ msg: `Welcome, ${data.user.name}`, type: 'success' }); }
      } else { setStatus({ msg: data.message, type: 'error' }); }
    } catch (err) { setStatus({ msg: "Auth Service Offline", type: 'error' }); }
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
      setStatus({ msg: data.message, type: data.status === 'confirmed' ? 'success' : 'warning' });
      fetchEvents();
    } catch (err) { setStatus({ msg: "Reg Service Offline", type: 'error' }); }
    setLoading(false);
  };

  // 🎨 GOLDEN THEME COLORS (Now with true dynamic borders)
  const colors = {
    bg: theme === 'light' ? '#f5f7fa' : '#121212',
    card: theme === 'light' ? '#ffffff' : '#1e1e1e',
    text: theme === 'light' ? '#333333' : '#e0e0e0',
    subText: theme === 'light' ? '#666666' : '#999999',
    border: theme === 'light' ? '#e1e4e8' : '#333333', // Dark mode border is now much subtler
    inputBg: theme === 'light' ? '#ffffff' : '#252525',
    btnBg: theme === 'light' ? '#333333' : '#4a90e2'
  };

  return (
    <div style={{ ...containerStyle, backgroundColor: colors.bg, color: colors.text }}>
      <header style={headerStyle}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>CampusConnect 🚀</h1>

        <div style={{ position: 'relative' }}>
          {/* Settings Button (Now just the logo) */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{ ...iconBtn, color: colors.text, borderColor: colors.border }}
          >
            ⚙️
          </button>

          {showSettings && (
            <div style={{ ...dropdownStyle, backgroundColor: colors.card, borderColor: colors.border }}>
              <div style={{ ...menuItemStyle, borderBottom: `1px solid ${colors.border}` }} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </div>
              {user && (
                <div style={{ ...menuItemStyle, color: '#ff4d4d' }} onClick={() => { setUser(null); setShowSettings(false); }}>
                  🚪 Logout
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {status.msg && (
        <div style={{
          ...alertStyle,
          backgroundColor: status.type === 'error' ? '#ffdce0' : status.type === 'warning' ? '#fff3cd' : '#d4edda',
          color: '#1a1a1a',
          borderColor: status.type === 'error' ? '#f5c6cb' : status.type === 'warning' ? '#ffeeba' : '#c3e6cb'
        }}>
          {status.msg}
        </div>
      )}

      {!user ? (
        <div style={{ ...cardStyle, backgroundColor: colors.card, borderColor: colors.border }}>
          <h2 style={{ marginTop: 0, color: colors.text }}>{isSignup ? "Create Account" : "Login"}</h2>
          <form onSubmit={handleAuth}>
            {isSignup && <input name="name" placeholder="Full Name" required style={{ ...inputStyle, backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }} />}
            <input name="email" type="email" placeholder="Email" required style={{ ...inputStyle, backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }} />
            <input name="password" type="password" placeholder="Password" required style={{ ...inputStyle, backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }} />
            <button type="submit" disabled={loading} style={{ ...mainBtn, backgroundColor: colors.btnBg }}>
              {loading ? "..." : isSignup ? "Sign Up" : "Login"}
            </button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '15px' }}>
            <span onClick={() => setIsSignup(!isSignup)} style={toggleLink}>
              {isSignup ? "Back to Login" : "New student? Sign Up"}
            </span>
          </p>
        </div>
      ) : (
        <div style={gridStyle}>
          {events.map(ev => (
            <div key={ev._id} style={{ ...eventCardStyle, backgroundColor: colors.card, borderColor: colors.border }}>
              <h3 style={{ marginTop: 0, color: colors.text }}>{ev.title}</h3>
              <p style={{ color: colors.subText, fontSize: '14px', marginBottom: '20px' }}>{ev.description}</p>
              <div style={{ ...statsBox, backgroundColor: theme === 'light' ? '#f8f9fa' : '#2a2a2a' }}>
                <span style={{ color: colors.text }}>Seats: <strong>{ev.seats}</strong></span>
                <span style={{ color: colors.text }}>Filled: <strong>{ev.registered || 0}</strong></span>
              </div>
              <button
                onClick={() => register(ev)}
                disabled={loading}
                style={{ ...mainBtn, backgroundColor: '#4a90e2', marginTop: 'auto' }}
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// STYLES
const containerStyle = { minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '20px', transition: 'background-color 0.3s ease' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1000px', margin: '0 auto 40px' };
const cardStyle = { padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', maxWidth: '400px', margin: 'auto', border: '1px solid' };
const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '1000px', margin: 'auto' };
const eventCardStyle = { padding: '24px', borderRadius: '12px', border: '1px solid', display: 'flex', flexDirection: 'column' };
const inputStyle = { display: 'block', width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid', boxSizing: 'border-box', outline: 'none' };
const mainBtn = { width: '100%', padding: '12px', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' };
const iconBtn = { width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent', border: '1px solid', borderRadius: '10px', cursor: 'pointer', fontSize: '20px' };
const toggleLink = { color: '#4a90e2', cursor: 'pointer', fontWeight: 'bold' };
const alertStyle = { maxWidth: '400px', margin: '0 auto 20px', padding: '12px', borderRadius: '8px', textAlign: 'center', border: '1px solid', fontWeight: '500' };
const statsBox = { display: 'flex', justifyContent: 'space-between', margin: '0 0 15px 0', fontSize: '14px', padding: '12px', borderRadius: '8px' };
const dropdownStyle = { position: 'absolute', right: 0, top: '50px', width: '150px', borderRadius: '10px', border: '1px solid', boxShadow: '0 10px 20px rgba(0,0,0,0.3)', zIndex: 100, overflow: 'hidden' };
const menuItemStyle = { padding: '12px 16px', cursor: 'pointer', fontSize: '14px', textAlign: 'left', fontWeight: '500' };

export default App;