import pytest
from app.models.project import Project


def test_dynamic_sitemap_xml(client, db_session):
    proj = Project(
        title="Royal Mansour Virtual Concierge",
        slug="royal-mansour",
        category="AI",
        short_description="Concierge",
        long_description="Details",
        technologies=["Python"],
        start_date="2026",
        end_date="2026",
        is_published=True
    )
    db_session.add(proj)
    db_session.commit()

    resp = client.get("/sitemap.xml")
    assert resp.status_code == 200
    assert "application/xml" in resp.headers["content-type"]
    assert "<urlset" in resp.text
    assert "<loc>" in resp.text
    assert "/projects/royal-mansour</loc>" in resp.text


def test_crawler_meta_tags_endpoint(client, db_session):
    proj = Project(
        title="SmartPark AI Platform",
        slug="smartpark-ai",
        category="Computer Vision",
        short_description="YOLOv8 parking detection",
        long_description="Details",
        technologies=["YOLOv8"],
        start_date="2026",
        end_date="2026",
        is_published=True
    )
    db_session.add(proj)
    db_session.commit()

    # Request as LinkedIn crawler bot
    resp = client.get(
        "/share/projects/smartpark-ai",
        headers={"User-Agent": "LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)"}
    )
    assert resp.status_code == 200
    assert "text/html" in resp.headers["content-type"]
    assert '<meta property="og:title" content="SmartPark AI Platform">' in resp.text
    assert '<meta name="twitter:card" content="summary_large_image">' in resp.text
