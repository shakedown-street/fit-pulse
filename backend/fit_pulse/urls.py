"""
URL configuration for fit_pulse project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from accounts.views import (
    LoginAPIView,
    LogoutAPIView,
    PasswordChangeAPIView,
    SessionAPIView,
    UserViewSet,
)
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from diet.views import FoodViewSet, FoodLogViewSet
from exercises.views import (
    ExerciseViewSet,
    MetricViewSet,
    PerformanceViewSet,
    WorkoutViewSet,
)
from rest_framework import routers

router = routers.DefaultRouter()
router.register("users", UserViewSet)
router.register("foods", FoodViewSet)
router.register("food-logs", FoodLogViewSet)
router.register("metrics", MetricViewSet)
router.register("exercises", ExerciseViewSet)
router.register("workouts", WorkoutViewSet)
router.register("performances", PerformanceViewSet)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/auth/", include("rest_framework.urls")),
    path("api/login/", LoginAPIView.as_view(), name="login"),
    path("api/logout/", LogoutAPIView.as_view(), name="logout"),
    path("api/session/", SessionAPIView.as_view(), name="session"),
    path(
        "api/password-change/", PasswordChangeAPIView.as_view(), name="password-change"
    ),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
