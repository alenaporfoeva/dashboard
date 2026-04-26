// Initial data
const projects = [
  {
    companyName: "DataViz Inc",
    projectName: "Analytics Dashboard",
    budget: 7900,
    employeeCapacityUsed: 1.0,
    employeeCapacityTotal: 1,
    employeesCount: 1,
    estimatedIncome: -1250,
  },
  {
    companyName: "SalesPro",
    projectName: "CRM System",
    budget: 10000,
    employeeCapacityUsed: 1.4,
    employeeCapacityTotal: 2,
    employeesCount: 2,
    estimatedIncome: -775,
  },
  {
    companyName: "TechCorp",
    projectName: "E-Commerce Platform",
    budget: 12500,
    employeeCapacityUsed: 3.0,
    employeeCapacityTotal: 3,
    employeesCount: 3,
    estimatedIncome: -3958.33,
  },
  {
    companyName: "MediCare Solutions",
    projectName: "Healthcare Portal",
    budget: 15000,
    employeeCapacityUsed: 2.9,
    employeeCapacityTotal: 3,
    employeesCount: 4,
    estimatedIncome: -4325,
  },
  {
    companyName: "TechCorp",
    projectName: "Mobile Banking App",
    budget: 16650,
    employeeCapacityUsed: 1.9,
    employeeCapacityTotal: 2,
    employeesCount: 2,
    estimatedIncome: 2767.5,
  },
  {
    companyName: "GreenSoft",
    projectName: "Sustainability Tracker",
    budget: 9200,
    employeeCapacityUsed: 1.2,
    employeeCapacityTotal: 2,
    employeesCount: 2,
    estimatedIncome: 850,
  },
];

const employees = [
  {
    name: "John",
    surname: "Smith",
    age: 29,
    position: "Junior",
    salary: 3750,
    estimatedPayment: 3750,
    assignmentsCount: 1,
    capacityUsed: 1.0,
    capacityTotal: 1.5,
    projectedIncome: 208.33,
  },
  {
    name: "Sarah",
    surname: "Johnson",
    age: 32,
    position: "Middle",
    salary: 5400,
    estimatedPayment: 5400,
    assignmentsCount: 1,
    capacityUsed: 1.0,
    capacityTotal: 1.5,
    projectedIncome: -1233.33,
  },
  {
    name: "Michael",
    surname: "Williams",
    age: 35,
    position: "Senior",
    salary: 7100,
    estimatedPayment: 7100,
    assignmentsCount: 1,
    capacityUsed: 1.0,
    capacityTotal: 1.5,
    projectedIncome: -2933.33,
  },
  {
    name: "Emily",
    surname: "Brown",
    age: 29,
    position: "Middle",
    salary: 5150,
    estimatedPayment: 5150,
    assignmentsCount: 1,
    capacityUsed: 1.0,
    capacityTotal: 1.5,
    projectedIncome: 2342.5,
  },
  {
    name: "Daniel",
    surname: "Miller",
    age: 38,
    position: "Lead",
    salary: 8200,
    estimatedPayment: 4100,
    assignmentsCount: 0,
    capacityUsed: 0,
    capacityTotal: 1.5,
    projectedIncome: -4100,
  },
];

// Monthly data
const monthlyData = {
  "2025-0": {
    projects,
    employees,
  },
  "2025-1": {
    projects: [],
    employees: [],
  },
};

// Helpers
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

function getIncomeClass(amount) {
  return amount >= 0 ? "positive-income" : "negative-income";
}

// Projects table
const projectsTableBody = document.getElementById("projects-table-body");

function renderProjectsTable(projectsToRender) {
  projectsTableBody.innerHTML = "";

  projectsToRender.forEach((project) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${project.companyName}</td>
      <td>${project.projectName}</td>
      <td>${formatCurrency(project.budget)}</td>
      <td>${project.employeeCapacityUsed.toFixed(1)}/${project.employeeCapacityTotal}</td>
      <td><button class="show-btn">Show Employees (${project.employeesCount})</button></td>
      <td class="${getIncomeClass(project.estimatedIncome)}">
        ${formatCurrency(project.estimatedIncome)}
      </td>
      <td><button class="delete-btn">Delete</button></td>
    `;

    projectsTableBody.appendChild(row);
  });
}

// Employees table
const employeesTableBody = document.getElementById("employees-table-body");

function renderEmployeesTable(employeesToRender) {
  employeesTableBody.innerHTML = "";

  employeesToRender.forEach((employee) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${employee.name}</td>
      <td>${employee.surname}</td>
      <td>${employee.age}</td>
      <td>${employee.position}</td>
      <td>${formatCurrency(employee.salary)}</td>
      <td>${formatCurrency(employee.estimatedPayment)}</td>
      <td>
        <button class="show-btn">
          Show Assignments (${employee.assignmentsCount})
          <small>${employee.capacityUsed.toFixed(1)}/${employee.capacityTotal}</small>
        </button>
      </td>
      <td class="${getIncomeClass(employee.projectedIncome)}">
        ${formatCurrency(employee.projectedIncome)}
      </td>
      <td>
        <button class="availability-btn">Availability</button>
        <button class="assign-btn">Assign</button>
        <button class="delete-btn">Delete</button>
      </td>
    `;

    employeesTableBody.appendChild(row);
  });
}

// Month switching
const monthSelect = document.getElementById("month-select");
const yearSelect = document.getElementById("year-select");
const totalIncomeBlock = document.getElementById("projects-total-income");

function getCurrentPeriodKey() {
  return `${yearSelect.value}-${monthSelect.value}`;
}

function renderCurrentMonthData() {
  const key = getCurrentPeriodKey();
  const data = monthlyData[key];

  if (!data) {
    projectsTableBody.innerHTML = "";
    employeesTableBody.innerHTML = "";
    totalIncomeBlock.classList.add("hidden");
    return;
  }

  renderProjectsTable(data.projects);
  renderEmployeesTable(data.employees);

  totalIncomeBlock.classList.toggle(
    "hidden",
    data.projects.length === 0
  );
}

monthSelect.addEventListener("change", renderCurrentMonthData);
yearSelect.addEventListener("change", renderCurrentMonthData);

// Sidebar
const sidePanel = document.getElementById("side-panel");
const toggleButton = document.getElementById("toggle-button");
const openButton = document.getElementById("open-side-panel-button");
const mainContent = document.getElementById("main-content");

toggleButton.addEventListener("click", () => {
  sidePanel.classList.add("collapsed");
  mainContent.classList.add("expanded");
  openButton.classList.remove("hidden");
});

openButton.addEventListener("click", () => {
  sidePanel.classList.remove("collapsed");
  mainContent.classList.remove("expanded");
  openButton.classList.add("hidden");
});

// Navigation
const navProjects = document.getElementById("nav-projects");
const navEmployees = document.getElementById("nav-employees");
const projectsContent = document.getElementById("projects-content");
const employeesContent = document.getElementById("employees-content");

navProjects.addEventListener("click", (e) => {
  e.preventDefault();
  projectsContent.classList.remove("hidden-section");
  employeesContent.classList.add("hidden-section");

  navProjects.classList.add("active");
  navEmployees.classList.remove("active");
});

navEmployees.addEventListener("click", (e) => {
  e.preventDefault();
  employeesContent.classList.remove("hidden-section");
  projectsContent.classList.add("hidden-section");

  navEmployees.classList.add("active");
  navProjects.classList.remove("active");
});

// Panels
const addProjectBtn = document.getElementById("add-project-btn");
const projectPanel = document.getElementById("project-panel");
const cancelProjectBtn = document.getElementById("cancel-project-btn");

addProjectBtn.addEventListener("click", () => {
  projectPanel.classList.add("open");
});

cancelProjectBtn.addEventListener("click", () => {
  projectPanel.classList.remove("open");
});

const addEmployeeBtn = document.getElementById("add-employee-btn");
const employeePanel = document.getElementById("employee-panel");
const cancelEmployeeBtn = document.getElementById("cancel-employee-btn");

addEmployeeBtn.addEventListener("click", () => {
  employeePanel.classList.add("open");
});

cancelEmployeeBtn.addEventListener("click", () => {
  employeePanel.classList.remove("open");
});

// Add project and employee forms
const projectForm = document.getElementById("project-form");
const employeeForm = document.getElementById("employee-form");

const projectAddBtn = projectForm.querySelector(".panel-add-btn");
const employeeAddBtn = employeeForm.querySelector(".panel-add-btn");

projectAddBtn.disabled = true;
employeeAddBtn.disabled = true;

function getCurrentMonthData() {
  const key = getCurrentPeriodKey();

  if (!monthlyData[key]) {
    monthlyData[key] = {
      projects: [],
      employees: [],
    };
  }

  return monthlyData[key];
}

function calculateAge(dateOfBirth) {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

function setFieldState(input, errorElement, isValid, message) {
  if (isValid) {
    input.classList.remove("invalid");
    input.classList.add("valid");
    errorElement.textContent = "";
  } else {
    input.classList.remove("valid");
    input.classList.add("invalid");
    errorElement.textContent = message;
  }
}

function validateProjectForm() {
  const projectName = document.getElementById("project-name");
  const companyName = document.getElementById("company-name");
  const budget = document.getElementById("project-budget");
  const capacity = document.getElementById("employee-capacity");

  const isProjectNameValid = projectName.value.trim().length >= 3;
  const isCompanyNameValid = companyName.value.trim().length >= 2;
  const isBudgetValid = Number(budget.value) > 0;
  const isCapacityValid = Number(capacity.value) >= 1;

  setFieldState(projectName, document.getElementById("project-name-error"), isProjectNameValid, "Project name must be at least 3 characters");
  setFieldState(companyName, document.getElementById("company-name-error"), isCompanyNameValid, "Company name must be at least 2 characters");
  setFieldState(budget, document.getElementById("project-budget-error"), isBudgetValid, "Budget must be greater than 0");
  setFieldState(capacity, document.getElementById("employee-capacity-error"), isCapacityValid, "Employee capacity must be at least 1");

  const isFormValid =
    isProjectNameValid &&
    isCompanyNameValid &&
    isBudgetValid &&
    isCapacityValid;

  projectAddBtn.disabled = !isFormValid;
  projectAddBtn.classList.toggle("active", isFormValid);

  return isFormValid;
}

function validateEmployeeForm() {
  const name = document.getElementById("employee-name");
  const surname = document.getElementById("employee-surname");
  const dob = document.getElementById("employee-dob");
  const position = document.getElementById("employee-position");
  const salary = document.getElementById("employee-salary");

  const lettersOnly = /^[A-Za-zА-Яа-яЁё\s-]+$/;

  const isNameValid = name.value.trim().length >= 3 && lettersOnly.test(name.value.trim());
  const isSurnameValid = surname.value.trim().length >= 3 && lettersOnly.test(surname.value.trim());
  const isDobValid = dob.value !== "" && calculateAge(dob.value) >= 18;
  const isPositionValid = position.value !== "";
  const isSalaryValid = Number(salary.value) > 0;

  setFieldState(name, document.getElementById("employee-name-error"), isNameValid, "Name must be at least 3 characters and contain only letters");
  setFieldState(surname, document.getElementById("employee-surname-error"), isSurnameValid, "Surname must be at least 3 characters and contain only letters");
  setFieldState(dob, document.getElementById("employee-dob-error"), isDobValid, "You must be at least 18 years old");
  setFieldState(position, document.getElementById("employee-position-error"), isPositionValid, "Please select a position");
  setFieldState(salary, document.getElementById("employee-salary-error"), isSalaryValid, "Salary must be greater than 0");

  const isFormValid =
    isNameValid &&
    isSurnameValid &&
    isDobValid &&
    isPositionValid &&
    isSalaryValid;

  employeeAddBtn.disabled = !isFormValid;
  employeeAddBtn.classList.toggle("active", isFormValid);

  return isFormValid;
}

projectForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateProjectForm()) return;

  const currentData = getCurrentMonthData();

  const newProject = {
    companyName: document.getElementById("company-name").value,
    projectName: document.getElementById("project-name").value,
    budget: Number(document.getElementById("project-budget").value),
    employeeCapacityUsed: 0,
    employeeCapacityTotal: Number(document.getElementById("employee-capacity").value),
    employeesCount: 0,
    estimatedIncome: 0,
  };

  currentData.projects.push(newProject);

  projectForm.reset();
  projectAddBtn.disabled = true;
  projectAddBtn.classList.remove("active");

  projectPanel.classList.remove("open");
  renderCurrentMonthData();
});

employeeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateEmployeeForm()) return;

  const currentData = getCurrentMonthData();
  const salary = Number(document.getElementById("employee-salary").value);

  const newEmployee = {
    name: document.getElementById("employee-name").value,
    surname: document.getElementById("employee-surname").value,
    age: calculateAge(document.getElementById("employee-dob").value),
    position: document.getElementById("employee-position").value,
    salary: salary,
    estimatedPayment: salary * 0.5,
    assignmentsCount: 0,
    capacityUsed: 0,
    capacityTotal: 1.5,
    projectedIncome: -(salary * 0.5),
  };

  currentData.employees.push(newEmployee);

  employeeForm.reset();
  employeeAddBtn.disabled = true;
  employeeAddBtn.classList.remove("active");

  employeePanel.classList.remove("open");
  renderCurrentMonthData();
});

projectForm.querySelectorAll("input").forEach((input) => {
  input.addEventListener("input", validateProjectForm);
  input.addEventListener("blur", validateProjectForm);
});

employeeForm.querySelectorAll("input, select").forEach((input) => {
  input.addEventListener("input", validateEmployeeForm);
  input.addEventListener("change", validateEmployeeForm);
  input.addEventListener("blur", validateEmployeeForm);
});

// Seed modal
const seedBtn = document.getElementById("seed-data-btn");
const seedModal = document.getElementById("seed-modal");
const overlay = document.getElementById("seed-overlay");
const closeSeedModal = document.getElementById("close-seed-modal");

seedBtn.addEventListener("click", () => {
  seedModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

closeSeedModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

function closeModal() {
  seedModal.classList.add("hidden");
  overlay.classList.add("hidden");
}

// Init
renderCurrentMonthData();