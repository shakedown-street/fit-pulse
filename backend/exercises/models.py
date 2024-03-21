from django.contrib.auth import get_user_model
from django.db import models
from fit_pulse.mixins import BaseMixin

User = get_user_model()


class Exercise(BaseMixin):
    VALUE_TYPE_CHOICES = (
        ("weight", "Weight"),
        ("reps", "Reps"),
        ("time", "Time"),
        ("bpm", "BPM"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    value_type = models.CharField(max_length=16, choices=VALUE_TYPE_CHOICES)

    class Meta:
        ordering = ("name",)

    def __str__(self):
        return self.name

    def user_performance_count(self, user):
        return Performance.objects.filter(exercise=self, user=user).count()


class Performance(BaseMixin):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    value = models.FloatField()
    date = models.DateField()

    class Meta:
        ordering = (
            "-date",
            "exercise__name",
        )

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.exercise.name} - {self.date}"
