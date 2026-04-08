import codecs

fp = r"c:\Users\admin\Downloads\wallcalendar\calendar\src\WallCalendar.jsx"
fp2 = r"c:\Users\admin\Downloads\wallcalendar\WallCalendar.jsx"

try:
    with codecs.open(fp, 'r', 'utf-8') as f:
        text = f.read()
except FileNotFoundError:
    print("File not found.")
    exit(1)

old_logic = "else if (isEnd) { innerBg = isDark ? \"#fff\" : \"#111\"; innerColor = isDark ? \"#111\" : \"#fff\"; fw = 600; box-shadow: `0 0 10px ${isDark ? '#fff' : '#111'}`; }"
new_logic = "else if (isEnd) { innerBg = isDark ? \"#fff\" : \"#111\"; innerColor = isDark ? \"#111\" : \"#fff\"; fw = 600; }"

if old_logic in text:
    text = text.replace(old_logic, new_logic)
else:
    print("Warning: old logic not found")

# Fix boxShadow in inline style
old_inline = "boxShadow: (isStart || isEnd) ? `0 0 15px ${accentColor}` : (hov && !isStart && !isEnd ? \"0 4px 10px rgba(0,0,0,0.2)\" : \"none\")"
new_inline = "boxShadow: isEnd ? `0 0 10px ${isDark ? '#fff' : '#111'}` : isStart ? `0 0 15px ${accentColor}` : (hov && !isStart && !isEnd ? \"0 4px 10px rgba(0,0,0,0.2)\" : \"none\")"

if old_inline in text:
    text = text.replace(old_inline, new_inline)
else:
    print("Warning: inline box shadow not found")

with codecs.open(fp, 'w', 'utf-8') as f:
    f.write(text)
with codecs.open(fp2, 'w', 'utf-8') as f:
    f.write(text)

print("Syntax fixed")
