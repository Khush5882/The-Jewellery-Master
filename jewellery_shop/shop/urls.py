from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .views import ProductViewSet,CartViewSet, LogoutView, UserRegistrationView, UserLoginView, OrderViewSet, AddressListCreateView, AddressDetailView
from .views import UserProfileView
from .views import SuperUserRegistrationView
from .views import JewelryCustomizationViewSet



router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'cart', CartViewSet, basename='cart')
cart_list = CartViewSet.as_view({'get': 'list', 'post': 'create'})
cart_detail = CartViewSet.as_view({'put': 'update', 'delete': 'destroy'})
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'jewelry_customization', JewelryCustomizationViewSet)


urlpatterns = [
    path('api/', include(router.urls)),  
    path('api/cart/', cart_list, name='cart-list'),
    path('api/cart/<int:pk>/', cart_detail, name='cart-detail'),
    path('api/logout/', LogoutView.as_view(), name='logout'),  
    path('api/register/', UserRegistrationView.as_view(), name='register'),
    path('api/login/', UserLoginView.as_view(), name='login'),
    path('api/profile/', UserProfileView.as_view(), name='user-profile'),
    path('api/register-superuser/', SuperUserRegistrationView.as_view(), name='register-superuser'),
    path('addresses/', AddressListCreateView.as_view(), name='address-list-create'),
    path('addresses/<int:pk>/', AddressDetailView.as_view(), name='address-detail'),

]
