# Generated by Django 4.2.16 on 2024-10-15 08:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('shop', '0009_rename_street_address_address_street_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='address',
            name='user',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
