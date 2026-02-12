# Ajouter 'pwa' aux INSTALLED_APPS
INSTALLED_APPS = [
    # ...
    "pwa",
    # ...
]


# Configuration PWA
PWA_CONFIG = {
    "name": "OPORTUNA ULINKA",
    "short_name": "Ulinka",
    "description": "Plateforme académique et professionnelle",
    "start_url": "/",
    "scope": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#3f4d67",
    "orientation": "portrait",
    "lang": "fr-FR",
}

PWA_CACHE_NAME = "ulinka-cache-v1"
PWA_VERSION = "1.0.0"
