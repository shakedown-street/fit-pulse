# Generated by Django 4.2 on 2024-04-02 06:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("diet", "0005_fooddatabase"),
    ]

    operations = [
        migrations.AddField(
            model_name="foodlog",
            name="meal_type",
            field=models.CharField(
                blank=True,
                choices=[
                    ("breakfast", "Breakfast"),
                    ("lunch", "Lunch"),
                    ("dinner", "Dinner"),
                    ("snack", "Snack"),
                ],
                max_length=16,
            ),
        ),
    ]
