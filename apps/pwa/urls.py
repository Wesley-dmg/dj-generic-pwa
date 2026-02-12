from django.urls import path

from . import views

app_name = "pwa"

urlpatterns = [
    path("offline/", views.OfflineView.as_view(), name="offline"),
    path("manifest.json", views.ManifestView.as_view(), name="manifest"),
    path("sw.js", views.ServiceWorkerView.as_view(), name="service_worker"),
]
