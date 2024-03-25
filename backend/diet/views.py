from django_filters import rest_framework as filters
from rest_framework import viewsets

from diet.models import Food, FoodLog
from diet.filters import FoodFilter, FoodLogFilter
from diet.permissions import FoodLogPermission, FoodPermission
from diet.serializers import FoodLogSerializer, FoodSerializer


class FoodViewSet(viewsets.ModelViewSet):
    queryset = Food.objects.all()
    serializer_class = FoodSerializer
    permission_classes = (FoodPermission,)
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = FoodFilter

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class FoodLogViewSet(viewsets.ModelViewSet):
    queryset = FoodLog.objects.all()
    serializer_class = FoodLogSerializer
    permission_classes = (FoodLogPermission,)
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = FoodLogFilter

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
