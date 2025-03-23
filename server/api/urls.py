from django.urls import path
from .views import UserRegistrationView, SessionView, CurrentUserView, SuperView, UserIDView, PostView

urlpatterns = [
    path('users', UserRegistrationView.as_view(), name='user-register'),
    path('users/me', CurrentUserView.as_view(), name='current-user'),
    path('sessions', SessionView.as_view(), name='sessions'),
    path('posts', PostView.as_view(), name='posts'),
    path('users/<int:user_id>', UserIDView.as_view(), name='user-detail'),
    path('super',SuperView.as_view(), name='make edit super')
]