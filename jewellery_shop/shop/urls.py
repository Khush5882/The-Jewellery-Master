from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .views import ProductViewSet, OrderViewSet ,CartViewSet, LogoutView, UserRegistrationView, UserLoginView

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'cart', CartViewSet, basename='cart')

cart_list = CartViewSet.as_view({'get': 'list', 'post': 'create'})
cart_detail = CartViewSet.as_view({'put': 'update', 'delete': 'destroy'})

urlpatterns = [
    path('api/', include(router.urls)),  
    path('api/cart/', cart_list, name='cart-list'),
    path('api/cart/<int:pk>/', cart_detail, name='cart-detail'),
    path('api/logout/', LogoutView.as_view(), name='logout'),  
    path('api/register/', UserRegistrationView.as_view(), name='register'),
    path('api/login/', UserLoginView.as_view(), name='login'),

]
