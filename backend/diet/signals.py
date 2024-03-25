from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from diet.models import Diet

User = get_user_model()


@receiver(post_save, sender=User)
def create_user_diet(sender, instance, created, **kwargs):
    if created:
        Diet.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_diet(sender, instance, **kwargs):
    instance.diet.save()
