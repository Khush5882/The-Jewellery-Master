from .models import Product, Order, OrderItem
from .serializers import ProductSerializer, OrderSerializer, OrderItemSerializer, AddressSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Cart, CartItem, User, Address
from .serializers import CartSerializer, CartItemSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import logout
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer
from rest_framework import generics, permissions
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .serializers import SuperUserRegistrationSerializer
from rest_framework.permissions import AllowAny
from .models import UserInfo
from .serializers import UserInfoSerializer
from django.db.models import Sum ,Count
from django.db.models.functions import TruncDate
from .models import JewelryCustomization
from .serializers import JewelryCustomizationSerializer
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer



# Order List/Create View
class OrderViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request):
        # Extract order data from the request
        order_items_data = request.data.get('order_items', [])

        # Calculate total price based on the order items
        total_price = 0
        for item_data in order_items_data:
            product_id = item_data.get('product')
            quantity = item_data.get('quantity', 1)

            # Fetch the product
            product = get_object_or_404(Product, id=product_id)

            # Calculate total price
            total_price += product.price * quantity  # Assuming Product has a price field

        # Prepare the order data
        order_data = {
            'user': request.user,
            'total_price': total_price,
            'name': request.data.get('name'),
            'phone_number': request.data.get('phone_number'),
            'billing_address': request.data.get('billing_address'),
            'shipping_address': request.data.get('shipping_address'),
            'coupon_applied': request.data.get('coupon_applied'),
            'payment_method': request.data.get('payment_method', 'CARD'),
        }
        # Create the order
        order = Order.objects.create(**order_data)

        # Create order items
        order_items = []
        for item_data in order_items_data:
            product = get_object_or_404(Product, id=item_data['product'])
            order_item = OrderItem.objects.create(order=order, product=product, quantity=item_data['quantity'])
            order_items.append(order_item)

        # Send order confirmation email
        self.send_order_confirmation_email(order, order_items)

        # Serialize the order data
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



    def send_order_confirmation_email(self, order, order_items):
        print(order, order_items)
        items_details = "\n".join(
            [f"{item.product.name} (x{item.quantity}) - ${item.product.price * item.quantity}"
            for item in order_items]
        )
        subject = f"Order Confirmation - #{order.id}"
        message = (
            f"Thank you for your order, {order.name}!\n\n"
            f"Order ID: {order.id}\n"
            f"Total Price: ${order.total_price}\n\n"
            f"Order Details:\n{items_details}\n\n"
            f"Shipping Address: {order.shipping_address}\n"
            f"Billing Address: {order.billing_address}\n\n"
            "Thank you for shopping with us!"
        )

        # Retrieve the user's email based on username
        user = User.objects.get(username=order.user.username)
        recipient_email = user.email
        print(recipient_email)

        # Send the email
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [recipient_email],
            fail_silently=False,
        )


    def list(self, request):
        # List all orders for the authenticated user
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        # Retrieve a specific order by ID
        order = get_object_or_404(Order, pk=pk, user=request.user)
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    def update(self, request, pk=None):
        # Update a specific order by ID
        order = get_object_or_404(Order, pk=pk, user=request.user)
        serializer = OrderSerializer(order, data=request.data, partial=True)  # Allow partial updates
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        # Delete a specific order by ID
        order = get_object_or_404(Order, pk=pk, user=request.user)
        order.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# If you want to create a separate view for addresses
class AddressListCreateView(generics.ListCreateAPIView):
    """
    View to list all addresses or create a new address.
    """
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return addresses belonging to the authenticated user
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Associate the address with the authenticated user
        serializer.save(user=self.request.user)

class AddressDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    permission_classes = [IsAuthenticated]



class CartViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        try:
            # Fetch the cart, ensuring that only one cart exists for the user
            cart = Cart.objects.get(user=request.user)
            serializer = CartSerializer(cart)
            return Response(serializer.data)
        except Cart.DoesNotExist:
            return Response({'message': 'Cart not found for user'}, status=status.HTTP_404_NOT_FOUND)
        except MultipleObjectsReturned:
            return Response({'error': 'Multiple carts found for this user, which is not allowed.'}, status=status.HTTP_400_BAD_REQUEST)

    def create(self, request):
        # POST request to add an item to the cart
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        product = get_object_or_404(Product, id=product_id)

        # Ensure only one cart per user
        try:
            cart = Cart.objects.get(user=request.user)
        except Cart.DoesNotExist:
            # If no cart exists, create a new one
            cart = Cart.objects.create(user=request.user)

        # Check if cart already has the item, and if so, update quantity
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += quantity
        cart_item.save()

        return Response({'message': 'Product added to cart'}, status=status.HTTP_201_CREATED)

    def update(self, request, pk=None):
        # Use pk instead of product_id
        cart = get_object_or_404(Cart, user=request.user)
        cart_item = get_object_or_404(CartItem, cart=cart, product__id=pk)

        quantity = request.data.get('quantity')
        if quantity is not None and isinstance(quantity, int) and quantity > 0:
            cart_item.quantity = quantity
            cart_item.save()
            return Response({'message': 'Quantity updated'}, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid quantity provided'}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        try:
            cart = get_object_or_404(Cart, user=request.user)  # Get the cart for the logged-in user
            cart_item = get_object_or_404(CartItem, cart=cart, product__id=pk)  # Get the cart item associated with the product id
            cart_item.delete()  # Delete the cart item
            return Response(status=status.HTTP_204_NO_CONTENT)  # Successfully deleted
        except CartItem.DoesNotExist:  # Ensure you're checking CartItem, not Cart
            return Response(status=status.HTTP_404_NOT_FOUND)  # Return 404 if no cart item found
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  # Handle any unexpected errors

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)  
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)


class UserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        # Save the new user instance
        user = serializer.save()
        
        # Send welcome email
        self.send_welcome_email(user)

    def send_welcome_email(self, user):
        # Prepare email content
        subject = "Welcome to Jewellery Masters!"
        message = (
            f"Hello {user.username},\n\n"
            "Thank you for registering on our platform. We’re excited to have you onboard!\n\n"
            "If you have any questions, feel free to reach out.\n\n"
            "Best regards,\n"
            "The Team Jeweellery Masters"
        )

        # Retrieve user's email
        recipient_email = user.email

        # Send the email
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [recipient_email],
            fail_silently=False,
        )

class UserLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {'error': 'Username and password are required.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user = authenticate(username=username, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            is_admin = user.is_superuser
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'is_admin': is_admin,
            })
        
        return Response(
            {'error': 'Invalid username or password.'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Check if UserInfo exists
        try:
            user_info = user.userinfo
        except UserInfo.DoesNotExist:
            return Response({'detail': 'UserInfo does not exist for this user.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserInfoSerializer(user_info)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user

        # Check if UserInfo exists
        try:
            user_info = user.userinfo
        except UserInfo.DoesNotExist:
            user_info = UserInfo(user=user)  # Create new UserInfo if it doesn't exist

        serializer = UserInfoSerializer(user_info, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class SuperUserRegistrationView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = SuperUserRegistrationSerializer
    permission_classes = [AllowAny]
    

class JewelryCustomizationViewSet(viewsets.ModelViewSet):
    queryset = JewelryCustomization.objects.all()
    serializer_class = JewelryCustomizationSerializer
    permission_classes = [IsAuthenticated]  # Ensure user is authenticated

    def perform_create(self, serializer):
        # Save the customization and assign the user
        customization = serializer.save(user=self.request.user)
        
        # Send the customization confirmation email
        self.send_customization_confirmation_email(customization)

    def send_customization_confirmation_email(self, customization):
        # Prepare email content
        subject = f"Jewelry Customization Confirmation - #{customization.id}"
        message = (
            f"Hello {customization.user.username},\n\n"
            f"Thank you for your jewelry customization request!\n\n"
            f"Customization ID: {customization.id}\n"
            f"Jewelry Type: {customization.get_jewelry_type_display()}\n"
            f"Material: {customization.get_material_display()}\n"
            f"Size: {customization.size or 'N/A'}\n"
            f"Engraving Text: {customization.engraving_text or 'N/A'}\n"
            f"Price: ${customization.price}\n\n"
            "Our team will begin processing your request, and we’ll keep you updated.\n\n"
            "Thank you for choosing us for your custom jewelry needs!"
        )

        # Retrieve user's email
        recipient_email = customization.user.email

        # Send email
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [recipient_email],
            fail_silently=False,
        )








@api_view(['GET'])
def jewelry_options(request):
    jewelry_types = ['ring', 'necklace', 'bracelet', 'earrings']
    materials = ['gold', 'silver', 'platinum']
    return Response({
        'jewelry_types': jewelry_types,
        'materials': materials
    })


@api_view(['GET'])
def get_insights(request):
    
    insights = (
        Order.objects
        .annotate(order_date=TruncDate('created_at'))  # Assuming 'created_at' is the timestamp field
        .values('order_date')
        .annotate(total_revenue=Sum('total_price'), total_orders=Count('id'))
        .order_by('order_date')
    )
    
    # Prepare data for response
    data = {
        'insights': list(insights)
    }
    return Response(data)


class AllOrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # List all orders
        orders = Order.objects.all()  # If you want all orders, use .all(), or filter based on certain conditions
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)