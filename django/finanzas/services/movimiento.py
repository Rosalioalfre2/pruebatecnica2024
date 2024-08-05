from django.db import transaction, IntegrityError
from django.db.models import F, Sum, Value, DateField, ExpressionWrapper
from django.db.models.functions import TruncWeek, TruncMonth
from finanzas.models import Ahorro, TipoMovimiento, Movimiento
from core.helpers.alert import alerta
import finanzas.const as finanza
import decimal
from datetime import date
from datetime import datetime, timedelta
from calendar import monthrange
import csv
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML

class MovimientoApi:
    
    cuenta_id = None
    user_id = None
    cuenta = None
    hoy = date.today()
    
    def __init__(self, cuenta_id, user_id):
        self.cuenta_id = cuenta_id
        self.user_id = user_id
        self.getCuenta()
    
    def getCuenta(self):
        cuenta = Ahorro.objects.filter(id=self.cuenta_id)

        if len(cuenta) == 0:
            alerta(errors=['No se encontro la cuenta'])
        
        self.cuenta = cuenta[0]
    
    def registerMovimiento(self, data):
        cantidad = data.get('cantidad', 0)
        fecha = data.get('fecha', None)
        tipo_movimiento_id = data.get('tipo_movimiento_id',0)
        cuenta = self.cuenta
        
        tipo_movimiento = TipoMovimiento.objects.filter(id=tipo_movimiento_id)
        
        try:
            cantidad = decimal.Decimal(cantidad)
        except e:
            alerta(errors=['La cantidad no es un numero valido'])
        
        try:
            fecha = datetime.strptime(fecha, '%Y-%m-%d').date()
        except e:
            alerta(errors=['Ingresa un fecha valida'])

        if len(tipo_movimiento) == 0:
            alerta(errors=["No se encontro el tipo de movimiento, intenta de nuevo"])
        
        if cantidad <= 0:
            alerta(errors=['Ingrese una cantidad valida'])
        
        if fecha is None:
            alerta(errors=['Ingrese una fecha valida'])
        
        tipo_movimiento = tipo_movimiento[0]
        
        try:
            with transaction.atomic():
                movimiento = Movimiento(
                    fecha = fecha,
                    cantidad = cantidad,
                    tipo_movimiento = tipo_movimiento,
                    cuenta = cuenta
                )
                if tipo_movimiento.origen.id == finanza.om_ingreso:
                    cuenta.cantidad = round(cuenta.cantidad + decimal.Decimal(cantidad), 2)
                    
                    if cuenta.tipo_ahorro.tipo_meta.pk == finanza.tm_cantidad:
                        if cuenta.cantidad >= cuenta.cantidad_objetivo:
                            cuenta.meta_alcanzada = True
                    
                    if cuenta.tipo_ahorro.tipo_meta.pk == finanza.tm_fecha:
                        if fecha >= cuenta.fecha_objetivo:
                            cuenta.meta_alcanzada = True
                        
                elif tipo_movimiento.origen.id == finanza.om_gasto:
                    if not cuenta.tipo_ahorro.tipo_meta.pk == finanza.tm_corriente:
                        if not cuenta.meta_alcanzada:
                            if cuenta.tipo_ahorro.tipo_meta.pk == finanza.tm_fecha:
                                if cuenta.fecha_objetivo > fecha:
                                    alerta(errors=['Aun no has alcanzado la fecha objetivo, sino esta de acuerdo puedes editar tu objetivo'])
                                else:
                                    cuenta.meta_alcanzada = True
                            elif cuenta.tipo_ahorro.tipo_meta.pk == finanza.tm_cantidad:
                                if cuenta.cantidad_objetivo > cuenta.cantidad:
                                    alerta(errors=['Aun no has logrado tu cantidad objetivo']) 
                    
                    cantidad_maxima = cuenta.cantidad
                    cuenta.cantidad = round(cuenta.cantidad - decimal.Decimal(cantidad), 2)
                    
                    if cuenta.cantidad < 0:
                        alerta(errors=[f'No puede gastar mas de ${cantidad_maxima} en esta cuenta!!!'])
                else:
                    alerta(errors=['Origen no reconocido'])
                
                movimiento.save()
                cuenta.save()
                return {'success': True, 'message': 'Se registro correctamente'}
        except IntegrityError as e:
            return {'success': False, 'message': f'Algo salio mal: {str(e)}'}
    
    def listMovimientos(self):
        movimientos = list(Movimiento.objects
                           .filter(
                               cuenta__id=self.cuenta.id,
                               fecha__isnull=False,
                               deleted_at__isnull=True
                            )
                           .annotate(
                               tipo_movimiento_nombre = F('tipo_movimiento__nombre'),
                               origen_id = F('tipo_movimiento__origen__id'),
                               origen_nombre = F('tipo_movimiento__origen__nombre'),
                           ).values(
                            'tipo_movimiento_nombre',
                            'origen_id',
                            'origen_nombre',
                            'fecha',
                            'cantidad',
                            'tipo_movimiento_id'
                           )
                           .order_by('-fecha'))
        
        return movimientos
    
    def listMovimientosCSV(self):
        movimientos = list(Movimiento.objects
                        .filter(
                            cuenta__id=self.cuenta_id,
                            fecha__isnull=False,
                            deleted_at__isnull=True
                        )
                        .annotate(
                            tipo_movimiento_nombre=F('tipo_movimiento__nombre'),
                            origen_id=F('tipo_movimiento__origen__id'),
                            origen_nombre=F('tipo_movimiento__origen__nombre'),
                        ).values(
                            'tipo_movimiento_nombre',
                            'origen_id',
                            'origen_nombre',
                            'fecha',
                            'cantidad',
                            'tipo_movimiento_id'
                        )
                        .order_by('fecha'))
        
        if len(movimientos) == 0:
            alerta(errors=['No se encontraron movimientos aun'])
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="movimientos.csv"'
        
        writer = csv.writer(response)
        
        writer.writerow([
            'Tipo Movimiento Nombre',
            'Origen ID',
            'Origen Nombre',
            'Fecha',
            'Cantidad',
            'Tipo Movimiento ID'
        ])
        
        for movimiento in movimientos:
            writer.writerow([
                movimiento['tipo_movimiento_nombre'],
                movimiento['origen_id'],
                movimiento['origen_nombre'],
                movimiento['fecha'],
                movimiento['cantidad'],
                movimiento['tipo_movimiento_id']
            ])
        
        return response
    
    def listMovimientosPDF(self):
        movimientos = list(Movimiento.objects
                        .filter(
                            cuenta__id=self.cuenta_id,
                            fecha__isnull=False,
                            deleted_at__isnull=True
                        )
                        .annotate(
                            tipo_movimiento_nombre=F('tipo_movimiento__nombre'),
                            origen_id=F('tipo_movimiento__origen__id'),
                            origen_nombre=F('tipo_movimiento__origen__nombre'),
                        ).values(
                            'tipo_movimiento_nombre',
                            'origen_id',
                            'origen_nombre',
                            'fecha',
                            'cantidad',
                            'tipo_movimiento_id'
                        )
                        .order_by('fecha'))
        
        if len(movimientos) == 0:
            alerta(errors=['No se encontraron movimientos aun'])
            
        html_string = render_to_string('movimientos.html', {'movimientos': movimientos})
        
        pdf_file = HTML(string=html_string).write_pdf()

        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="movimientos.pdf"'

        return response
    
    def chartMovimientos(self):
        movimientos = list(Movimiento.objects
                        .filter(
                            cuenta__id=self.cuenta.id,
                            fecha__isnull=False,
                            deleted_at__isnull=True
                        )
                        .annotate(
                            tipo_movimiento_nombre=F('tipo_movimiento__nombre'),
                            origen_id=F('tipo_movimiento__origen__id'),
                            origen_nombre=F('tipo_movimiento__origen__nombre'),
                        )
                        .values(
                            'fecha',
                            'origen_id',
                            'origen_nombre'
                        )
                        .annotate(
                            cantidad=Sum('cantidad')
                        )
                        .order_by('fecha'))

        return movimientos
        
    
    def listMovimientosPorSemana(self):
        movimientos = list(Movimiento.objects
                        .filter(
                            cuenta__id=self.cuenta.id,
                            fecha__isnull=False,
                            deleted_at__isnull=True
                            )
                        .annotate(
                            origen_id=F('tipo_movimiento__origen__id'),
                            origen_nombre=F('tipo_movimiento__origen__nombre'),
                            semana_inicio=TruncWeek('fecha', output_field=DateField()),
                            semana_fin=ExpressionWrapper(TruncWeek('fecha', output_field=DateField()) + timedelta(days=6), output_field=DateField())
                        )
                        .values(
                            'semana_inicio',
                            'semana_fin',
                            'origen_id',
                            'origen_nombre',
                        )
                        .annotate(
                            total_cantidad=Sum('cantidad')
                        )
                        .order_by('-semana_inicio'))
        return movimientos
    
    def listMovimientosPorMes(self):
        movimientos = list(Movimiento.objects
                        .filter(
                            cuenta__id=self.cuenta.id,
                            fecha__isnull=False,
                            deleted_at__isnull=True
                            )
                        .annotate(
                            origen_id=F('tipo_movimiento__origen__id'),
                            origen_nombre=F('tipo_movimiento__origen__nombre'),
                            inicio_mes=TruncMonth('fecha', output_field=DateField())
                        )
                        .values(
                            'inicio_mes',
                            'origen_id',
                            'origen_nombre'
                        )
                        .annotate(
                            total_cantidad=Sum('cantidad')
                        )
                        .order_by('-inicio_mes'))

        for movimiento in movimientos:
            inicio_mes = movimiento['inicio_mes']
            fin_mes = date(inicio_mes.year, inicio_mes.month, monthrange(inicio_mes.year, inicio_mes.month)[1])
            movimiento['fin_mes'] = fin_mes

        return movimientos