📊 Expense Tracker

A simple but powerful Expense Tracker web app to record, manage, and analyze your daily expenses.
Built with Node.js + Express, MySQL (XAMPP), and a clean frontend using HTML, CSS, and Chart.js.

🚀 Features

➕ Add expenses (name, amount, category, date)

✏️ Edit / Delete expenses

🔍 Search expenses by keyword (name/category/date)

📅 Analysis Dashboard

Month-wise stacked bar chart (per category)

Week-wise bar chart

Category-wise pie chart

📤 Export charts as PNG images

🎨 Responsive UI with modern design

💾 Stores data in MySQL database (via XAMPP / phpMyAdmin)

👤 Currently supports single user

📂 Project Structure
expense-tracker/
├─ client/
│  ├─ index.html      # Frontend (UI)
│  ├─ style.css       # Styling
│  └─ app.js          # Frontend JS logic
├─ server/
│  ├─ index.js        # Express.js backend
│  ├─ package.json    # Node.js dependencies
│  └─ .env.example    # Environment variables
├─ db.sql             # MySQL schema
└─ README.md          # Documentation

🛠️ Tech Stack

Frontend: HTML, CSS, Vanilla JS, Chart.js

Backend: Node.js, Express.js

Database: MySQL (XAMPP + phpMyAdmin)

Other: dotenv, cors, mysql2

⚙️ Setup Instructions
1. Install Prerequisites

Node.js
 (v16 or above recommended)

XAMPP
 (for MySQL + phpMyAdmin)

2. Clone Repository
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker

3. Setup Database

Start XAMPP → enable Apache and MySQL

Open http://localhost/phpmyadmin

Create a new database named:

CREATE DATABASE expense_tracker;


Import the schema from db.sql:

USE expense_tracker;

CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  expense_name VARCHAR(255) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  date_of_expense DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

4. Configure Backend

Go into server folder:

cd server
npm install


Copy .env.example → .env and set your database credentials:

DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=expense_tracker
DB_PORT=3306
PORT=3000

5. Run Backend
npm start


Server runs on:
👉 http://localhost:3000

6. Run Frontend

Simply open client/index.html in your browser.
(Or use a VS Code extension like Live Server for auto-reload.)

🖼️ Screenshots

(Add actual screenshots here)

💰 Expense List Page

📊 Analysis Page (Charts)

🔍 Search Functionality

📝 Add Expense Modal

📤 API Endpoints

Base URL: http://localhost:3000/api/expenses

Method	Endpoint	Description
GET	/api/expenses	Fetch all expenses
POST	/api/expenses	Add a new expense
PUT	/api/expenses/:id	Update an expense
DELETE	/api/expenses/:id	Delete an expense
📊 Analysis Logic

Month-wise chart: Groups expenses by month (stacked by category).

Week-wise chart: Groups expenses by ISO week (Week 1, 2, …).

Pie chart: Shows total expense split across categories.

All charts update automatically whenever expenses change.

🔮 Future Enhancements

👤 Multi-user support with authentication

📤 CSV/Excel import & export

📱 Mobile-friendly UI (PWA support)

⏰ Reminders / budgeting alerts

📈 More visualizations (daily trends, savings goals)
