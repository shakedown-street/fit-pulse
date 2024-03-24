from django.contrib import admin

from exercises.models import Exercise, Metric, Performance, PerformanceMetric


@admin.register(Metric)
class MetricAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "user",
    )


class PerformanceMetricInline(admin.TabularInline):
    model = PerformanceMetric
    extra = 0


@admin.register(Performance)
class PerformanceAdmin(admin.ModelAdmin):
    list_display = (
        "exercise",
        "user",
        "date",
    )
    inlines = (PerformanceMetricInline,)
