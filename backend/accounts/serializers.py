from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        read_only_fields = (
            "id",
            "last_login",
            "is_superuser",
            "username",
            "email",
            "is_staff",
            "is_active",
            "date_joined",
            "is_verified",
            "groups",
            "user_permissions",
        )
        exclude = ("password",)
