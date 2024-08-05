from django.db import models
from django.utils import timezone
from core_app.models import User

class TipoMeta(models.Model):
    '''
    Ahorro corriente
    Por cantidad
    Por fecha
    '''
    nombre = models.CharField(max_length=50, verbose_name="Nombre")

class TipoAhorro(models.Model):
    nombre = models.CharField(max_length=50, verbose_name="Nombre")
    tipo_meta = models.ForeignKey(TipoMeta, on_delete=models.RESTRICT, blank=True, null=True)
    
    usuario = models.ForeignKey(User, on_delete=models.RESTRICT, blank=True, null=True )
    
    created_at = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated_at = models.DateTimeField(auto_now_add=False, auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    

    def delete(self, using=None, keep_parents=False):
        self.deleted_at = timezone.now()
        self.save()

    def is_deleted(self):
        return self.deleted_at is not None

class Ahorro(models.Model):
    nombre = models.CharField(max_length= 50, verbose_name="Nombre")
    cantidad = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Cantidad")
    cantidad_inicial = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Cantidad inicial", default=0)
    cantidad_objetivo = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Cantidad", null=True, blank=True)
    fecha_objetivo = models.DateField(verbose_name="Fecha objetivo",null=True, blank=True)
    meta_alcanzada = models.BooleanField(verbose_name='Meta alcanzada', default=False)
    tipo_ahorro = models.ForeignKey(TipoAhorro, on_delete=models.RESTRICT)
    
    usuario = models.ForeignKey(User, on_delete=models.RESTRICT, blank=True, null=True )
    
    created_at = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated_at = models.DateTimeField(auto_now_add=False, auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    

    def delete(self, using=None, keep_parents=False):
        self.deleted_at = timezone.now()
        self.save()

    def is_deleted(self):
        return self.deleted_at is not None

class OrigenMovimiento(models.Model):
    '''
    Ingreso o gasto
    '''
    nombre = models.CharField(max_length= 50, verbose_name="Nombre")

class TipoMovimiento(models.Model):
    nombre = models.CharField(max_length= 50, verbose_name="Nombre")
    
    origen = models.ForeignKey(OrigenMovimiento, on_delete=models.RESTRICT)
    usuario = models.ForeignKey(User, on_delete=models.RESTRICT, blank=True, null=True )
    
    created_at = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated_at = models.DateTimeField(auto_now_add=False, auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    

    def delete(self, using=None, keep_parents=False):
        self.deleted_at = timezone.now()
        self.save()

    def is_deleted(self):
        return self.deleted_at is not None
    

class Movimiento(models.Model):
    fecha = models.DateField(help_text="Fecha",null=True, blank=True)
    cantidad = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Cantidad")
    
    cuenta = models.ForeignKey(Ahorro, on_delete=models.RESTRICT)
    tipo_movimiento = models.ForeignKey(TipoMovimiento, on_delete=models.RESTRICT)
    
    created_at = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated_at = models.DateTimeField(auto_now_add=False, auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    

    def delete(self, using=None, keep_parents=False):
        self.deleted_at = timezone.now()
        self.save()

    def is_deleted(self):
        return self.deleted_at is not None
    