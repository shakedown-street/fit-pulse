from django.contrib import admin
from exercises.models import Exercise, Progress


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "value_type",
    )


@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = (
        "exercise",
        "user",
        "value",
        "date",
    )
