import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { trains, source, destination } = location.state || {};
  const [crowdLevels, setCrowdLevels] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/');
    fetchCrowdLevels();
  }, []);

  const fetchCrowdLevels = async () => {
    const now = new Date();
    const hour = now.getHours();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = days[now.getDay()];
    try {
      const res = await api.get('/api/trains/crowd', {
        params: { hour, day }
      });
      const levels = {};
      trains.forEach(train => { levels[train._id] = res.data.crowdLevel; });
      setCrowdLevels(levels);
    } catch (err) { console.log(err); }
  };

  const getCrowd = (level) => {
    if (level === 'High') return { color: '#dc2626', bg: '#fef2f2', bar: 90, label: 'Very Crowded' };
    if (level === 'Medium') return { color: '#dd8017', bg: '#fffbeb', bar: 55, label: 'Moderate' };
    return { color: '#16a34a', bg: '#f0fdf4', bar: 20, label: 'Comfortable' };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #f5f5f0; font-family: 'DM Sans', sans-serif; }
        .card-hover { transition: transform 0.2s, box-shadow 0.2s; }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.10); }
      `}</style>

      <div style={s.page}>
        <div style={s.topbar}>
          <button style={s.back} onClick={() => navigate('/home')}>‹ Back</button>
          <span style={s.topbarTitle}>Train Results</span>
          <span style={s.topbarCount}>{trains?.length} found</span>
        </div>

        <div style={s.routePill}>
          <div style={s.routeCity}>
            <span style={s.cityCode}>{source?.slice(0,3).toUpperCase()}</span>
            <span style={s.cityFull}>{source}</span>
          </div>
          <div style={s.routeMid}>
            <div style={s.routeDot} />
            <div style={s.routeTrack} />
            <span style={s.routeIcon}>🚆</span>
            <div style={s.routeTrack} />
            <div style={s.routeDot} />
          </div>
          <div style={{ ...s.routeCity, alignItems: 'flex-end' }}>
            <span style={s.cityCode}>{destination?.slice(0,3).toUpperCase()}</span>
            <span style={s.cityFull}>{destination}</span>
          </div>
        </div>

        <div style={s.list}>
          {trains?.map((train) => {
            const crowd = getCrowd(crowdLevels[train._id]);
            return (
              <div key={train._id} className="card-hover" style={s.ticket}>
                <div style={s.ticketTop}>
                  <div>
                    <div style={s.trainName}>{train.trainName}</div>
                    <div style={s.trainNo}>Train #{train.trainNumber}</div>
                  </div>
                  <div style={{ ...s.crowdPill, background: crowd.bg, color: crowd.color }}>
                    {crowd.label}
                  </div>
                </div>

                <div style={s.dividerRow}>
                  <div style={s.dividerCircle} />
                  <div style={s.dividerLine} />
                  <div style={s.dividerCircle} />
                </div>

                <div style={s.timeRow}>
                  <div style={s.timeBlock}>
                    <div style={s.timeVal}>{train.departureTime}</div>
                    <div style={s.timeLabel}>Departs</div>
                  </div>
                  <div style={s.duration}>
                    <div style={s.durationLine} />
                    <div style={s.durationText}>Direct</div>
                    <div style={s.durationLine} />
                  </div>
                  <div style={{ ...s.timeBlock, alignItems: 'flex-end' }}>
                    <div style={s.timeVal}>{train.arrivalTime}</div>
                    <div style={s.timeLabel}>Arrives</div>
                  </div>
                </div>

                <div style={s.barSection}>
                  <div style={s.barLabel}>
                    <span style={s.barText}>Crowd Level</span>
                    <span style={{ ...s.barPct, color: crowd.color }}>{crowd.bar}%</span>
                  </div>
                  <div style={s.barTrack}>
                    <div style={{ ...s.barFill, width: `${crowd.bar}%`, background: crowd.color }} />
                  </div>
                </div>

                <div style={s.bottomRow}>
                  <div style={s.daysWrap}>
                    {['M','T','W','T','F','S','S'].map((d, i) => {
                      const fullDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
                      const active = train.days.includes(fullDays[i]);
                      return (
                        <span key={i} style={{
                          ...s.dayDot,
                          background: active ? crowd.color : '#e5e7eb',
                          color: active ? 'white' : '#9ca3af'
                        }}>{d}</span>
                      );
                    })}
                  </div>
                  <div style={s.seats}>
                    <span style={s.seatsNum}>{train.totalSeats}</span>
                    <span style={s.seatsLabel}> seats</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

const s = {
  page: { maxWidth: '80%', margin: '0 auto', minHeight: '100vh', background: '#f5f5f0', paddingBottom: 32 },
  topbar: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'white', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 10 },
  back: { background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#111', fontFamily: 'DM Sans', fontWeight: 600, padding: '4px 8px' },
  topbarTitle: { fontSize: 16, fontWeight: 700, color: '#111', letterSpacing: '-0.3px' },
  topbarCount: { fontSize: 13, color: '#6b7280', fontWeight: 500 },
  routePill: { margin: '16px', background: 'white', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  routeCity: { display: 'flex', flexDirection: 'column', gap: 2 },
  cityCode: { fontSize: 22, fontWeight: 800, color: '#111', fontFamily: 'DM Mono', letterSpacing: '1px' },
  cityFull: { fontSize: 11, color: '#9ca3af', fontWeight: 500, maxWidth: 100 },
  routeMid: { display: 'flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center', padding: '0 12px' },
  routeDot: { width: 8, height: 8, borderRadius: '50%', background: '#d1d5db' },
  routeTrack: { flex: 1, height: 1, background: '#e5e7eb' },
  routeIcon: { fontSize: 20 },
  list: { display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px' },
  ticket: { background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
  ticketTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '18px 20px 12px' },
  trainName: { fontSize: 17, fontWeight: 700, color: '#111', marginBottom: 3, letterSpacing: '-0.3px' },
  trainNo: { fontSize: 12, color: '#9ca3af', fontFamily: 'DM Mono', fontWeight: 500 },
  crowdPill: { fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 20, letterSpacing: '0.3px' },
  dividerRow: { display: 'flex', alignItems: 'center', padding: '0 -1px' },
  dividerCircle: { width: 16, height: 16, borderRadius: '50%', background: '#f5f5f0', border: '1px solid #e5e7eb', marginLeft: -8, marginRight: -8, flexShrink: 0, zIndex: 1 },
  dividerLine: { flex: 1, borderTop: '1.5px dashed #e5e7eb' },
  timeRow: { display: 'flex', alignItems: 'center', padding: '16px 20px 12px' },
  timeBlock: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' },
  timeVal: { fontSize: 26, fontWeight: 800, color: '#111', fontFamily: 'DM Mono', letterSpacing: '-1px' },
  timeLabel: { fontSize: 11, color: '#9ca3af', fontWeight: 500, marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.5px' },
  duration: { flex: 1, display: 'flex', alignItems: 'center', gap: 6, padding: '0 12px' },
  durationLine: { flex: 1, height: 1, background: '#e5e7eb' },
  durationText: { fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap', fontWeight: 500 },
  barSection: { padding: '0 20px 14px' },
  barLabel: { display: 'flex', justifyContent: 'space-between', marginBottom: 6 },
  barText: { fontSize: 12, color: '#6a717f', fontWeight: 500 },
  barPct: { fontSize: 12, fontWeight: 700 },
  barTrack: { height: 6, background: '#f3f4f6', borderRadius: 99, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 99, transition: 'width 0.8s ease' },
  bottomRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px 18px', borderTop: '1px solid #f3f4f6' },
  daysWrap: { display: 'flex', gap: 4 },
  dayDot: { width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 },
  seats: { fontSize: 13 },
  seatsNum: { fontWeight: 700, color: '#111', fontFamily: 'DM Mono' },
  seatsLabel: { color: '#9ca3af' }
};

export default Results;