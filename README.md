# CS319 Final Project

Transactions ERP Web Application

## Team Members

**CS319/ 427B**

- ศุภชัย สุวรรณทิพย์ 1660708619 (ทำหน้า / เกี่ยวกับ Transaction CRUD)

- พิสิษฐ์ จเรธรรมจิตต์ 1650704131 (ทำหน้า /categories เกี่ยวกับ Category CRUD)

- ชุติพนธ์ สัมพันธ์ 1640707368 (ทำหน้า /statuses เกี่ยวกับ Status CRUD)

## Getting Started

Clone the repository.

### Backend

1. Open a terminal and navigate to the `back-end` directory.

2. Install dependencies with `npm install`.

3. Setup the SQLite database: `npm run db:setup`. The database file is located in `back-end/prisma/dev.db`.

   3.1 (Optional) Seed the database: `npm run db:seed`.

4. Start server: `npm run start`.

### Frontend

1. Open a terminal and navigate to the `front-end` directory.

2. Install dependencies with `npm install`.

3. Start server: `npm run start:prod`.

Navigate to `http://localhost:4200` to view the application.
