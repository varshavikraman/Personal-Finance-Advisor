# 💰 Personal Finance Advisor

## 🧩 Description

This **Personal Finance Advisor** is designed to help users to track income, allocate funds automatically, manage budgets, monitor savings, and achieve financial goals effectively.

It combines automation, data visualization, and financial insights to help users maintain spending discipline and make smarter money decisions.

---

## 🚀 Key Features:

- 🔐 **User Authentication:** Secure sign-up and login using JWT and HTTP-only cookies.  
- 💸 **Income Allocation:** Automatic distribution of income into budgets, savings, and goals.  
- 📊 **Budget Management:** Category-wise spending limits and expense tracking.  
- 💰 **Savings Management:** Allocate or withdraw from savings and visualize progress with bar charts.  
- 🎯 **Goal Tracking:** Allocate portions of income toward financial goals and get completion notifications.  
- 📈 **Financial Insights:** Personalized advice and reports to improve money management.  
- 🧠 **Charts & Reports:** Monthly and multi-month expense visualizations with category breakdowns.

---

## 🛠️ Tech Stack

**Frontend:** React.js + Tailwind CSS  
**Backend:** Node.js + Express.js  
**Database:** MongoDB  
**Authentication:** JWT(JSON Web Token) with HTTP-only cookies  
**Visualization:** Recharts 
**Containerization:** Docker

---

## 🧭 Workflow

graph TB
    A[User Registration] --> B[User Login]
    B --> C[Add Monthly Income<br/>Auto Split: Budget, Savings, Goals]
    C --> D[Budget Management<br/>Set Limits, Add Expenses, Track]
    D --> E[Expense Tracking<br/>Manual Add + Charts]
    E --> F[Savings Management<br/>Allocate & Withdraw, Visualize via BarChart]
    F --> G[Goal Allocation<br/>End of Month]
    G --> H[Financial Insights & Notifications]
    
    style A fill:#e1f5fe
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style D fill:#fce4ec
    style E fill:#f3e5f5
    style F fill:#e8eaf6
    style G fill:#e0f2f1
    style H fill:#fff8e1

----

## ⚙️ Step-by-Step Setup (Using Docker Compose)

1. **Clone the repository:**  

    ```bash
    git clone git@github.com:varshavikraman/Personal-Finance-Advisor.git
    ```
    ```bash
    cd Personal-Finance-Advisor
    ```

2. **Set up environment variables:** 
 
   - Create a `.env` file in server folder.  
   - Add 
    ```bash
        PORT=<Port_no>
        SECRET_KEY=<any_name>
        NODE_ENV=production
    ```
 

3. **Docker Setup:**  

    ```bash
    docker-compose up --build
    ```

4. **Access the Application:**  

   - Once the containers are up, visit `localhost:3030` to access the app.  

---

## ⚙️ Step-by-Step Setup (Using Docker Compose)