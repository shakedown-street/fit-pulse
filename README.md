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

Users create exercises with a `name` and `metrics` they want to track. They can then log their performance on their exercises and the app will track their improvement on each metric over time.

For example:

- User creates an exercise called `Bicep Curls` with metrics `Weight` and `Repetitions`
- User logs a performance for `Bicep Curls` with `Weight: 100` and `Repetitions: 10`
- User logs another performance for `Bicep Curls` with `Weight: 110` and `Repetitions: 10`
- User can see a graph of their `Weight` and `Repetitions` over time for `Bicep Curls`
- User can also see a summary of their improvement on `Weight` and `Repetitions` over time for `Bicep Curls`

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
