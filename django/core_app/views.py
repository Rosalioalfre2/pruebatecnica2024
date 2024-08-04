from django.http import HttpResponse, JsonResponse
from rest_framework import status
from core_app.serializer import UserSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import  DjangoModelPermissions, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction
import finanzas.const as Finanza


class Homeview(APIView):
    def get(self, request):
        return JsonResponse({'success': True, 'message': 'Home' })

class LoginView(APIView):
    def post(self, request):
        import datetime
        from rest_framework_simplejwt.tokens import RefreshToken
        from django.contrib.auth import authenticate, login
        from core_app.models import User
        from rest_framework.exceptions import AuthenticationFailed
        username = request.data['username']
        password = request.data['password']
        # Authenticate the user using Django's built-in authentication
        user = authenticate(request, username=username, password=password)
        if user is None:
            raise AuthenticationFailed('Ooops! Verifica que tu contraseña o tu usuario sea el correcto.')
        if not user.is_active:  # Check for active status
            raise AuthenticationFailed('Usuario inactivo.')
        groups = user.groups.all()
        json_grupos = list(groups.values())
        refresh = RefreshToken.for_user(user)
        refresh['iat'] = datetime.datetime.now()
        refresh['user'] = user.username
        refresh['email'] = user.email
        refresh['date'] = str(datetime.date.today())
        refresh['groups'] = json_grupos
        refresh['is_admin'] = user.is_superuser

        response = Response()
        response.data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            'iat': datetime.datetime.utcnow(),
            'groups': json_grupos
        }
        return response

class RegisterView(APIView):
    @transaction.atomic
    def post(self, request):
        from finanzas.models import TipoAhorro, Ahorro
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            tipo_ahorro = TipoAhorro.objects.get(id=Finanza.ta_apertura)
            
            ahorro = Ahorro(
                usuario=user,
                nombre="Cuenta principal",
                cantidad=0,
                tipo_ahorro=tipo_ahorro
            )
            
            try:
                ahorro.save()
                response_data = {
                    'user': serializer.data,
                    'ahorro': {
                        'id': ahorro.id,
                        'usuario_id': ahorro.usuario.id,
                        'nombre': ahorro.nombre,
                        'cantidad': ahorro.cantidad,
                        'tipo_ahorro_id': ahorro.tipo_ahorro.id,
                    }
                }
                return Response(response_data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SimpleLogoutView(APIView):
    permission_classes = (IsAuthenticated,)
    def post(self, request):
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response({'error': 'No refresh token provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)