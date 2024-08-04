from core.helpers.alert import alerta
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.exceptions import AuthenticationFailed

def getPayloadJWT(request, item):
    try:
        authorization_header = request.headers.get('Authorization')
        
        if authorization_header and 'Bearer' in authorization_header:
            jwt_token = authorization_header.split(' ')[1]
        else:
            raise AuthenticationFailed('El encabezado de autorización no tiene el formato esperado.')

        token = AccessToken(jwt_token)
        
        jwt_id = token.payload[item]
        
        return jwt_id
    except AuthenticationFailed as e:
        alerta(errors=["JWT no valido"])