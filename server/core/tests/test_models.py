from django.test import TestCase
from django.db.utils import IntegrityError
from django.core.exceptions import ValidationError
from core.models import User

class UserModelTests(TestCase):
    """Test cases for the User model."""
    
    def setUp(self):
        """Set up test data for User model tests."""
        self.test_user = User.objects.create_user(
            username='testuser',
            password='TestPassword123!',
            display_name='Test User'
        )
    
    def test_user_creation(self):
        """Test basic user creation and validation."""
        self.assertEqual(self.test_user.username, 'testuser')
        self.assertEqual(self.test_user.display_name, 'Test User')
        self.assertTrue(self.test_user.check_password('TestPassword123!'))
        self.assertFalse(self.test_user.consent)  # Default should be False
    
    def test_string_representation(self):
        """Test the string representation of a User."""
        self.assertEqual(str(self.test_user), 'testuser')
    
    def test_to_dict_method(self):
        """Test to_dict method returns expected dictionary."""
        user_dict = self.test_user.to_dict()
        self.assertEqual(user_dict['id'], self.test_user.id)
        self.assertEqual(user_dict['username'], 'testuser')
        self.assertEqual(user_dict['displayName'], 'Test User')