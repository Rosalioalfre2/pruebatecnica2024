from finanzas.models import Ahorro, TipoAhorro
from core.helpers.alert import alerta
from django.db.models import F
import finanzas.const as finanza

class AhorroApi():
    user_id = None
    
    def __init__(self, user_id):
        self.validateUser(user_id)
        self.user_id = user_id
    
    def validateUser(self, user_id):
        if user_id is None:
            alerta(errors=['Usuario no valido!!!'])
    
    def getCuentas(self):
        user_id = self.user_id
        cuentas = list(Ahorro.objects
                    .filter(
                        usuario_id=user_id,
                        deleted_at__isnull = True
                    )
                    .annotate(
                        tipo_ahorro_nombre = F('tipo_ahorro__nombre'),
                        tipo_meta = F('tipo_ahorro__tipo_meta__id'),
                        tipo_meta_nombre = F('tipo_ahorro__tipo_meta__nombre'),
                    )
                    .values(
                        'nombre',
                        'cantidad',
                        'cantidad_objetivo',
                        'fecha_objetivo',
                        'meta_alcanzada',
                        'tipo_ahorro_id',
                        'tipo_ahorro_nombre',
                        'tipo_meta',
                        'tipo_meta_nombre',
                    ))
        
        return cuentas
    
    def addCuenta(self, data, usuario_id):
        tipo_ahorro_id = data.get('tipo_ahorro_id', '')
        tipo_ahorro = TipoAhorro.objects.filter(id=tipo_ahorro_id).first()

        if not tipo_ahorro:
            alerta(errors=['Tipo de ahorro no encontrado'])

        cantidad_objetivo = data.get('cantidad_objetivo')
        fecha_objetivo = data.get('fecha_objetivo')
        cantidad = data.get('cantidad')
        nombre = data.get('nombre')  # Corregido aquí
        
        ahorro_id = data.get('id')

        if cantidad is None:
            alerta(errors=["Ingrese una cantidad válida"])

        if finanza.tm_cantidad == tipo_ahorro.tipo_meta and cantidad_objetivo is None:
            alerta(errors=["Ingrese una cantidad objetivo válida"])

        if finanza.tm_fecha == tipo_ahorro.tipo_meta and fecha_objetivo is None:
            alerta(errors=["Ingrese una fecha objetivo válida"])
        
        if tipo_ahorro.tipo_meta == finanza.tm_corriente:
            cantidad_objetivo = None
            fecha_objetivo = None
        elif tipo_ahorro.tipo_meta == finanza.tm_cantidad:
            fecha_objetivo = None
        elif tipo_ahorro.tipo_meta == finanza.tm_fecha:
            cantidad_objetivo = None
        
        if nombre is None:
            alerta(errors=['Ingrese un nombre válido'])

        if ahorro_id is None:
            ahorro = Ahorro(
                tipo_ahorro=tipo_ahorro,
                nombre=nombre,
                cantidad=cantidad,
                cantidad_objetivo=cantidad_objetivo,
                fecha_objetivo=fecha_objetivo,
                usuario_id=usuario_id
            )
        else:
            try:
                ahorro = Ahorro.objects.get(id=ahorro_id)
                ahorro.tipo_ahorro = tipo_ahorro
                ahorro.nombre = nombre
                ahorro.cantidad = cantidad
                ahorro.cantidad_objetivo = cantidad_objetivo
                ahorro.fecha_objetivo = fecha_objetivo
            except Ahorro.DoesNotExist:
                alerta(errors=['No se encontró la cuenta'])
        
        try:
            ahorro.save()
            return {'success': True, 'message': 'Se guardó correctamente'}
        except Exception as e:
            return {'success': False, 'message': f'Algo salió mal: {str(e)}'}
