from rest_framework import permissions


class FoodPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if obj.user == request.user:
            return True

        food_databases = request.user.food_databases.all()

        for food_database in food_databases:
            if obj.user in food_database.users.all():
                return True

        return False


class FoodLogPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
