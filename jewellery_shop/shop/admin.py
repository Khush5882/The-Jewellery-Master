from django.contrib import admin
from .models import Product, Order, OrderItem, Cart, CartItem

class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock')
    search_fields = ('name',)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1

class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'total_price', 'created_at')
    search_fields = ('user__username',)
    inlines = [OrderItemInline]

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 1

class CartAdmin(admin.ModelAdmin):
    list_display = ('user',)  # Show the user associated with the cart
    search_fields = ('user__username',)  # Enable search by username
    inlines = [CartItemInline]  # Inline cart items for easy management

    def get_queryset(self, request):
        # Allow admin to view all carts
        return super().get_queryset(request)

# Register the models
admin.site.register(Product, ProductAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Cart, CartAdmin)
