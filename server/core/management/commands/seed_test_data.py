import json
from pathlib import Path
from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from django.db import transaction
from django.conf import settings
from django.utils import timezone
from core.models import User, Project, Link, Tag, Club, Event, Super

class Command(BaseCommand):
    help = 'Seeds the database with initial data from JSON files'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Delete existing data before seeding',
        )
        parser.add_argument(
            '--data-dir',
            type=str,
            default='seed_data',
            help='Directory containing JSON seed files (default: seed_data)',
        )

    def handle(self, *args, **options):
        data_dir = options['data_dir']
        seed_path = Path(settings.BASE_DIR) / 'core' / 'management' / data_dir
        
        if not seed_path:
            self.stdout.write(self.style.ERROR(f'Seed data directory not found in: {seed_path}'))
            return
        
        self.stdout.write(self.style.SUCCESS(f'Using seed data from: {seed_path}'))
        
        try:
            with transaction.atomic():
                if options['reset']:
                    self.stdout.write(self.style.WARNING('Deleting existing data...'))
                    Project.objects.all().delete()
                    Event.objects.all().delete()
                    Club.objects.all().delete()
                    Super.objects.all().delete()
                    # Keep superuser accounts if they exist
                    User.objects.filter(is_superuser=False).delete()
                
                # Load and seed data from JSON files
                user_data = self.load_json_file(seed_path / 'users.json')
                proj_data = self.load_json_file(seed_path / 'projects.json')
                event_data = self.load_json_file(seed_path / 'events.json')
                club_data = self.load_json_file(seed_path / 'clubs.json')
                self.seed_users(user_data)
                self.seed_projects(proj_data)
                self.seed_events(event_data)
                self.seed_clubs(club_data)
                self.stdout.write(self.style.SUCCESS('Successfully seeded database'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error seeding database: {str(e)}'))
            raise
    
    def load_json_file(self, file_path):
        """Load data from a JSON file"""
        try:
            with open(file_path, 'r') as file:
                return json.load(file)
        except FileNotFoundError:
            self.stdout.write(self.style.WARNING(f'File not found: {file_path}'))
            return []
        except json.JSONDecodeError:
            self.stdout.write(self.style.ERROR(f'Invalid JSON in file: {file_path}'))
            return []

    def seed_users(self, user_data):
        self.stdout.write('Seeding users...')
        
        for data in user_data:
            username = data['username']
            # Hash the password if it's not already hashed
            password = data['password']
            if not password.startswith('pbkdf2_sha256'):
                password = make_password(password)
            
            user, created = User.objects.update_or_create(
                username=username,
                defaults={
                    'password': password,
                    'display_name': data.get('display_name', ''),
                    'profile_picture': data.get('profile_picture',''),
                    'is_staff': data.get('is_staff', False),
                    'is_superuser': data.get('is_superuser', False),
                }
            )
            status = 'Created' if created else 'Updated'
            self.stdout.write(self.style.SUCCESS(f'{status}: {username}'))

    def seed_projects(self, proj_data):
            self.stdout.write('Seeding users...')
            for data in proj_data:
                project, created = Project.objects.update_or_create(
                    name = data.get('name',''),
                    description = data.get('description',''),
                )
                
                links = data.get('links', [])
                for link_url in links:
                    link_obj, created  = Link.objects.get_or_create(link=link_url)
                    project.links.add(link_obj)

                tags = data.get('tags', [])
                for tag_name in tags:
                    tag_obj, created = Tag.objects.get_or_create(tag=tag_name)
                    project.tags.add(tag_obj)
                
                status = 'Created' if created else 'Updated'
                self.stdout.write(self.style.SUCCESS(f'{status} {data.get('name','')}'))

    def seed_clubs(self, club_data):
        self.stdout.write('Seeding clubs...')
        for data in club_data:
            club, created = Club.objects.update_or_create(
                name=data.get('name', ''),
                description=data.get('description', ''),
            )
            
            links = data.get('links', [])
            for link_url in links:
                link_obj, _ = Link.objects.get_or_create(link=link_url)
                club.links.add(link_obj)
            
            tags = data.get('tags', [])
            for tag_name in tags:
                tag_obj, _ = Tag.objects.get_or_create(tag=tag_name)
                club.tags.add(tag_obj)
            
            status = 'Created' if created else 'Updated'
            self.stdout.write(self.style.SUCCESS(f'{status} {data.get("name", "")}'))

    def seed_events(self, event_data):
        self.stdout.write('Seeding events...')
        for data in event_data:
            club_ref = None
            if data.get('club_ref'):
                club_ref = Club.objects.filter(id=data['club_ref']).first()
            
            event, created = Event.objects.update_or_create(
                name=data.get('name', ''),
                description=data.get('description', ''),
                start_time=data.get('start_time', timezone.now()),
                end_time=data.get('end_time', timezone.now()),
                location=data.get('location', ''),
                club_ref=club_ref,
            )
            
            links = data.get('links', [])
            for link_url in links:
                link_obj, _ = Link.objects.get_or_create(link=link_url)
                event.links.add(link_obj)
            
            tags = data.get('tags', [])
            for tag_name in tags:
                tag_obj, _ = Tag.objects.get_or_create(tag=tag_name)
                event.tags.add(tag_obj)
            
            status = 'Created' if created else 'Updated'
            self.stdout.write(self.style.SUCCESS(f'{status} {data.get("name", "")}'))