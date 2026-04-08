import { useState, useCallback, useMemo, useEffect, useRef } from "react";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const THEMES = [
  { bg:"url('/images/bg_0.png')", accent:"#dc2626", light:"#fdd8d8", season:"Captain"  },
  { bg:"url('/images/bg_1.png')", accent:"#10b981", light:"#d1fae5", season:"Swordsman"  },
  { bg:"url('/images/bg_2.png')", accent:"#f97316", light:"#ffedd5", season:"Navigator"  },
  { bg:"url('/images/bg_3.png')", accent:"#eab308", light:"#fef9c3", season:"Sniper"  },
  { bg:"url('/images/bg_4.png')", accent:"#3b82f6", light:"#dbeafe", season:"Cook"  },
  { bg:"url('/images/bg_5.png')", accent:"#ec4899", light:"#fce7f3", season:"Doctor"  },
  { bg:"url('/images/bg_0.png')", accent:"#dc2626", light:"#fdd8d8", season:"Captain"  },
  { bg:"url('/images/bg_1.png')", accent:"#10b981", light:"#d1fae5", season:"Swordsman"  },
  { bg:"url('/images/bg_2.png')", accent:"#f97316", light:"#ffedd5", season:"Navigator"  },
  { bg:"url('/images/bg_3.png')", accent:"#eab308", light:"#fef9c3", season:"Sniper"  },
  { bg:"url('/images/bg_4.png')", accent:"#3b82f6", light:"#dbeafe", season:"Cook"  },
  { bg:"url('/images/bg_5.png')", accent:"#ec4899", light:"#fce7f3", season:"Doctor"  },
];

const getThemeProps = (month, isDark) => {
  const t = THEMES[month];
  if (!isDark) return t;
  return { ...t, light: t.accent + "33" }; 
};

const HOLIDAYS = {
  "2026-0-1":  "New Year's Day",
  "2026-0-19": "MLK Jr. Day",
  "2026-1-16": "Presidents' Day",
  "2026-4-25": "Memorial Day",
  "2026-5-19": "Juneteenth",
  "2026-6-4":  "Independence Day",
  "2026-8-7":  "Labor Day",
  "2026-9-12": "Columbus Day",
  "2026-10-11":"Veterans Day",
  "2026-10-26":"Thanksgiving",
  "2026-11-25":"Christmas Day",
};

function toKey(d) { return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }
function isSame(a, b) { return !!(a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()); }
function fmtRange(s, e) {
  if (!s) return "";
  const o = { month:"short", day:"numeric" };
  if (!e || isSame(s, e)) return s.toLocaleDateString("en-US", o);
  return `${s.toLocaleDateString("en-US", o)} — ${e.toLocaleDateString("en-US", o)}`;
}

function SeasonArt({ month }) {
  const arts = [
    <g key="jan">{[0,60,120,180,240,300].map((deg, i) => { const a = deg * Math.PI / 180; const bx = 60 + 28 * Math.cos(a), by = 50 + 28 * Math.sin(a); const bra = a + Math.PI / 2; return <g key={i}><line x1="60" y1="50" x2={bx} y2={by} stroke="rgba(255,255,255,.35)" strokeWidth="1.8" strokeLinecap="round"/><line x1={60 + 14 * Math.cos(a) - 6 * Math.cos(bra)} y1={50 + 14 * Math.sin(a) - 6 * Math.sin(bra)} x2={60 + 14 * Math.cos(a) + 6 * Math.cos(bra)} y2={50 + 14 * Math.sin(a) + 6 * Math.sin(bra)} stroke="rgba(255,255,255,.25)" strokeWidth="1.2" strokeLinecap="round"/></g>; })}<circle cx="60" cy="50" r="6" fill="rgba(255,255,255,.3)"/></g>,
    <g key="feb"><path d="M55,28 A22,22 0 1,0 55,72 A14,14 0 1,1 55,28Z" fill="rgba(255,255,255,.2)"/>{[[88,30],[82,58],[92,70],[70,20],[95,45]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r={2} fill={`rgba(255,255,255,${.25+i*.04})`}/>)}</g>,
    <g key="mar"><line x1="60" y1="90" x2="60" y2="40" stroke="rgba(255,255,255,.3)" strokeWidth="2.5" strokeLinecap="round"/><ellipse cx="48" cy="58" rx="14" ry="8" fill="rgba(255,255,255,.18)" transform="rotate(-30 48 58)"/><ellipse cx="72" cy="52" rx="14" ry="8" fill="rgba(255,255,255,.18)" transform="rotate(30 72 52)"/><ellipse cx="60" cy="40" rx="10" ry="14" fill="rgba(255,255,255,.15)" transform="rotate(-5 60 40)"/></g>,
    <g key="apr">{[0,72,144,216,288].map((deg, i) => { const a = deg * Math.PI / 180; const x = 60 + 26 * Math.cos(a), y = 50 + 26 * Math.sin(a); return <ellipse key={i} cx={x} cy={y} rx="9" ry="6" fill="rgba(255,255,255,.18)" transform={`rotate(${deg} ${x} ${y})`}/>; })}<circle cx="60" cy="50" r="9" fill="rgba(255,255,255,.28)"/></g>,
    <g key="may">{[0,45,90,135,180,225,270,315].map((deg, i) => { const a = deg * Math.PI / 180; const cx = 60 + 24 * Math.cos(a), cy = 50 + 24 * Math.sin(a); return <ellipse key={i} cx={cx} cy={cy} rx="7" ry="12" fill="rgba(255,255,255,.15)" transform={`rotate(${deg} ${cx} ${cy})`}/>; })}<circle cx="60" cy="50" r="14" fill="rgba(255,255,255,.22)"/></g>,
    <g key="jun"><circle cx="60" cy="48" r="20" fill="rgba(255,255,255,.22)" style={{animation:"wc-pulse-sun 2s alternate infinite"}}/><g style={{animation:"wc-spin 40s linear infinite", transformOrigin:"60px 48px"}}>{[0,45,90,135,180,225,270,315].map((deg, i) => { const a = deg * Math.PI / 180; return <line key={i} x1={60+22*Math.cos(a)} y1={48+22*Math.sin(a)} x2={60+32*Math.cos(a)} y2={48+32*Math.sin(a)} stroke="rgba(255,255,255,.35)" strokeWidth="2.5" strokeLinecap="round"/>; })}</g></g>,
    <g key="jul">{[[38,28,22],[68,20,18],[86,46,14]].map(([cx,cy,len], fi) => [0,51,103,154,206,257,309].map((deg, i) => { const a = deg * Math.PI / 180; return <line key={`${fi}-${i}`} x1={cx} y1={cy} x2={cx+len*Math.cos(a)} y2={cy+len*Math.sin(a)} stroke={`rgba(255,255,255,${.12+fi*.06})`} strokeWidth="1.8" strokeLinecap="round"/>; }))}</g>,
    <g key="aug">{[18,34,54,74,90].map((x, i) => { const ox = i%2===0 ? 6 : -6; return <g key={i}><line x1={x} y1="90" x2={x+ox} y2="28" stroke="rgba(255,255,255,.18)" strokeWidth="1.5"/><ellipse cx={x+ox} cy="24" rx="5" ry="10" fill="rgba(255,255,255,.15)" transform={`rotate(${i%2===0?12:-12} ${x+ox} 24)`}/></g>; })}</g>,
    <g key="sep">{[[30,62],[62,42],[88,58],[52,80],[76,30]].map(([cx,cy], i) => <path key={i} d="M0,-11 L2,-5 L7,-7 L5,-2 L11,0 L5,2 L7,7 L2,5 L0,11 L-2,5 L-7,7 L-5,2 L-11,0 L-5,-2 L-7,-7 L-2,-5Z" fill={`rgba(255,255,255,${.07+i*.025})`} transform={`translate(${cx} ${cy}) rotate(${i*18})`}/>)}</g>,
    <g key="oct"><line x1="60" y1="95" x2="60" y2="55" stroke="rgba(255,255,255,.28)" strokeWidth="3.5"/><line x1="60" y1="72" x2="32" y2="48" stroke="rgba(255,255,255,.22)" strokeWidth="2.2"/><line x1="60" y1="65" x2="82" y2="44" stroke="rgba(255,255,255,.22)" strokeWidth="2.2"/><line x1="32" y1="48" x2="18" y2="34" stroke="rgba(255,255,255,.15)" strokeWidth="1.5"/><line x1="32" y1="48" x2="40" y2="30" stroke="rgba(255,255,255,.12)" strokeWidth="1.2"/><line x1="82" y1="44" x2="96" y2="30" stroke="rgba(255,255,255,.15)" strokeWidth="1.5"/><line x1="60" y1="60" x2="48" y2="34" stroke="rgba(255,255,255,.12)" strokeWidth="1.2"/><line x1="60" y1="60" x2="72" y2="32" stroke="rgba(255,255,255,.12)" strokeWidth="1.2"/></g>,
    <g key="nov">{[28,42,56,70,84].map((y, i) => <line key={i} x1={i%2===0?8:16} y1={y} x2={i%2===0?98:88} y2={y} stroke="rgba(255,255,255,.1)" strokeWidth="2.5" strokeLinecap="round"/>)}<circle cx="28" cy="52" r="22" fill="rgba(255,255,255,.06)"/></g>,
    <g key="dec">{[[22,18],[50,12],[84,22],[36,52],[70,38],[92,62],[14,70],[58,68]].map(([x,y], i) => <circle key={i} cx={x} cy={y} r={i<4?3:2} fill={`rgba(255,255,255,${.12+i*.02})`}/>)}{[[60,38,7],[82,18,5],[38,58,5]].map(([x,y,len], i) => [0,60,120,180,240,300].map((deg, j) => { const a = deg * Math.PI / 180; return <line key={`${i}-${j}`} x1={x} y1={y} x2={x+len*Math.cos(a)} y2={y+len*Math.sin(a)} stroke="rgba(255,255,255,.32)" strokeWidth="1.2" strokeLinecap="round"/>; }))}</g>,
  ];
  return (
    <svg viewBox="0 0 120 100" style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", opacity:0.75, pointerEvents:"none" }}>
      <g style={{ animation: "wc-float 8s ease-in-out infinite", transformOrigin: "center" }}>
        {arts[month]}
      </g>
      <g className="anime-speedlines">
         <line x1="-20" y1="-20" x2="30" y2="30" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
         <line x1="80" y1="120" x2="130" y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
         <line x1="120" y1="-20" x2="60" y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
      </g>
    </svg>
  );
}

function DayCell({ day, isToday, isStart, isEnd, inRange, isWeekend, holiday, hasNote,
                   colIdx, accentColor, lightColor,
                   onSingleClick, onDoubleClick, isDark }) {
  const [hov, setHov] = useState(false);
  const [clickFlash, setClickFlash] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isStart || isEnd) {
      setClickFlash(true);
      const timer = setTimeout(() => setClickFlash(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isStart, isEnd]);

  const handleRawClick = () => {
      if (timerRef.current !== null) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
          if (onDoubleClick) onDoubleClick();
      } else {
          timerRef.current = setTimeout(() => {
              if (onSingleClick) onSingleClick();
              timerRef.current = null;
          }, 250);
      }
  };

  let outerBg = "transparent";
  if (inRange) {
    outerBg = lightColor;
  } else if (isStart && !isEnd && isEnd) {
    // Left empty specifically to fulfill structural requirement but disabled the effective dragging behavior
  }

  let innerBg    = hov ? (isDark ? "rgba(255,255,255,.15)" : "rgba(0,0,0,.08)") : "transparent";
  let innerColor = isDark ? "var(--wc-text)" : "#2c2418";
  let fw = 400;

  if (isWeekend && !isStart && !isEnd) innerColor = isDark ? "var(--wc-text-muted)" : "#9a7a6a";
  if (isToday  && !isStart && !isEnd) innerColor  = accentColor;
  
  if (isStart) { innerBg = accentColor; innerColor = "white"; fw = 600; }
  else if (isEnd) { innerBg = isDark ? "#fff" : "#111"; innerColor = isDark ? "#111" : "#fff"; fw = 600; }

  return (
    <div
      style={{ height:44, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative" }}
      onClick={handleRawClick}
      onMouseEnter={() => { setHov(true); }}
      onMouseLeave={() => { setHov(false); }}
      title={holiday || undefined}
    >
      {outerBg !== "transparent" && (
          <div style={{ position:"absolute", inset:0, background:outerBg, zIndex:0,
                        transformOrigin: "left",
                        animation: "anime-slash-band 0.25s cubic-bezier(0.19, 1, 0.22, 1) forwards" }} />
      )}
      
      {clickFlash && (
        <div style={{ position:"absolute", inset:-12, zIndex:0, borderRadius:"50%", border:`2px solid ${accentColor}`,
                      animation: "anime-burst 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards" }} />
      )}

      <div style={{ width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center",
                    borderRadius:"50%", fontSize:14, fontWeight:fw, color:innerColor,
                    background:innerBg, position:"relative", zIndex:1,
                    transition:"all .2s cubic-bezier(0.34, 1.56, 0.64, 1)",
                    transform: hov && !isStart && !isEnd ? "scale(1.2) rotate(-3deg)" : "scale(1)",
                    animation: (isStart || isEnd) ? "anime-pop 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards" : "none",
                    boxShadow: isEnd ? `0 0 10px ${isDark ? '#fff' : '#111'}` : isStart ? `0 0 15px ${accentColor}` : (hov && !isStart && !isEnd ? "0 4px 10px rgba(0,0,0,0.2)" : "none") }}>
        {day}
        {isToday && (
          <span style={{ position:"absolute", bottom:3, left:"50%", transform:"translateX(-50%)", width:4, height:4, borderRadius:"50%", background: (isStart||isEnd) ? "rgba(255,255,255,.9)" : accentColor }} />
        )}
      </div>
      {holiday && (
        <span style={{ position:"absolute", top:4, right:4, width:5, height:5, borderRadius:"50%", background: isDark?"#6dba6d":"#5a8a5a", zIndex:2, animation: "wc-bounce-in 0.4s cubic-bezier(0.175,0.885,0.32,1.275) backwards", animationDelay: `${colIdx * 20}ms` }} />
      )}
      {hasNote && !isStart && !isEnd && (
        <span style={{ position:"absolute", bottom:4, right:4, width:5, height:5, borderRadius:"50%", background:accentColor, zIndex:2, animation: "wc-bounce-in 0.4s cubic-bezier(0.175,0.885,0.32,1.275) backwards" }} />
      )}
    </div>
  );
}

export default function WallCalendar() {
  const [isDark, setIsDark] = useState(false);
  const today = useMemo(() => new Date(), []);

  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [startDate, setStart] = useState(null);
  const [endDate,   setEnd]   = useState(null);
  const [phase,  setPhase]    = useState("start");
  
  const [notes,  setNotes]    = useState(() => {
    try {
      const saved = localStorage.getItem("wc_notes");
      return saved ? JSON.parse(saved, (k, v) => (k === "start" || k === "end") && v ? new Date(v) : v) : [];
    } catch(e) { return []; }
  });
  const [showSavedMsg, setShowSavedMsg] = useState(false);
  const [noteText, setNote]   = useState("");
  const [fading, setFading]   = useState(false);

  useEffect(() => {
    localStorage.setItem("wc_notes", JSON.stringify(notes));
  }, [notes]);
  const [tDir, setTDir]       = useState(0);

  const themeProps = getThemeProps(month, isDark);
  const ac  = themeProps.accent;
  const lgt = themeProps.light;

  const goMonth = useCallback((dir) => {
    if (fading) return;
    setTDir(dir);
    setFading(true);
    setTimeout(() => {
      setMonth(m => {
        const nm = m + dir;
        if (nm < 0)  { setYear(y => y - 1); return 11; }
        if (nm > 11) { setYear(y => y + 1); return 0;  }
        return nm;
      });
      setFading(false);
    }, 350); 
  }, [fading]);

  const { daysInMonth, firstDay } = useMemo(() => ({
    daysInMonth: new Date(year, month + 1, 0).getDate(),
    firstDay:    new Date(year, month, 1).getDay(),
  }), [year, month]);

  const calDays = useMemo(() => {
    const arr = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    while (arr.length % 7) arr.push(null);
    return arr;
  }, [firstDay, daysInMonth]);

  const handleSingleClick = useCallback((day) => {
    const d = new Date(year, month, day);
    setStart(d);
    setEnd(d);
    setPhase("start");
  }, [year, month]);

  const handleDoubleClick = useCallback((day) => {
    const d = new Date(year, month, day);
    if (phase === "start" || (startDate && isSame(startDate, endDate))) {
      setStart(d); setEnd(null); setPhase("end");
    } else {
      if (startDate && d < startDate) {
        setStart(d); setEnd(null);
      } else {
        setEnd(d); setPhase("start");
      }
    }
  }, [phase, startDate, endDate, year, month]);

  const clearSel = useCallback(() => { setStart(null); setEnd(null); setPhase("start"); }, []);

  const saveNote = useCallback(() => {
    if (!noteText.trim() || !startDate) return;
    setNotes(p => [{ id:Date.now(), start:startDate, end:endDate, text:noteText.trim(), month, year }, ...p]);
    setNote("");
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 2000);
  }, [noteText, startDate, endDate, month, year]);

  const monthNotes = useMemo(() => notes.filter(n => n.month === month && n.year === year), [notes, month, year]);

  const noteKeySet = useMemo(() => {
    const s = new Set();
    monthNotes.forEach(n => {
      if (!n.start) return;
      if (!n.end || isSame(n.start, n.end)) { s.add(toKey(n.start)); return; }
      const cur = new Date(n.start);
      while (cur <= n.end) { s.add(toKey(cur)); cur.setDate(cur.getDate() + 1); }
    });
    return s;
  }, [monthNotes]);

  const selLabel = (() => {
    if (!startDate) return "Click day to view, double-click for range";
    if (phase === "end") return `From ${startDate.toLocaleDateString("en-US",{month:"short",day:"numeric"})}... double-click end!`;
    return fmtRange(startDate, endDate) || startDate.toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
  })();

  return (
    <>
      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        .wc {
          --wc-bg: #faf8f5;
          --wc-shadow: rgba(44,36,24,.22);
          --wc-bind: #d4c9b8;
          --wc-bind-border: #c4b9a8;
          --wc-hole: #eae4d8;
          --wc-hole-border: #b4a898;
          --wc-panel: #faf8f5;
          --wc-text: #2c2418;
          --wc-text-muted: #9a8a7a;
          --wc-text-light: #c0b0a0;
          --wc-border: #e4dbd0;
          --wc-nav-btn: white;
          --wc-nav-btn-hover: #ede5d8;
          --wc-nav-border: #ddd4c4;
          --wc-input-bg: white;
          --wc-ni-bg: white;
          font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
          max-width: 980px; width: 100%; margin: 0 auto; box-sizing: border-box;
          background: var(--wc-bg); border-radius: 20px; overflow: hidden;
          box-shadow: 0 16px 80px var(--wc-shadow), 0 2px 8px var(--wc-shadow);
          transition: background 0.4s cubic-bezier(0.19, 1, 0.22, 1), box-shadow 0.4s ease, color 0.4s ease;
        }

        .wc[data-theme="dark"] {
          --wc-bg: #14141a;
          --wc-shadow: rgba(0,0,0,.8);
          --wc-bind: #1e1e26;
          --wc-bind-border: #0a0a0f;
          --wc-hole: #14141a;
          --wc-hole-border: #000;
          --wc-panel: #1a1a22;
          --wc-text: #eaeaea;
          --wc-text-muted: #8a8a9a;
          --wc-text-light: #6a6a7a;
          --wc-border: #2a2a35;
          --wc-nav-btn: #2a2a35;
          --wc-nav-btn-hover: #3a3a48;
          --wc-nav-border: #444455;
          --wc-input-bg: #22222d;
          --wc-ni-bg: #22222d;
        }

        @keyframes anime-pop {
          0% { transform: scale(0.2) rotate(-15deg); opacity: 0; filter: blur(4px); }
          50% { transform: scale(1.4) rotate(5deg); filter: blur(0); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes anime-burst {
          0% { transform: scale(0.5); opacity: 1; border-width: 8px; }
          100% { transform: scale(3.5); opacity: 0; border-width: 0px; }
        }
        @keyframes anime-slash-band {
          0% { opacity: 0; transform: scaleX(0) skewX(-20deg); filter: brightness(2); }
          100% { opacity: 1; transform: scaleX(1) skewX(0deg); filter: brightness(1); }
        }
        @keyframes wc-bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.5); }
          100% { transform: scale(1); }
        }
        @keyframes anime-spring-down {
          0% { opacity: 0; transform: translateY(-40px) scale(0.9) skewX(10deg); }
          50% { transform: translateY(5px) scale(1.05) skewX(-2deg); }
          100% { opacity: 1; transform: translateY(0) scale(1) skewX(0); }
        }
        @keyframes wc-float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        @keyframes wc-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes wc-pulse-sun {
          0%, 100% { transform: scale(0.9); opacity: 0.8; filter: drop-shadow(0 0 5px rgba(255,255,255,0.5)); }
          50% { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 20px rgba(255,255,255,0.9)); }
        }
        
        .anime-speedlines { animation: anime-speed 0.3s infinite linear; transform-origin: center; }
        @keyframes anime-speed {
          0% { transform: translate(-5px, -5px) scale(1.05); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translate(5px, 5px) scale(1.1); opacity: 0; }
        }

        .wc-bind{height:24px;background:var(--wc-bind);border-bottom:1px solid var(--wc-bind-border);
                 display:flex;align-items:center;justify-content:space-evenly; overflow:hidden; transition: background 0.4s ease}
        .wc-hole{width:18px;height:18px;border-radius:50%;background:var(--wc-hole);
                 border:2px solid var(--wc-hole-border);box-shadow:inset 0 2px 4px rgba(0,0,0,.3)}

        .wc-body{display:grid;grid-template-columns:290px 1fr;min-height:570px}
        @media(max-width:680px){
          .wc-hole{width: 12px; height: 12px; border-width: 1px;}
          .wc-body{grid-template-columns:1fr; min-height:auto}
          .wc-hero{min-height:200px!important;max-height:240px}
          .wc-navbtn{width:48px;height:48px;font-size:24px}
          .wc-dhcell{font-size:10px}
          .wc-panel{padding:18px 14px}
          .wc-inputrow{flex-direction:column}
          .wc-savebtn{width:100%; padding:14px; margin-top:8px}
        }

        .wc-hero{position:relative;overflow:hidden;min-height:570px}
        .wc-hero-bg{position:absolute;inset:0;transition:all .6s cubic-bezier(0.85, 0, 0.15, 1); background-size: cover !important; background-position: center !important;}
        .wc-hero-ov{position:absolute;inset:0;
                    background:linear-gradient(to top,rgba(0,0,0,.9) 0%,rgba(0,0,0,.5) 50%,transparent 100%);
                    display:flex;flex-direction:column;justify-content:flex-end;
                    padding:28px 26px;color:white}
        
        .wc-mname{font-size:46px;font-weight:700;line-height:1;letter-spacing:-1.5px;
                  animation: glitch-in 0.8s cubic-bezier(0.19, 1, 0.22, 1) both; text-transform:uppercase}
        @keyframes glitch-in {
          0% { transform: translateX(-30px); opacity:0; filter: blur(10px) drop-shadow(-10px 0 0 white); }
          100% { transform: translateX(0); opacity:1; filter: blur(0); }
        }

        .wc-season{font-size:11px;letter-spacing:6px;text-transform:uppercase;opacity:.8;margin-bottom:8px;font-weight:bold}
        .wc-year{font-size:15px;opacity:.6;letter-spacing:4px;margin-top:6px;font-weight:bold}

        .wc-pill{margin-top:14px;display:inline-flex;align-items:center;gap:7px;
                 padding:6px 16px;font-size:11px;letter-spacing:2px;text-transform:uppercase;
                 border-radius:30px;border:1px solid rgba(255,255,255,.5);
                 background:rgba(255,255,255,.15);width:fit-content;backdrop-filter:blur(4px); font-weight:bold}
        .wc-pulsedot{width:8px;height:8px;border-radius:50%;background:white;
                     animation:wc-pulse 1s infinite alternate; box-shadow: 0 0 10px white}
        @keyframes wc-pulse{0%{transform:scale(0.8);opacity:.5}100%{transform:scale(1.2);opacity:1}}

        .wc-panel{padding:22px 26px 18px;display:flex;flex-direction:column;
                  background:var(--wc-panel);perspective:2000px; transition:background .4s ease}

        .wc-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px}
        .wc-navbtn{width:38px;height:38px;border-radius:50%;border:1px solid var(--wc-nav-border);
                   background:var(--wc-nav-btn);cursor:pointer;font-size:20px;color:var(--wc-text-muted);
                   display:flex;align-items:center;justify-content:center;
                   transition:all .2s cubic-bezier(0.34, 1.56, 0.64, 1);line-height:1}
        .wc-navbtn:hover{background:var(--wc-nav-btn-hover);color:var(--wc-text);transform:scale(1.15) rotate(15deg);box-shadow:0 4px 10px rgba(0,0,0,.2)}
        .wc-navbtn:active{transform:scale(0.9)}
        .wc-navtitle{font-size:18px;font-weight:700;color:var(--wc-text);letter-spacing:1px;text-transform:uppercase}
        
        .wc-themebtn{background:var(--wc-nav-btn);border:1px solid var(--wc-nav-border);border-radius:20px;padding:4px 12px;font-size:14px;cursor:pointer;transition:all .3s;margin-right:12px;color:var(--wc-text);display:flex;align-items:center;gap:6px}
        .wc-themebtn:hover{background:var(--wc-nav-btn-hover);transform:scale(1.05);box-shadow:0 4px 10px rgba(0,0,0,.2)}

        .wc-dh{display:grid;grid-template-columns:repeat(7,1fr);margin-bottom:4px}
        .wc-dhcell{text-align:center;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;
                   padding:3px 0 7px;color:var(--wc-text-muted)}

        .wc-grid{display:grid;grid-template-columns:repeat(7,1fr); transition:transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.35s ease; transform-style:preserve-3d; perspective:1500px }
        .wc-grid.fading{opacity:0; filter: blur(2px)}deg) translateX(${tDir * 250}px) scale(0.6) skewX(${tDir * -15}deg); filter: blur(6px)}

        .wc-legend{display:flex;gap:14px;flex-wrap:wrap;margin-top:12px}
        .wc-leg{display:flex;align-items:center;gap:6px;font-size:11px;letter-spacing:1px;color:var(--wc-text-muted);text-transform:uppercase;font-weight:bold}
        .wc-legdot{width:8px;height:8px;border-radius:50%;flex-shrink:0}

        .wc-notes{margin-top:18px;padding-top:18px;border-top:2px dashed var(--wc-border)}
        .wc-selinfo{display:flex;align-items:center;justify-content:space-between;
                    margin-bottom:12px;min-height:18px;font-size:13px;color:var(--wc-text-muted);gap:8px;font-weight:bold}
        .wc-clr{font-size:12px;color:var(--wc-text-muted);background:none;border:none;cursor:pointer;
                text-decoration:underline;font-family:inherit;white-space:nowrap;
                flex-shrink:0;transition:all .15s;text-transform:uppercase}
        .wc-clr:hover{color:#f43f5e; transform: scale(1.1)}

        .wc-inputrow{display:flex;gap:10px}
        .wc-ta{flex:1;resize:none;border:2px solid var(--wc-border);border-radius:12px;
               padding:12px 16px;font-family:inherit;font-size:14px;color:var(--wc-text);
               background:var(--wc-input-bg);min-height:60px;outline:none;transition:all .2s;line-height:1.5;box-shadow:inset 0 2px 4px rgba(0,0,0,.05)}
        .wc-ta:focus{border-color:${ac};box-shadow: 0 0 0 4px ${ac}44}

        .wc-savebtn{padding:12px 20px;background:${ac};color:white;border:none;font-weight:bold;
                    border-radius:12px;font-size:14px;cursor:pointer;font-family:inherit;
                    white-space:nowrap;align-self:flex-end;text-transform:uppercase;letter-spacing:1px;
                    transition:all .2s cubic-bezier(0.34, 1.56, 0.64, 1); box-shadow: 0 4px 15px ${ac}66}
        .wc-savebtn:hover:not(:disabled){transform:scale(1.08) translateY(-2px);box-shadow: 0 8px 25px ${ac}88}
        .wc-savebtn:active:not(:disabled){transform:scale(.95)}
        .wc-savebtn:disabled{opacity:.4;cursor:not-allowed;box-shadow:none}

        .wc-nlist{margin-top:12px;display:flex;flex-direction:column;gap:10px;
                  max-height:150px;overflow-y:auto;padding-right:4px}
        .wc-nlist::-webkit-scrollbar{width:6px}
        .wc-nlist::-webkit-scrollbar-thumb{background:var(--wc-border);border-radius:6px}

        .wc-ni{background:var(--wc-ni-bg);border:1px solid var(--wc-border);border-radius:12px;
               padding:10px 14px;display:flex;gap:12px;align-items:flex-start;
               transition:all .2s cubic-bezier(0.34, 1.56, 0.64, 1);
               animation: anime-spring-down 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards;
               transform-origin: left center;}
        .wc-ni:hover{border-color:${ac};transform:translateY(-3px) scale(1.02);box-shadow:0 8px 20px rgba(0,0,0,.2)}
        .wc-nidate{font-size:11px;font-weight:bold;letter-spacing:1px;color:${ac};white-space:nowrap;
                   margin-top:2px;font-style:italic;min-width:65px}
        .wc-nitext{font-size:14px;color:var(--wc-text);flex:1;line-height:1.5}
        .wc-nidel{background:none;border:none;color:var(--wc-text-light);cursor:pointer;
                  font-size:20px;padding:0;line-height:1;transition:all .2s}
        .wc-nidel:hover{color:#f43f5e;transform:scale(1.3) rotate(90deg)}
      `}</style>

      <div className={`wc`} data-theme={isDark ? 'dark' : 'light'}>
        <div className="wc-bind">
          {Array.from({ length: 14 }).map((_, i) => <div key={i} className="wc-hole" />)}
        </div>

        <div className="wc-body">
          <div className="wc-hero">
            <div className="wc-hero-bg" style={{ background: themeProps.bg }} />
            
            <div className="wc-hero-ov">
              <div className="wc-season">{themeProps.season}</div>
              <div className="wc-mname">{MONTHS[month]}</div>
              <div className="wc-year">{year}</div>

              {phase === "end" && startDate && !endDate && (
                <div className="wc-pill">
                  <span className="wc-pulsedot" /> Select Endpoint
                </div>
              )}
              {startDate && endDate && (
                <div className="wc-pill" style={{ animation:"none" }}>
                  {fmtRange(startDate, endDate)}
                </div>
              )}
            </div>
          </div>

          <div className="wc-panel">
            <div className="wc-nav">
              <button className="wc-navbtn" onClick={() => goMonth(-1)}>&#x276E;</button>
              <div style={{display:'flex', alignItems:'center'}}>
                <button className="wc-themebtn" onClick={() => setIsDark(!isDark)}>
                  {isDark ? '☀️ Light' : '🌙 Dark'}
                </button>
                <div className="wc-navtitle">{MONTHS[month]} {year}</div>
              </div>
              <button className="wc-navbtn" onClick={() => goMonth(1)}>&#x276F;</button>
            </div>

            <div className="wc-dh">
              {DAYS.map((d, i) => (
                <div key={i} className="wc-dhcell" style={{ color:(i===0||i===6) ? ac : undefined }}>{d}</div>
              ))}
            </div>

            <div className={`wc-grid${fading ? " fading" : ""}`} style={{ transformOrigin: tDir === 1 ? "left center" : "right center", transform: fading ? `rotateY(${tDir === 1 ? -120 : 120}deg) scale(0.9) translateZ(50px)` : "rotateY(0deg) scale(1) translateZ(0px)" }}>
              {calDays.map((day, i) => {
                if (!day) return <div key={`e${i}`} style={{ height:44 }} />;

                const colIdx  = i % 7;
                const d       = new Date(year, month, day);
                const key     = toKey(d);
                const holiday = HOLIDAYS[key] || null;
                const isToday = isSame(d, today);
                
                const isStart = isSame(d, startDate);
                const isEnd   = isSame(d, endDate);
                const inRange = !!(startDate && endDate && d > startDate && d < endDate);
                
                const isWknd  = colIdx === 0 || colIdx === 6;
                const hasNote = noteKeySet.has(key);

                return (
                  <DayCell
                    key={day} day={day} isToday={isToday} isStart={isStart} isEnd={isEnd}
                    inRange={inRange} isWeekend={isWknd} holiday={holiday} hasNote={hasNote}
                    colIdx={colIdx} accentColor={ac} lightColor={lgt} 
                    onSingleClick={() => handleSingleClick(day)}
                    onDoubleClick={() => handleDoubleClick(day)}
                    isDark={isDark}
                  />
                );
              })}
            </div>

            <div className="wc-legend">
              <span className="wc-leg"><span className="wc-legdot" style={{ background:isDark?"#6dba6d":"#5a8a5a" }} /> Holiday</span>
              <span className="wc-leg"><span className="wc-legdot" style={{ background:ac }} /> Note</span>
              <span className="wc-leg"><span className="wc-legdot" style={{ background:lgt, border:`2px solid ${ac}` }} /> Range</span>
            </div>

            <div className="wc-notes">
              <div className="wc-selinfo">
                <span>{selLabel}</span>
                {startDate && <button className="wc-clr" onClick={clearSel}>Clear</button>}
              </div>

              <div className="wc-inputrow">
                <textarea
                  className="wc-ta"
                  value={noteText}
                  onChange={e => setNote(e.target.value)}
                  placeholder={
                    !startDate        ? "Click day to view, double-click for range..." :
                    phase === "end"   ? "Awaiting double-click for target end..." :
                    `Add a note for ${fmtRange(startDate, endDate) || "target"}...`
                  }
                  onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") saveNote(); }}
                />
                <button className="wc-savebtn" onClick={saveNote} disabled={!noteText.trim() || !startDate}>
                  Save Plan
                </button>
              </div>

              {showSavedMsg && <div style={{ color:"#10b981", fontSize:13, fontWeight:"bold", margin:"6px 0 0 auto", textAlign:"right", animation:"anime-pop 0.3s forwards" }}>Saved ✅</div>}
              
              {monthNotes.length > 0 ? (
                <div className="wc-nlist">
                  {monthNotes.map(n => (
                    <div key={n.id} className="wc-ni">
                      <div className="wc-nidate">{fmtRange(n.start, n.end)}</div>
                      <div className="wc-nitext">{n.text}</div>
                      <button className="wc-nidel" onClick={() => setNotes(p => p.filter(x => x.id !== n.id))}>&times;</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ marginTop: 30, textAlign: "center", color: "var(--wc-text-muted)", fontSize: 14, fontStyle: "italic", opacity: 0.6 }}>
                  No notes yet for this month.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
