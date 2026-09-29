"""Generate glossy product card images for all products, using the shifted
accent palette (same hue family as the brand, visibly different shade)."""
import re
import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "backend", "server.py")
OUT_DIR = os.path.join(ROOT, "frontend", "public", "images", "products")
W, H = 600, 800

FONT_BOLD = "C:/Windows/Fonts/arialbd.ttf"
FONT_REG = "C:/Windows/Fonts/arial.ttf"

ACCENTS = {
    # hue family kept, shades shifted away from official brand colors
    "Norton":  {"hi": "#C99214", "mid": "#A16207", "lo": "#7C4A03", "soft": "#F5ECD4", "border": "#E2CE8B"},
    "Webroot": {"hi": "#0E9163", "mid": "#047857", "lo": "#065F46", "soft": "#D2EBDD", "border": "#86C9A4"},
    "McAfee":  {"hi": "#B01A45", "mid": "#9F1239", "lo": "#7A0E2C", "soft": "#F5E0E6", "border": "#E3A3B5"},
}


def load_products():
    text = open(SRC, encoding="utf-8").read()
    start = text.index("PRODUCTS = [")
    end = text.index("\n]", start)
    section = text[start:end]
    products = []
    for block in re.split(r"\n\s*\{", section):
        m = lambda p: (re.search(p, block) or [None])[1] if re.search(p, block) else None
        slug = m(r"'slug': '([^']+)'")
        name = m(r"'name': '([^']+)'")
        price = m(r"'price': ([\d.]+)")
        tagline = m(r"'tagline': '([^']*)'")
        brand = m(r"'brand': '([^']+)'")
        if slug and name:
            products.append({"slug": slug, "name": name, "price": price, "tagline": tagline, "brand": brand})
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
    """Vertical gradient image."""
    w, h = size
    top, bottom = hex2rgb(top), hex2rgb(bottom)
    base = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / max(h - 1, 1)
        base.putpixel((0, y), tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    return base.resize((w, h))


def rounded_mask(size, radius):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size[0] - 1, size[1] - 1], radius=radius, fill=255)
    return m


def make_image(p):
    a = ACCENTS.get(p["brand"], ACCENTS["Norton"])
    img = Image.new("RGB", (W, H), "#F4F5F7")
    d = ImageDraw.Draw(img)

    # soft drop shadow + rounded card
    card = [40, 36, W - 40, H - 36]
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle([card[0] + 6, card[1] + 12, card[2] + 6, card[3] + 12], radius=26, fill=(16, 24, 38, 60))
    img.paste(Image.alpha_composite(Image.new("RGBA", (W, H)), shadow.filter(ImageFilter.GaussianBlur(14))).convert("RGB"), (0, 0), shadow.filter(ImageFilter.GaussianBlur(14)))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle(card, radius=26, fill="#FFFFFF", outline="#E5E7EB", width=2)

    # header band: vertical gradient + diagonal sheen
    band_h = 150
    band = vgrad((card[2] - card[0], band_h), a["hi"], a["lo"])
    sheen = Image.new("L", band.size, 0)
    sd = ImageDraw.Draw(sheen)
    sd.polygon([(0, 0), (band.size[0] * 0.72, 0), (band.size[0] * 0.38, band_h), (0, band_h)], fill=45)
    white = Image.new("RGB", band.size, (255, 255, 255))
    band = Image.composite(white, band, sheen)
    mask = Image.new("L", band.size, 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([0, 0, band.size[0], band.size[1] + 40], radius=26, fill=255)
    md.rectangle([0, band_h - 30, band.size[0], band_h], fill=255)
    img.paste(band, (card[0], card[1]), mask)
    d = ImageDraw.Draw(img)
    # top gloss line
    d.line([(card[0] + 14, card[1] + 2), (card[2] - 14, card[1] + 2)], fill=(255, 255, 255), width=2)

    # brand name in header
    f_brand = ImageFont.truetype(FONT_BOLD, 44)
    bname = (p["brand"] or "").upper()
    tw = d.textlength(bname, font=f_brand)
    d.text(((W - tw) / 2, card[1] + band_h / 2 - 30), bname, font=f_brand, fill="#FFFFFF")
    f_sub = ImageFont.truetype(FONT_REG, 20)
    sub = "G A R N A V O"
    tw = d.textlength(sub, font=f_sub)
    d.text(((W - tw) / 2, card[1] + band_h / 2 + 24), sub, font=f_sub, fill=(255, 255, 255))

    # product name (wrapped, centered)
    f_name = ImageFont.truetype(FONT_BOLD, 40)
    y = card[1] + band_h + 70
    for line in wrap(d, p["name"], f_name, card[2] - card[0] - 60):
        tw = d.textlength(line, font=f_name)
        d.text(((W - tw) / 2, y), line, font=f_name, fill="#101826")
        y += 50

    # tagline (wrapped)
    f_tag = ImageFont.truetype(FONT_REG, 21)
    y += 14
    for line in wrap(d, p["tagline"] or "", f_tag, card[2] - card[0] - 80)[:3]:
        tw = d.textlength(line, font=f_tag)
        d.text(((W - tw) / 2, y), line, font=f_tag, fill="#5B6572")
        y += 30

    # price pill: soft fill, accent border, accent price
    f_price = ImageFont.truetype(FONT_BOLD, 46)
    price_txt = f"${float(p['price']):.2f}" if p["price"] else ""
    pw = d.textlength(price_txt, font=f_price)
    pill_w, pill_h = int(pw + 120), 92
    px, py = (W - pill_w) / 2, card[3] - 200
    d.rounded_rectangle([px, py, px + pill_w, py + pill_h], radius=18, fill=a["soft"], outline=a["border"], width=3)
    # pill gloss line
    d.line([(px + 10, py + 3), (px + pill_w - 10, py + 3)], fill=(255, 255, 255), width=2)
    f_pill = ImageFont.truetype(FONT_REG, 19)
    cap = "G E T   I T   T O D A Y"
    cw = d.textlength(cap, font=f_pill)
    d.text(((W - cw) / 2, py + 14), cap, font=f_pill, fill=a["mid"])
    d.text((px + (pill_w - pw) / 2, py + 36), price_txt, font=f_price, fill=a["lo"])

    # footer line
    f_foot = ImageFont.truetype(FONT_REG, 21)
    foot = "Genuine License  \u00b7  Email Delivery in 5\u201315 min"
    fw = d.textlength(foot, font=f_foot)
    d.text(((W - fw) / 2, card[3] - 66), foot, font=f_foot, fill="#6B7280")

    # overall subtle diagonal gloss over the card
    gloss = Image.new("L", (W, H), 0)
    gd = ImageDraw.Draw(gloss)
    gd.polygon([(card[0], card[1]), (card[0] + 180, card[1]), (card[0], card[1] + 260)], fill=22)
    cardmask = rounded_mask((W, H), 0)
    cm = Image.new("L", (W, H), 0)
    ImageDraw.Draw(cm).rounded_rectangle(card, radius=26, fill=255)
    from PIL import ImageChops
    gloss = ImageChops.multiply(gloss, cm)
    img = Image.composite(Image.new("RGB", (W, H), "#FFFFFF"), img, gloss)

    return img


def main():
    products = load_products()
    os.makedirs(OUT_DIR, exist_ok=True)
    for p in products:
        img = make_image(p)
        path = os.path.join(OUT_DIR, f"{p['slug']}.png")
        img.save(path, "PNG", optimize=True)
    print(f"generated {len(products)} images")


if __name__ == "__main__":
    main()
