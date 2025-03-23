# Generated by Django 5.1.1 on 2025-03-23 04:45

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_remove_post_tag'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='club',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='post_club', to='core.club'),
        ),
        migrations.AddField(
            model_name='post',
            name='event',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='post_event', to='core.event'),
        ),
        migrations.AddField(
            model_name='post',
            name='misc',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='post_misc', to='core.super'),
        ),
        migrations.AddField(
            model_name='post',
            name='project',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='post_project', to='core.project'),
        ),
        migrations.AddField(
            model_name='post',
            name='tag',
            field=models.ManyToManyField(to='core.tag'),
        ),
    ]
