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

# 1. Update the CSS for .wc-grid
text = re.sub(
    r'\.wc-grid\{display:grid;grid-template-columns:repeat\(7,1fr\);[^}]+\}',
    '.wc-grid{display:grid;grid-template-columns:repeat(7,1fr); transition:transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.35s ease; transform-style:preserve-3d; perspective:1500px }',
    text
)

text = re.sub(
    r'\.wc-grid\.fading\{[^}]+\}',
    '.wc-grid.fading{opacity:0; filter: blur(2px)}',
    text
)

# 2. Inject inline styles into the div
text = text.replace(
    '<div className={`wc-grid${fading ? " fading" : ""}`}>',
    '<div className={`wc-grid${fading ? " fading" : ""}`} style={{ transformOrigin: tDir === 1 ? "left center" : "right center", transform: fading ? `rotateY(${tDir === 1 ? -120 : 120}deg) scale(0.9) translateZ(50px)` : "rotateY(0deg) scale(1) translateZ(0px)" }}>'
)

# 3. Increase timeout slightly to allow the majestic flip to complete
text = text.replace('}, 280);', '}, 350);')

with codecs.open(fp, 'w', 'utf-8') as f:
    f.write(text)
with codecs.open(fp2, 'w', 'utf-8') as f:
    f.write(text)

print("Page flip mechanism engaged!")
