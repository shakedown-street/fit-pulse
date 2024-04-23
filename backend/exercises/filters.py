from django_filters import rest_framework as filters
from django_filters.widgets import RangeWidget

from exercises.models import Exercise, Performance


class ExerciseFilter(filters.FilterSet):
    search = filters.CharFilter(field_name="name", lookup_expr="icontains")

    class Meta:
        model = Exercise
        fields = ("search",)


class PerformanceFilter(filters.FilterSet):
    date = filters.DateFromToRangeFilter(
        widget=RangeWidget(attrs={"placeholder": "YYYY-MM-DD"})
    )

    class Meta:
        model = Performance
        fields = (
            "date",
            "exercise",
        )
