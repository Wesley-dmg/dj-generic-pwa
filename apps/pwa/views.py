import json

# from django.http import JsonResponse, HttpResponse
from django.conf import settings
from django.shortcuts import render
from django.views.generic import TemplateView


class OfflineView(TemplateView):
    template_name = "pwa/offline.html"


class ManifestView(TemplateView):
    template_name = "pwa/manifest.json"
    content_type = "application/manifest+json"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        pwa_config = getattr(settings, "PWA_CONFIG", {})

        # Configuration par défaut
        default_config = {
            "name": "Django PWA",
            "short_name": "PWA",
            "description": "Progressive Web Application",
            "start_url": "/",
            "scope": "/",
            "display": "standalone",
            "background_color": "#ffffff",
            "theme_color": "#3f4d67",
            "orientation": "portrait",
            "lang": "fr-FR",
            "dir": "ltr",
        }

        # Fusionner avec la config du projet
        default_config.update(pwa_config)
        context.update(default_config)
        return context


class ServiceWorkerView(TemplateView):
    template_name = "pwa/sw.js"
    content_type = "application/javascript"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["CACHE_NAME"] = getattr(
            settings, "PWA_CACHE_NAME", "django-pwa-cache-v1"
        )
        context["VERSION"] = getattr(settings, "PWA_VERSION", "1.0.0")
        return context
