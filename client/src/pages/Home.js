import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [error, setError] = useState('');
  const [liveTrains, setLiveTrains] = useState([]);
  const [liveLoading, setLiveLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLiveTrains();
  }, []);

  const fetchLiveTrains = async () => {
    try {
      const res = await api.get('/api/trains/live');
      setLiveTrains(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLiveLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get('/api/trains/search', {
  params: { source, destination }
});
      navigate('/results', { state: { trains: res.data, source, destination } });
    } catch (err) {
      setError('No trains found for this route!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getCrowd = (level) => {
    if (level === 'High') return { color: '#dc2626', bg: '#fef2f2', emoji: '🔴' };
    if (level === 'Medium') return { color: '#d97706', bg: '#fffbeb', emoji: '🟡' };
    return { color: '#16a34a', bg: '#f0fdf4', emoji: '🟢' };
  };

  const quickRoutes = [
    { from: 'Chennai Central', to: 'Bangalore' },
    { from: 'Chennai Central', to: 'Mumbai CST' },
    { from: 'Chennai Central', to: 'Hyderabad' },
    { from: 'Chennai Central', to: 'Delhi' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #f5f5f0; font-family: 'DM Sans', sans-serif; }
        input:focus { outline: none; border-color: #111 !important; }
        .quick-card:hover { background: #f5f5f0 !important; cursor: pointer; }
        .live-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
        .live-card { transition: transform 0.2s, box-shadow 0.2s; }
      `}</style>

      <div style={s.page}>
        {/* Navbar */}
        <div style={s.navbar}>
          <div style={s.navLeft}>
            <span style={s.navLogo}>🚆</span>
            <span style={s.navName}>RailSense</span>
          </div>
          <div style={s.navRight}>
            <span style={s.navUser}>Hi, {user?.name?.split(' ')[0]}!</span>
            <button style={s.logoutBtn} onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div style={s.content}>
          {/* Greeting */}
          <div style={s.greeting}>
            <p style={s.greetText}>{getGreeting()},</p>
            <h1 style={s.greetName}>{user?.name} 👋</h1>
            <p style={s.greetSub}>Here's what's running right now</p>
          </div>

          {/* Live Trains Section */}
          <div style={s.section}>
            <div style={s.sectionHeader}>
              <div style={s.liveIndicator}>
                <div style={s.liveDot} />
                <span style={s.liveText}>LIVE NOW</span>
              </div>
              <span style={s.liveCount}>
                {liveLoading ? '...' : `${liveTrains.length} trains`}
              </span>
            </div>

            {liveLoading ? (
              <div style={s.loading}>Fetching live trains...</div>
            ) : liveTrains.length === 0 ? (
              <div style={s.empty}>No trains running right now</div>
            ) : (
              <div style={s.liveGrid}>
                {liveTrains.map(train => {
                  const crowd = getCrowd(train.crowdLevel);
                  return (
                    <div key={train._id} className="live-card" style={s.liveCard}>
                      <div style={s.liveCardTop}>
                        <div>
                          <div style={s.liveTrainName}>{train.trainName}</div>
                          <div style={s.liveTrainNo}>#{train.trainNumber}</div>
                        </div>
                        <div style={{ ...s.crowdBadge, background: crowd.bg, color: crowd.color }}>
                          {crowd.emoji} {train.crowdLevel}
                        </div>
                      </div>
                      <div style={s.liveCardBottom}>
                        <span style={s.liveRoute}>
                          {train.source.split(' ')[0]} → {train.destination.split(' ')[0]}
                        </span>
                        <span style={s.liveTime}>
                          {train.departureTime} – {train.arrivalTime}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search Section */}
          <div style={s.searchCard}>
            <h3 style={s.searchTitle}>Search Trains</h3>

            {error && <div style={s.error}>{error}</div>}

            <form onSubmit={handleSearch}>
              <div style={s.inputRow}>
                <div style={s.inputWrap}>
                  <label style={s.label}>FROM</label>
                  <input
                    style={s.input}
                    type="text"
                    placeholder="e.g. Chennai Central"
                    value={source}
                    onChange={(e) => { setSource(e.target.value); setError(''); }}
                    required
                  />
                </div>
                <div style={s.swapBtn}>⇄</div>
                <div style={s.inputWrap}>
                  <label style={s.label}>TO</label>
                  <input
                    style={s.input}
                    type="text"
                    placeholder="e.g. Bangalore"
                    value={destination}
                    onChange={(e) => { setDestination(e.target.value); setError(''); }}
                    required
                  />
                </div>
              </div>
              <button style={s.searchBtn} type="submit">
                Search Trains →
              </button>
            </form>
          </div>

          {/* Quick Routes */}
          <div style={s.quickSection}>
            <p style={s.quickTitle}>POPULAR ROUTES</p>
            <div style={s.quickGrid}>
              {quickRoutes.map((route, i) => (
                <button
                  key={i}
                  className="quick-card"
                  style={s.quickCard}
                  onClick={() => {
                    setSource(route.from);
                    setDestination(route.to);
                    setError('');
                  }}
                >
                  <div style={s.quickFrom}>{route.from.split(' ')[0]}</div>
                  <div style={s.quickArrow}>→</div>
                  <div style={s.quickTo}>{route.to.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const s = {
  page: { width: '100%', minHeight: '100vh', background: '#f5f5f0' },
  navbar: { background: 'white', borderBottom: '1px solid #e5e7eb', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 },
  navLeft: { display: 'flex', alignItems: 'center', gap: 8 },
  navLogo: { fontSize: 24 },
  navName: { fontSize: 18, fontWeight: 800, color: '#111', letterSpacing: '-0.5px' },
  navRight: { display: 'flex', alignItems: 'center', gap: 12 },
  navUser: { fontSize: 14, color: '#6b7280', fontWeight: 500 },
  logoutBtn: { background: '#f5f5f0', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 600, color: '#111', cursor: 'pointer' },
  content: { maxWidth: 780, margin: '0 auto', padding: '40px 24px' },
  greeting: { marginBottom: 32 },
  greetText: { fontSize: 14, color: '#9ca3af', marginBottom: 4 },
  greetName: { fontSize: 32, fontWeight: 800, color: '#111', letterSpacing: '-1px', marginBottom: 6 },
  greetSub: { fontSize: 15, color: '#6b7280' },
  section: { marginBottom: 32 },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  liveIndicator: { display: 'flex', alignItems: 'center', gap: 8 },
  liveDot: { width: 8, height: 8, borderRadius: '50%', background: '#dc2626', animation: 'pulse 1.5s infinite' },
  liveText: { fontSize: 11, fontWeight: 700, color: '#dc2626', letterSpacing: '2px' },
  liveCount: { fontSize: 13, color: '#9ca3af', fontWeight: 500 },
  loading: { background: 'white', borderRadius: 16, padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: 14 },
  empty: { background: 'white', borderRadius: 16, padding: '24px', textAlign: 'center', color: '#9ca3af', fontSize: 14 },
  liveGrid: { display: 'flex', flexDirection: 'column', gap: 10 },
  liveCard: { background: 'white', borderRadius: 16, padding: '16px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  liveCardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  liveTrainName: { fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 2 },
  liveTrainNo: { fontSize: 12, color: '#9ca3af', fontFamily: 'DM Mono' },
  crowdBadge: { fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 20 },
  liveCardBottom: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  liveRoute: { fontSize: 13, color: '#6b7280', fontWeight: 500 },
  liveTime: { fontSize: 13, color: '#111', fontFamily: 'DM Mono', fontWeight: 500 },
  searchCard: { background: 'white', borderRadius: 24, padding: '28px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 24 },
  searchTitle: { fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 20, letterSpacing: '-0.3px' },
  error: { background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 },
  inputRow: { display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 16 },
  inputWrap: { flex: 1 },
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '1.5px', marginBottom: 6 },
  input: { width: '100%', padding: '12px 14px', border: '1.5px solid #e5e7eb', borderRadius: 12, fontSize: 15, color: '#111', background: '#fafafa', fontFamily: 'DM Sans' },
  swapBtn: { fontSize: 20, color: '#9ca3af', paddingBottom: 10, cursor: 'pointer', flexShrink: 0 },
  searchBtn: { width: '100%', padding: 14, background: '#111', color: 'white', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.3px' },
  quickSection: { marginBottom: 24 },
  quickTitle: { fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '2px', marginBottom: 12 },
  quickGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 },
  quickCard: { background: 'white', border: '1px solid #e5e7eb', borderRadius: 14, padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'DM Sans', transition: 'background 0.2s' },
  quickFrom: { fontSize: 14, fontWeight: 700, color: '#111' },
  quickArrow: { fontSize: 14, color: '#9ca3af' },
  quickTo: { fontSize: 14, color: '#6b7280', fontWeight: 500 }
};

export default Home;