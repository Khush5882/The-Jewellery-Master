# used chatGpt for the the help in the code (how can i create a jewellery customsiazation code for a website using python django and react)
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('shop', '0011_alter_address_user'),
    ]

    operations = [
        migrations.CreateModel(
            name='JewelryCustomization',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('jewelry_type', models.CharField(choices=[('ring', 'Ring'), ('necklace', 'Necklace'), ('bracelet', 'Bracelet'), ('earrings', 'Earrings')], max_length=50)),
                ('material', models.CharField(choices=[('gold', 'Gold'), ('silver', 'Silver'), ('platinum', 'Platinum'), ('diamond', 'Diamond'), ('gemstone', 'Gemstone')], max_length=50)),
                ('size', models.CharField(blank=True, max_length=10, null=True)),
                ('engraving_text', models.CharField(blank=True, max_length=100, null=True)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
