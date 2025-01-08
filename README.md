# 🧮 Optimization Solver

![Optimization Solver Logo](https://placeholder.com/wp-content/uploads/2018/10/placeholder.com-logo1.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React Version](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Python Version](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)

---

```ascii
 ██████  ██████  ████████ ██ ███    ███ ██ ███████  █████  ████████ ██  ██████  ███    ██ 
██    ██ ██   ██    ██    ██ ████  ████ ██    ███  ██   ██    ██    ██ ██    ██ ████   ██ 
██    ██ ██████     ██    ██ ██ ████ ██ ██   ███   ███████    ██    ██ ██    ██ ██ ██  ██ 
██    ██ ██         ██    ██ ██  ██  ██ ██  ███    ██   ██    ██    ██ ██    ██ ██  ██ ██ 
 ██████  ██         ██    ██ ██      ██ ██ ███████ ██   ██    ██    ██  ██████  ██   ████ 
                                                                                            
███████  ██████  ██    ██     ██ ███████ ██████  
██      ██    ██ ██    ██     ██ ██      ██   ██ 
███████ ██    ██ ██    ██     ██ █████   ██████  
     ██ ██    ██  ██  ██      ██ ██      ██   ██ 
███████  ██████    ████       ██ ███████ ██   ██

---

## 📊 Interactive Linear Programming Solver

**Optimization Solver** is a powerful web application designed to solve both linear and non-linear programming problems interactively. It combines a user-friendly React frontend with a robust Python backend to provide a seamless optimization experience.
**Optimization Solver** is a powerful tool designed to help users solve optimization problems efficiently. Whether you are a researcher, student, or professional, this application offers a variety of features to assist you in solving complex problems related to optimization.

---

## 🌟 Features

- **Optimization Problem Solving**: Solve linear and non-linear optimization problems.
- **Constraint Management**: Easily add and manage constraints in optimization problems.
- **Visualizations**: Generate charts and graphs to visualize optimization results, including 2-variable problem visualizations.
- **Sensitivity Analysis**: Analyze how changes in constraints or the objective function affect the solution.
- **Random Problem Generator**: Generate random optimization problems to practice and test.
- **Save and Load**: Save and load optimization problems for later use.
- **Tutorial Mode**: Step-by-step tutorial to help users understand the components of optimization problems and how to solve them.
- **Guided Help**: Interactive help section to guide users through the process.

---

## 🛠 Technologies Used

### Frontend
- React 18.2.0
- Next.js 13.4.4
- Tailwind CSS 3.3.2
- shadcn/ui components

### Backend
- Python 3.9+
- Flask 2.0.1
- NumPy 1.21.0
- SciPy 1.7.0

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (version 14 or higher)
- **npm** (Node package manager)
- **Python** (version 3.9 or higher)
- **pip** (Python package manager)

---

### 🔧 Installation

#### Frontend

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/OptimizationSolver.git
   ```

2. Navigate into the project directory:
   ```bash
   cd OptimizationSolver
   ```

3. Install the necessary dependencies:
   ```bash
   npm install
   ```

4. Start the application in development mode:
   ```bash
   npm run dev
   ```

   This will start the frontend server at `http://localhost:3000`. Open this URL in your browser to interact with the application.

#### Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install the Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the Flask server:
   ```bash
   python app.py
   ```

   The backend server will start at `http://localhost:5000`.

---

## 🧑‍💻 Usage

### Solving Optimization Problems

1. Input the objective function in the provided input field.
2. Add constraints as inequalities or equalities.
3. Select the type of optimization problem (linear/non-linear).
4. Click the "Solve" button.
5. View results, including optimized values and graphical representations.

### Constraint Management

- Add constraints for each problem.
- Specify constraint types (greater than, less than, equal).
- Visualize how different constraints impact the optimization process.

---

## 📄 Contributing

We welcome contributions from the community! If you'd like to help improve **Optimization Solver**, follow these steps:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -am 'Add new feature'
   ```
4. Push to your branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Create a new Pull Request.

Please ensure you follow the project's code style and include tests for new features where applicable.

---

## 🔍 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📚 Acknowledgments

- **Next.js** for the React framework used to build the app.
- **Chart.js** for creating the visualizations and graphs.
- **React** for the frontend components.
- **Node.js** for the backend server.
- **Flask, NumPy, and SciPy** for backend optimization functionalities.
