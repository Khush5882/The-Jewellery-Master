from rest_framework import serializers
from .models import Order, OrderItem, Product
from .models import Cart, CartItem, Address
from django.contrib.auth.models import User
from .models import UserInfo
from django.conf import settings 
from .models import JewelryCustomization


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock', 'image']
        
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['street', 'city', 'state', 'postal_code', 'country']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['user'] = request.user  # Set the authenticated user
        return super().create(validated_data)



class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['product', 'quantity']  # Adjust fields as necessary

class OrderSerializer(serializers.ModelSerializer):
    order_items = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = ['id', 'user', 'total_price', 'name', 'phone_number', 'billing_address', 'shipping_address', 'coupon_applied', 'payment_method', 'order_items', 'created_at']

    def get_order_items(self, obj):
        # Retrieve order items related to this order
        order_items = obj.orderitem_set.all()  # 'orderitem_set' gets all related OrderItem instances
        return OrderItemSerializer(order_items, many=True).data

    def create(self, validated_data):
        order_items_data = validated_data.pop('order_items', [])
        order = Order.objects.create(**validated_data)  # Create the order
        for item_data in order_items_data:
            OrderItem.objects.create(order=order, **item_data)  # Create order items
        return order

    
    
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
        user.set_password(validated_data['password'])  
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




class JewelryCustomizationSerializer(serializers.ModelSerializer):
    creator_name = serializers.SerializerMethodField()  # Add this line for creator's name

    class Meta:
        model = JewelryCustomization
        fields = ['jewelry_type', 'material', 'size', 'engraving_text', 'price', 'created_at', 'creator_name']  # Include creator_name
        read_only_fields = ['created_at']  # Optional, if you want to keep this as read-only

    def get_creator_name(self, obj):
        return obj.user.username