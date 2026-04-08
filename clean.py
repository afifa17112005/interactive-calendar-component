import codecs
import re

file_paths = [
    r"c:\Users\admin\Downloads\wallcalendar\calendar\src\WallCalendar.jsx",
    r"c:\Users\admin\Downloads\wallcalendar\WallCalendar.jsx"
]

for fp in file_paths:
    try:
        with codecs.open(fp, "r", "utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        continue

    # 1. Remove the 'hovered' logic from isEnd in WallCalendar main component
    content = re.sub(
        r'const isEnd\s*=\s*isSame\(d, endDate\) \|\|[^;]+;',
        'const isEnd = isSame(d, endDate);',
        content
    )

    # 2. Remove the 'hovered' logic from effectiveEnd
    content = re.sub(
        r'const effectiveEnd = endDate \|\|[^;]+;',
        'const effectiveEnd = endDate;',
        content
    )

    # 3. Clean up the DayCell props (remove phase === "end" && setHovered(...) logic)
    # The previous code has:
    # onMouseEnter={() => phase === "end" && setHovered(...) }
    # onMouseLeave={() => setHovered(null)}
    # We will replace them with a simple static onMouseEnter/Leave just for standard button hover
    content = re.sub(
        r'onMouseEnter=\{[^\}]+\}\s*onMouseLeave=\{[^\}]+\}',
        'onMouseEnter={() => {}} onMouseLeave={() => {}}',
        content
    )
    
    # 4. Make sure DayCell inner component doesn't fire an empty onMouseEnter if it breaks
    content = content.replace(
        'onMouseEnter={() => { setHov(true);  onMouseEnter(); }}',
        'onMouseEnter={() => { setHov(true); if(onMouseEnter) onMouseEnter(); }}'
    )
    content = content.replace(
        'onMouseLeave={() => { setHov(false); onMouseLeave(); }}',
        'onMouseLeave={() => { setHov(false); if(onMouseLeave) onMouseLeave(); }}'
    )

    with codecs.open(fp, "w", "utf-8") as f:
        f.write(content)

print("Cleaned up hover dragging and explosion rings!")
