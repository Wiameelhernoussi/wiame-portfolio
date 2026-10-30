import pytest
from app.core.config import settings


def test_login_success_and_cookie(client):
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": settings.FIRST_SUPERUSER_EMAIL,
            "password": settings.FIRST_SUPERUSER_PASSWORD
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert "refresh_token" in response.cookies


def test_login_invalid_credentials(client):
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": settings.FIRST_SUPERUSER_EMAIL,
            "password": "WrongPassword!"
        }
    )
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]


def test_auth_me_protected(client):
    # Without token
    unauth_resp = client.get("/api/v1/auth/me")
    assert unauth_resp.status_code == 401

    # With valid token
    login_resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": settings.FIRST_SUPERUSER_EMAIL,
            "password": settings.FIRST_SUPERUSER_PASSWORD
        }
    )
    token = login_resp.json()["access_token"]
    auth_resp = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert auth_resp.status_code == 200
    assert auth_resp.json()["email"] == settings.FIRST_SUPERUSER_EMAIL


def test_refresh_token_flow(client):
    login_resp = client.post(
        "/api/v1/auth/login",
        json={
            "email": settings.FIRST_SUPERUSER_EMAIL,
            "password": settings.FIRST_SUPERUSER_PASSWORD
        }
    )
    refresh_token = login_resp.cookies.get("refresh_token")
    assert refresh_token is not None

    # Call refresh endpoint with cookie
    refresh_resp = client.post("/api/v1/auth/refresh", cookies={"refresh_token": refresh_token})
    assert refresh_resp.status_code == 200
    new_data = refresh_resp.json()
    assert "access_token" in new_data
    assert "refresh_token" in refresh_resp.cookies


def test_logout(client):
    response = client.post("/api/v1/auth/logout")
    assert response.status_code == 200
    # Cookie should be deleted/expired
    cookie_val = response.cookies.get("refresh_token")
    assert cookie_val is None or cookie_val == '""'
