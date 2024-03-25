from django.contrib.auth import get_user_model
from django.db import models

from fit_pulse.mixins import BaseMixin

User = get_user_model()


class Diet(BaseMixin):
    user = models.OneToOneField(User, related_name="diet", on_delete=models.CASCADE)
    calories = models.PositiveIntegerField(default=2000)
    carbs = models.PositiveIntegerField(default=300)
    proteins = models.PositiveIntegerField(default=175)
    fats = models.PositiveIntegerField(default=75)

    def __str__(self):
        return f"{self.user.username} - Diet"

    class Meta:
        verbose_name = "Diet"
        verbose_name_plural = "Diets"


class Food(BaseMixin):
    user = models.ForeignKey(User, related_name="foods", on_delete=models.CASCADE)
    name = models.CharField(max_length=256)
    calories = models.PositiveIntegerField()
    carbs = models.PositiveIntegerField()
    proteins = models.PositiveIntegerField()
    fats = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.user.username} - {self.name}"

    class Meta:
        ordering = ("name",)


class FoodLog(BaseMixin):
    user = models.ForeignKey(User, related_name="food_logs", on_delete=models.CASCADE)
    food = models.ForeignKey(Food, related_name="logs", on_delete=models.CASCADE)
    date = models.DateField()
    servings = models.FloatField()
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - {self.food.name} - {self.date}"

    class Meta:
        ordering = (
            "-date",
            "created_at",
        )
