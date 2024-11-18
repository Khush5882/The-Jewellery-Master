from rest_framework import serializers
from .models import (
    Order, OrderItem, Product, Cart, CartItem, Address, 
    UserInfo, JewelryCustomization, Category, SubCategory, Tag
)
from django.contrib.auth.models import User
from django.conf import settings


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']


class SubCategorySerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'description', 'category', 'category_name']


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class ProductSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), required=False)
    sub_category = serializers.PrimaryKeyRelatedField(queryset=SubCategory.objects.all(), required=False)
    tags = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True, required=False)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'description', 'price', 'stock', 
            'image', 'category', 'sub_category', 'tags'
        ]

    def create(self, validated_data):
        # Extract tags data from validated_data
        tags_data = validated_data.pop('tags', None)
        
        # Create the product instance
        product = Product.objects.create(**validated_data)
        
        # Set the tags for the product if provided
        if tags_data:
            product.tags.set(tags_data)
        
        return product


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'street', 'city', 'state', 'postal_code', 'country']

    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['user'] = request.user
        return super().create(validated_data)


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    order_items = OrderItemSerializer(source='orderitem_set', many=True)

    class Meta:
        model = Order
        fields = [
            'id', 'user', 'total_price', 'name', 'phone_number', 
            'billing_address', 'shipping_address', 'coupon_applied', 
            'payment_method', 'order_items', 'created_at'
        ]

    def create(self, validated_data):
        order_items_data = validated_data.pop('orderitem_set', [])
        order = Order.objects.create(**validated_data)
        for item_data in order_items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'quantity']


class CartSerializer(serializers.ModelSerializer):
    products = CartItemSerializer(source='cartitem_set', many=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'products']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


class UserInfoSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

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
        if attrs['secret_key'] != settings.ADMIN_SECRET_KEY:
            raise serializers.ValidationError("Invalid secret key.")
        return attrs

    def create(self, validated_data):
        validated_data.pop('secret_key')
        superuser = User.objects.create_superuser(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        UserInfo.objects.create(user=superuser, is_admin=True)
        return superuser


class JewelryCustomizationSerializer(serializers.ModelSerializer):
    creator_name = serializers.SerializerMethodField()

    class Meta:
        model = JewelryCustomization
        fields = [
            'id', 'jewelry_type', 'material', 'size', 'engraving_text', 
            'price', 'created_at', 'creator_name'
        ]
        read_only_fields = ['created_at']

    def get_creator_name(self, obj):
        return obj.user.username
