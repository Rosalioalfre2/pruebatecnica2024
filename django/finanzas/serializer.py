from rest_framework import serializers

class TipoMetaSerializer(serializers.ModelSerializer):
    class Meta:
        from finanzas.models import TipoMeta
        model = TipoMeta
        fields = '__all__'

class TipoAhorroSerializer(serializers.ModelSerializer):
    nombre_tipo_meta = serializers.SerializerMethodField()
    
    class Meta:
        from finanzas.models import TipoAhorro
        model = TipoAhorro
        fields = '__all__'
    
    def get_nombre_tipo_meta(self, obj):
        if obj.tipo_meta:
            return obj.tipo_meta.nombre
