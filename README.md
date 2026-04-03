# FinView | Premium Finance Dashboard

FinView is a clean, interactive personal finance dashboard built to help users track their spending and income with ease. It focuses on providing a high-end, responsive experience while keeping state management simple and reliable.

## 🚀 Key Features

*   **Financial Overview**: Quick-glance cards for Total Balance, monthly Income, and monthly Expenses.
*   **Visual Spending Data**: Interactive charts showing your balance trends over time and a breakdown of spending by category.
*   **Advanced Transaction Ledger**:
    *   **Smart Grouping**: Transactions are automatically grouped by date (Today, Yesterday, etc.) for better readability.
    *   **Real-time Search & Filter**: Search by description or filter by "Food," "Shopping," and more.
    *   **Advanced Sorting**: Easily toggle between date and amount sorting on any device.
*   **Role-Based Interaction**:
    *   **Viewer Mode**: Perfect for observing data without making changes.
    *   **Admin Mode**: Full control to add, edit, or delete transactions.
    *   **Seamless Switching**: Toggle roles instantly from the settings menu to see the UI behavior change.
*   **Enterprise Tools**:
    *   **CSV Export**: One-click download of your filtered transaction history as a standard CSV file.
    *   **Insights Panel**: Automated highlights for your "Highest Spending Category" and month-over-month comparisons.
*   **Modern UX**:
    *   **Fully Responsive**: Works beautifully on everything from a large desktop to a narrow mobile phone.
    *   **Dark Theme**: A polished, high-contrast dark mode designed for focus.
    *   **Persistence**: Your data stays saved in your browser even if you refresh.

## 🛠️ Tech Stack & Approach

*   **React 18**: Used for its performance and component-based architecture.
*   **State Management**: Built with a custom **Context API + useReducer** pattern. This ensures that a role change or a new transaction propagates instantly across the entire app without needing a bulky library like Redux.
*   **Styling**: 100% **Vanilla CSS**. I avoided utility frameworks like Tailwind to ensure maximum control over the design system, animations, and the "glassmorphism" aesthetic.
*   **Icons**: Lucide-React for clean, lightweight iconography.

## 🔧 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Launch the App**:
    ```bash
    npm run dev
    ```
    The app will typically be available at `http://localhost:5173`.

## 📂 Project Structure

*   `/src/context`: Global state management and local storage persistence.
*   `/src/pages`: Main views like the Dashboard, Transactions Ledger, and Insights.
*   `/src/components`: Reusable UI elements (CustomSelect, TransactionList, SummaryCards).
*   `/src/hooks`: Custom logic for media queries and data formatting.
*   `/src/utils`: Helper utilities for CSV generation and data processing.

---
Built with focus on user experience and clean code.
