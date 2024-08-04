from rest_framework import serializers
from typing import List

def alerta(errors:List[str] = [], warnings:List[str] = []):
  raise serializers.ValidationError({"errors": errors, "warnings": warnings})