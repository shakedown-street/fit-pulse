from django_filters import rest_framework as filters
from rest_framework import viewsets

from exercises.filters import ExerciseFilter, PerformanceFilter
from exercises.models import Exercise, Metric, Performance
from exercises.permissions import ExercisePermission, PerformancePermission
from exercises.serializers import (
    ExerciseSerializer,
    MetricSerializer,
    PerformanceSerializer,
)


class MetricViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Metric.objects.all()
    serializer_class = MetricSerializer


class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = (ExercisePermission,)
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = ExerciseFilter

    def get_queryset(self):
        qs = self.queryset
        qs = qs.filter(user=self.request.user)
        return qs


class PerformanceViewSet(viewsets.ModelViewSet):
    queryset = Performance.objects.all()
    serializer_class = PerformanceSerializer
    permission_classes = (PerformancePermission,)
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = PerformanceFilter

    def get_queryset(self):
        qs = self.queryset
        qs = qs.filter(user=self.request.user)
        return qs
