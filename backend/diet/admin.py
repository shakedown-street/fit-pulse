from django.contrib import admin

from diet.models import Diet, Food, FoodLog, FoodDatabase


@admin.register(FoodDatabase)
class FoodDatabaseAdmin(admin.ModelAdmin):
    list_display = ("id",)
    search_fields = ("id",)


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
    list_display = ("food", "user", "date", "meal_type", "servings")
    search_fields = (
        "user",
        "food",
    )
