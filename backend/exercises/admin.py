from django.contrib import admin

from exercises.models import Exercise, Performance


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "user",
        "value_type",
    )


@admin.register(Performance)
class PerformanceAdmin(admin.ModelAdmin):
    list_display = (
        "exercise",
        "user",
        "value",
        "date",
    )
