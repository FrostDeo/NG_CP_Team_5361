import os
import django
from django.urls import reverse, resolve
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
django.setup()

print(f"ROOT_URLCONF: {settings.ROOT_URLCONF}")
print(f"BASE_DIR: {settings.BASE_DIR}")
print(f"INSTALLED_APPS: {settings.INSTALLED_APPS}")

try:
    print("Testing resolve('/') ...")
    match = resolve('/')
    print(f"Match: {match}")
    print(f"View Name: {match.view_name}")
except Exception as e:
    print(f"Error resolving '/': {e}")

try:
    print("Testing reverse('home:index') ...")
    url = reverse('home:index')
    print(f"URL: {url}")
except Exception as e:
    print(f"Error reversing 'home:index': {e}")
