from django.db import models

class Ahorro(models.Model):
    nombre = models.CharField(max_length= 50, verbose_name="Nombre")
    cantidad = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Cantidad")
    cantidad_objetivo = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Cantidad", null=True, blank=True)
    fecha_objetivo = models.DateField(verbose_name="Fecha objetivo",null=True, blank=True)
    
    # usuario = models.ForeignKey(CentroDeCosto, on_delete=models.RESTRICT, blank=True, null=True )
    
    created_at = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated_at = models.DateTimeField(auto_now_add=False, auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    

    def delete(self, using=None, keep_parents=False):
        self.deleted_at = timezone.now()
        self.save()

    def is_deleted(self):
        return self.deleted_at is not None