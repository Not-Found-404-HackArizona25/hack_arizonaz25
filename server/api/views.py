from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserLoginSerializer, UserRegistrationSerializer, UserUpdateSerializer

from core.services import UserService, SuperService, PostService
from core.models import User, Super, Project, Event, Club, Like, Post
from .utils import json_standard
from django.db.models import Q

class UserRegistrationView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    Endpoint: POST /api/users/
    """
    serializer_class = UserRegistrationSerializer # Handles data validation and user creation
    permission_classes = [AllowAny] # Allows anyone to register (no authentication required)

    def create(self, request, *args, **kwargs):
        """
        Handle the user registration process. It:
        1. Validates the incoming registration data
        2. Creates the user if validation passes
        3. Returns the newly created user's details
        4. Logs in the new user

        Raises:
            ValidationError: If the registration data is invalid
        """
        serializer: UserRegistrationSerializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True) # Validates the data, raises exception if invalid
        user = serializer.save() # Creates the user
        user_data = UserService.login_user(request, user) # Logs the user in and returns user data

        return json_standard(
            message="Registration successful",
            data=user_data,
            status=status.HTTP_201_CREATED
        )
        
    def get(self, request, *args, **kwargs):
        """
        Handles a user search which returns the top 10 users based on the
        search term (such as users with a similar name). Searches the username,
        display_name, and email fields in a case insentitive way.
        """
        
        search_term = request.query_params.get('search', '')
        users = User.objects.filter(
            Q(username__icontains=search_term) |
            Q(display_name__icontains=search_term)
        ).distinct()
        users = users[:10]

        return json_standard(
            message='Search Results',
            data={'users': [user.to_dict() for user in users]},
            status=status.HTTP_200_OK,
        )
    
class SessionView(APIView):
    """
    API endpoint for managing user sessions.

    POST: Create a new session (login)
    DELETE: Terminate the session (logout)
    """

    def get_permissions(self):
        """
        Only POST requests do not require authentication.
        """
        if self.request.method == 'POST':
            return [AllowAny()]
        return [IsAuthenticated()]

    def post(self, request, *args, **kwargs):
        """
        Handle user login and create a new session.
        Accessible to unauthenticated users.
        """
        serializer = UserLoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        user_data = UserService.login_user(request, user)

        return json_standard(
            message="Login successful",
            data=user_data,
            status=status.HTTP_200_OK
        )

    def delete(self, request, *args, **kwargs):
        """End the current session (logout)"""
        UserService.logout_user(request)

        return json_standard(
            message="Logout successful",
            status=status.HTTP_200_OK
        )

class CurrentUserView(APIView):
    """
    Endpoint for retrieving/updating current user information
    
    GET: Get the current user session
    PATCH: Update the current user
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        Return the current user's information.
        Only accessible to authenticated users.
        """
        user = request.user
        return json_standard(
            data={
                'user': user.to_dict()
            },
            status=status.HTTP_200_OK
        )

    def patch(self, request, *args, **kwargs):
        """
        Update the current user's information.
        Only accessible to authenticated users.
        """
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            updated_user = serializer.save()  # Saves the changes to the user model
            return json_standard(
                message="User information updated successfully",
                data={
                    'user': user.to_dict()
                },
                status=status.HTTP_200_OK
            )

        return json_standard(
            message="Failed to update user information",
            data=serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    
class PostView(APIView):
    """
    API endpoint for retrieving multiple posts.
    Supports optional filtering parameters via query strings.
    Example: /api/posts/?type=project&tag=web&offset=10
    """

    permission_classes = [AllowAny] # Allows anyone to register (no authentication required)
    
    def get(self, request):
        """
        Handle the get multiple posts process. It:
        1. Interact with the PostService to get queried posts
        2. Returns all the posts to the user

        Raises:
            ValidationError: If the registration data is invalid
        """
        posts_data = PostService.get_multiple_posts(request)

        return json_standard(
            message="Get posts successful",
            data=posts_data,
            status=status.HTTP_200_OK
        )
    
class UserIDView(APIView):
    permission_classes = [IsAuthenticated]  # Restrict to authenticated users

    def get(self, request, *args, **kwargs):
        """
        Retrieve a user by their ID.
        """
        [user_id] = kwargs.values()
        try:
            user = User.objects.get(id=user_id)
            return json_standard(
                message="Retrieved User",
                data={'user': user.to_dict()},
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return json_standard(
                message="User not found",
                status=status.HTTP_404_NOT_FOUND
            )
        except ValueError:
            return json_standard(
                message="Invalid user ID",
                status=status.HTTP_400_BAD_REQUEST
            )

class SuperIDView(APIView):
    permission_classes = [IsAuthenticated]  # Restrict to authenticated users

    def get(self, request, *args, **kwargs):
        """
        Retrieve a user by their ID.
        """
        [super_id] = kwargs.values()
        try:
            super = Super.objects.get(id=super_id)
            return json_standard(
                message="Retrieved User",
                data={'super': super.to_dict()},
                status=status.HTTP_200_OK
            )
        except Super.DoesNotExist:
            return json_standard(
                message="Super not found",
                status=status.HTTP_404_NOT_FOUND
            )
        except ValueError:
            return json_standard(
                message="Invalid user ID",
                status=status.HTTP_400_BAD_REQUEST
            )


class SuperView(APIView):
    """
    Endpoint for making/editing a super object
    
    POST: Create a super object
    PATCH: Update/edit a super object
    
    TODO: Validate post data
    """
    
    def get(self, request, *args, **kwargs):
        """
        Handles a user search which returns the top 10 users based on the
        search term (such as users with a similar name). Searches the username,
        display_name, and email fields in a case insentitive way.
        """
        search_term = request.query_params.get('search', '')
        type = request.query_params.get('type', '')
        
        out = None
        if type=='project':
            projects = Project.objects.filter(
                Q(name__icontains=search_term) |
                Q(description__icontains=search_term) |
                Q(tags__tag__icontains=search_term)
            ).distinct()
            out = projects[:10]
        elif type=='event':
            events = Event.objects.filter(
                Q(name__icontains=search_term) |
                Q(description__icontains=search_term) |
                Q(tags__tag__icontains=search_term)
            ).distinct()
            out = events[:10]
        elif type=='club':
                clubs = Club.objects.filter(
                    Q(name__icontains=search_term) |
                    Q(description__icontains=search_term) |
                    Q(tags__tag__icontains=search_term)
                ).distinct()
                out = clubs[:10]
                
        return json_standard(
            message='Search Results',
            data={(type+"s"): [super.to_dict() for super in out]},
            status=status.HTTP_200_OK,
        )
    
    def post(self, request):
        user = request.user
        data = request.data
        created = None
        if data['type'] == 'project':
            created = SuperService.create_project(user,data)
        elif data['type'] == 'event':
            created = SuperService.create_event(user,data)
        elif data['type'] == 'club':
            created = SuperService.create_club(user,data)
                
        return json_standard(
            message='Successfully created Super',
            data=created.to_dict(),
            status=status.HTTP_200_OK
        )
    def patch(self,request):
        user = request.user
        data = request.data
        created = None
        if data['type'] == 'project':
            created = SuperService.edit_project(user,data)
        elif data['type'] == 'event':
            created = SuperService.edit_event(user,data)
        elif data['type'] == 'club':
            created = SuperService.edit_club(user,data)
        return json_standard(
            message='Successfully created Super',
            data=created.to_dict(),
            status=status.HTTP_200_OK
        )

class UserUNameGet(APIView):
    def get(self, request, **kwargs):
        [username] = kwargs.values()
        user = User.objects.filter(username=username).first()
        return json_standard(
            message='Successfully created Super',
            data=user.to_dict() if user is not None else {},
            status=status.HTTP_200_OK
        )

class LikesUNameGet(APIView):
    def get(self, request, **kwargs):
        [username] = kwargs.values()
        likes = Like.objects.filter(user__username=username)
        return json_standard(
            message='Successfully created Super',
            data=[user.to_dict() for user in likes],
            status=status.HTTP_200_OK
        )

class PostsUNameGet(APIView):
    def get(self, request, **kwargs):
        [username] = kwargs.values()
        posts = Post.objects.filter(user__username=username)
        return json_standard(
            message='Successfully created Super',
            data=[user.to_dict() for user in posts],
            status=status.HTTP_200_OK
        )

class SupersUNameGet(APIView):
    def get(self, request, **kwargs):
        [username] = kwargs.values()
        projects = Project.objects.filter(leader__username=username)
        
        return json_standard(
            message='Successfully created Super',
            data=[user.to_dict() for user in projects],
            status=status.HTTP_200_OK
        )