from django.contrib import admin

from diet.models import Diet, Food, FoodLog


@admin.register(Diet)
class Diet(admin.ModelAdmin):
    list_display = ("user", "calories", "carbs", "proteins", "fats")
    search_fields = ("user",)


@admin.register(Food)
class FoodAdmin(admin.ModelAdmin):
    list_display = ("name", "calories", "carbs", "proteins", "fats")
    search_fields = ("name",)


@admin.register(FoodLog)
class FoodLogAdmin(admin.ModelAdmin):
    list_display = ("food", "user", "date", "servings")
    search_fields = (
        "user",
        "food",
    )
