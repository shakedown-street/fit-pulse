from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from progress_tracker.mixins import BaseMixin


def user_image_upload_to(user, filename):
    return f"users/{user.id}/image{filename}"


class User(AbstractUser, BaseMixin):
    image = models.ImageField(upload_to=user_image_upload_to, blank=True, null=True)
    is_verified = models.BooleanField(
        _("verified"),
        default=False,
        help_text=_("Designates whether this user has verified their email."),
    )
