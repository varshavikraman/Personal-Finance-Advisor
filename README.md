# 💰 SaveSage – Personal Finance Advisor

## 🧩 Description

SaveSage is a personal finance management application that helps users efficiently manage their income, expenses, savings, and financial goals. The system automatically divides the user's income into three parts — **budget**, **goals**, and **savings** — allowing users to track their spending, set budget limits, and monitor savings growth through visual insights. It aims to simplify money management and encourage consistent saving habits.

It combines automation, data visualization, and financial insights to help users maintain spending discipline and make smarter money decisions.

---

## 🚀 Key Features

- 🔐 **User Authentication:** Secure sign-up and login using JWT and HTTP-only cookies  
- 💸 **Income Allocation:** Automatic distribution of income into budgets, savings, and goals  
- 📊 **Budget Management:** Category-wise spending limits and expense tracking  
- 💰 **Savings Management:** Allocate or withdraw from savings and visualize progress with bar charts  
- 🎯 **Goal Tracking:** Allocate portions of income toward financial goals and get completion notifications  
- 📈 **Financial Insights:** Personalized advice and reports to improve money management  
- 🧠 **Charts & Reports:** Monthly and multi-month expense visualizations with category breakdowns  

---

## 🛠️ Tech Stack

**Frontend:** React.js, Tailwind CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB  
**Authentication:** JWT (JSON Web Token) with HTTP-only cookies  
**Visualization:** Recharts  
**Containerization:** Docker  

---

## ⚙️ Steps to Run the Application
### Prerequisites

Make sure you have Docker installed on your system

### 🔧Installation

1. **Clone the Repository:**  

    ```bash
        git clone git@github.com:varshavikraman/Personal-Finance-Advisor.git
    ```

2. **Navigate to the Project Directory:**  

    ```bash
        cd SaveSage:Personal-Finance-Advisor
    ```

3. **Set up environment variables:** 
 
   - Create a `.env` file inside the `server` folder.  
   - Add the following variables:

    ```bash
        PORT=<Port_no>

        SECRET_KEY=<your_jwt_secret_key_here>

        NODE_ENV=production
    ```
 

4. **Docker Setup:** 

    - Build & Run the Containers

    ```bash
        docker compose up --build
    ```

5. **Access the Application:**  

   - Once the containers are up, open your browser and visit: 

    ```bash
        http://localhost:3838
    ``` 

6. **Stopping the Docker Containers:**

    - Stop and remove all services defined docker-compose.yaml file

    ```bash
        docker compose down
    ```
---

## 📺 Demo Video Link

This demo video provides an overview of the **SaveSage – Personal Finance Advisor** application.  
It walks through the complete workflow, including:
- User registration and authentication  
- Adding monthly income and automatic budget allocation  
- Managing expenses and tracking spending categories  
- Viewing savings progress and financial goals  
- Interpreting charts and visual insights for better money decisions  

The video showcases how SaveSage simplifies financial planning and promotes smarter saving habits.

<a href="https://drive.google.com/file/d/1VTu9Ml4QhrI0Iu2nhDjDViLdLO9HmvNo/view?usp=drive_link" target="_blank">▶️ [Watch Demo]</a>  
