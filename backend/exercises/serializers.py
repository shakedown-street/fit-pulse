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
    improvement_percent = serializers.SerializerMethodField()

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

    def get_improvement_percent(self, instance):
        previous_performance = (
            Performance.objects.filter(
                user=instance.user, exercise=instance.exercise, date__lt=instance.date
            )
            .order_by("-date")
            .first()
        )

        if previous_performance:
            improvement = instance.value - previous_performance.value
            percent = (improvement / previous_performance.value) * 100
            return percent
        else:
            return 0

    def validate(self, data):
        data["user"] = self.context["request"].user
        return data
