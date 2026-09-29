"""Generate a static Google Merchant Center feed at
frontend/public/google-merchant-feed.xml so it is served from
https://garnavo.com/google-merchant-feed.xml (mirrors the backend feed)."""
import ast
import os
import re
from xml.etree.ElementTree import Element, SubElement, tostring

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "backend", "server.py")
OUT = os.path.join(ROOT, "frontend", "public", "google-merchant-feed.xml")

STORE_NAME = "Garnavo"
STORE_URL = "https://garnavo.com"


def load_products():
    text = open(SRC, encoding="utf-8").read()
    start = text.index("PRODUCTS = [")
    i = text.index("[", start)
    end = text.index("\nDEFAULT_COUPONS", i)
    block = text[i:end].strip()
    block = "\n".join(l for l in block.splitlines() if not l.strip().startswith("#"))
    return ast.literal_eval(block)


def build_feed(products):
    rss = Element("rss", {"version": "2.0", "xmlns:g": "http://base.google.com/ns/1.0"})
    channel = SubElement(rss, "channel")
    SubElement(channel, "title").text = STORE_NAME
    SubElement(channel, "link").text = STORE_URL
    SubElement(channel, "description").text = (
        f"Genuine antivirus and security software licenses with fast email delivery from {STORE_NAME}.")

    count = 0
    for product in products:
        if not product.get("variants") or not product.get("is_active", True):
            continue
        brand = product.get("brand") or "Norton"
        category = product.get("category") or "Antivirus"
        desc = (product.get("long_description") or product.get("description")
                or product.get("tagline") or "").replace("\n", " ").strip()[:5000]
        link = f"{STORE_URL}/product/{product['slug']}"
        img = f"{STORE_URL}/images/products/{product['slug']}.png"

        for variant in product["variants"]:
            price = float(variant.get("price") or 0)
            original = variant.get("original_price")
            try:
                original = float(original) if original else None
            except (TypeError, ValueError):
                original = None
            vslug = re.sub(r"[^a-z0-9]+", "-", variant["label"].lower()).strip("-")

            item = SubElement(channel, "item")
            SubElement(item, "g:id").text = f"{product['slug']}-{vslug}"
            SubElement(item, "g:item_group_id").text = product["slug"]
            SubElement(item, "g:title").text = f"{product['name']} - {variant['label']}"
            SubElement(item, "g:description").text = desc
            SubElement(item, "g:link").text = link
            SubElement(item, "g:image_link").text = img
            SubElement(item, "g:condition").text = "new"
            SubElement(item, "g:availability").text = "in stock"
            SubElement(item, "g:brand").text = brand
            SubElement(item, "g:google_product_category").text = (
                "Software > Computer Software > Antivirus & Security Software")
            SubElement(item, "g:product_type").text = f"Software > Antivirus & Security > {category}"
            SubElement(item, "g:mpn").text = f"{product['slug']}-{variant['label']}".replace(" ", "-")[:70]
            SubElement(item, "g:identifier_exists").text = "no"
            if original and original > price:
                SubElement(item, "g:price").text = f"{original:.2f} USD"
                SubElement(item, "g:sale_price").text = f"{price:.2f} USD"
            else:
                SubElement(item, "g:price").text = f"{price:.2f} USD"
            count += 1

    return count, '<?xml version="1.0" encoding="UTF-8"?>' + tostring(rss, encoding="unicode")


def main():
    products = load_products()
    count, xml = build_feed(products)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(xml)
    print(f"wrote {OUT} ({count} variant items)")


if __name__ == "__main__":
    main()
