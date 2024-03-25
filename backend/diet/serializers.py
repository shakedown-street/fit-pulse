from rest_framework import serializers

from diet.models import Diet, Food, FoodLog


class DietSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diet
        read_only_fields = ("user",)
        exclude = (
            "id",
            "created_at",
            "user",
        )


class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Food
        fields = "__all__"
        read_only_fields = ("user",)

    def validate(self, data):
        data["user"] = self.context["request"].user
        return data


class FoodLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodLog
        fields = "__all__"
        read_only_fields = ("user",)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["food"] = FoodSerializer(instance.food).data
        return data

    def validate_food(self, value):
        if value.user != self.context["request"].user:
            raise serializers.ValidationError("You can only log your own foods.")
        return value

    def validate(self, data):
        data["user"] = self.context["request"].user
        return data
