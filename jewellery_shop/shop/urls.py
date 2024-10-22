from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProductViewSet,
    CartViewSet,
    LogoutView,
    UserRegistrationView,
    UserLoginView,
    OrderViewSet,
    AddressListCreateView,
    AddressDetailView,
    UserProfileView,
    SuperUserRegistrationView,
    JewelryCustomizationViewSet,
    jewelry_options,
    get_insights  # Import the get_insights view
)

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'jewelry_customization', JewelryCustomizationViewSet)

# URL patterns
urlpatterns = [
    path('api/', include(router.urls)),
    path('api/logout/', LogoutView.as_view(), name='logout'),  
    path('api/register/', UserRegistrationView.as_view(), name='register'),
    path('api/login/', UserLoginView.as_view(), name='login'),
    path('api/profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/register-superuser/', SuperUserRegistrationView.as_view(), name='register-superuser'),
    path('api/addresses/', AddressListCreateView.as_view(), name='address-list-create'),
    path('api/addresses/<int:pk>/', AddressDetailView.as_view(), name='address-detail'),
    path('api/jewelry_options/', jewelry_options, name='jewelry-options'),
    path('api/insights/', get_insights, name='get-insights'),  # Add the insights endpoint
]

# Include cart list and detail endpoints as needed (if not already included in the router)
cart_list = CartViewSet.as_view({'get': 'list', 'post': 'create'})
cart_detail = CartViewSet.as_view({'put': 'update', 'delete': 'destroy'})

# You can also include the following lines to define the cart endpoints explicitly if needed
urlpatterns += [
    path('api/cart/', cart_list, name='cart-list'),
    path('api/cart/<int:pk>/', cart_detail, name='cart-detail'),
]
