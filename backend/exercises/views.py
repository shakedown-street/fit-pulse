from django_filters import rest_framework as filters
from exercises.filters import ProgressFilter
from exercises.models import Exercise, Progress
from exercises.permissions import ExercisePermission, ProgressPermission
from exercises.serializers import ExerciseSerializer, ProgressSerializer
from rest_framework import viewsets


class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = (ExercisePermission,)

    def get_queryset(self):
        qs = self.queryset
        qs = qs.filter(user=self.request.user)
        return qs


class ProgressViewSet(viewsets.ModelViewSet):
    queryset = Progress.objects.all()
    serializer_class = ProgressSerializer
    permission_classes = (ProgressPermission,)
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = ProgressFilter

    def get_queryset(self):
        qs = self.queryset
        qs = qs.filter(exercise__user=self.request.user)
        return qs
