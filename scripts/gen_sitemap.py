import re
from datetime import date

src = open("backend/server.py", encoding="utf-8").read()
slugs = re.findall(r"'slug': '([^']+)'", src)
today = date.today().isoformat()

STATIC = [
    ("/", "daily", "1.0"),
    ("/products", "daily", "0.9"),
    ("/category/norton", "weekly", "0.8"),
    ("/category/webroot", "weekly", "0.8"),
    ("/category/mcafee", "weekly", "0.8"),
    ("/activation", "monthly", "0.8"),
    ("/activation/norton", "monthly", "0.8"),
    ("/activation/webroot", "monthly", "0.8"),
    ("/activation/mcafee", "monthly", "0.8"),
    ("/faq", "weekly", "0.7"),
    ("/contact", "monthly", "0.7"),
    ("/about", "monthly", "0.6"),
    ("/digital-delivery", "monthly", "0.6"),
    ("/track", "monthly", "0.5"),
    ("/terms", "yearly", "0.3"),
    ("/privacy-policy", "yearly", "0.3"),
    ("/refund-policy", "yearly", "0.3"),
    ("/disclaimer", "yearly", "0.2"),
]

urls = list(STATIC) + [(f"/product/{s}", "weekly", "0.8") for s in slugs]

xml = ['<?xml version="1.0" encoding="UTF-8"?>',
       '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for loc, freq, prio in urls:
    xml.append(f"""  <url>
    <loc>https://garnavo.com{loc}</loc>
    <lastmod>{today}</lastmod>
    <changefreq>{freq}</changefreq>
    <priority>{prio}</priority>
  </url>""")
xml.append("</urlset>")

open("frontend/public/sitemap.xml", "w", encoding="utf-8").write("\n".join(xml) + "\n")
print(f"{len(urls)} URLs ({len(slugs)} products), lastmod={today}")
