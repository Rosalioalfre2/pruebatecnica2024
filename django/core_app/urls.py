from django.urls import path
import core_app.views as View
from rest_framework_simplejwt.views import TokenVerifyView, TokenRefreshView

urlpatterns = [
    path('',View.Homeview.as_view(),name='home'),
    path("register/", View.RegisterView.as_view(), name='register'),
    path("login/", View.LoginView.as_view(), name='token_obtain_pair'),
    path("verify/", TokenVerifyView.as_view(), name='token_verify'),
    path("logout/", View.SimpleLogoutView.as_view(), name='token_logout'),
    path("refresh/", TokenRefreshView.as_view(), name='token_refresh'),
]

