import json

from django import template
from django.conf import settings
from django.templatetags.static import static

register = template.Library()


@register.inclusion_tag("pwa/meta.html", takes_context=True)
def pwa_meta(context):
    pwa_config = getattr(settings, "PWA_CONFIG", {})
    return {
        "pwa_config": pwa_config,
        "request": context.get("request"),
    }


@register.inclusion_tag("pwa/register_sw.html", takes_context=True)
def pwa_scripts(context):
    return {
        "request": context.get("request"),
    }


@register.simple_tag
def pwa_config_json():
    config = getattr(settings, "PWA_CONFIG", {})
    return json.dumps(config)
