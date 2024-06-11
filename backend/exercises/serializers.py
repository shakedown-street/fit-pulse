from rest_framework import serializers

from exercises.models import Exercise, Metric, Performance, PerformanceMetric, Workout


class MetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = Metric
        fields = "__all__"


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        read_only_fields = ("user",)
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["metrics"] = MetricSerializer(instance.metrics, many=True).data
        return data

    def validate(self, data):
        data["user"] = self.context["request"].user
        return data


class WorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workout
        read_only_fields = ("user",)
        fields = "__all__"

    def validate_exercises(self, value):
        # Check if all exercises belong to the user
        user = self.context["request"].user
        for exercise in value:
            if exercise.user != user:
                raise serializers.ValidationError(
                    "Exercise does not belong to the user."
                )
        return value

    def validate(self, data):
        data["user"] = self.context["request"].user
        return data


class PerformanceMetricSerializer(serializers.ModelSerializer):
    improvement_percent = serializers.SerializerMethodField()

    class Meta:
        model = PerformanceMetric
        fields = "__all__"
        read_only_fields = ("performance",)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["metric"] = MetricSerializer(instance.metric).data
        return data

    def get_improvement_percent(self, instance):
        previous_performance = (
            Performance.objects.exclude(id=instance.performance.id)
            .filter(
                user=instance.performance.user,
                exercise=instance.performance.exercise,
                date__lte=instance.performance.date,
                created_at__lte=instance.performance.created_at,
            )
            .order_by("-date", "-created_at")
            .first()
        )
        previous_performance_metric = (
            previous_performance.metrics.filter(metric=instance.metric).first()
            if previous_performance
            else None
        )

        if previous_performance_metric:
            if previous_performance_metric.value == 0:
                return 0
            improvement = instance.value - previous_performance_metric.value
            percent = (improvement / previous_performance_metric.value) * 100
            return percent
        else:
            return 0


class PerformanceSerializer(serializers.ModelSerializer):
    metrics = PerformanceMetricSerializer(many=True)

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

    def validate_metrics(self, value):
        # Check if all metrics are unique
        metrics = [metric["metric"] for metric in value]
        if len(metrics) != len(set(metrics)):
            raise serializers.ValidationError("Metrics must be unique.")
        return value

    def validate(self, data):
        data["user"] = self.context["request"].user
        return data

    def create(self, validated_data):
        metrics_data = validated_data.pop("metrics")
        performance = Performance.objects.create(**validated_data)
        for metric_data in metrics_data:
            PerformanceMetric.objects.create(performance=performance, **metric_data)
        return performance

    def update(self, instance, validated_data):
        metrics_data = validated_data.pop("metrics")
        instance = super().update(instance, validated_data)

        instance.metrics.all().delete()

        for metric_data in metrics_data:
            PerformanceMetric.objects.create(performance=instance, **metric_data)

        return instance
