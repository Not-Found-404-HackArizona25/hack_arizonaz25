from django.urls import path


from .views import UserRegistrationView, SessionView, CurrentUserView, SuperView, UserIDView, SuperIDView

urlpatterns = [
    path('users', UserRegistrationView.as_view(), name='user-register'),
    path('users/me', CurrentUserView.as_view(), name='current-user'),
    path('sessions', SessionView.as_view(), name='sessions'),
    path('users/<int:user_id>', UserIDView.as_view(), name='user-detail'),
    path('super',SuperView.as_view(), name='make edit super'),
    path('super/<int:super_id>', SuperIDView.as_view(),name='super-detail')
]