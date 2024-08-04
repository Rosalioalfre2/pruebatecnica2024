from datetime import datetime
from rest_framework import serializers
import re

# Archivo de validaciones generales
# sólo para validaciones que son reusables en muchos lados.

def validate_min_length(value, min_length, is_required = True):        
    if not is_required:
        if value == "" or value is None:
            return
        
    if len(value) < min_length:
        raise serializers.ValidationError(f"Debe tener al menos {min_length} caracteres")

def validate_max_length(value, max_length, is_required = True):
    if not is_required:
        if value == "" or value is None:
            return
        
    if len(value) > max_length:
        raise serializers.ValidationError(f"No debe tener mas de {max_length} caracteres")

def validate_min(value, min, is_required = True):
    if not is_required:
        if value == "" or value is None:
            return
        
    if value < min:
        raise serializers.ValidationError(f"No debe ser menor que {min}")
    
def validate_max(value, max, is_required = True):
    if not is_required:
        if value == "" or value is None:
            return
    if value > max:
        raise serializers.ValidationError(f"No debe ser mayor que {max}")

def validate_only_letters(value, is_required = True ):
    if not is_required:
        if value == "" or value is None:
            return
        
    if not re.match(r'^[a-zA-ZáéíóúüñÑÁÉÍÓÚ\s]+$', value):
            raise serializers.ValidationError('Este campo no puede contener caracteres especiales o números.')
    
def validate_only_numbers(value, is_required = True ):
    if not is_required:
        if value == "" or value is None:
            return
        
    if not re.match(r'^[0-9]+$', str(value)):
            raise serializers.ValidationError('Este campo no puede contener caracteres especiales o letras.')

def validate_no_special_characters(value, is_required = True):
    if not is_required:
        if value == "" or value is None:
            return
        
    if re.search(r'[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s(),./\'"°#-]', value):
        raise serializers.ValidationError('Este campo no puede contener caracteres especiales.')

def validate_letters_and_numbers(value, is_required = True):
    if not is_required:
        if value == "" or value is None:
            return
        
    if re.search(r'[^a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s]', value):
        raise serializers.ValidationError('Este campo no puede contener caracteres especiales.')

#No sirve :/, al parecer esta no es la forma de validar nulos, siempre valida antes de llegar a esta validacion
def validate_required(value, is_required = True):
    if not is_required:
        if value == "" or value is None:
            return

def validate_tel(value, is_required = True):
    if not is_required:
        if value == "" or value is None:
            return
        
    if len(value) <= 5:
        raise serializers.ValidationError("El télefono debe al menos tener 5 caracteres.")
    
    elif not re.match(r'^[\d\+\-]+$', value):
        raise serializers.ValidationError('El número de teléfono no tiene un formato válido.')

def validate_tel_sv(value, is_required = True):
    if not is_required:
        if value == "" or value is None:
            return

    if not re.match(r'^[0-9]{4}-[0-9]{4}$', value):
        raise serializers.ValidationError('El campo debe tener el formato "0000-0000".')

def validate_nit(value, is_required = True):
    if not is_required:
        if value == "" or value is None:
            return

    if not re.match(r'^[0-9]{4}-[0-9]{6}-[0-9]{3}-[0-9]{1}$', value):
        raise serializers.ValidationError('El campo debe tener el formato "0000-000000-000-0".')

def validate_dui(value, is_required = True):
    if not is_required:
        if value == "" or value is None:
            return
    if is_required:
        if value == "" or value is None:
            raise serializers.ValidationError('Este campo es obligatorio')

    if not re.match(r'^[0-9]{8}-[0-9]{1}$', value):
        raise serializers.ValidationError('El campo debe tener el formato "00000000-0".')

def validate_date(value, is_required = True):
    if not is_required:
        if value == "" or value is None:
            return
    
    try:
        datetime.strptime(value, '%Y-%m-%d')
    except ValueError:
        raise serializers.ValidationError('Ingrese una fecha valida')