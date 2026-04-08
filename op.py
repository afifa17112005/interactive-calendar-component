import codecs

fp = r"c:\Users\admin\Downloads\wallcalendar\calendar\src\WallCalendar.jsx"
fp2 = r"c:\Users\admin\Downloads\wallcalendar\WallCalendar.jsx"

with codecs.open(fp, 'r', 'utf-8') as f:
    text = f.read()

# Replace THEMES
old_themes = """const THEMES = [
  { bg:"linear-gradient(160deg,#0d1b3e,#1a4580 55%,#2c7bb6)", accent:"#4a9fd4", light:"#daeef9", season:"Winter"  },
  { bg:"linear-gradient(160deg,#2d1b4e,#6b3a8c 55%,#a855b5)", accent:"#b57fd4", light:"#eedefa", season:"Winter"  },
  { bg:"linear-gradient(160deg,#0e4714,#2d7a2d 55%,#52a852)", accent:"#3aad6a", light:"#d4f7da", season:"Spring"  },
  { bg:"linear-gradient(160deg,#5c1a3a,#a83270 55%,#f472b6)", accent:"#d8588a", light:"#fce4ef", season:"Spring"  },
  { bg:"linear-gradient(160deg,#1a4d1a,#3d8b3d 55%,#70c570)", accent:"#4aaa4a", light:"#d8f4d8", season:"Spring"  },
  { bg:"linear-gradient(160deg,#7c4a00,#c27a0a 55%,#f5c430)", accent:"#c49010", light:"#fdf3d0", season:"Summer"  },
  { bg:"linear-gradient(160deg,#7c1d00,#c2380a 55%,#f97316)", accent:"#d96010", light:"#fde8d0", season:"Summer"  },
  { bg:"linear-gradient(160deg,#5c3300,#a35e00 55%,#d97706)", accent:"#b87810", light:"#fdf0d0", season:"Summer"  },
  { bg:"linear-gradient(160deg,#5c2000,#b54500 55%,#ea580c)", accent:"#c85010", light:"#fde3d0", season:"Autumn"  },
  { bg:"linear-gradient(160deg,#3c0000,#991b1b 55%,#dc2626)", accent:"#c03030", light:"#fdd8d8", season:"Autumn"  },
  { bg:"linear-gradient(160deg,#1a1209,#3d2f22 55%,#7a6255)", accent:"#8a6a58", light:"#f0e8e0", season:"Autumn"  },
  { bg:"linear-gradient(160deg,#050e24,#0d2557 55%,#1e4080)", accent:"#4870c0", light:"#dae4f8", season:"Winter"  },
];"""
new_themes = """const THEMES = [
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
];"""

if old_themes in text:
    text = text.replace(old_themes, new_themes)
else:
    print("Warning: old themes block not found exactly.")

text = text.replace('.wc-hero-bg{position:absolute;inset:0;transition:background .6s cubic-bezier(0.85, 0, 0.15, 1)}', 
                    '.wc-hero-bg{position:absolute;inset:0;transition:all .6s cubic-bezier(0.85, 0, 0.15, 1); background-size: cover !important; background-position: center !important;}')

text = text.replace('background:linear-gradient(to top,rgba(0,0,0,.7) 0%,transparent 70%);',
                    'background:linear-gradient(to top,rgba(0,0,0,.9) 0%,rgba(0,0,0,.5) 50%,transparent 100%);')

text = text.replace('<SeasonArt month={month} />', '')

with codecs.open(fp, 'w', 'utf-8') as f:
    f.write(text)
with codecs.open(fp2, 'w', 'utf-8') as f:
    f.write(text)

print("One Piece calendar executed!")
