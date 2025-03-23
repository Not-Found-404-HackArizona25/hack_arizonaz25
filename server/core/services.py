# Business logic
from typing import List
from django.db import transaction
from django.contrib.auth import login, logout
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Super, User, Project, Link, Tag, Event, Club, Post
from datetime import datetime
from django.utils import timezone

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

            if type == "misc":
                querySet = querySet.filter(misc__isnull=False)
            
            # if no posts fit the filter, return all posts
            results = None if querySet is None else querySet[offset: offset+limit]
            return {
                'posts': [post.to_dict() for post in results] if results else [],
                'pagination': {
                    'total': querySet.count() if querySet is not None else 0,
                    'offset': offset,
                    'limit': limit
                }
            }
            
        except KeyError as e:
            raise ValidationError(f'Missing required field: {str(e)}') from e
        
    def create_a_post(user: User, data: dict):
        # Create a Post instance using the provided data.
        # We assume `data` contains "text" or "image_url".
        # Todo: handle the tags later
        try:
            title = data.get('title', '')
            contentType = data.get('contentType', 'TEXT')
            text = image_url = None
            if contentType == 'TEXT':
                text = data.get('text')
            if contentType == 'IMAGE':
                image_url = data.get('image_url')
            try:
                project = Project.objects.get(id=data.get('project', None))
            except Project.DoesNotExist:
                project = None  # Set to None if the project doesn't exist
            except Project.MultipleObjectsReturned:
                return {"error": "Multiple projects found with the given ID"}  # Handle duplicates properly
            try:
                event = Event.objects.get(id=data.get('event', None))
            except Event.DoesNotExist:
                event = None  # Set to None if the event doesn't exist
            except Event.MultipleObjectsReturned:
                return {"error": "Multiple events found with the given ID"}  # Handle duplicates properly
            
            try:
                club = Club.objects.get(id=data.get('club', None))
            except Club.DoesNotExist:
                club = None  # Set to None if the club doesn't exist
            except Club.MultipleObjectsReturned:
                return {"error": "Multiple clubs found with the given ID"}  # Handle duplicates properly
            
            try:
                misc = Super.objects.get(id=data.get('misc', None))
            except Super.DoesNotExist:
                misc = None  # Set to None if the misc doesn't exist
            except Super.MultipleObjectsReturned:
                return {"error": "Multiple miscs found with the given ID"}  # Handle duplicates properly
            
            

            post = Post(
                title = title,
                user=user,
                text=text,
                image_url=image_url,
                contentType=Post.PostType.TEXT if text else Post.PostType.IMAGE, 
                project=None if not project else project,
                event=event,
                club=club,
                misc=misc,
            )
            post.save()
            return post
        
        except ValidationError as e:
                raise ValidationError({'post': e.messages})
         
class SuperService:
    def create_project(user: User, data: dict):
        # Create a Project instance using the provided data.
        # We assume `data` contains "name" and "description".
        try:
            project = Project(
                name=data.get('name'),
                leader=user,
                description=data.get('description', ''),
                active=data.get('active', True)
            )
            project.save()

            links = data.get('links', [])
            for link_url in links:
                link_obj, created  = Link.objects.get_or_create(link=link_url)
                project.links.add(link_obj)

            tags = data.get('tags', [])
            for tag_name in tags:
                tag_obj, created = Tag.objects.get_or_create(tag=tag_name)
                project.tags.add(tag_obj)

            project.save()
            return project
        
        except ValidationError as e:
                raise ValidationError({'project': e.messages})
            
    def create_event(user: User, data: dict):
        # Create a Project instance using the provided data.
        # We assume `data` contains "name" and "description".
        try:
            event = event = Event(
                name=data.get('name'),
                leader=user,
                description=data.get('description', ''),
                start_time=datetime.fromisoformat(data.get('start_time', datetime.now().isoformat().replace("Z", "+00:00"))),
                end_time=datetime.fromisoformat(data.get('end_time', datetime.now().isoformat().replace("Z", "+00:00"))),
                location=data.get('location', 'The University of Arizona')
            )
                
            event.save()

            links = data.get('links', [])
            for link_url in links:
                link_obj, created = Link.objects.get_or_create(link=link_url)
                event.links.add(link_obj)
            
            tags = data.get('tags', [])
            for tag_name in tags:
                tag_obj, created = Tag.objects.get_or_create(tag=tag_name)
                event.tags.add(tag_obj)
                
            club_id = data.get('club_ref')
            if club_id and Club.objects.filter(id=club_id).exists():
                club = Club.objects.get(id=club_id)
                event.club_ref = club

            event.save()
            return event
        
        except ValidationError as e:
                raise ValidationError({'project': e.messages})
            
    def create_club(user: User, data: dict):
        try:
            club = Club(
                name=data.get('name'),
                leader=user,
                description=data.get('description', ''),
            )
            club.save()

            links = data.get('links', [])
            for link_url in links:
                link_obj, created = Link.objects.get_or_create(link=link_url)
                club.links.add(link_obj)

            tags = data.get('tags', [])
            for tag_name in tags:
                tag_obj, created = Tag.objects.get_or_create(tag=tag_name)
                club.tags.add(tag_obj)

            club.save()
            return club
        
        except ValidationError as e:
                raise ValidationError({'project': e.messages})

    def edit_project(user: User, data: dict):
            # Create a Project instance using the provided data.
            # We assume `data` contains "name" and "description".
            try:
                project = Project.objects.get(id=data.get("id"))
                project.name = data.get('name',project.name)
                project.description = data.get('description',project.description)
                project.active = data.get('active',project.active)
                project.save()
                return project

            except ValidationError as e:
                    raise ValidationError({'project': e.messages})

    def edit_event(user: User, data: dict):
        # Create a Project instance using the provided data.
        # We assume `data` contains "name" and "description".
        try:
            event = Event.objects.get(id=data.get("id"))
            event.name = data.get('name',event.name)
            event.description = data.get('description',event.description)
            event.save()
            return event
        
        except ValidationError as e:
                raise ValidationError({'project': e.messages})
            
    def edit_club(user: User, data: dict):
        try:
            club = Club.objects.get(id=data.get("id"))
            club.name = data.get('name', club.name)
            club.description = data.get('description', club.description)
            club.save()
            return club
        
        except ValidationError as e:
                raise ValidationError({'project': e.messages})
            
    
