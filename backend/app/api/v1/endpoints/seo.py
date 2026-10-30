from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status, Request, Response
from fastapi.responses import HTMLResponse, RedirectResponse
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.project import Project
from app.models.setting import SiteSetting

router = APIRouter()

CRAWLER_USER_AGENTS = [
    "linkedinbot",
    "twitterbot",
    "facebookexternalhit",
    "whatsapp",
    "slackbot",
    "telegrambot",
    "pinterest",
    "discordbot",
    "googlebot",
    "bingbot"
]


@router.get("/sitemap.xml")
def get_dynamic_sitemap(request: Request, db: Session = Depends(get_db)):
    """
    Generates a dynamic XML sitemap containing the homepage and all published projects.
    """
    base_url = str(request.base_url).rstrip("/")
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")

    projects = (
        db.query(Project.slug, Project.updated_at)
        .filter(Project.is_published == True)
        .all()
    )

    xml_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        '  <url>',
        f'    <loc>{base_url}/</loc>',
        f'    <lastmod>{now_str}</lastmod>',
        '    <changefreq>weekly</changefreq>',
        '    <priority>1.0</priority>',
        '  </url>'
    ]

    for p in projects:
        p_mod = p.updated_at.strftime("%Y-%m-%d") if p.updated_at else now_str
        xml_lines.extend([
            '  <url>',
            f'    <loc>{base_url}/projects/{p.slug}</loc>',
            f'    <lastmod>{p_mod}</lastmod>',
            '    <changefreq>monthly</changefreq>',
            '    <priority>0.8</priority>',
            '  </url>'
        ])

    xml_lines.append('</urlset>')
    return Response(content="\n".join(xml_lines), media_type="application/xml")


@router.get("/share/projects/{slug}", response_class=HTMLResponse)
def get_project_social_meta(slug: str, request: Request, db: Session = Depends(get_db)):
    """
    Prerendered meta tags for social crawlers (LinkedIn, Twitter, Facebook, WhatsApp).
    Since LinkedIn's crawler does not execute client-side JavaScript, this route delivers
    clean static Open Graph tags. Normal browser visitors are immediately redirected to the frontend view.
    """
    project = db.query(Project).filter(Project.slug == slug, Project.is_published == True).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    settings = db.query(SiteSetting).first()
    site_title = settings.site_title if settings else "Wiame El Hernoussi – Data & AI Engineer"

    base_url = str(request.base_url).rstrip("/")
    target_url = f"{base_url}/projects/{slug}"
    image_url = project.cover_image or (f"{base_url}/og-preview.png")
    if image_url.startswith("/"):
        image_url = f"{base_url}{image_url}"

    user_agent = request.headers.get("User-Agent", "").lower()
    is_crawler = any(bot in user_agent for bot in CRAWLER_USER_AGENTS)

    # For crawlers: render complete OG and Twitter metadata
    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>{project.title} | {site_title}</title>
  <meta name="description" content="{project.short_description}">
  
  <!-- Open Graph -->
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="{site_title}">
  <meta property="og:title" content="{project.title}">
  <meta property="og:description" content="{project.short_description}">
  <meta property="og:url" content="{target_url}">
  <meta property="og:image" content="{image_url}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{project.title}">
  <meta name="twitter:description" content="{project.short_description}">
  <meta name="twitter:image" content="{image_url}">

  {'<meta http-equiv="refresh" content="0; url=' + target_url + '">' if not is_crawler else ''}
</head>
<body>
  <h1>{project.title}</h1>
  <p>{project.short_description}</p>
  <a href="{target_url}">View Project Details</a>
</body>
</html>"""

    return HTMLResponse(content=html_content)
