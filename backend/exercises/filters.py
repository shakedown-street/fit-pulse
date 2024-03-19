from django_filters import rest_framework as filters
from django_filters.widgets import RangeWidget
from exercises.models import Progress


class ProgressFilter(filters.FilterSet):
    date = filters.DateFromToRangeFilter(
        widget=RangeWidget(attrs={"placeholder": "YYYY-MM-DD"})
    )

    class Meta:
        model = Progress
        fields = (
            "date",
            "exercise",
        )
