from django.contrib.auth import get_user_model
from django.db import models
from fit_pulse.mixins import BaseMixin, UUIDMixin

User = get_user_model()


class Metric(UUIDMixin):
    name = models.CharField(max_length=256)

    class Meta:
        ordering = ("name",)

    def __str__(self):
        return self.name


class Exercise(BaseMixin):
    user = models.ForeignKey(User, related_name="exercises", on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    metrics = models.ManyToManyField(Metric, related_name="exercises")

    class Meta:
        ordering = ("name",)

    def __str__(self):
        return self.name


class Performance(BaseMixin):
    user = models.ForeignKey(
        User, related_name="performances", on_delete=models.CASCADE
    )
    exercise = models.ForeignKey(
        Exercise, related_name="performances", on_delete=models.CASCADE
    )
    date = models.DateField()

    class Meta:
        ordering = (
            "-date",
            "-created_at",
            "exercise__name",
        )

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.exercise.name} - {self.date}"


class PerformanceMetric(BaseMixin):
    performance = models.ForeignKey(
        Performance, related_name="metrics", on_delete=models.CASCADE
    )
    metric = models.ForeignKey(
        Metric, related_name="performances", on_delete=models.CASCADE
    )
    value = models.FloatField()

    class Meta:
        unique_together = ("performance", "metric")
        ordering = (
            "-performance__date",
            "-performance__created_at",
            "metric__name",
        )

    def __str__(self):
        return f"{self.performance} - {self.metric.name} - {self.value}"
