import codecs
import re

fp = r"c:\Users\admin\Downloads\wallcalendar\calendar\src\WallCalendar.jsx"
fp2 = r"c:\Users\admin\Downloads\wallcalendar\WallCalendar.jsx"

try:
    with codecs.open(fp, 'r', 'utf-8') as f:
        text = f.read()
except FileNotFoundError:
    print("File not found.")
    exit(1)

# 1. State updates for LocalStorage and Feedback
old_state = """  const [notes,  setNotes]    = useState([]);
  const [noteText, setNote]   = useState("");
  const [fading, setFading]   = useState(false);"""
new_state = """  const [notes,  setNotes]    = useState(() => {
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
  }, [notes]);"""
text = text.replace(old_state, new_state)

# 2. Update saveNote function
old_save = """  const saveNote = useCallback(() => {
    if (!noteText.trim() || !startDate) return;
    setNotes(p => [{ id:Date.now(), start:startDate, end:endDate, text:noteText.trim(), month, year }, ...p]);
    setNote("");
  }, [noteText, startDate, endDate, month, year]);"""
new_save = """  const saveNote = useCallback(() => {
    if (!noteText.trim() || !startDate) return;
    setNotes(p => [{ id:Date.now(), start:startDate, end:endDate, text:noteText.trim(), month, year }, ...p]);
    setNote("");
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 2000);
  }, [noteText, startDate, endDate, month, year]);"""
text = text.replace(old_save, new_save)

# 3. Add UX text and empty state
old_ux = """              {monthNotes.length > 0 && (
                <div className="wc-nlist">
                  {monthNotes.map(n => (
                    <div key={n.id} className="wc-ni">
                      <div className="wc-nidate">{fmtRange(n.start, n.end)}</div>
                      <div className="wc-nitext">{n.text}</div>
                      <button className="wc-nidel" onClick={() => setNotes(p => p.filter(x => x.id !== n.id))}>&times;</button>
                    </div>
                  ))}
                </div>
              )}"""
new_ux = """              {showSavedMsg && <div style={{ color:"#10b981", fontSize:13, fontWeight:"bold", margin:"6px 0 0 auto", textAlign:"right", animation:"anime-pop 0.3s forwards" }}>Saved ✅</div>}
              
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
              )}"""
text = text.replace(old_ux, new_ux)

text = text.replace('Engage', 'Save Plan')
text = text.replace('Input mission for', 'Add a note for')

# 4. Range Distinction color updates
old_color_logic = """  if (isWeekend && !isStart && !isEnd) innerColor = isDark ? "var(--wc-text-muted)" : "#9a7a6a";
  if (isToday  && !isStart && !isEnd) innerColor  = accentColor;
  if (isStart || isEnd) { innerBg = accentColor; innerColor = "white"; fw = 600; }"""
new_color_logic = """  if (isWeekend && !isStart && !isEnd) innerColor = isDark ? "var(--wc-text-muted)" : "#9a7a6a";
  if (isToday  && !isStart && !isEnd) innerColor  = accentColor;
  
  if (isStart) { innerBg = accentColor; innerColor = "white"; fw = 600; }
  else if (isEnd) { innerBg = isDark ? "#fff" : "#111"; innerColor = isDark ? "#111" : "#fff"; fw = 600; box-shadow: `0 0 10px ${isDark ? '#fff' : '#111'}`; }"""
text = text.replace(old_color_logic, new_color_logic)

# 5. Responsive Design optimizations
old_media = "@media(max-width:680px){.wc-body{grid-template-columns:1fr}.wc-hero{min-height:210px!important;max-height:280px}}"
new_media = """@media(max-width:680px){
          .wc-body{grid-template-columns:1fr; min-height:auto}
          .wc-hero{min-height:200px!important;max-height:240px}
          .wc-navbtn{width:48px;height:48px;font-size:24px}
          .wc-dhcell{font-size:10px}
          .wc-panel{padding:18px 14px}
          .wc-inputrow{flex-direction:column}
          .wc-savebtn{width:100%; padding:14px; margin-top:8px}
        }"""
text = text.replace(old_media, new_media)

with codecs.open(fp, 'w', 'utf-8') as f:
    f.write(text)
with codecs.open(fp2, 'w', 'utf-8') as f:
    f.write(text)

print("Refactored code for internship readiness")
