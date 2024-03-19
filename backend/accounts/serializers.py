from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import gettext_lazy as _
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


class AuthenticationSerializer(serializers.Serializer):
    username = serializers.CharField(label=_("username"), write_only=True)
    password = serializers.CharField(
        label=_("password"),
        style={"input_type": "password"},
        trim_whitespace=False,
        write_only=True,
    )

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        if not username or not password:
            msg = _("Must include 'username' and 'password'.")
            raise serializers.ValidationError(msg, code="authorization")

        user = authenticate(
            request=self.context.get("request"), username=username, password=password
        )

        if not user:
            msg = _("Unable to log in with provided credentials.")
            raise serializers.ValidationError(msg, code="authorization")

        data["user"] = user
        return data
