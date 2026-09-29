"""Generate 3D product-box images (front + top + right faces, soft shadow).
GMC-safe: only product information - brand, name, features, license type.
No price, CTAs, seller branding or delivery claims."""
import re
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "backend", "server.py")
OUT_DIR = os.path.join(ROOT, "frontend", "public", "images", "products")
W, H = 800, 800

FONTS = {
    "display": ["C:/Windows/Fonts/bahnschrift.ttf", "C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/arialbd.ttf"],
    "body":    ["C:/Windows/Fonts/segoeui.ttf", "C:/Windows/Fonts/arial.ttf"],
}
_cache = {}

def font(kind, size):
    key = (kind, size)
    if key not in _cache:
        for path in FONTS[kind]:
            if os.path.exists(path):
                _cache[key] = ImageFont.truetype(path, size)
                break
        else:
            _cache[key] = ImageFont.load_default()
    return _cache[key]


ACCENTS = {
    "Norton":  {"hi": "#C99214", "mid": "#A16207", "lo": "#7C4A03", "soft": "#F5ECD4"},
    "Webroot": {"hi": "#0E9163", "mid": "#047857", "lo": "#065F46", "soft": "#D2EBDD"},
    "McAfee":  {"hi": "#B01A45", "mid": "#9F1239", "lo": "#7A0E2C", "soft": "#F5E0E6"},
}


def load_products():
    text = open(SRC, encoding="utf-8").read()
    start = text.index("PRODUCTS = [")
    end = text.index("\n]", start)
    section = text[start:end]
    products = []
    for block in re.split(r"\n\s*\{", section):
        def m(p):
            r = re.search(p, block)
            return r.group(1) if r else None
        slug = m(r"'slug': '([^']+)'")
        name = m(r"'name': '([^']+)'")
        brand = m(r"'brand': '([^']+)'")
        tagline = m(r"'tagline': '([^']*)'")
        feats_raw = m(r"'features': \[([^\]]*)\]")
        feats = re.findall(r"'([^']*)'", feats_raw) if feats_raw else []
        if slug and name:
            products.append({"slug": slug, "name": name, "brand": brand,
                             "tagline": tagline or "", "features": feats})
    return products


def hex2rgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def shade(h, f):
    """Darken (f<1) or lighten (f>1) a hex color."""
    r, g, b = hex2rgb(h)
    if f >= 1:
        return tuple(int(c + (255 - c) * (f - 1)) for c in (r, g, b))
    return tuple(int(c * f) for c in (r, g, b))


def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=fnt) <= max_w:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def vgrad(size, top, bottom):
    w, h = size
    base = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / max(h - 1, 1)
        base.putpixel((0, y), tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    return base.resize((w, h))


def hgrad(size, left, right):
    w, h = size
    base = Image.new("RGB", (w, 1))
    for x in range(w):
        t = x / max(w - 1, 1)
        base.putpixel((x, 0), tuple(int(left[i] + (right[i] - left[i]) * t) for i in range(3)))
    return base.resize((w, h))


def draw_check(draw, cx, cy, r, color):
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)
    p = r * 0.55
    wd = max(2, int(r * 0.28))
    draw.line([(cx - p * 0.7, cy), (cx - p * 0.15, cy + p * 0.55)], fill="#FFFFFF", width=wd)
    draw.line([(cx - p * 0.15, cy + p * 0.55), (cx + p * 0.8, cy - p * 0.6)], fill="#FFFFFF", width=wd)


def front_face(p, a, fw, fh):
    """The front of the box as an RGBA image."""
    face = Image.new("RGBA", (fw, fh), (0, 0, 0, 0))
    d = ImageDraw.Draw(face)
    d.rounded_rectangle([0, 0, fw - 1, fh - 1], radius=22, fill="#FFFFFF", outline="#E2E4E8", width=2)

    # glossy gradient header
    band_h = int(fh * 0.30)
    band = vgrad((fw, band_h), hex2rgb(a["hi"]), hex2rgb(a["lo"]))
    sheen = Image.new("L", (fw, band_h), 0)
    ImageDraw.Draw(sheen).polygon([(0, 0), (int(fw * 0.72), 0), (int(fw * 0.30), band_h), (0, band_h)], fill=48)
    band = Image.composite(Image.new("RGB", (fw, band_h), "#FFFFFF"), band, sheen)
    mask = Image.new("L", (fw, band_h), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([0, 0, fw, band_h + 40], radius=22, fill=255)
    md.rectangle([0, band_h - 30, fw, band_h], fill=255)
    face.paste(band, (0, 0), mask)
    d = ImageDraw.Draw(face)
    d.line([(14, 3), (fw - 14, 3)], fill=(255, 255, 255), width=3)

    f_brand = font("display", 52)
    bname = (p["brand"] or "").upper()
    tw = d.textlength(bname, font=f_brand)
    d.text(((fw - tw) / 2, band_h / 2 - 46), bname, font=f_brand, fill="#FFFFFF")
    f_sub = font("body", 19)
    sub = "S E C U R I T Y   S O F T W A R E"
    tw = d.textlength(sub, font=f_sub)
    d.text(((fw - tw) / 2, band_h / 2 + 12), sub, font=f_sub, fill=(255, 255, 255))

    d.line([(0, band_h), (fw, band_h)], fill=hex2rgb(a["mid"]), width=4)

    # product name
    f_name = font("display", 38)
    y = band_h + 34
    for line in wrap(d, p["name"], f_name, fw - 48)[:3]:
        tw = d.textlength(line, font=f_name)
        d.text(((fw - tw) / 2, y), line, font=f_name, fill="#101826")
        y += 46

    # tagline
    f_tag = font("body", 18)
    y += 8
    for line in wrap(d, p["tagline"], f_tag, fw - 64)[:3]:
        tw = d.textlength(line, font=f_tag)
        d.text(((fw - tw) / 2, y), line, font=f_tag, fill="#5B6572")
        y += 25

    # features
    f_feat = font("body", 19)
    fy = min(y + 22, fh - 190)
    for feat in p["features"][:3]:
        lines = wrap(d, feat, f_feat, fw - 120)
        if fy + len(lines) * 25 > fh - 120:
            break
        draw_check(d, 40, fy + 11, 10, hex2rgb(a["mid"]))
        for ln in lines:
            d.text((62, fy), ln, font=f_feat, fill="#374151")
            fy += 25
        fy += 5

    # bottom strip
    strip_h = 46
    strip = vgrad((fw, strip_h), hex2rgb(a["soft"]), (255, 255, 255))
    smask = Image.new("L", (fw, strip_h), 0)
    smd = ImageDraw.Draw(smask)
    smd.rounded_rectangle([0, -40, fw, strip_h], radius=22, fill=255)
    face.paste(strip, (0, fh - strip_h), smask)
    d = ImageDraw.Draw(face)
    d.line([(0, fh - strip_h), (fw, fh - strip_h)], fill=hex2rgb(a["mid"]), width=2)
    f_strip = font("display", 19)
    strip_txt = "D I G I T A L   L I C E N S E"
    tw = d.textlength(strip_txt, font=f_strip)
    d.text(((fw - tw) / 2, fh - strip_h + 13), strip_txt, font=f_strip, fill=hex2rgb(a["lo"]))

    # faint diagonal gloss over whole face
    gloss = Image.new("L", (fw, fh), 0)
    ImageDraw.Draw(gloss).polygon([(0, 0), (180, 0), (0, 270)], fill=18)
    cm = Image.new("L", (fw, fh), 0)
    ImageDraw.Draw(cm).rounded_rectangle([0, 0, fw - 1, fh - 1], radius=22, fill=255)
    gloss = ImageChops.multiply(gloss, cm)
    face = Image.composite(Image.new("RGBA", (fw, fh), (255, 255, 255, 255)), face, gloss)
    return face


def make_image(p):
    a = ACCENTS.get(p["brand"], ACCENTS["Norton"])
    img = Image.new("RGB", (W, H), "#F6F7F9")
    d = ImageDraw.Draw(img)

    # ---- 3D box geometry: bigger, less canvas padding ----
    fw, fh = 520, 640          # front face size
    depth_x, depth_y = 60, -46 # how far the right/top faces extend
    bx = (W - fw - depth_x) // 2
    by = (H - fh - depth_y) // 2 + 20
    x0, y0, x1, y1 = bx, by, bx + fw, by + fh

    # ground shadow (soft ellipse behind/below the box)
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.ellipse([x0 - 20, y1 - 30, x1 + depth_x + 40, y1 + 60], fill=(16, 24, 38, 80))
    img = Image.alpha_composite(img.convert("RGBA"), shadow.filter(ImageFilter.GaussianBlur(16))).convert("RGB")
    d = ImageDraw.Draw(img)

    # right face (darkened accent, slight vertical shading)
    side = hgrad((depth_x + 8, fh), shade(a["lo"], 1.0), shade(a["lo"], 0.75))
    side_mask = Image.new("L", (depth_x + 8, fh), 0)
    ImageDraw.Draw(side_mask).polygon([(0, 0), (depth_x, depth_y), (depth_x, fh + depth_y), (0, fh)], fill=255)
    img.paste(side, (x1, y0), side_mask)

    # top face (lightened accent)
    top = vgrad((fw + depth_x + 8, abs(depth_y) + 8), shade(a["hi"], 1.25), shade(a["hi"], 1.05))
    top_mask = Image.new("L", (fw + depth_x + 8, abs(depth_y) + 8), 0)
    ImageDraw.Draw(top_mask).polygon([(0, -depth_y), (depth_x, 0), (fw + depth_x, 0), (fw, -depth_y)], fill=255)
    img.paste(top, (x0, y0 + depth_y), top_mask)

    # thin bright edge along the top-right ridge
    d = ImageDraw.Draw(img)
    d.line([(x1, y0), (x1 + depth_x, y0 + depth_y)], fill=shade(a["hi"], 1.3), width=3)

    # front face with packaging design
    face = front_face(p, a, fw, fh)
    img.paste(face, (x0, y0), face)

    return img


def main():
    products = load_products()
    os.makedirs(OUT_DIR, exist_ok=True)
    for p in products:
        img = make_image(p)
        img.save(os.path.join(OUT_DIR, f"{p['slug']}.png"), "PNG", optimize=True)
    print(f"generated {len(products)} images")


if __name__ == "__main__":
    main()
