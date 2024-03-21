# FitPulse

## Backend

- [Django](https://www.djangoproject.com/)
- [Django Rest Framework](https://www.django-rest-framework.org/)

## Frontend

- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Radix UI](https://radix-ui.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [SCSS](https://sass-lang.com/)
- [Vite](https://vitejs.dev/)

## How it works

User's create exercises, with a `name` and a `value_type` (e.g. `time`, `weight`, `reps`, `bpm`). `value_type` is a metric that they want to track their progress on. They can then log their performance however often they want and the app will track their improvement over time.

## How to run

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm start
```
