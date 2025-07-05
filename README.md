# 💸 Personal Finance Visualizer – Stage 1

A simple, responsive web application to **track personal transactions** and visualize **monthly expenses**.

Built using **Next.js App Router**, **React**, **shadcn/ui**, **Recharts**, and **MongoDB**.

---

## 📌 Features – Stage 1

- ✅ Add, edit, and delete transactions (amount, date, description)
- ✅ View a clean list of transactions with formatted dates
- ✅ Monthly bar chart of expenses using Recharts
- ✅ Basic form validation for inputs
- ✅ Fully responsive UI built with shadcn/ui (Radix + Tailwind)

---

## 🛠 Tech Stack

 Frontend : [Next.js 14 (App Router)](https://nextjs.org), [React](https://react.dev) 
 UI Components : [shadcn/ui](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com) 
 Charts : [Recharts](https://recharts.org) 
 Backend : API Routes in Next.js 
 Database : [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) via [Mongoose](https://mongoosejs.com) 

---

## 📂 Project Structure (Simplified)
src/
├── app/
│ ├── page.tsx // Main UI
│ └── api/
│ └── transactions/
│ ├── route.ts // GET & POST handlers
│ └── [id]/route.ts // PUT & DELETE handlers
├── lib/
│ └── mongoose.ts // MongoDB connection
├── models/
│ └── Transaction.ts // Mongoose schema




