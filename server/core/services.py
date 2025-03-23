# Business logic
from typing import List
from django.db import transaction
from django.contrib.auth import login, logout
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Post, User

class UserService:
    @staticmethod
    @transaction.atomic
    def create_user(data: dict):
        """
        Create a new user with validated data
        
        Args:
            data (dict): Dictionary containing user data including:
                        username, password, email, display_name, facility_id, profile_picture, consent
        
        Returns:
            User: Created user instance
            
        Raises:
            ValidationError: If password validation fails or required fields are missing
        """
        try:
            # Validate password
            validate_password(data['password'])
            
            # Create user instance but don't save yet
            user = User(
                username=data['username'],
                display_name=data['display_name'],
            )
            
            # Set password (this handles the hashing)
            user.set_password(data['password'])
            
            # Save the user
            user.save()
            
            return user
        except ValidationError as e:
            raise ValidationError({'password': e.messages})
        except KeyError as e:
            raise ValidationError(f'Missing required field: {str(e)}')
        
    @staticmethod
    def login_user(request, user: User):
        """
        Log in a user and create a session
        
        Args:
            request: The HTTP request object
            user: The authenticated user instance
            
        Returns:
            dict: User data including authentication token if used

        Raises:
            ValidationError: If login fails
        """
        try:
            # Log the user in (validates with HTTP session storage)
            login(request, user)

            return {
                'user': user.to_dict()
            }
        except Exception as e:
            raise ValidationError('login failed. Please try again.')
        
    @staticmethod
    def logout_user(request):
        """
        Log out a user and destroy the session
        
        Args:
            request: The HTTP request object
            
        Returns:
            dict: User data including authentication token if used
        """
        try:
            # Log the user out (validates with HTTP session storage)
            logout(request)
        except Exception as e:
            raise ValidationError('logout failed. Please try again.')
        
class PostService:
    @staticmethod
    def get_multiple_posts(request):
        """
        Get multiple posts based on query parameters
        
        Args:
            request: The HTTP request object
            
        Returns:
            dict: Posts data
        """
        try:
            title: str = request.query_params.get("title", "")
            tag_list: List[str] = request.query_params.getlist("tag", [])
            type: str = request.query_params.get("type", "")
            offset: int = int(request.query_params.get('offset', 0))
            limit: int = int(request.query_params.get('limit', 10))

            querySet = Post.objects.all()

            if title:
                querySet = querySet.filter(title__icontains=title)
            
            if tag_list:
                # Match all queries with at least one matching tag
                querySet = querySet.filter(tag__tag__in=tag_list)

            if type == "project":
                querySet = querySet.filter(project__isnull=False)
            
            if type == "event":
                querySet = querySet.filter(event__isnull=False)

            if type == "club":
                querySet = querySet.filter(club__isnull=False)

            if type == "mics":
                querySet = querySet.filter(mics__isnull=False)
            
            # if no posts fit the filter, return all posts
            results = None if querySet == None else querySet[offset: offset+limit]
            return results
            
        except KeyError as e:
            raise ValidationError(f'Missing required field: {str(e)}')