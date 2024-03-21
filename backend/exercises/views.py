from django_filters import rest_framework as filters
from rest_framework import viewsets

from exercises.filters import PerformanceFilter
from exercises.models import Exercise, Performance
from exercises.permissions import ExercisePermission, PerformancePermission
from exercises.serializers import ExerciseSerializer, PerformanceSerializer


class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = (ExercisePermission,)

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
