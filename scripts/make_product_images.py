"""Generate GMC-compliant product images: clean packaging-style cards.
No prices, CTAs, delivery claims or seller branding — just brand + product
name on a glossy box, white background."""
import re
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "backend", "server.py")
OUT_DIR = os.path.join(ROOT, "frontend", "public", "images", "products")
W, H = 800, 800

FONT_BOLD = "C:/Windows/Fonts/arialbd.ttf"
FONT_REG = "C:/Windows/Fonts/arial.ttf"

ACCENTS = {
    "Norton":  {"hi": "#C99214", "mid": "#A16207", "lo": "#7C4A03"},
    "Webroot": {"hi": "#0E9163", "mid": "#047857", "lo": "#065F46"},
    "McAfee":  {"hi": "#B01A45", "mid": "#9F1239", "lo": "#7A0E2C"},
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
        if slug and name:
            products.append({"slug": slug, "name": name, "brand": brand})
    return products


def hex2rgb(h):
    return tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))


def wrap(draw, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if draw.textlength(t, font=font) <= max_w:
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
    top, bottom = hex2rgb(top), hex2rgb(bottom)
    base = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / max(h - 1, 1)
        base.putpixel((0, y), tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    return base.resize((w, h))


def make_image(p):
    a = ACCENTS.get(p["brand"], ACCENTS["Norton"])
    img = Image.new("RGB", (W, H), "#FFFFFF")

    # ---- product box: portrait card centered on white canvas ----
    bx, by, bw, bh = 140, 90, 520, 620

    # drop shadow
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        [bx + 10, by + 18, bx + bw + 10, by + bh + 18], radius=30, fill=(16, 24, 38, 70))
    shadow = shadow.filter(ImageFilter.GaussianBlur(18))
    img = Image.alpha_composite(img.convert("RGBA"), shadow).convert("RGB")
    d = ImageDraw.Draw(img)

    # white card body
    d.rounded_rectangle([bx, by, bx + bw, by + bh], radius=30, fill="#FBFBFC", outline="#E5E7EB", width=2)

    # glossy gradient header (top ~40% of box)
    band_h = int(bh * 0.42)
    band = vgrad((bw, band_h), a["hi"], a["lo"])
    # diagonal sheen
    sheen = Image.new("L", (bw, band_h), 0)
    sd = ImageDraw.Draw(sheen)
    sd.polygon([(0, 0), (bw * 0.75, 0), (bw * 0.35, band_h), (0, band_h)], fill=42)
    band = Image.composite(Image.new("RGB", (bw, band_h), "#FFFFFF"), band, sheen)
    # clip to rounded top corners
    mask = Image.new("L", (bw, band_h), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([0, 0, bw, band_h + 50], radius=30, fill=255)
    md.rectangle([0, band_h - 40, bw, band_h], fill=255)
    img.paste(band, (bx, by), mask)
    d = ImageDraw.Draw(img)
    d.line([(bx + 16, by + 3), (bx + bw - 16, by + 3)], fill=(255, 255, 255), width=3)

    # brand name centered in header
    f_brand = ImageFont.truetype(FONT_BOLD, 56)
    bname = (p["brand"] or "").upper()
    tw = d.textlength(bname, font=f_brand)
    d.text((bx + (bw - tw) / 2, by + band_h / 2 - 40), bname, font=f_brand, fill="#FFFFFF")

    # thin divider accent under header
    d.line([(bx, by + band_h), (bx + bw, by + band_h)], fill=a["mid"], width=4)

    # product name (wrapped, centered) in lower white area
    f_name = ImageFont.truetype(FONT_BOLD, 46)
    lines = wrap(d, p["name"], f_name, bw - 60)
    block_h = len(lines) * 58
    y = by + band_h + (bh - band_h - block_h) / 2 - 10
    for line in lines:
        tw = d.textlength(line, font=f_name)
        d.text((bx + (bw - tw) / 2, y), line, font=f_name, fill="#101826")
        y += 58

    # subtle diagonal gloss across whole box
    gloss = Image.new("L", (W, H), 0)
    ImageDraw.Draw(gloss).polygon([(bx, by), (bx + 200, by), (bx, by + 300)], fill=20)
    cm = Image.new("L", (W, H), 0)
    ImageDraw.Draw(cm).rounded_rectangle([bx, by, bx + bw, by + bh], radius=30, fill=255)
    gloss = ImageChops.multiply(gloss, cm)
    img = Image.composite(Image.new("RGB", (W, H), "#FFFFFF"), img, gloss)

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
