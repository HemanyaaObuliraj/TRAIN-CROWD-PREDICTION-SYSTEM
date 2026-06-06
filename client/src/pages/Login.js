import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email, password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/home');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #f5f5f0; font-family: 'DM Sans', sans-serif; }
        input:focus { outline: none; border-color: #111 !important; }
        button:hover { opacity: 0.9; }
      `}</style>

      <div style={s.page}>
        <div style={s.top}>
          <div style={s.logoRow}>
            <span style={s.logoIcon}>🚆</span>
            <span style={s.logoText}>RailSense</span>
          </div>
          <p style={s.tagline}>Know before you go</p>
        </div>

        <div style={s.card}>
          <h2 style={s.title}>Welcome back</h2>
          <p style={s.subtitle}>Login to continue</p>

          {error && <div style={s.error}>{error}</div>}

          <form onSubmit={handleLogin}>
            <div style={s.group}>
              <label style={s.label}>EMAIL</label>
              <input
                style={s.input}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={s.group}>
              <label style={s.label}>PASSWORD</label>
              <input
                style={s.input}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button style={s.btn} type="submit">Login →</button>
          </form>

          <p style={s.switch}>
            New here?{' '}
            <Link to="/register" style={s.link}>Create account</Link>
          </p>
        </div>

        {/* Bottom decoration */}
        <div style={s.bottom}>
          <div style={s.track} />
          <span style={s.trainAnim}>🚆</span>
        </div>
      </div>
    </>
  );
}

const s = {
  page: { maxWidth: 420, margin: '0 auto', minHeight: '100vh', background: '#f5f5f0', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '32px 20px' },
  top: { textAlign: 'center', marginBottom: 32 },
  logoRow: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 },
  logoIcon: { fontSize: 36 },
  logoText: { fontSize: 28, fontWeight: 800, color: '#111', letterSpacing: '-1px' },
  tagline: { fontSize: 13, color: '#9ca3af', letterSpacing: '1px' },
  card: { background: 'white', borderRadius: 24, padding: '32px 28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  title: { fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 4, letterSpacing: '-0.5px' },
  subtitle: { fontSize: 14, color: '#9ca3af', marginBottom: 24 },
  error: { background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 },
  group: { marginBottom: 16 },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '1.5px', marginBottom: 6 },
  input: { width: '100%', padding: '12px 14px', border: '1.5px solid #e5e7eb', borderRadius: 12, fontSize: 15, color: '#111', background: '#fafafa', fontFamily: 'DM Sans', transition: 'border 0.2s' },
  btn: { width: '100%', padding: 14, background: '#111', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 8, letterSpacing: '0.3px' },
  switch: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' },
  link: { color: '#111', fontWeight: 700, textDecoration: 'none', borderBottom: '1px solid #111' },
  bottom: { position: 'relative', marginTop: 40, overflow: 'hidden' },
  track: { height: 3, background: 'repeating-linear-gradient(90deg, #e5e7eb 0px, #e5e7eb 20px, transparent 20px, transparent 30px)', borderRadius: 99 },
  trainAnim: { position: 'absolute', top: -14, left: '40%', fontSize: 24 }
};

export default Login;