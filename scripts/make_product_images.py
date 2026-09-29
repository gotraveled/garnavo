"""Generate product images styled like software retail boxes.
GMC-safe: only product information shown (brand, product name, feature
list, license type) - no price, CTAs, seller branding or delivery claims."""
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


def draw_check(draw, cx, cy, r, color):
    """Small filled circle with a check mark."""
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)
    p = r * 0.55
    draw.line([(cx - p * 0.7, cy), (cx - p * 0.15, cy + p * 0.55)], fill="#FFFFFF", width=max(2, int(r * 0.28)))
    draw.line([(cx - p * 0.15, cy + p * 0.55), (cx + p * 0.8, cy - p * 0.6)], fill="#FFFFFF", width=max(2, int(r * 0.28)))


def make_image(p):
    a = ACCENTS.get(p["brand"], ACCENTS["Norton"])
    img = Image.new("RGB", (W, H), "#FFFFFF")

    # ---- retail box ----
    bx, by, bw, bh = 130, 70, 540, 660

    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle(
        [bx + 10, by + 18, bx + bw + 10, by + bh + 18], radius=30, fill=(16, 24, 38, 70))
    img = Image.alpha_composite(img.convert("RGBA"), shadow.filter(ImageFilter.GaussianBlur(18))).convert("RGB")
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([bx, by, bx + bw, by + bh], radius=30, fill="#FFFFFF", outline="#E5E7EB", width=2)

    # header: glossy gradient band with brand name
    band_h = 190
    band = vgrad((bw, band_h), a["hi"], a["lo"])
    sheen = Image.new("L", (bw, band_h), 0)
    ImageDraw.Draw(sheen).polygon(
        [(0, 0), (int(bw * 0.72), 0), (int(bw * 0.32), band_h), (0, band_h)], fill=45)
    band = Image.composite(Image.new("RGB", (bw, band_h), "#FFFFFF"), band, sheen)
    mask = Image.new("L", (bw, band_h), 0)
    md = ImageDraw.Draw(mask)
    md.rounded_rectangle([0, 0, bw, band_h + 50], radius=30, fill=255)
    md.rectangle([0, band_h - 40, bw, band_h], fill=255)
    img.paste(band, (bx, by), mask)
    d = ImageDraw.Draw(img)
    d.line([(bx + 16, by + 3), (bx + bw - 16, by + 3)], fill=(255, 255, 255), width=3)

    f_brand = ImageFont.truetype(FONT_BOLD, 52)
    bname = (p["brand"] or "").upper()
    tw = d.textlength(bname, font=f_brand)
    d.text((bx + (bw - tw) / 2, by + band_h / 2 - 44), bname, font=f_brand, fill="#FFFFFF")
    f_sub = ImageFont.truetype(FONT_REG, 20)
    sub = "S E C U R I T Y   S O F T W A R E"
    tw = d.textlength(sub, font=f_sub)
    d.text((bx + (bw - tw) / 2, by + band_h / 2 + 14), sub, font=f_sub, fill=(255, 255, 255))

    # accent divider
    d.line([(bx, by + band_h), (bx + bw, by + band_h)], fill=a["mid"], width=4)

    # product name
    f_name = ImageFont.truetype(FONT_BOLD, 40)
    y = by + band_h + 38
    for line in wrap(d, p["name"], f_name, bw - 56)[:3]:
        tw = d.textlength(line, font=f_name)
        d.text((bx + (bw - tw) / 2, y), line, font=f_name, fill="#101826")
        y += 48

    # tagline
    f_tag = ImageFont.truetype(FONT_REG, 19)
    y += 10
    for line in wrap(d, p["tagline"], f_tag, bw - 80)[:3]:
        tw = d.textlength(line, font=f_tag)
        d.text((bx + (bw - tw) / 2, y), line, font=f_tag, fill="#5B6572")
        y += 27

    # feature list with check marks (product info = packaging copy)
    f_feat = ImageFont.truetype(FONT_REG, 20)
    feats = p["features"][:3]
    fy = min(y + 26, by + bh - 210)
    for feat in feats:
        lines = wrap(d, feat, f_feat, bw - 130)
        if fy + len(lines) * 27 > by + bh - 130:
            break
        draw_check(d, bx + 46, fy + 12, 11, a["mid"])
        for ln in lines:
            d.text((bx + 70, fy), ln, font=f_feat, fill="#374151")
            fy += 27
        fy += 6

    # bottom strip: license-type info band (packaging info, not promo)
    strip_h = 52
    strip = vgrad((bw, strip_h), a["soft"], "#FFFFFF")
    smask = Image.new("L", (bw, strip_h), 0)
    smd = ImageDraw.Draw(smask)
    smd.rounded_rectangle([0, -50, bw, strip_h], radius=30, fill=255)
    img.paste(strip, (bx, by + bh - strip_h), smask)
    d = ImageDraw.Draw(img)
    d.line([(bx, by + bh - strip_h), (bx + bw, by + bh - strip_h)], fill=a["mid"], width=2)
    f_strip = ImageFont.truetype(FONT_BOLD, 20)
    strip_txt = "D I G I T A L   L I C E N S E"
    tw = d.textlength(strip_txt, font=f_strip)
    d.text((bx + (bw - tw) / 2, by + bh - strip_h + 15), strip_txt, font=f_strip, fill=a["lo"])

    # subtle diagonal gloss over the whole box
    gloss = Image.new("L", (W, H), 0)
    ImageDraw.Draw(gloss).polygon([(bx, by), (bx + 200, by), (bx, by + 300)], fill=18)
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
