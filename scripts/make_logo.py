from PIL import Image, ImageDraw
import math

S = 2048          # supersampled
OUT = 512
img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
d = ImageDraw.Draw(img)

def hex2rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

NAVY_TOP = hex2rgb("16233B")
NAVY_BOT = hex2rgb("0B1220")
CORAL = hex2rgb("FF6B45")
CORAL_L = hex2rgb("FF9776")

# Rounded-square mask
radius = int(S * 0.24)
mask = Image.new("L", (S, S), 0)
md = ImageDraw.Draw(mask)
md.rounded_rectangle([0, 0, S - 1, S - 1], radius=radius, fill=255)

# Vertical navy gradient inside mask
grad = Image.new("RGB", (1, S))
for y in range(S):
    t = y / (S - 1)
    grad.putpixel((0, y), tuple(int(NAVY_TOP[i] + (NAVY_BOT[i] - NAVY_TOP[i]) * t) for i in range(3)))
grad = grad.resize((S, S)).convert("RGBA")
img = Image.composite(grad, img, mask)
d = ImageDraw.Draw(img)

# Subtle inner top highlight
hl = Image.new("RGBA", (S, S), (0, 0, 0, 0))
hd = ImageDraw.Draw(hl)
hd.rounded_rectangle([0, 0, S - 1, int(S * 0.45)], radius=radius, fill=(255, 255, 255, 14))
img = Image.alpha_composite(img, Image.composite(hl, Image.new("RGBA", (S, S), (0, 0, 0, 0)), mask))
d = ImageDraw.Draw(img)

# Geometric "G": thick open ring + horizontal bar
cx = cy = S // 2
r = int(S * 0.285)
w = int(S * 0.115)
bbox = [cx - r, cy - r, cx + r, cy + r]
# PIL arc angles: 0 = 3 o'clock, clockwise positive. Gap at right: draw 37 -> 323
d.arc(bbox, start=37, end=323, fill=CORAL + (255,), width=w)

# Rounded caps for the arc ends
def arc_point(deg):
    a = math.radians(deg)
    return (cx + r * math.cos(a), cy + r * math.sin(a))

for deg in (37, 323):
    x, y = arc_point(deg)
    d.ellipse([x - w / 2, y - w / 2, x + w / 2, y + w / 2], fill=CORAL + (255,))

# Horizontal bar of the G: from center outward to the right, lighter coral
bar_h = w
bar_y0 = cy - bar_h // 2
bar_x0 = cx - int(w * 0.10)
bar_x1 = cx + r + w // 2
d.rounded_rectangle([bar_x0, bar_y0, bar_x1, bar_y0 + bar_h], radius=bar_h // 2, fill=CORAL_L + (255,))

img = img.resize((OUT, OUT), Image.LANCZOS)
img.save(r"frontend/public/logo.png")
img.resize((64, 64), Image.LANCZOS).save(r"frontend/public/favicon.png")
img.resize((180, 180), Image.LANCZOS).save(r"frontend/public/apple-touch-icon.png")
print("logo.png, favicon.png, apple-touch-icon.png written")
