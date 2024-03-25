from diet.serializers import DietSerializer
from django.contrib.auth import authenticate, get_user_model, update_session_auth_hash
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()


def validate_passwords_match(password1, password2):
    if password1 != password2:
        raise serializers.ValidationError("The two password fields didn't match.")


class PasswordField(serializers.CharField):
    def __init__(self, **kwargs):
        kwargs.setdefault("style", {})
        kwargs["style"] = {"input_type": "password"}
        kwargs["trim_whitespace"] = False
        kwargs["write_only"] = True
        super().__init__(**kwargs)


class UserSerializer(serializers.ModelSerializer):
    calories = serializers.IntegerField(required=False, write_only=True)
    carbs = serializers.IntegerField(required=False, write_only=True)
    proteins = serializers.IntegerField(required=False, write_only=True)
    fats = serializers.IntegerField(required=False, write_only=True)

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

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["full_name"] = instance.get_full_name()
        if instance.image and self.context.get("request"):
            data["image"] = self.context.get("request").build_absolute_uri(
                instance.image.url
            )
        if instance.diet:
            data["diet"] = DietSerializer(instance.diet).data
        return data

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)

        if "calories" in validated_data:
            instance.diet.calories = validated_data["calories"]
            instance.diet.save()

        if "carbs" in validated_data:
            instance.diet.carbs = validated_data["carbs"]
            instance.diet.save()

        if "proteins" in validated_data:
            instance.diet.proteins = validated_data["proteins"]
            instance.diet.save()

        if "fats" in validated_data:
            instance.diet.fats = validated_data["fats"]
            instance.diet.save()

        return instance


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
        validate_passwords_match(data["password1"], data["password2"])
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


class PasswordChangeSerializer(serializers.Serializer):
    current_password = PasswordField(label="Current password")
    new_password1 = PasswordField(label="New password")
    new_password2 = PasswordField(label="New password (again)")

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("The current password was incorrect.")

    def validate(self, data):
        validate_passwords_match(data["new_password1"], data["new_password2"])
        validate_password(data["new_password1"])
        return data

    def save(self):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password1"])
        user.save()

        update_session_auth_hash(self.context["request"], user)

        return user
