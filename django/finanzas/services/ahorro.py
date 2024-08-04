from finanzas.models import Ahorro, TipoAhorro
from core.helpers.alert import alerta
from django.db.models import F
import finanzas.const as finanza
from datetime import date
from datetime import datetime

class AhorroApi():
    user_id = None
    hoy = date.today()
    
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
                        'id',
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

        fecha_objetivo = data.get('fecha_objetivo', None)
        nombre = data.get('nombre') 
        cantidad = data.get('cantidad', None)
        cantidad_objetivo = data.get('cantidad_objetivo', None)
        
        ahorro_id = data.get('id')
        
        if fecha_objetivo == '':
            fecha_objetivo = None
        if cantidad_objetivo == '':
            cantidad_objetivo = None
        if cantidad == '':
            cantidad = None

        if cantidad is None:
            alerta(errors=["Ingrese una cantidad válida"])

        if finanza.tm_cantidad == tipo_ahorro.tipo_meta and cantidad_objetivo is None:
            alerta(errors=["Ingrese una cantidad objetivo válida"])

        if finanza.tm_fecha == tipo_ahorro.tipo_meta and fecha_objetivo is None:
            alerta(errors=["Ingrese una fecha objetivo válida"])
        
        if tipo_ahorro.tipo_meta.id == finanza.tm_corriente:
            cantidad_objetivo = None
            fecha_objetivo = None
        elif tipo_ahorro.tipo_meta.id == finanza.tm_cantidad:
            fecha_objetivo = None
        elif tipo_ahorro.tipo_meta.id == finanza.tm_fecha:
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
                ahorro.meta_alcanzada = False
                
                if ahorro.cantidad_objetivo is not None and ahorro.cantidad_objetivo <= cantidad:
                    ahorro.meta_alcanzada = True
                if ahorro.fecha_objetivo is not None:
                    if isinstance(ahorro.fecha_objetivo, str):
                        ahorro.fecha_objetivo = datetime.strptime(ahorro.fecha_objetivo, '%Y-%m-%d').date()
                    if isinstance(self.hoy, str):
                        self.hoy = datetime.strptime(self.hoy, '%Y-%m-%d').date()
                        
                    if ahorro.fecha_objetivo <= self.hoy:
                        ahorro.meta_alcanzada = True
            except Ahorro.DoesNotExist:
                alerta(errors=['No se encontró la cuenta'])
        
        try:
            ahorro.save()
            return {'success': True, 'message': 'Se guardó correctamente'}
        except Exception as e:
            return {'success': False, 'message': f'Algo salió mal: {str(e)}'}
    
    def deleteCuenta(self, data, usuario_id):
        cuenta_id = data.get('id', None)

        if cuenta_id is None:
            alerta(errors=['No se proporcionó el ID de la cuenta'])

        try:
            # Obtén la cuenta utilizando el ID proporcionado
            cuenta = Ahorro.objects.get(id=cuenta_id)

            # Verifica si la cuenta pertenece al usuario especificado
            if cuenta.usuario.id != usuario_id:
                alerta(errors=['La cuenta no pertenece al usuario especificado'])
            if cuenta.cantidad != 0:
                alerta(errors=['La cuenta debe estar a $0 para poder eliminarla'])

            # Elimina la cuenta
            cuenta.delete()
            return {'success': True, 'message': 'Se eimino correctamente'}

        except Ahorro.DoesNotExist:
            alerta(errors=['No se encontró la cuenta'])