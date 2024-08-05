from core.models import CustomSetPagination
from core.helpers.alert import alerta
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions, DjangoObjectPermissions
from core.helpers.jwt import getPayloadJWT
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.http import JsonResponse

class OrigenMovimientoView(viewsets.ModelViewSet):
    from .models import OrigenMovimiento
    from .serializer import OrigenMovimientoSerializer
    permission_classes = (DjangoModelPermissions, IsAuthenticated)
    pagination_class = CustomSetPagination
    serializer_class = OrigenMovimientoSerializer 
    queryset = OrigenMovimiento.objects.all().order_by('id') 

    def get_queryset(self):
        isAdmin = getPayloadJWT(self.request, "is_admin")
        queryset = super().get_queryset()
        
        return queryset

class TipoMetaView(viewsets.ModelViewSet):
    from .models import TipoMeta
    from .serializer import TipoMetaSerializer
    permission_classes = (DjangoModelPermissions, IsAuthenticated)
    pagination_class = CustomSetPagination
    serializer_class = TipoMetaSerializer 
    queryset = TipoMeta.objects.all().order_by('id') 

    def get_queryset(self):
        isAdmin = getPayloadJWT(self.request, "is_admin")
        queryset = super().get_queryset()
        
        return queryset

class TipoAhorroView(viewsets.ModelViewSet):
    from .models import TipoAhorro
    from .serializer import TipoAhorroSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomSetPagination
    serializer_class = TipoAhorroSerializer 
    queryset = TipoAhorro.objects.all().order_by('id') 

    def get_queryset(self):
        isAdmin = getPayloadJWT(self.request, "is_admin")
        userId = getPayloadJWT(self.request, "user_id")
        option = self.request.GET.get('op')
        queryset = super().get_queryset()
        
        if isAdmin and option=='admin':
            queryset = queryset.filter(Q(usuario__isnull=True) & Q(deleted_at__isnull=True))
        elif option == 'select':
            queryset = queryset.filter(
                (Q(usuario__isnull=True) | Q(usuario=userId)) 
                & Q(deleted_at__isnull=True))
        else:
            queryset = queryset.filter(usuario=userId, deleted_at__isnull=True)
        
        return queryset
    
    def perform_create(self, serializer):
        self._save_serializer(serializer)
    
    def perform_update(self, serializer):
        self._save_serializer(serializer)
    
    def _save_serializer(self, serializer):
        isAdmin = getPayloadJWT(self.request,"is_admin")
        userId = getPayloadJWT(self.request,"user_id")
        option = self.request.data.get('op')

        if isAdmin and option == 'admin':
            serializer.save()
        else:
            serializer.save(usuario_id=userId)
    
    def get_object(self):
        from .models import TipoAhorro
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        assert lookup_url_kwarg in self.kwargs, (
            'Expected view %s to be called with a URL keyword argument named "%s". '
            'Fix your URL conf, or set the `.lookup_field` attribute on the view correctly.' %
            (self.__class__.__name__, lookup_url_kwarg)
        )
        filter_kwargs = {self.lookup_field: self.kwargs[lookup_url_kwarg]}
        obj = get_object_or_404(TipoAhorro, **filter_kwargs)
        self.check_object_permissions(self.request, obj)
        return obj
    
    def perform_destroy(self, instance):
        isAdmin = getPayloadJWT(self.request, "is_admin")
        userId = getPayloadJWT(self.request, "user_id")

        if isAdmin is None or userId is None:
            raise alerta(errors=["Error al obtener datos del JWT."])

        if isAdmin:
            instance.delete()
        else:
            if instance.usuario_id == userId:
                instance.delete()
            else:
                raise alerta(errors=["No tienes permiso para eliminar este objeto."])

class TipoMovimientoView(viewsets.ModelViewSet):
    from .models import TipoMovimiento
    from .serializer import TipoMovimientoSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomSetPagination
    serializer_class = TipoMovimientoSerializer 
    queryset = TipoMovimiento.objects.all().order_by('id') 

    def get_queryset(self):
        isAdmin = getPayloadJWT(self.request, "is_admin")
        userId = getPayloadJWT(self.request, "user_id")
        option = self.request.GET.get('op')
        origen = self.request.GET.get('origen')
        queryset = super().get_queryset()
        
        if isAdmin and option=='admin':
            queryset = queryset.filter(Q(usuario__isnull=True) & Q(deleted_at__isnull=True) & Q(origen=origen))
        elif option == 'select':
            queryset = queryset.filter(
                (Q(usuario__isnull=True) | Q(usuario=userId)) 
                & Q(deleted_at__isnull=True)
                & Q(origen=origen))
        else:
            queryset = queryset.filter(usuario=userId, deleted_at__isnull=True, origen=origen)
        
        return queryset
    
    def perform_create(self, serializer):
        self._save_serializer(serializer)
    
    def perform_update(self, serializer):
        self._save_serializer(serializer)
    
    def _save_serializer(self, serializer):
        isAdmin = getPayloadJWT(self.request,"is_admin")
        userId = getPayloadJWT(self.request,"user_id")
        option = self.request.data.get('op')

        if isAdmin and option == 'admin':
            serializer.save()
        else:
            serializer.save(usuario_id=userId)
    
    def get_object(self):
        from .models import TipoMovimiento
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        assert lookup_url_kwarg in self.kwargs, (
            'Expected view %s to be called with a URL keyword argument named "%s". '
            'Fix your URL conf, or set the `.lookup_field` attribute on the view correctly.' %
            (self.__class__.__name__, lookup_url_kwarg)
        )
        filter_kwargs = {self.lookup_field: self.kwargs[lookup_url_kwarg]}
        obj = get_object_or_404(TipoMovimiento, **filter_kwargs)
        self.check_object_permissions(self.request, obj)
        return obj
    
    def perform_destroy(self, instance):
        isAdmin = getPayloadJWT(self.request, "is_admin")
        userId = getPayloadJWT(self.request, "user_id")

        if isAdmin is None or userId is None:
            raise alerta(errors=["Error al obtener datos del JWT."])

        if isAdmin:
            instance.delete()
        else:
            if instance.usuario_id == userId:
                instance.delete()
            else:
                raise alerta(errors=["No tienes permiso para eliminar este objeto."])

class CuentasApiView(APIView):
    def post(self, request):
        from finanzas.services.ahorro import AhorroApi
        option = self.request.GET.get('op')
        user_id = getPayloadJWT(self.request, "user_id")
        
        cuenta = AhorroApi(user_id=user_id)

        if option == "listCuentas":
            return JsonResponse(cuenta.getCuentas(), safe=False)
        elif option == "addCuenta":
            return JsonResponse(cuenta.addCuenta(self.request.data, user_id), safe=False)
        elif option == "deleteCuenta":
            return JsonResponse(cuenta.deleteCuenta(self.request.data, user_id), safe=False)
        elif option == "getCuenta":
            return JsonResponse(cuenta.getCuenta(self.request.data), safe=False)
        else:
            alerta(errors=['Opcion no valida'])

class MovimientoApiView(APIView):
    def post(self, request):
        from finanzas.services.movimiento import MovimientoApi
        option = self.request.GET.get('op')
        user_id = getPayloadJWT(self.request, "user_id")
        cuenta_id = self.request.data.get('cuenta_id', None)
        
        cuenta = MovimientoApi( cuenta_id=cuenta_id, user_id=user_id)

        if option == "registerMovimiento":
            return JsonResponse(cuenta.registerMovimiento(data=self.request.data), safe=False)
        elif option == "listMovimientos":
            return JsonResponse(cuenta.listMovimientos(), safe=False)
        elif option == "listMovimientosPorSemana":
            return JsonResponse(cuenta.listMovimientosPorSemana(), safe=False)
        elif option == "listMovimientosPorMes":
            return JsonResponse(cuenta.listMovimientosPorMes(), safe=False)
        else:
            alerta(errors=['Opcion no valida'])