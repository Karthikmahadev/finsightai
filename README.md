# FinSight AI — Personal Financial Analytics Platform

FinSight AI is a full-stack personal finance and spending analytics platform designed to help users track transactions, manage monthly budgets, understand spending patterns, and make informed financial decisions.

The application combines interactive dashboards, budget health metrics, spending trend visualizations, anomaly detection, and AI-powered financial insights in a unified interface.

**Live Demo:** [Frontend](https://finsight-frontend-imo3.onrender.com/) · [Backend](https://finsight-backend-imo3.onrender.com/)

---

## Features

### 1. Financial Overview Dashboard

Get a comprehensive overview of your financial activity through an interactive dashboard.

- **Financial Summary:** Monitor total balance, monthly income, expenses, and savings.
- **Spending at a Glance:** Track today's spending, weekly spending, and average daily expenses.
- **Spending Trends:** Visualize spending patterns across multiple months.
- **Category Breakdown:** Understand how expenses are distributed across categories.
- **Budget Status:** Monitor category budgets and their current utilization.
- **Recent Transactions:** Review recent financial activity from the dashboard.

### 2. Transaction Management

Manage personal financial records through a centralized transaction interface.

- **Transaction Ledger:** View transaction descriptions, categories, dates, amounts, and transaction types.
- **Create Transactions:** Record income and expenses.
- **Update Transactions:** Edit existing transaction details.
- **Delete Transactions:** Remove transactions when necessary.
- **Search and Filtering:** Find transactions using search queries, categories, and date ranges.
- **Pagination:** Navigate through transaction records efficiently.
- **INR Support:** Display financial amounts in Indian Rupees (₹).

### 3. Budget Management and Financial Health

Plan monthly spending and monitor budget utilization.

- **Monthly Budgets:** Create and update overall or category-specific budgets.
- **Budget Utilization:** Track the percentage of each budget consumed.
- **Budget Health Indicators:** Identify budgets that are safe, approaching their limits, or exceeded.
- **Remaining Budget:** Calculate the amount available within each budget.
- **Monthly Progress:** Compare spending against monthly limits and the current billing period.
- **Spending Alerts:** Highlight categories experiencing increased spending or approaching budget limits.
- **Financial Recommendations:** Provide actionable suggestions for reviewing expenses and adjusting budgets.

### 4. AI-Powered Financial Insights

Explore spending patterns and obtain insights into personal financial activity.

- **Ask FinSight:** A natural-language interface for asking questions about spending and budgeting.
- **Spending Anomaly Detection:** Identify unusual increases in category-level spending.
- **Month-over-Month Comparisons:** Compare current spending against previous periods.
- **Category Growth Analysis:** Understand how spending changes across expense categories.
- **Recurring Expense Analysis:** Highlight recurring outflows and potential subscription optimization opportunities.
- **Actionable Recommendations:** Surface potential areas for reducing discretionary expenses and improving budget discipline.
- **Interactive Visualizations:** Explore spending distribution, category comparisons, and financial trends through charts.

> AI-generated insights depend on the configured AI integration and the financial data available to the application.

---

## Application Routes

| Route | Description |
|---|---|
| `/home/dashboard` | Financial overview, key metrics, recent activity, and spending trends |
| `/home/transactions` | Transaction ledger, search, filtering, and transaction management |
| `/home/budgets` | Budget allocation, utilization, and financial health indicators |
| `/home/aiinsights` | Spending analytics, anomaly insights, recommendations, and Ask FinSight |

---

## Technology Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts / Chart.js
- Lucide React Icons

### Backend
- Node.js
- Express.js / API routes, as applicable to the configured application
- REST APIs
- JWT-based authentication

### Database and Data Management
- MongoDB
- Mongoose
- User-scoped financial records and database queries

### AI Integration
- OpenAI API
- Natural-language financial queries and spending insights

### Deployment and Development
- Render
- Git and GitHub
- Environment-based configuration
- npm

> **Architecture note:** The deployed backend currently connects to MongoDB. Update this section if the implementation changes or if additional database technologies are introduced.

---

## Architecture Overview

FinSight AI follows a frontend-backend architecture that separates the user interface, API layer, authentication, data persistence, and financial analytics.

```text
                  User
                   |
                   v
          Next.js / React UI
                   |
                   v
             Backend API
             (Node.js)
                   |
          +--------+---------+
          |        |         |
          v        v         v
     MongoDB    Analytics   OpenAI API
          |        |         |
          +--------+---------+
                   |
                   v
        Financial Insights
        and Dashboard Data
```

### Core Data Flow

1. Users authenticate and access their financial dashboard.
2. The frontend requests financial data from the backend APIs.
3. Authentication middleware validates protected requests.
4. The backend retrieves user-associated transactions and budgets from MongoDB.
5. Analytics functions calculate financial summaries, budget utilization, spending trends, and recommendations.
6. The frontend renders the results using dashboard cards, tables, and interactive charts.
7. AI-related functionality uses the configured OpenAI integration where applicable.

---

## Authentication and Security

Security is an important part of a personal finance application.

The backend uses protected routes and user-scoped data access to restrict financial operations to authenticated users.

Security considerations include:

- JWT-based authentication.
- Protected API endpoints.
- User-specific transaction and budget queries.
- Server-side storage of API credentials.
- Environment variables for sensitive configuration.
- Database access controls and validation of incoming requests.

**Important:** Production deployments should use secure token handling, validate transaction ownership for every operation, configure CORS for trusted origins, and never expose database credentials or AI API keys in client-side code.

---

## Getting Started

### Prerequisites

Install the following:

- Node.js 18 or later (use a version supported by your dependencies).
- npm.
- Git.
- A MongoDB database, such as MongoDB Atlas.
- An OpenAI API key if you want to use AI-powered functionality.

### 1. Clone the Repository

```bash
git clone https://github.com/Karthikmahadev/finsightai.git
cd finsightai
```

### 2. Install Dependencies

If the project contains separate frontend and backend directories, install dependencies in each directory:

```bash
cd backend
npm install
```

Then install the frontend dependencies:

```bash
cd ../frontend
npm install
```

> Adjust the directory names if your repository uses a different structure. If the repository has a single root `package.json`, install dependencies from the root instead.

### 3. Configure Environment Variables

Create a `.env` file in the backend directory and configure the variables required by your application.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_secure_jwt_secret
```

If Google OAuth is enabled, configure the Google client ID, client secret, and callback URL using the exact variable names expected by your backend code.

For the frontend, configure the backend API base URL using the environment variable expected by your application.

**Never commit real API keys, database credentials, or JWT secrets to GitHub.** Use placeholder values in example environment files.

### 4. Start the Backend

From the backend directory:

```bash
npm start
```

The backend should start on the configured port. If no `PORT` is supplied locally, the application can use port `5000` as its fallback.

### 5. Start the Frontend

From the frontend directory:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment

FinSight AI is deployed using Render.

### Frontend Deployment

Configure the frontend service with:

- The correct repository and frontend root directory.
- The appropriate Node.js build environment.
- The frontend build command.
- The production start command or static publishing configuration, depending on the application.
- The production backend API URL.

### Backend Deployment

Configure the backend as a Render Web Service with:

- The correct repository and backend root directory.
- Build command: `npm install`
- Start command: `npm start`
- MongoDB connection string.
- OpenAI API key and other required secrets.
- Any authentication or OAuth environment variables used by the application.

The backend must listen on the port supplied by Render and bind to `0.0.0.0`.

For local development, a fallback port such as `5000` can be used:

```javascript
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
```

Do not set `PORT` to the backend URL. The port variable must contain a numeric port value.

---

## Financial Analytics

FinSight AI uses transaction records to calculate useful financial metrics.

### Monthly Balance

Balance is calculated from income and expenses for the selected period:

```text
Balance = Total Income - Total Expenses
```

### Savings Rate

```text
Savings Rate = (Income - Expenses) / Income * 100
```

The application should handle cases where income is zero to avoid invalid calculations.

### Budget Utilization

```text
Budget Utilization = Amount Spent / Budget Limit * 100
```

Budget status can be determined from utilization:

- **Safe:** Less than 80% used.
- **Warning:** At least 80% but less than 100% used.
- **Exceeded:** 100% or more used.

### Spending Trends

Expenses can be grouped by month, week, or category to identify changes in financial behavior over time.

### Anomaly Detection

Spending changes can be compared with previous periods to identify unusually large increases. These rules should be treated as indicators for review, not definitive evidence of fraud or financial risk.

---

## Future Improvements

Potential enhancements include:

- Automated recurring transaction detection.
- More configurable budget periods.
- Improved anomaly detection with historical baselines.
- Personalized AI recommendations grounded in transaction data.
- Exportable financial reports.
- Automated financial summaries.
- Stronger automated tests for analytics and authentication.
- Improved observability, error monitoring, and API performance.
- Better handling of missing data and transactions with different currencies.

---

## Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement and test your changes.
4. Submit a pull request describing the changes.

---

## Disclaimer

FinSight AI is intended for personal financial tracking and informational purposes. Its analytics and recommendations should not be treated as professional financial, investment, tax, or legal advice.

---

## Author

**Karthik Mahadev B**

- GitHub: [@Karthikmahadev](https://github.com/Karthikmahadev)
- LinkedIn: [Karthik Mahadev](https://www.linkedin.com/in/karthikmahadev19/)

Built to explore full-stack development, financial analytics, data visualization, and AI-assisted personal finance.
