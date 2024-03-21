from rest_framework import serializers

from exercises.models import Exercise, Performance


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        read_only_fields = ("user",)
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["performance_count"] = instance.user_performance_count(
            self.context["request"].user
        )
        return data

    def validate(self, data):
        data["user"] = self.context["request"].user
        return data


class PerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Performance
        fields = "__all__"
        read_only_fields = ("user",)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["exercise"] = ExerciseSerializer(
            instance.exercise,
            context=self.context,
        ).data
        return data

    def validate(self, data):
        data["user"] = self.context["request"].user
        return data
