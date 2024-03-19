from exercises.models import Exercise, Progress
from rest_framework import serializers


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        read_only_fields = ("user",)
        fields = "__all__"

    def validate(self, data):
        data["user"] = self.context["request"].user
        return data


class ProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["exercise"] = ExerciseSerializer(instance.exercise).data
        return data
