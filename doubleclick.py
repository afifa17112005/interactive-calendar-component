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

    # Change onClick to onDoubleClick in DayCell
    content = content.replace(
        "onClick={() => { onClick(); }}",
        "onDoubleClick={() => { onClick(); }}"
    )

    # Update tooltip text
    content = content.replace(
        'Click a date to begin selecting',
        'Double-click a date to begin'
    )
    content = content.replace(
        '— click end date!',
        '— double-click end date!'
    )
    content = content.replace(
        '"Select your dates first..."',
        '"Double-click dates first..."'
    )
    content = content.replace(
        'Select Target',
        'Double-click Target'
    )

    with codecs.open(fp, "w", "utf-8") as f:
        f.write(content)

print("Double click activated")
