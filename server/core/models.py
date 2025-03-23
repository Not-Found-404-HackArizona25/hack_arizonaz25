from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator
from django.urls import reverse
from django.utils import timezone


# Custom User model that extends Django's AbstractUser
# This gives us all the default user functionality (username, password, groups, permissions)
# while allowing us to add our own custom fields and methods
class User(AbstractUser):
    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'

    # By default, Django requires email for user creation
    # We override this to make email optional since we're using username-based auth
    REQUIRED_FIELDS = []
    email = models.EmailField(
        'email address',
        blank=True,
        null=True
    )

    # User's first name - minimum 2 characters required
    display_name = models.CharField(
        'display name',
        max_length=50,
        validators=[MinLengthValidator(2)],
    )

    # Optional
    profile_picture = models.CharField(
        'profile picture link',
        max_length=50,
        null=True,
        blank=True,
        validators=[MinLengthValidator(2)]
    )
    
    # Automatically set when the user is created and updated
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # This is not data we collect, its ugly but the other option is to inherit 
    # from AbstractBaseUser and all the stuff that comes with that
    first_name = None
    last_name = None

    def __str__(self):
        """
        String representation of the user - returns username
        Used in Django admin and whenever a user object is printed
        """
        return self.username

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'display_name': self.display_name,
            'profile_picture': self.profile_picture,
        }
        
class Link(models.Model):
    link = models.CharField(max_length=1000,null=True,blank=True)
    def to_dict(self):
        return self.link
    
class Tag(models.Model):
    tag = models.CharField(max_length=1000,null=True,blank=True)
    def to_dict(self):
        return self.tag
    
class Super(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)
    leader = models.ForeignKey(User, on_delete=models.CASCADE,related_name="super_leader", blank=True, null=True)
    followers = models.ManyToManyField(User,related_name="super_users", blank=True, null=True)
    description = models.CharField(max_length=1000,null=True,blank=True)
    links = models.ManyToManyField(Link)
    tags = models.ManyToManyField(Tag)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'leader': self.leader.id if self.leader else None,
            'followers': [user.id for user in self.followers.all()],
            'description': self.description,
            'links': [link.to_dict() for link in self.links.all()],
            'tags': [tag.to_dict() for tag in self.tags.all()],
        }

class Project(Super):
    active = models.BooleanField(default=True)
    
    def to_dict(self):
        out = super().to_dict()
        out['active'] = self.active
        out['type'] = 'project'
        return out

class Club(Super):
    def to_dict(self):
        out = super().to_dict()
        out['type'] = 'club'
        return out

class Event(Super):
    start_time = models.DateField(default=timezone.now)
    end_time = models.DateField(default=timezone.now)
    location = models.CharField(max_length=200, null=True, blank=True)
    club_ref = models.ForeignKey(Club, blank=True, null=True, on_delete=models.CASCADE)
    
    def to_dict(self):
        out = super().to_dict()
        out.update({
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat(),
            'location': self.location,
            'club_ref': self.club_ref.id if self.club_ref else None,
            'type': 'event'
        })
        return out
    
class Comment(models.Model):
    text = models.CharField(max_length=200, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    def to_dict(self):
        return {'id': self.id, 'text': self.text, 'user': self.user.id}
    
class Post(models.Model):
    class PostType(models.TextChoices):
        TEXT = 'text', 'text'
        IMAGE = 'image', 'image'
    
    title = models.CharField(max_length=200, null=True, blank=True)
    text = models.CharField(max_length=1000,null=True,blank=True)
    image_url = models.CharField(max_length=1000,null=True,blank=True)
    contentType  = models.CharField(
        max_length=5,
        choices=PostType.choices,
        default=PostType.TEXT
    )

    comments = models.ManyToManyField(Comment)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'text': self.text,
            'image_url': self.image_url,
            'contentType': self.contentType,
            'comments': [comment.to_dict() for comment in self.comments.all()],
        }
    
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    time_stamp = models.DateField(default=timezone.now)

class SuperUserData(models.Model):
    class SuperType(models.TextChoices):
        PROJECT = 'project', 'project'
        EVENT = 'event', 'event'
        CLUB = 'club', 'club'
        SUPER = 'super', 'super'
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    super = models.ForeignKey(Super, on_delete=models.CASCADE)
    type = models.CharField(max_length=7, choices=SuperType.choices, default=SuperType.SUPER)


    