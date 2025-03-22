# Generated by Django 5.1.6 on 2025-03-22 23:16

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_super_link_tag_club_project_super_links_post_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='super',
            name='leader',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='super_leader', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='super',
            name='users',
            field=models.ManyToManyField(blank=True, null=True, related_name='super_users', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('time_stamp', models.DateField(default=django.utils.timezone.now)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.post')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='SuperUserData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('project', 'project'), ('event', 'event'), ('club', 'club'), ('super', 'super')], default='super', max_length=7)),
                ('super', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='core.super')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
