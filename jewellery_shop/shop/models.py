from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    image = models.ImageField(upload_to='products/')
    
    def __str__(self):
        return self.name



class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.street}, {self.city}, {self.state}, {self.postal_code}, {self.country}"




class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    billing_address = models.TextField()
    shipping_address = models.TextField()
    coupon_applied = models.CharField(max_length=100, null=True, blank=True)
    
    PAYMENT_METHODS = [
        ('CARD', 'Credit/Debit Card'),
        ('PAYPAL', 'PayPal'),
        ('COD', 'Cash on Delivery'),
    ]
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHODS, default='CARD')

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.product.name} - {self.quantity} pcs"


class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    products = models.ManyToManyField(Product, through='CartItem')

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)




class UserInfo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)  
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    phone_number = models.CharField(max_length=20)
    billing_address = models.TextField(blank=True, null=True)
    shipping_address = models.TextField(blank=True, null=True)
    is_admin = models.BooleanField(default=False)  

    def __str__(self):
        return f"{self.user.username}'s Info"


from django.db import models
from django.contrib.auth.models import User

class JewelryCustomization(models.Model):
    JEWELRY_TYPES = [
        ('ring', 'Ring'),
        ('necklace', 'Necklace'),
        ('bracelet', 'Bracelet'),
        ('earrings', 'Earrings'),
    ]

    MATERIALS = [
        ('gold', 'Gold'),
        ('silver', 'Silver'),
        ('platinum', 'Platinum'),
        ('diamond', 'Diamond'),
        ('gemstone', 'Gemstone'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Foreign key to User model
    jewelry_type = models.CharField(max_length=50, choices=JEWELRY_TYPES)
    material = models.CharField(max_length=50, choices=MATERIALS)
    size = models.CharField(max_length=10, blank=True, null=True)  # Optional size for rings/bracelets
    engraving_text = models.CharField(max_length=100, blank=True, null=True)  # Optional engraving
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.jewelry_type} ({self.material}) for {self.user.username}"
