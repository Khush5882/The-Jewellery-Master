from rest_framework import serializers
from .models import Order, OrderItem, Product
from .models import Cart, CartItem
from django.contrib.auth.models import User
from .models import UserInfo
from django.conf import settings 



class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock', 'image']

class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = OrderItem
        fields = ['product', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  

    order_items = OrderItemSerializer(many=True, source='orderitem_set')

    class Meta:
        model = Order
        fields = ['id', 'user', 'total_price', 'created_at', 'order_items']
        

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = CartItem
        fields = ['product', 'quantity']

class CartSerializer(serializers.ModelSerializer):
    products = CartItemSerializer(source='cartitem_set', many=True)

    class Meta:
        model = Cart
        fields = ['user', 'products']
        
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password')

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user




# Serializer for UserInfo model
class UserInfoSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # Display the username (optional)

    class Meta:
        model = UserInfo
        fields = [
            'user', 'first_name', 'last_name', 'phone_number', 
            'billing_address', 'shipping_address', 'is_admin'
        ]
        read_only_fields = ['is_admin']

        
        
        
class SuperUserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    secret_key = serializers.CharField(write_only=True)  

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'secret_key']

    def validate(self, attrs):
        # Check if the provided secret key is correct
        if attrs['secret_key'] != settings.ADMIN_SECRET_KEY:
            raise serializers.ValidationError("Invalid secret key.")
        return attrs

    def create(self, validated_data):
        # Remove the secret_key from the validated_data before creating the user
        validated_data.pop('secret_key')
        
        # Create the superuser using Django's create_superuser method
        superuser = User.objects.create_superuser(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        # Create the associated UserInfo object and set is_admin to True
        UserInfo.objects.create(user=superuser, is_admin=True)
        return superuser
