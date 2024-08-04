from . import views
from django.urls import path, include
from rest_framework import routers

router = routers.DefaultRouter()
# RUTAS DEL API REST DE EMPLEADO
router.register( r'TipoMeta', views.TipoMetaView, 'TipoMeta')
router.register( r'TipoAhorro', views.TipoAhorroView, 'TipoAhorro')
router.register( r'TipoMovimiento', views.TipoMovimientoView, 'TipoMovimiento')
router.register( r'OrigenMovimiento', views.OrigenMovimientoView, 'OrigenMovimiento')

# EL RESTO DE RUTAS
urlpatterns = [
    path('', include(router.urls)),
    path('api/cuenta', views.CuentasApiView.as_view(), name='api.cuentas'),
]