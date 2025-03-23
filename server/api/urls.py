from django.urls import path
from .views import *
urlpatterns = [
    path('users', UserRegistrationView.as_view(), name='user-register'),
    path('users/me', CurrentUserView.as_view(), name='current-user'),
    path('sessions', SessionView.as_view(), name='sessions'),
    path('posts', PostView.as_view(), name='posts'),
    path('posts/<int:post_id>', PostIDView.as_view(), name='post-detail'),
    path('users/<int:user_id>', UserIDView.as_view(), name='user-detail'),
    path('super',SuperView.as_view(), name='make edit super'),
    path('super/<int:super_id>', SuperIDView.as_view(),name='super-detail'),
    
    path('users/<str:username>', UserUNameGet.as_view(), name='user-register'),
    path('likes/user/<str:username>', LikesUNameGet.as_view(), name='user-register'),
    path('posts/user/<str:username>', PostsUNameGet.as_view(), name='user-register'),
    path('super/user/<str:username>', SupersUNameGet.as_view(), name='user-register'),
]