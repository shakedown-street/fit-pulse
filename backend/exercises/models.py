from django.db import models
from django.contrib.auth import get_user_model

from progress_tracker.mixins import BaseMixin

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

    def user_progress_count(self, user):
        return Progress.objects.filter(exercise=self, user=user).count()


class Progress(BaseMixin):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    value = models.FloatField()
    date = models.DateField()

    class Meta:
        verbose_name = "progress"
        verbose_name_plural = "progress"
        ordering = (
            "-date",
            "exercise__name",
        )

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.exercise.name} - {self.date}"
