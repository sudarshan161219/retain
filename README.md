# Retain 🧾

A self-hosted, privacy-first Client & Invoice Management tool tailored for freelancers.
Built as a Monorepo with **React**, **Node.js**, **Prisma**, and **PostgreSQL**. Fully Dockerized for easy deployment.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-green.svg)

## 🎥 Demo

https://github.com/user-attachments/assets/458a1b2b-5d1e-445f-a181-dd7d4595d9b2

## 🚀 Quick Start (Docker)

The easiest way to run Retain is using Docker. You don't need to install Node or Postgres on your machine.

### 1. Clone the Repository

```bash
git clone [https://github.com/sudarshan161219/retain.git](https://github.com/sudarshan161219/retain.git)
cd retain-monorepo

```

### 2. Setup Environment Variables

Copy the example configuration file:

```bash
cp .env.example .env

```

_(Optional: Open `.env` and change the database password if you wish, but the defaults work out of the box.)_

### 3. Run the App

Start the database, backend, and frontend with one command:

```bash
docker-compose up -d

```

### 4. Access the App

- **Frontend (App):** [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
- **Backend (API):** [http://localhost:8080](https://www.google.com/search?q=http://localhost:8080)

---

## 🛠 Tech Stack

- **Frontend:** React, Tailwind CSS, Nginx (for serving production build)
- **Backend:** Node.js, Express, Socket.io
- **Database:** PostgreSQL, Prisma ORM
- **DevOps:** Docker, Docker Compose

---

## 📂 Project Structure

```bash
retain-monorepo/
├── backend/            # Node.js API & Prisma Migrations
├── frontend/           # React SPA
├── docker-compose.yml  # Orchestration config
└── .env                # Environment variables

```

---

## ⚙️ Configuration (.env)

| Variable            | Description              | Default (Docker)   |
| ------------------- | ------------------------ | ------------------ |
| `POSTGRES_USER`     | Database User            | `retain_user`      |
| `POSTGRES_PASSWORD` | Database Password        | `password`         |
| `POSTGRES_DB`       | Database Name            | `retain_db`        |
| `DATABASE_URL`      | Prisma Connection String | `postgresql://...` |
| `PORT`              | Backend Port             | `8080`             |

---

## 🐛 Troubleshooting

### "Database migration failed" or "Relation does not exist"

The backend container is designed to run migrations automatically on startup. If it fails:

1. Check the logs: `docker-compose logs backend`
2. Reset the database (WARNING: Deletes data):

```bash
docker-compose down -v
docker-compose up -d

```

### "Connection Refused" on Localhost:3000

1. Ensure the containers are running: `docker-compose ps`
2. If the frontend container exited, check logs: `docker-compose logs frontend`

### Updating the Schema

If you change `schema.prisma` during development:

1. Stop containers.
2. Uncomment the ports section in `docker-compose.yml` for the db.
3. Run: `npx prisma migrate dev` locally.
4. Rebuild: `docker-compose up -d --build backend`

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)
