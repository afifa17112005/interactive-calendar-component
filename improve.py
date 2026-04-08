import sys
import re

file_paths = [
    r"c:\Users\admin\Downloads\wallcalendar\calendar\src\WallCalendar.jsx",
    r"c:\Users\admin\Downloads\wallcalendar\WallCalendar.jsx"
]

for fp in file_paths:
    try:
        with open(fp, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        continue

    # Injection 1: Top CSS animations
    css_to_add = """
        @keyframes wc-pop {
          0% { transform: scale(0.4); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes wc-bounce-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        @keyframes wc-spring-down {
          0% { opacity: 0; transform: translateY(-20px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes wc-band-reveal {
          from { opacity: 0; transform: scaleX(0); }
          to { opacity: 1; transform: scaleX(1); }
        }
        @keyframes wc-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes wc-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes wc-pulse-sun {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
"""
    if "@keyframes wc-pop" not in content:
        content = content.replace(".wc{font-family", css_to_add + "\n        .wc{font-family")

    # Injection 2: DayCell replacement
    day_cell_component = """function DayCell({ day, isToday, isStart, isEnd, inRange, isWeekend, holiday, hasNote,
                   colIdx, accentColor, lightColor, effectiveEnd, startDate,
                   onClick, onMouseEnter, onMouseLeave }) {
  const [hov, setHov] = useState(false);

  // Outer: range-band background
  let outerBg = "transparent";
  if (inRange) {
    outerBg = lightColor;
  } else if (isStart && !isEnd && effectiveEnd) {
    if (colIdx !== 6) outerBg = `linear-gradient(to right, transparent 50%, ${lightColor} 50%)`;
  } else if (isEnd && startDate && !isStart) {
    if (colIdx !== 0) outerBg = `linear-gradient(to left, transparent 50%, ${lightColor} 50%)`;
  }

  // Inner circle
  let innerBg    = hov ? "rgba(0,0,0,.07)" : "transparent";
  let innerColor = "#2c2418";
  let fw = 400;
  if (isWeekend && !isStart && !isEnd) innerColor = "#9a7a6a";
  if (isToday  && !isStart && !isEnd) innerColor  = accentColor;
  if (isStart || isEnd) { innerBg = accentColor; innerColor = "white"; fw = 600; }

  return (
    <div
      style={{ height:44, display:"flex", alignItems:"center", justifyContent:"center",
               cursor:"pointer", position:"relative" }}
      onClick={onClick}
      onMouseEnter={() => { setHov(true);  onMouseEnter(); }}
      onMouseLeave={() => { setHov(false); onMouseLeave(); }}
      title={holiday || undefined}
    >
      {outerBg !== "transparent" && (
          <div style={{ position:"absolute", inset:0, background:outerBg, zIndex:0,
                        transformOrigin: startDate && isEnd ? "right" : "left",
                        animation: "wc-band-reveal 0.35s cubic-bezier(0.175,0.885,0.32,1.275) forwards" }} />
      )}
      <div style={{ width:36, height:36, display:"flex", alignItems:"center", justifyContent:"center",
                    borderRadius:"50%", fontSize:13, fontWeight:fw, color:innerColor,
                    background:innerBg, position:"relative", zIndex:1,
                    transition:"all .25s cubic-bezier(0.175,0.885,0.32,1.275)",
                    transform: hov && !isStart && !isEnd ? "scale(1.15)" : "scale(1)",
                    animation: (isStart || isEnd) ? "wc-pop 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards" : "none",
                    boxShadow: (isStart || isEnd) ? `0 4px 12px ${accentColor}66` : (hov && !isStart && !isEnd ? "0 4px 10px rgba(0,0,0,0.12)" : "none") }}>
        {day}
        {isToday && (
          <span style={{ position:"absolute", bottom:3, left:"50%", transform:"translateX(-50%)",
                         width:4, height:4, borderRadius:"50%",
                         background: (isStart||isEnd) ? "rgba(255,255,255,.7)" : accentColor }} />
        )}
      </div>
      {holiday && (
        <span style={{ position:"absolute", top:4, right:4, width:5, height:5,
                       borderRadius:"50%", background:"#5a8a5a", zIndex:2,
                       animation: "wc-bounce-in 0.4s cubic-bezier(0.175,0.885,0.32,1.275) backwards", animationDelay: `${colIdx * 30}ms` }} />
      )}
      {hasNote && !isStart && !isEnd && (
        <span style={{ position:"absolute", bottom:4, right:4, width:4, height:4,
                       borderRadius:"50%", background:accentColor, zIndex:2,
                       animation: "wc-bounce-in 0.4s cubic-bezier(0.175,0.885,0.32,1.275) backwards" }} />
      )}
    </div>
  );
}"""
    content = re.sub(
        r"function DayCell\(\{ day, isToday, isStart, isEnd, inRange.*?</div>\n  \);\n}",
        day_cell_component,
        content,
        flags=re.DOTALL
    )

    # Injection 3: Update Grid and Panel CSS inside the style tag
    if "perspective:1000px" not in content:
        content = content.replace(
            ".wc-panel{padding:22px 26px 18px;display:flex;flex-direction:column;background:#faf8f5}",
            ".wc-panel{padding:22px 26px 18px;display:flex;flex-direction:column;background:#faf8f5;perspective:1000px}"
        )
    if "transform-style:preserve-3d" not in content:
        content = content.replace(
            ".wc-grid{display:grid;grid-template-columns:repeat(7,1fr);transition:opacity .22s,transform .22s}",
            ".wc-grid{display:grid;grid-template-columns:repeat(7,1fr);transition:opacity .35s ease,transform .45s cubic-bezier(0.175,0.885,0.32,1.275);transform-style:preserve-3d;transform-origin:center}"
        )
    if "rotateY" not in content:
        content = re.sub(
            r"\.wc-grid\.fading\{opacity:0;transform:translateX\(\$\{transDir \* 16\}px\)\}",
            r".wc-grid.fading{opacity:0;transform:rotateY(${transDir * -15}deg) translateX(${transDir * 30}px) translateZ(-60px) scale(0.95)}",
            content
        )

    # Injection 4: Node Item (.wc-ni) hover and pop animation
    if "wc-spring-down" not in content and ".wc-ni:hover" not in content:
        # Avoid double replacing
        if "border-radius:9px;padding:8px 12px;display:flex;gap:10px;align-items:flex-start;transition:border-color .15s" in content:
            content = content.replace(
                ".wc-ni{background:white;border:1px solid #e4dbd0;border-radius:9px;\n               padding:8px 12px;display:flex;gap:10px;align-items:flex-start;\n               transition:border-color .15s}",
                ".wc-ni{background:white;border:1px solid #e4dbd0;border-radius:9px;padding:8px 12px;display:flex;gap:10px;align-items:flex-start;transition:border-color .15s, transform .2s, box-shadow .2s;animation: wc-spring-down 0.4s cubic-bezier(0.175,0.885,0.32,1.275) forwards;transform-origin:top center}\n        .wc-ni:hover{border-color:${ac};transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.05)}"
            )

    # Injection 5: Season Art Float and SVG spin
    if 'animation: "wc-float 8s ease-in-out infinite"' not in content:
        content = content.replace(
            "{arts[month]}",
            '<g style={{ animation: "wc-float 8s ease-in-out infinite", transformOrigin: "center" }}>\n        {arts[month]}\n      </g>'
        )
    if 'animation:"wc-pulse-sun' not in content:
        content = content.replace(
            '<circle cx="60" cy="48" r="20" fill="rgba(255,255,255,.22)"/>',
            '<circle cx="60" cy="48" r="20" fill="rgba(255,255,255,.22)" style={{ animation:"wc-pulse-sun 2s alternate infinite" }}/>'
        )
    if 'animation:"wc-spin 40s linear infinite"' not in content:
        content = re.sub(
            r"\{\[0,45,90,135,180,225,270,315\]\.map\(\(deg, i\) => \{(.*?)\}\)\}",
            r'<g style={{ animation:"wc-spin 40s linear infinite", transformOrigin:"60px 48px" }}>\n      {[0,45,90,135,180,225,270,315].map((deg, i) => {\g<1>})}\n      </g>',
            content,
            flags=re.DOTALL
        )

    with open(fp, "w", encoding="utf-8") as f:
        f.write(content)

print("Animations updated!")
