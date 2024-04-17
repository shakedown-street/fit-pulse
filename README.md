# FitPulse

FitPulse is a diet and exercise tracking web app. It allows users to define exercises and track performance on those exercises over time.
It also allows users to create a database of foods and track their daily caloric and macro nutrient intake.

There is a free [official site](https://fitpulse.cc),
and the code is licensed under the BSD 3-Clause License, so you are free to host your own version of the site.

## Features

### Diet

- Create a database of foods

![Create Food](https://github.com/shakedown-street/fit-pulse/blob/main/images/create-food.png)

- Track daily food intake

![Food Log](https://github.com/shakedown-street/fit-pulse/blob/main/images/food-log.png)

- Daily dashboard with caloric and macro nutrient intake

![Diet Dashboard](https://github.com/shakedown-street/fit-pulse/blob/main/images/diet.png)

### Exercise

- Define exercises, with metrics that can be tracked over time

![Create Exercise](https://github.com/shakedown-street/fit-pulse/blob/main/images/create-exercise.png)

- Track performance on exercises when you complete a workout

![Log Performance](https://github.com/shakedown-street/fit-pulse/blob/main/images/log-performance.png)

- View improvement on metrics over time

![Log Performance](https://github.com/shakedown-street/fit-pulse/blob/main/images/exercise.png)

## Development

### Backend

- [Django](https://www.djangoproject.com/)
- [Django Rest Framework](https://www.django-rest-framework.org/)

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

- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- [Radix UI](https://radix-ui.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [SCSS](https://sass-lang.com/)
- [Vite](https://vitejs.dev/)

```bash
cd frontend
npm install
npm start
```
