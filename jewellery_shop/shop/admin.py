from django.contrib import admin
from .models import Product, Order, OrderItem, Cart, CartItem, UserInfo

class UserInfoAdmin(admin.ModelAdmin):
    list_display = ('user', 'first_name', 'last_name', 'phone_number', 'shipping_address', 'is_admin')
    
    search_fields = ('user__username', 'phone_number', 'user__first_name', 'user__last_name')

    def get_queryset(self, request):
        return super().get_queryset(request)

   
    def get_readonly_fields(self, request, obj=None):
        if not request.user.is_superuser:
            return ['is_admin']  
        return []




# Admin for Product model
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock')
    search_fields = ('name',)

# Inline for OrderItems in the Order view
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

# Admin for Order model
class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_price', 'created_at')
    search_fields = ('user__username',)
    inlines = [OrderItemInline]

# Inline for CartItems in the Cart view
class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 1

# Admin for Cart model
class CartAdmin(admin.ModelAdmin):
    list_display = ('user',)
    search_fields = ('user__username',)
    inlines = [CartItemInline]

# Register all models in the admin
admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Cart, CartAdmin)
admin.site.register(UserInfo, UserInfoAdmin)  # Register UserInfo model
