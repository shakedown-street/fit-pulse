from django_filters import rest_framework as filters

from diet.models import Food, FoodLog


class FoodFilter(filters.FilterSet):
    search = filters.CharFilter(field_name="name", lookup_expr="icontains")

    class Meta:
        model = Food
        fields = ("search",)


class FoodLogFilter(filters.FilterSet):
    class Meta:
        model = FoodLog
        fields = (
            "food",
            "date",
            "meal_type",
        )
