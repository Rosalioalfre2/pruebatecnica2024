import core_app.views as View
from django.urls import path, include
from django.contrib import admin
from rest_framework.documentation import include_docs_urls


urlpatterns = [
    path('',View.Homeview.as_view(),name='home'),
    path('admin/', admin.site.urls),
    path("docs/", include_docs_urls(title="Documentacion")),
    path('auth/', include('core_app.urls')),
    path('finanza/', include('finanzas.urls')),
]

