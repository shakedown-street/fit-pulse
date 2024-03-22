from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()


class PasswordField(serializers.CharField):
    def __init__(self, **kwargs):
        kwargs.setdefault("style", {})
        kwargs["style"] = {"input_type": "password"}
        kwargs["trim_whitespace"] = False
        kwargs["write_only"] = True
        super().__init__(**kwargs)


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


class UserCreateSerializer(serializers.Serializer):
    username = serializers.CharField(label="Username", max_length=150)
    email = serializers.EmailField(label="Email")
    password1 = PasswordField(label="Password")
    password2 = PasswordField(label="Password (again)")

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "A user with that username already exists."
            )
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def validate(self, data):
        if data["password1"] != data["password2"]:
            raise serializers.ValidationError("The two password fields didn't match.")
        validate_password(data["password1"])
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password1"],
        )
        return user


class AuthenticationSerializer(serializers.Serializer):
    username = serializers.CharField(label="Username", write_only=True)
    password = PasswordField(label="Password")

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        user = authenticate(
            request=self.context.get("request"), username=username, password=password
        )

        if not user:
            raise serializers.ValidationError(
                "Unable to log in with provided credentials.", code="authorization"
            )

        data["user"] = user
        return data
