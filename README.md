# Digital Queue Management System (Government Offices)

Stack: React (client, later steps) · Node.js + Express · MongoDB (Mongoose) · plain JavaScript

## Run the server

```bash
cd server
cp .env.example .env      # edit MONGO_URI if needed
npm install
npm run seed              # sample office, services, counters, admin + staff users
npm run dev               # http://localhost:5000/api/health
```

Requires a running MongoDB (local install or a free MongoDB Atlas cluster).
