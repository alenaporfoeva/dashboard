const STORAGE_KEY = "monthlyData";
const ACTIVE_TAB_KEY = "active-tab";
const SELECTED_MONTH_KEY = "selected-month";
const SELECTED_YEAR_KEY = "selected-year";

// Initial data
const projects = [
  {
    id: "project-1",
    companyName: "DataViz Inc",
    projectName: "Analytics Dashboard",
    budget: 7900,
    employeeCapacity: 1,
  },
  {
    id: "project-2",
    companyName: "SalesPro",
    projectName: "CRM System",
    budget: 10000,
    employeeCapacity: 2,
  },
  {
    id: "project-3",
    companyName: "TechCorp",
    projectName: "E-Commerce Platform",
    budget: 12500,
    employeeCapacity: 3,
  },
  {
    id: "project-4",
    companyName: "MediCare Solutions",
    projectName: "Healthcare Portal",
    budget: 15000,
    employeeCapacity: 3,
  },
  {
    id: "project-5",
    companyName: "TechCorp",
    projectName: "Mobile Banking App",
    budget: 16650,
    employeeCapacity: 2,
  },
  {
    id: "project-6",
    companyName: "GreenSoft",
    projectName: "Sustainability Tracker",
    budget: 9200,
    employeeCapacity: 2,
  },
];

const employees = [
  {
    id: "employee-1",
    name: "John",
    surname: "Smith",
    dateOfBirth: "1997-04-12",
    position: "Junior",
    salary: 3750,
    vacationDays: [],
    assignments: [
      {
        projectId: "project-1",
        capacity: 1.0,
        fit: 1.0,
      },
    ],
  },
  {
    id: "employee-2",
    name: "Sarah",
    surname: "Johnson",
    dateOfBirth: "1994-09-20",
    position: "Middle",
    salary: 5400,
    vacationDays: [],
    assignments: [
      {
        projectId: "project-2",
        capacity: 1.0,
        fit: 1.0,
      },
    ],
  },
  {
    id: "employee-3",
    name: "Michael",
    surname: "Williams",
    dateOfBirth: "1991-02-03",
    position: "Senior",
    salary: 7100,
    vacationDays: [],
    assignments: [
      {
        projectId: "project-3",
        capacity: 1.0,
        fit: 1.0,
      },
    ],
  },
  {
    id: "employee-4",
    name: "Emily",
    surname: "Brown",
    dateOfBirth: "1997-07-18",
    position: "Middle",
    salary: 5150,
    vacationDays: [],
    assignments: [
      {
        projectId: "project-5",
        capacity: 1.0,
        fit: 1.0,
      },
    ],
  },
  {
    id: "employee-5",
    name: "Daniel",
    surname: "Miller",
    dateOfBirth: "1988-11-05",
    position: "Lead",
    salary: 8200,
    vacationDays: [],
    assignments: [],
  },
];

// Monthly data
const monthlyData = {
  "2026-0": {
    projects: JSON.parse(JSON.stringify(projects)),
    employees: JSON.parse(JSON.stringify(employees)),
  },
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// localStorage
function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(monthlyData));
}

function loadFromLocalStorage() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) return;

  try {
    const parsedData = JSON.parse(savedData);

    Object.keys(parsedData).forEach((key) => {
      monthlyData[key] = parsedData[key];
    });
  } catch (error) {
    console.error("Could not load data from localStorage", error);
  }
}

// Sort and filter state
let projectSort = { key: null, direction: "asc" };
let employeeSort = { key: null, direction: "asc" };

let projectFilters = {};
let employeeFilters = {};

let currentFilterPopup = null;

function updateSortIcons(tableId, sortState) {
  const table = document.getElementById(tableId);

  table.querySelectorAll("th.sortable").forEach(th => {
    const icon = th.querySelector(".sort-icon");
    const key = th.dataset.sort;

    if (!icon) return;

    if (sortState.key === key) {
      icon.textContent = sortState.direction === "asc" ? "↑" : "↓";
    } else {
      icon.textContent = "⇅";
    }
  });
}

const filterChipsContainer = document.getElementById("filter-chips");
const clearFiltersBtn = document.getElementById("clear-filters-btn");

function formatFilterName(key) {
  const names = {
    companyName: "Company Name",
    projectName: "Project Name",
    name: "Name",
    surname: "Surname",
    position: "Position",
  };

  return names[key] || key;
}

function renderFilterChips() {
  filterChipsContainer.innerHTML = "";

  const activeTab = getActiveTab();
  const filters = activeTab === "employees" ? employeeFilters : projectFilters;

  const keys = Object.keys(filters);

  keys.forEach((key) => {
    const chip = document.createElement("div");
    chip.className = "filter-chip";

    chip.innerHTML = `
      <span>${formatFilterName(key)}: ${filters[key]}</span>
      <button type="button" data-key="${key}">×</button>
    `;

    filterChipsContainer.appendChild(chip);
  });

  clearFiltersBtn.classList.toggle("hidden", keys.length < 2);
}

filterChipsContainer.addEventListener("click", (e) => {
  if (!e.target.dataset.key) return;

  const key = e.target.dataset.key;
  const activeTab = getActiveTab();

  if (activeTab === "employees") {
    delete employeeFilters[key];
  } else {
    delete projectFilters[key];
  }

  renderCurrentMonthData();
});

clearFiltersBtn.addEventListener("click", () => {
  const activeTab = getActiveTab();

  if (activeTab === "employees") {
    employeeFilters = {};
  } else {
    projectFilters = {};
  }

  renderCurrentMonthData();
});

// Helpers
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

function getIncomeClass(amount) {
  return amount >= 0 ? "positive-income" : "negative-income";
}

function getCurrentPeriodKey() {
  return `${yearSelect.value}-${monthSelect.value}`;
}

function getCurrentMonthData() {
  const key = getCurrentPeriodKey();

  if (!monthlyData[key]) {
    monthlyData[key] = {
      projects: [],
      employees: [],
    };

    saveToLocalStorage();
  }

  return monthlyData[key];
}

function cloneData(data) {
  return JSON.parse(JSON.stringify(data));
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

function sortData(data, sortState) {
  if (!sortState.key) return data;

  return [...data].sort((a, b) => {
    let aVal = a[sortState.key];
    let bVal = b[sortState.key];

    const currentData = getCurrentMonthData();

    if (sortState.key === "employeeCapacity") {
      aVal = getProjectUsedEffectiveCapacity(a, currentData.employees) / a.employeeCapacity;
      bVal = getProjectUsedEffectiveCapacity(b, currentData.employees) / b.employeeCapacity;
    }

    if (sortState.key === "estimatedIncome") {
      aVal = calculateProjectProfit(a, currentData.employees);
      bVal = calculateProjectProfit(b, currentData.employees);
    }

    if (sortState.key === "age") {
      aVal = calculateAge(a.dateOfBirth);
      bVal = calculateAge(b.dateOfBirth);
    }

    if (sortState.key === "estimatedPayment") {
      aVal = calculateEmployeePayment(a);
      bVal = calculateEmployeePayment(b);
    }

    if (sortState.key === "projectedIncome") {
      aVal = calculateEmployeeProjectedIncome(
        a,
        currentData.projects,
        currentData.employees
      );
      bVal = calculateEmployeeProjectedIncome(
        b,
        currentData.projects,
        currentData.employees
      );
    }

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortState.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortState.direction === "asc" ? 1 : -1;
    return 0;
  });
}

function filterData(data, filters) {
  return data.filter((item) => {
    return Object.keys(filters).every((key) => {
      if (!filters[key]) return true;

      const value = item[key];

      if (value === undefined || value === null) return false;

      return String(value)
        .toLowerCase()
        .includes(filters[key].toLowerCase());
    });
  });
}

function getActiveTab() {
  if (!employeesContent.classList.contains("hidden")) {
    return "employees";
  }

  return "projects";
}

// Calculations
const MAX_EMPLOYEE_CAPACITY = 1.5;

function getCurrentYear() {
  return Number(yearSelect.value);
}

function getCurrentMonth() {
  return Number(monthSelect.value);
}

function getWorkingDaysInMonth(year, month) {
  const date = new Date(year, month, 1);
  let count = 0;

  while (date.getMonth() === month) {
    const day = date.getDay();

    if (day !== 0 && day !== 6) {
      count++;
    }

    date.setDate(date.getDate() + 1);
  }

  return count;
}

function getVacationCoefficient(employee) {
  const year = getCurrentYear();
  const month = getCurrentMonth();
  const workingDays = getWorkingDaysInMonth(year, month);

  const vacationDays = employee.vacationDays || [];

  const vacationWorkingDays = vacationDays.filter((dayNumber) => {
    const date = new Date(year, month, dayNumber);
    const day = date.getDay();

    return day !== 0 && day !== 6;
  }).length;

  if (workingDays === 0) return 1;

  return (workingDays - vacationWorkingDays) / workingDays;
}

function getEffectiveCapacity(employee, assignment) {
  const vacationCoefficient = getVacationCoefficient(employee);

  return assignment.capacity * assignment.fit * vacationCoefficient;
}

function getEmployeeCost(employee, assignment) {
  return employee.salary * Math.max(0.5, assignment.capacity);
}

function getBenchCost(employee) {
  return employee.salary * 0.5;
}

function getEmployeeCapacityUsed(employee) {
  return (employee.assignments || []).reduce((sum, assignment) => {
    return sum + assignment.capacity;
  }, 0);
}

function getProjectAssignments(projectId, employees) {
  const assignments = [];

  employees.forEach((employee) => {
    (employee.assignments || []).forEach((assignment) => {
      if (assignment.projectId === projectId) {
        assignments.push({
          employee,
          assignment,
        });
      }
    });
  });

  return assignments;
}

function getProjectUsedEffectiveCapacity(project, employees) {
  const projectAssignments = getProjectAssignments(project.id, employees);

  return projectAssignments.reduce((sum, item) => {
    return sum + getEffectiveCapacity(item.employee, item.assignment);
  }, 0);
}

function getProjectRevenuePerEffectiveCapacity(project, employees) {
  const usedEffectiveCapacity = getProjectUsedEffectiveCapacity(project, employees);
  const capacityForRevenue = Math.max(project.employeeCapacity, usedEffectiveCapacity);

  if (capacityForRevenue === 0) return 0;

  return project.budget / capacityForRevenue;
}

function getAssignmentRevenue(project, employee, assignment, employees) {
  const revenuePerEffectiveCapacity = getProjectRevenuePerEffectiveCapacity(
    project,
    employees
  );

  return revenuePerEffectiveCapacity * getEffectiveCapacity(employee, assignment);
}

function getAssignmentProfit(project, employee, assignment, employees) {
  const revenue = getAssignmentRevenue(project, employee, assignment, employees);
  const cost = getEmployeeCost(employee, assignment);

  return revenue - cost;
}

function calculateProjectProfit(project, employees) {
  const projectAssignments = getProjectAssignments(project.id, employees);

  const totalRevenue = projectAssignments.reduce((sum, item) => {
    return sum + getAssignmentRevenue(
      project,
      item.employee,
      item.assignment,
      employees
    );
  }, 0);

  const totalCost = projectAssignments.reduce((sum, item) => {
    return sum + getEmployeeCost(item.employee, item.assignment);
  }, 0);

  return totalRevenue - totalCost;
}

function calculateEmployeePayment(employee) {
  const assignments = employee.assignments || [];

  if (assignments.length === 0) {
    return getBenchCost(employee);
  }

  return assignments.reduce((sum, assignment) => {
    return sum + getEmployeeCost(employee, assignment);
  }, 0);
}

function calculateEmployeeProjectedIncome(employee, projects, employees) {
  const assignments = employee.assignments || [];

  if (assignments.length === 0) {
    return -getBenchCost(employee);
  }

  return assignments.reduce((sum, assignment) => {
    const project = projects.find((project) => project.id === assignment.projectId);

    if (!project) return sum;

    return sum + getAssignmentProfit(project, employee, assignment, employees);
  }, 0);
}

function calculateTotalEstimatedIncome(projects, employees) {
  const projectsIncome = projects.reduce((sum, project) => {
    return sum + calculateProjectProfit(project, employees);
  }, 0);

  const benchPayments = employees.reduce((sum, employee) => {
    const assignments = employee.assignments || [];

    if (assignments.length === 0) {
      return sum + getBenchCost(employee);
    }

    return sum;
  }, 0);

  return {
    totalIncome: projectsIncome - benchPayments,
    benchPayments,
  };
}

// Tables
const projectsTableBody = document.getElementById("projects-table-body");
const employeesTableBody = document.getElementById("employees-table-body");

function renderProjectsTable(projectsToRender) {
  projectsTableBody.innerHTML = "";

  let data = filterData(projectsToRender, projectFilters);
  data = sortData(data, projectSort);

  data.forEach((project) => {
    const row = document.createElement("tr");
    const currentData = getCurrentMonthData();
    const profit = calculateProjectProfit(project, currentData.employees);
    const usedCapacity = getProjectUsedEffectiveCapacity(project, currentData.employees);
    const employeesCount = getProjectAssignments(project.id, currentData.employees).length;
    const isOverCapacity = usedCapacity > project.employeeCapacity;

    row.innerHTML = `
      <td>${project.companyName}</td>
      <td>${project.projectName}</td>
      <td>${formatCurrency(project.budget)}</td>
      <td class="${isOverCapacity ? "negative-income" : ""}">
        ${usedCapacity.toFixed(1)}/${project.employeeCapacity}</td>
      <td>
      <button class="show-btn show-project-employees-btn" data-id="${project.id}">
        Show Employees (${employeesCount})
      </button>
</td>
      <td class="${getIncomeClass(profit)}">
        ${formatCurrency(profit)}
      </td>
      <td>
        <button class="delete-btn" data-id="${project.id}" data-type="project">Delete</button>
      </td>
    `;

    projectsTableBody.appendChild(row);
  });
}

function renderEmployeesTable(employeesToRender) {
  employeesTableBody.innerHTML = "";

  let data = filterData(employeesToRender, employeeFilters);
  data = sortData(data, employeeSort);

  data.forEach((employee) => {
    const row = document.createElement("tr");
    const currentData = getCurrentMonthData();
    const age = calculateAge(employee.dateOfBirth);
    const capacityUsed = getEmployeeCapacityUsed(employee);
    const assignmentsCount = (employee.assignments || []).length;
    const estimatedPayment = calculateEmployeePayment(employee);
    const projectedIncome = calculateEmployeeProjectedIncome(
      employee,
      currentData.projects,
      currentData.employees
    );
    const isAtMaxCapacity = capacityUsed >= MAX_EMPLOYEE_CAPACITY;

    row.innerHTML = `
      <td>${employee.name}</td>
      <td>${employee.surname}</td>
      <td>${age}</td>
      <td class="editable-position" data-id="${employee.id}">
        ${employee.position} <span class="edit-icon">✎</span>
      </td>
      <td class="editable-salary" data-id="${employee.id}">
        ${formatCurrency(employee.salary)} <span class="edit-icon">✎</span>
      </td>
      <td>${formatCurrency(estimatedPayment)}</td>
        <td>
        <button class="show-btn show-assignments-btn" data-id="${employee.id}">
          Show Assignments (${assignmentsCount})
          <small>${capacityUsed.toFixed(1)}/${MAX_EMPLOYEE_CAPACITY}</small>
        </button>
      </td>
      <td class="${getIncomeClass(projectedIncome)}">
      ${formatCurrency(projectedIncome)}
      </td>
      <td>
        <button class="availability-btn" data-id="${employee.id}">Availability</button>
        <button class="assign-btn" data-id="${employee.id}" ${isAtMaxCapacity ? "disabled" : ""}>Assign</button>
        <button class="delete-btn" data-id="${employee.id}" data-type="employee">Delete</button>
      </td>
    `;

    employeesTableBody.appendChild(row);
  });
}

// Total income
function renderTotalEstimatedIncome(projects, employees) {
  const result = calculateTotalEstimatedIncome(projects, employees);

  totalIncomeAmount.textContent = formatCurrency(result.totalIncome);
  benchPaymentsText.textContent = `(Bench payments: ${formatCurrency(result.benchPayments)})`;

  totalIncomeAmount.classList.remove("positive-income", "negative-income");
  totalIncomeAmount.classList.add(getIncomeClass(result.totalIncome));
}

// Month and year switching
const monthSelect = document.getElementById("month-select");
const yearSelect = document.getElementById("year-select");
const totalIncomeBlock = document.getElementById("projects-total-income");
const totalIncomeAmount = document.getElementById("total-income-amount");
const benchPaymentsText = document.getElementById("bench-payments");

function renderCurrentMonthData() {
  const data = getCurrentMonthData();

  renderProjectsTable(data.projects);
  renderEmployeesTable(data.employees);
  renderTotalEstimatedIncome(data.projects, data.employees);

  totalIncomeBlock.classList.toggle("hidden", data.projects.length === 0);
  renderFilterChips();
}

monthSelect.addEventListener("change", () => {
  localStorage.setItem(SELECTED_MONTH_KEY, monthSelect.value);
  renderCurrentMonthData();
});

yearSelect.addEventListener("change", () => {
  localStorage.setItem(SELECTED_YEAR_KEY, yearSelect.value);
  renderCurrentMonthData();
});

// Table sorting
function setupTableSorting(tableId, sortState) {
  const table = document.getElementById(tableId);

  table.addEventListener("click", (e) => {
    if (e.target.classList.contains("filter-icon")) return;

    const th = e.target.closest("th.sortable");
    if (!th) return;

    const key = th.dataset.sort;

    if (sortState.key === key) {
      sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
    } else {
      sortState.key = key;
      sortState.direction = "asc";
    }

    renderCurrentMonthData();
    updateSortIcons(tableId, sortState);
  });
}

setupTableSorting("projects-table", projectSort);
setupTableSorting("employees-table", employeeSort);

// Filter popup
function closeFilterPopup() {
  if (currentFilterPopup) {
    currentFilterPopup.remove();
    currentFilterPopup = null;
  }
}

function openFilterPopup(icon, tableType, key) {
  closeFilterPopup();

  const popup = document.createElement("div");
  popup.className = "filter-popup";

  const filters = tableType === "projects" ? projectFilters : employeeFilters;
  const currentValue = filters[key] || "";

  if (key === "position") {
    popup.innerHTML = `
      <select class="filter-input">
        <option value="">Select position</option>
        <option value="Junior">Junior</option>
        <option value="Middle">Middle</option>
        <option value="Senior">Senior</option>
        <option value="Lead">Lead</option>
        <option value="Architect">Architect</option>
        <option value="BO">BO</option>
      </select>
    `;
  } else {
    popup.innerHTML = `
      <input type="text" class="filter-input" placeholder="Filter by ${formatFilterName(key)}..." value="${currentValue}">
      <div class="filter-popup-actions">
        <button type="button" class="filter-apply-btn">Apply</button>
        <button type="button" class="filter-cancel-btn">Cancel</button>
      </div>
    `;
  }

  document.body.appendChild(popup);

  const rect = icon.getBoundingClientRect();
  popup.style.top = `${rect.bottom + window.scrollY + 10}px`;
  popup.style.left = `${rect.left + window.scrollX - 20}px`;

  currentFilterPopup = popup;

  const input = popup.querySelector(".filter-input");
  const applyBtn = popup.querySelector(".filter-apply-btn");
  const cancelBtn = popup.querySelector(".filter-cancel-btn");

  input.value = currentValue;
  input.focus();

  if (key === "position") {
    input.addEventListener("change", () => {
      const value = input.value;

      if (value === "") {
        delete filters[key];
      } else {
        filters[key] = value;
      }

      closeFilterPopup();
      renderCurrentMonthData();
    });

    return;
  }

  applyBtn.addEventListener("click", () => {
    const value = input.value.trim();

    if (value === "") {
      delete filters[key];
    } else {
      filters[key] = value;
    }

    closeFilterPopup();
    renderCurrentMonthData();
  });

  cancelBtn.addEventListener("click", () => {
    closeFilterPopup();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") applyBtn.click();
    if (e.key === "Escape") closeFilterPopup();
  });
}

document.querySelectorAll("#projects-table .filter-icon").forEach((icon) => {
  icon.addEventListener("click", (e) => {
    e.stopPropagation();

    const th = icon.closest("th");
    const key = th.dataset.filter;

    openFilterPopup(icon, "projects", key);
  });
});

document.querySelectorAll("#employees-table .filter-icon").forEach((icon) => {
  icon.addEventListener("click", (e) => {
    e.stopPropagation();

    const th = icon.closest("th");
    const key = th.dataset.filter;

    openFilterPopup(icon, "employees", key);
  });
});

document.addEventListener("click", (e) => {
  if (
    currentFilterPopup &&
    !currentFilterPopup.contains(e.target) &&
    !e.target.classList.contains("filter-icon")
  ) {
    closeFilterPopup();
  }
});

// Delete project or employee
projectsTableBody.addEventListener("click", (e) => {
  if (!e.target.classList.contains("delete-btn")) return;

  const projectId = e.target.dataset.id;
  const currentData = getCurrentMonthData();

  const project = currentData.projects.find((project) => project.id === projectId);
  if (!project) return;

  const isConfirmed = confirm(`Delete project "${project.projectName}"?`);
  if (!isConfirmed) return;

  currentData.projects = currentData.projects.filter(
    (project) => project.id !== projectId
  );

  currentData.employees.forEach((employee) => {
    employee.assignments = (employee.assignments || []).filter((assignment) => {
      return assignment.projectId !== projectId;
    });
  });

  saveToLocalStorage();
  renderCurrentMonthData();
});

employeesTableBody.addEventListener("click", (e) => {
  if (!e.target.classList.contains("delete-btn")) return;

  const employeeId = e.target.dataset.id;
  const currentData = getCurrentMonthData();

  const employee = currentData.employees.find(
    (employee) => employee.id === employeeId
  );

  if (!employee) return;

  const isConfirmed = confirm(
    `Delete employee "${employee.name} ${employee.surname}"?`
  );

  if (!isConfirmed) return;

  currentData.employees = currentData.employees.filter(
    (employee) => employee.id !== employeeId
  );

  saveToLocalStorage();
  renderCurrentMonthData();
});

// Inline editing for employee position and salary
employeesTableBody.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("inline-select") ||
    e.target.classList.contains("inline-input")
  ) {
    return;
  }

  const positionCell = e.target.closest(".editable-position");
  const salaryCell = e.target.closest(".editable-salary");

  if (positionCell) {
    editEmployeePosition(positionCell);
  }

  if (salaryCell) {
    editEmployeeSalary(salaryCell);
  }
});

function editEmployeePosition(cell) {
  const employeeId = cell.dataset.id;
  const currentData = getCurrentMonthData();

  const employee = currentData.employees.find(
    (employee) => employee.id === employeeId
  );

  if (!employee) return;

  cell.innerHTML = `
    <select class="inline-select">
      <option value="Junior">Junior</option>
      <option value="Middle">Middle</option>
      <option value="Senior">Senior</option>
      <option value="Lead">Lead</option>
      <option value="Architect">Architect</option>
      <option value="BO">BO</option>
    </select>
  `;

  const select = cell.querySelector(".inline-select");
  select.value = employee.position;
  select.focus();

  select.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  select.addEventListener("change", () => {
    employee.position = select.value;
    saveToLocalStorage();
    renderCurrentMonthData();
  });
}

function editEmployeeSalary(cell) {
  const employeeId = cell.dataset.id;
  const currentData = getCurrentMonthData();

  const employee = currentData.employees.find(
    (employee) => employee.id === employeeId
  );

  if (!employee) return;

  cell.innerHTML = `
    <input
      type="number"
      class="inline-input"
      value="${employee.salary}"
      min="0"
      step="0.01"
    >
  `;

  const input = cell.querySelector(".inline-input");
  input.focus();
  input.select();

  input.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  function saveSalary() {
    const newSalary = Number(input.value);

    if (newSalary <= 0) {
      renderCurrentMonthData();
      return;
    }

    employee.salary = newSalary;

    saveToLocalStorage();
    renderCurrentMonthData();
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      saveSalary();
    }

    if (e.key === "Escape") {
      renderCurrentMonthData();
    }
  });

  input.addEventListener("blur", () => {
    saveSalary();
  });
}

// Assign
let currentAssignmentPopup = null;
let currentAssignmentButton = null;

function closeAssignmentPopup() {
  if (currentAssignmentPopup) {
    currentAssignmentPopup.remove();
    currentAssignmentPopup = null;
    currentAssignmentButton = null;
  }

  window.removeEventListener("scroll", repositionCurrentAssignmentPopup);
  window.removeEventListener("resize", repositionCurrentAssignmentPopup);
}

function positionAssignmentPopup(popup, button) {
  const rect = button.getBoundingClientRect();

  let top = rect.bottom + window.scrollY + 8;
  let left = rect.left + window.scrollX;

  const popupWidth = 340;
  const popupHeight = popup.offsetHeight || 360;

  if (left + popupWidth > window.scrollX + window.innerWidth) {
    left = window.scrollX + window.innerWidth - popupWidth - 16;
  }

  if (top + popupHeight > window.scrollY + window.innerHeight) {
    top = rect.top + window.scrollY - popupHeight - 8;
  }

  if (left < window.scrollX + 16) {
    left = window.scrollX + 16;
  }

  if (top < window.scrollY + 16) {
    top = window.scrollY + 16;
  }

  popup.style.left = `${left}px`;
  popup.style.top = `${top}px`;
}

function repositionCurrentAssignmentPopup() {
  if (!currentAssignmentPopup || !currentAssignmentButton) return;

  positionAssignmentPopup(currentAssignmentPopup, currentAssignmentButton);
}

function openAssignmentPopup(button, employeeId) {
  closeAssignmentPopup();

  const currentData = getCurrentMonthData();
  const employee = currentData.employees.find((employee) => employee.id === employeeId);

  if (!employee) return;

  const capacityUsed = getEmployeeCapacityUsed(employee);
  const availableCapacity = MAX_EMPLOYEE_CAPACITY - capacityUsed;

  const popup = document.createElement("div");
  popup.className = "assignment-popup";

  const assignedProjectIds = (employee.assignments || []).map((assignment) => {
    return assignment.projectId;
  });

  const availableProjects = currentData.projects.filter((project) => {
    return !assignedProjectIds.includes(project.id);
  });

  const projectOptions = availableProjects
    .map((project) => {
      const used = getProjectUsedEffectiveCapacity(project, currentData.employees);

      return `
      <option value="${project.id}">
        ${project.projectName} (${used.toFixed(1)}/${project.employeeCapacity})
      </option>
    `;
    })
    .join("");

  if (availableProjects.length === 0) {
    popup.innerHTML = `
    <h3>Assign ${employee.name} ${employee.surname}</h3>
    <p class="assignment-error">No available projects to assign.</p>
    <div class="assignment-popup-actions">
      <button type="button" class="assignment-cancel-btn">Close</button>
    </div>
  `;

    document.body.appendChild(popup);
    currentAssignmentPopup = popup;
    currentAssignmentButton = button;
    positionAssignmentPopup(popup, button);
    window.addEventListener("scroll", repositionCurrentAssignmentPopup);
    window.addEventListener("resize", repositionCurrentAssignmentPopup);

    popup.querySelector(".assignment-cancel-btn").addEventListener("click", closeAssignmentPopup);
    return;
  }

  popup.innerHTML = `
    <h3>Assign ${employee.name} ${employee.surname}</h3>

    <div class="assignment-popup-info">
      Current capacity: <strong>${capacityUsed.toFixed(1)}/${MAX_EMPLOYEE_CAPACITY}</strong><br>
      Available capacity: <strong>${availableCapacity.toFixed(1)}</strong>
    </div>

    <label for="assignment-project">Project</label>
    <select id="assignment-project">
      ${projectOptions}
    </select>

    <label for="assignment-capacity">
  Capacity: <span id="assignment-capacity-value">0.0</span>
    </label>
    <input id="assignment-capacity" type="range" min="0" max="${availableCapacity.toFixed(1)}" step="0.1" value="0">

    <label for="assignment-fit">
      Project fit: <span id="assignment-fit-value">1.0</span>
    </label>
    <input id="assignment-fit" type="range" min="0" max="1" step="0.1" value="1">

    <div class="assignment-popup-info">
      Effective capacity: <strong id="assignment-effective">0.100</strong><br>
      Project capacity after assignment: <strong id="assignment-project-capacity"></strong>
    </div>

    <p id="assignment-error" class="assignment-error"></p>

    <div class="assignment-popup-actions">
      <button type="button" class="assignment-cancel-btn">Cancel</button>
      <button type="button" class="assignment-save-btn">Save</button>
    </div>
  `;

  document.body.appendChild(popup);
  currentAssignmentPopup = popup;
  currentAssignmentButton = button;

  positionAssignmentPopup(popup, button);

  window.addEventListener("scroll", repositionCurrentAssignmentPopup);
  window.addEventListener("resize", repositionCurrentAssignmentPopup);

  const capacityInput = popup.querySelector("#assignment-capacity");
  const fitInput = popup.querySelector("#assignment-fit");
  const capacityValue = popup.querySelector("#assignment-capacity-value");
  const fitValue = popup.querySelector("#assignment-fit-value");
  const effectiveValue = popup.querySelector("#assignment-effective");
  const projectCapacityValue = popup.querySelector("#assignment-project-capacity");
  const errorText = popup.querySelector("#assignment-error");

  function updateAssignPreview() {
    const projectId = popup.querySelector("#assignment-project").value;
    const project = currentData.projects.find((project) => project.id === projectId);

    const capacity = Number(capacityInput.value);
    const fit = Number(fitInput.value);
    const vacationCoefficient = getVacationCoefficient(employee);
    const effectiveCapacity = capacity * fit * vacationCoefficient;

    const currentProjectUsed = getProjectUsedEffectiveCapacity(project, currentData.employees);
    const projectedUsed = currentProjectUsed + effectiveCapacity;

    capacityValue.textContent = capacity.toFixed(1);
    fitValue.textContent = fit.toFixed(1);
    effectiveValue.textContent = effectiveCapacity.toFixed(3);
    projectCapacityValue.textContent = `${projectedUsed.toFixed(1)}/${project.employeeCapacity}`;

    if (projectedUsed > project.employeeCapacity) {
      errorText.textContent = "Warning: project capacity will be exceeded. Reduce capacity or project fit if you want to avoid over-capacity.";
    } else {
      errorText.textContent = "";
    }
  }

  capacityInput.addEventListener("input", updateAssignPreview);
  fitInput.addEventListener("input", updateAssignPreview);
  popup.querySelector("#assignment-project").addEventListener("change", updateAssignPreview);
  updateAssignPreview();

  popup.querySelector(".assignment-cancel-btn").addEventListener("click", closeAssignmentPopup);

  popup.querySelector(".assignment-save-btn").addEventListener("click", () => {
    const projectId = popup.querySelector("#assignment-project").value;
    const capacity = Number(capacityInput.value);
    const fit = Number(fitInput.value);

    employee.assignments.push({
      projectId,
      capacity,
      fit,
    });

    saveToLocalStorage();
    closeAssignmentPopup();
    renderCurrentMonthData();
  });

  setTimeout(() => {
    document.addEventListener("click", handleAssignmentOutsideClick);
  }, 0);
}

function handleAssignmentOutsideClick(e) {
  if (
    currentAssignmentPopup &&
    !currentAssignmentPopup.contains(e.target) &&
    !e.target.classList.contains("assign-btn") &&
    !e.target.classList.contains("edit-assignment-btn")
  ) {
    closeAssignmentPopup();
    document.removeEventListener("click", handleAssignmentOutsideClick);
  }
}

employeesTableBody.addEventListener("click", (e) => {
  const assignButton = e.target.closest(".assign-btn");

  if (!assignButton) return;
  if (assignButton.disabled) return;

  const employeeId = assignButton.dataset.id;

  openAssignmentPopup(assignButton, employeeId);
});


// Action menu
let currentActionMenu = null;

function closeActionMenu() {
  if (currentActionMenu) {
    currentActionMenu.remove();
    currentActionMenu = null;
  }
}

function openActionMenu(button, options) {
  closeActionMenu();

  const menu = document.createElement("div");
  menu.className = "action-menu";

  options.forEach(({ label, className, onClick }) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;
    btn.className = className;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      onClick();
      closeActionMenu();
    });

    menu.appendChild(btn);
  });

  document.body.appendChild(menu);

  const rect = button.getBoundingClientRect();

  menu.style.top = `${rect.bottom + window.scrollY + 6}px`;
  menu.style.left = `${rect.left + window.scrollX}px`;

  currentActionMenu = menu;
}

document.addEventListener("click", (e) => {
  if (
    currentActionMenu &&
    !currentActionMenu.contains(e.target) &&
    !e.target.closest(".details-link")
  ) {
    closeActionMenu();
  }
});

// Navigation links from details popups
function switchToProjectsWithFilter(projectName) {
  projectFilters = { projectName };
  employeeFilters = {};

  projectsContent.classList.remove("hidden");
  employeesContent.classList.add("hidden");

  navProjects.classList.add("active");
  navEmployees.classList.remove("active");

  localStorage.setItem(ACTIVE_TAB_KEY, "projects");

  moveFiltersRowToActiveTab();
  renderCurrentMonthData();
}

function switchToEmployeesWithFilter(name, surname) {
  employeeFilters = { name, surname };
  projectFilters = {};

  employeesContent.classList.remove("hidden");
  projectsContent.classList.add("hidden");

  navEmployees.classList.add("active");
  navProjects.classList.remove("active");

  localStorage.setItem(ACTIVE_TAB_KEY, "employees");

  moveFiltersRowToActiveTab();
  renderCurrentMonthData();
}

// Show Project Employees popup
function openProjectEmployeesPopup(projectId) {
  closeDetailsPopup();

  const currentData = getCurrentMonthData();
  const project = currentData.projects.find(p => p.id === projectId);

  if (!project) return;

  const overlay = document.createElement("div");
  overlay.className = "details-overlay";

  const popup = document.createElement("div");
  popup.className = "details-popup";

  const assignments = getProjectAssignments(projectId, currentData.employees);

  const rows = assignments.map(({ employee, assignment }) => {
    const vacationCoefficient = getVacationCoefficient(employee);
    const effectiveCapacity = getEffectiveCapacity(employee, assignment);
    const revenue = getAssignmentRevenue(project, employee, assignment, currentData.employees);
    const cost = getEmployeeCost(employee, assignment);
    const profit = revenue - cost;

    return `
      <tr>
        <td>
          <button
            type="button"
            class="details-link go-to-employee-btn"
            data-name="${employee.name}"
            data-surname="${employee.surname}"
      >
        ${employee.name} ${employee.surname}
      </button>
    </td>
        <td>${assignment.capacity.toFixed(2)}</td>
        <td>${assignment.fit.toFixed(2)}</td>
        <td>${(employee.vacationDays || []).length}</td>
        <td>${vacationCoefficient.toFixed(3)}</td>
        <td>${effectiveCapacity.toFixed(3)}</td>
        <td>${formatCurrency(revenue)}</td>
        <td>${formatCurrency(cost)}</td>
        <td class="${getIncomeClass(profit)}">${formatCurrency(profit)}</td>
        <td>
          <button
            class="edit-assignment-btn"
            data-employee-id="${employee.id}"
            data-project-id="${project.id}">
            Edit
          </button>

          <button
            class="delete-btn unassign-btn"
            data-employee-id="${employee.id}"
            data-project-id="${project.id}">
            Unassign
          </button>
        </td>
      </tr>
    `;
  }).join("");

  popup.innerHTML = `
    <div class="details-popup-header">
      <h2>Employees: ${project.projectName}</h2>
      <button type="button" class="details-close-btn">×</button>
    </div>

    <div class="details-popup-body">
      ${assignments.length === 0
      ? `<div class="empty-state">No employees assigned to this project.</div>`
      : `
          <table class="details-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Capacity</th>
                <th>Fit</th>
                <th>Vacation Days</th>
                <th>Vacation Coef.</th>
                <th>Effective Capacity</th>
                <th>Revenue</th>
                <th>Cost</th>
                <th>Profit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        `}
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  overlay.addEventListener("click", closeDetailsPopup);
  popup.querySelector(".details-close-btn").addEventListener("click", closeDetailsPopup);
}

projectsTableBody.addEventListener("click", (e) => {
  const button = e.target.closest(".show-project-employees-btn");

  if (!button) return;

  const projectId = button.dataset.id;

  openProjectEmployeesPopup(projectId);
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".go-to-project-btn");
  if (!btn) return;

  e.stopPropagation();

  const projectName = btn.dataset.projectName;
  const employeeId = btn.closest("tr")?.querySelector(".unassign-btn")?.dataset.employeeId;
  const projectId = btn.dataset.projectId || btn.closest("tr")?.querySelector(".unassign-btn")?.dataset.projectId;

  openActionMenu(btn, [
    {
      label: "See at Projects",
      className: "show-btn",
      onClick: () => {
        closeDetailsPopup();
        switchToProjectsWithFilter(projectName);
      },
    },
    {
      label: "Unassign",
      className: "delete-btn",
      onClick: () => {
        openUnassignConfirmationPopup(employeeId, projectId);
      },
    },
  ]);
});

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".go-to-employee-btn");
  if (!btn) return;

  e.stopPropagation();

  const name = btn.dataset.name;
  const surname = btn.dataset.surname;
  const employeeId = btn.closest("tr")?.querySelector(".unassign-btn")?.dataset.employeeId;
  const projectId = btn.closest("tr")?.querySelector(".unassign-btn")?.dataset.projectId;

  openActionMenu(btn, [
    {
      label: "See at Employees",
      className: "show-btn",
      onClick: () => {
        closeDetailsPopup();
        switchToEmployeesWithFilter(name, surname);
      },
    },
    {
      label: "Unassign",
      className: "delete-btn",
      onClick: () => {
        openUnassignConfirmationPopup(employeeId, projectId);
      },
    },
  ]);
});

// Show Assignments popup
function closeDetailsPopup() {
  closeAssignmentPopup();
  closeActionMenu();
  document.querySelector(".details-overlay")?.remove();
  document.querySelector(".details-popup")?.remove();
}

function openEmployeeAssignmentsPopup(employeeId) {
  closeDetailsPopup();

  const currentData = getCurrentMonthData();
  const employee = currentData.employees.find((employee) => employee.id === employeeId);

  if (!employee) return;

  const overlay = document.createElement("div");
  overlay.className = "details-overlay";

  const popup = document.createElement("div");
  popup.className = "details-popup";

  const assignments = employee.assignments || [];

  const rows = assignments.map((assignment) => {
    const project = currentData.projects.find((project) => project.id === assignment.projectId);

    if (!project) return "";

    const vacationCoefficient = getVacationCoefficient(employee);
    const effectiveCapacity = getEffectiveCapacity(employee, assignment);
    const revenue = getAssignmentRevenue(project, employee, assignment, currentData.employees);
    const cost = getEmployeeCost(employee, assignment);
    const profit = revenue - cost;

    return `
      <tr>
        <td>
      <button
      type="button"
      class="details-link go-to-project-btn"
      data-project-name="${project.projectName}"
      >
        ${project.projectName}
        </button>
        </td>
        <td>${assignment.capacity.toFixed(2)}</td>
        <td>${assignment.fit.toFixed(2)}</td>
        <td>${(employee.vacationDays || []).length}</td>
        <td>${vacationCoefficient.toFixed(3)}</td>
        <td>${effectiveCapacity.toFixed(3)}</td>
        <td>${formatCurrency(revenue)}</td>
        <td>${formatCurrency(cost)}</td>
        <td class="${getIncomeClass(profit)}">${formatCurrency(profit)}</td>
        <td>
        <button
            class="edit-assignment-btn"
            data-employee-id="${employee.id}"
            data-project-id="${project.id}"
  >
    Edit
</button>
        <button
            class="delete-btn unassign-btn"
            data-employee-id="${employee.id}"
            data-project-id="${project.id}"
  >
    Unassign
  </button>
</td>
      </tr>
    `;
  }).join("");

  popup.innerHTML = `
    <div class="details-popup-header">
      <h2>Assignments: ${employee.name} ${employee.surname}</h2>
      <button type="button" class="details-close-btn">×</button>
    </div>

    <div class="details-popup-body">
      ${assignments.length === 0
      ? `<div class="empty-state">This employee has no assignments.</div>`
      : `
            <table class="details-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Capacity</th>
                  <th>Fit</th>
                  <th>Vacation Days</th>
                  <th>Vacation Coef.</th>
                  <th>Effective Capacity</th>
                  <th>Revenue</th>
                  <th>Cost</th>
                  <th>Profit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          `
    }
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  overlay.addEventListener("click", closeDetailsPopup);
  popup.querySelector(".details-close-btn").addEventListener("click", closeDetailsPopup);
}

employeesTableBody.addEventListener("click", (e) => {
  const button = e.target.closest(".show-assignments-btn");

  if (!button) return;

  const employeeId = button.dataset.id;

  openEmployeeAssignmentsPopup(employeeId);
});

function openUnassignConfirmationPopup(employeeId, projectId) {
  closeAssignmentPopup();

  const currentData = getCurrentMonthData();
  const employee = currentData.employees.find((employee) => employee.id === employeeId);
  const project = currentData.projects.find((project) => project.id === projectId);

  if (!employee || !project) return;

  const assignment = (employee.assignments || []).find((assignment) => {
    return assignment.projectId === projectId;
  });

  if (!assignment) return;

  const currentProjectIncome = calculateProjectProfit(project, currentData.employees);
  const currentProjectUsed = getProjectUsedEffectiveCapacity(project, currentData.employees);

  const assignmentRevenue = getAssignmentRevenue(project, employee, assignment, currentData.employees);
  const assignmentCost = getEmployeeCost(employee, assignment);
  const assignmentProfit = assignmentRevenue - assignmentCost;

  const employeesAfterUnassign = cloneData(currentData.employees);
  const employeeAfterUnassign = employeesAfterUnassign.find((item) => item.id === employeeId);

  employeeAfterUnassign.assignments = (employeeAfterUnassign.assignments || []).filter((assignment) => {
    return assignment.projectId !== projectId;
  });

  const projectIncomeAfter = calculateProjectProfit(project, employeesAfterUnassign);
  const projectUsedAfter = getProjectUsedEffectiveCapacity(project, employeesAfterUnassign);

  const overlay = document.createElement("div");
  overlay.className = "details-overlay";

  const popup = document.createElement("div");
  popup.className = "details-popup";

  popup.innerHTML = `
    <div class="details-popup-header">
      <h2>Confirm Unassign</h2>
      <button type="button" class="details-close-btn">×</button>
    </div>

    <div class="details-popup-body">
      <p>
        Are you sure you want to unassign
        <strong>${employee.name} ${employee.surname}</strong>
        from <strong>${project.projectName}</strong>?
      </p>

      <div class="unassign-summary">
        <div><strong>Assigned Capacity:</strong><span>${assignment.capacity.toFixed(1)}</span></div>
        <div><strong>Employee Salary Share:</strong><span>${formatCurrency(assignmentCost)}</span></div>
        <div><strong>Budget Share:</strong><span>${formatCurrency(assignmentRevenue)}</span></div>
      <div>
        <strong>Employee Estimated Income:</strong>
        <span class="${getIncomeClass(assignmentProfit)}">${formatCurrency(assignmentProfit)}</span>
      </div>
      <div><strong>Current Project Capacity:</strong><span>${currentProjectUsed.toFixed(1)} / ${project.employeeCapacity}</span></div>
      <div><strong>Capacity After Unassignment:</strong><span>${projectUsedAfter.toFixed(1)} / ${project.employeeCapacity}</span></div>
      <div>
        <strong>Project Income Now:</strong>
        <span class="${getIncomeClass(currentProjectIncome)}">${formatCurrency(currentProjectIncome)}</span>
      </div>
  <div>
    <strong>Project Income After:</strong>
    <span class="${getIncomeClass(projectIncomeAfter)}">${formatCurrency(projectIncomeAfter)}</span>
  </div>
</div>

      <div class="assignment-popup-actions">
        <button type="button" class="assignment-cancel-btn">Cancel</button>
        <button type="button" class="delete-btn confirm-unassign-btn">Unassign</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  function closeUnassignPopup() {
    overlay.remove();
    popup.remove();
  }

  overlay.addEventListener("click", closeUnassignPopup);
  popup.querySelector(".details-close-btn").addEventListener("click", closeUnassignPopup);
  popup.querySelector(".assignment-cancel-btn").addEventListener("click", closeUnassignPopup);

  popup.querySelector(".confirm-unassign-btn").addEventListener("click", () => {
    employee.assignments = (employee.assignments || []).filter((assignment) => {
      return assignment.projectId !== projectId;
    });

    saveToLocalStorage();
    closeUnassignPopup();
    renderCurrentMonthData();
    openEmployeeAssignmentsPopup(employeeId);
  });
}

document.addEventListener("click", (e) => {
  const button = e.target.closest(".unassign-btn");

  if (!button) return;

  const employeeId = button.dataset.employeeId;
  const projectId = button.dataset.projectId;

  openUnassignConfirmationPopup(employeeId, projectId);
});

function openEditAssignmentPopup(button, employeeId, projectId) {
  closeAssignmentPopup();

  const currentData = getCurrentMonthData();

  const employee = currentData.employees.find((employee) => employee.id === employeeId);
  if (!employee) return;

  const project = currentData.projects.find((project) => project.id === projectId);
  if (!project) return;

  const assignment = (employee.assignments || []).find(
    (assignment) => assignment.projectId === projectId
  );

  if (!assignment) return;

  const currentCapacityUsed = getEmployeeCapacityUsed(employee);
  const capacityWithoutCurrent = currentCapacityUsed - assignment.capacity;
  const availableCapacity = MAX_EMPLOYEE_CAPACITY - capacityWithoutCurrent;

  const popup = document.createElement("div");
  popup.className = "assignment-popup";

  popup.innerHTML = `
    <h3>Edit Assignment</h3>

    <div class="assignment-popup-info">
      <strong>${employee.name} ${employee.surname}</strong><br>
      Project: <strong>${project.projectName}</strong><br>
      Current total capacity: <strong>${currentCapacityUsed.toFixed(1)}/${MAX_EMPLOYEE_CAPACITY}</strong><br>
      Available for this assignment: <strong>${availableCapacity.toFixed(1)}</strong>
    </div>

    <label for="edit-assignment-capacity">
      Capacity: <span id="edit-assignment-capacity-value">${assignment.capacity.toFixed(1)}</span>
    </label>
    <input
      id="edit-assignment-capacity"
      type="range"
      min="0"
      max="${availableCapacity.toFixed(1)}"
      step="0.1"
      value="${assignment.capacity.toFixed(1)}"
    >

    <label for="edit-assignment-fit">
      Project fit: <span id="edit-assignment-fit-value">${assignment.fit.toFixed(1)}</span>
    </label>
    <input
      id="edit-assignment-fit"
      type="range"
      min="0"
      max="1"
      step="0.1"
      value="${assignment.fit.toFixed(1)}"
    >

    <div class="assignment-popup-info">
      Effective capacity: <strong id="edit-assignment-effective">
        ${(assignment.capacity * assignment.fit * getVacationCoefficient(employee)).toFixed(3)}
      </strong><br>
      Project capacity after edit: <strong id="edit-project-capacity"></strong>
    </div>

    <p id="edit-assignment-error" class="assignment-error"></p>

    <div class="assignment-popup-actions">
      <button type="button" class="assignment-cancel-btn">Cancel</button>
      <button type="button" class="assignment-save-btn">Save</button>
    </div>
  `;

  document.body.appendChild(popup);
  currentAssignmentPopup = popup;
  currentAssignmentButton = button;

  positionAssignmentPopup(popup, button);
  window.addEventListener("scroll", repositionCurrentAssignmentPopup);
  window.addEventListener("resize", repositionCurrentAssignmentPopup);

  const capacityInput = popup.querySelector("#edit-assignment-capacity");
  const fitInput = popup.querySelector("#edit-assignment-fit");
  const capacityValue = popup.querySelector("#edit-assignment-capacity-value");
  const fitValue = popup.querySelector("#edit-assignment-fit-value");
  const effectiveValue = popup.querySelector("#edit-assignment-effective");
  const projectCapacityValue = popup.querySelector("#edit-project-capacity");
  const errorText = popup.querySelector("#edit-assignment-error");

  function updateEditPreview() {
    const capacity = Number(capacityInput.value);
    const fit = Number(fitInput.value);
    const vacationCoefficient = getVacationCoefficient(employee);

    const effectiveCapacity = capacity * fit * vacationCoefficient;

    const currentProjectUsed = getProjectUsedEffectiveCapacity(project, currentData.employees);

    const currentAssignmentEffective =
      assignment.capacity *
      assignment.fit *
      getVacationCoefficient(employee);

    const projectedUsed =
      currentProjectUsed - currentAssignmentEffective + effectiveCapacity;

    capacityValue.textContent = capacity.toFixed(1);
    fitValue.textContent = fit.toFixed(1);
    effectiveValue.textContent = effectiveCapacity.toFixed(3);
    projectCapacityValue.textContent = `${projectedUsed.toFixed(1)}/${project.employeeCapacity}`;

    if (projectedUsed > project.employeeCapacity) {
      errorText.textContent =
        "Warning: project capacity will be exceeded. Reduce capacity or project fit if you want to avoid over-capacity.";
    } else {
      errorText.textContent = "";
    }
  }

  capacityInput.addEventListener("input", updateEditPreview);
  fitInput.addEventListener("input", updateEditPreview);
  updateEditPreview();

  popup.querySelector(".assignment-cancel-btn").addEventListener("click", closeAssignmentPopup);

  popup.querySelector(".assignment-save-btn").addEventListener("click", () => {
    const capacity = Number(capacityInput.value);
    const fit = Number(fitInput.value);

    assignment.capacity = capacity;
    assignment.fit = fit;

    saveToLocalStorage();
    closeAssignmentPopup();
    renderCurrentMonthData();
    openEmployeeAssignmentsPopup(employeeId);
  });

  setTimeout(() => {
    document.addEventListener("click", handleAssignmentOutsideClick);
  }, 0);
}

document.addEventListener("click", (e) => {
  const button = e.target.closest(".edit-assignment-btn");

  if (!button) return;

  const employeeId = button.dataset.employeeId;
  const projectId = button.dataset.projectId;

  openEditAssignmentPopup(button, employeeId, projectId);
});

// Availability
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getVacationWorkingDays(vacationDays, year, month) {
  return vacationDays.filter((dayNumber) => {
    const date = new Date(year, month, dayNumber);
    const day = date.getDay();

    return day !== 0 && day !== 6;
  }).length;
}

function formatVacationRanges(days, month) {
  if (!days.length) return "No vacation days selected";

  const year = getCurrentYear();

  const sortedDays = [...days].sort((a, b) => a - b);
  const ranges = [];

  let start = sortedDays[0];
  let previous = sortedDays[0];

  function isWeekend(day) {
    const date = new Date(year, month, day);
    const d = date.getDay();
    return d === 0 || d === 6;
  }

  for (let i = 1; i < sortedDays.length; i++) {
    const current = sortedDays[i];

    let isContinuous = false;

    if (current === previous + 1) {
      isContinuous = true;
    } else {
      let onlyWeekendsBetween = true;

      for (let d = previous + 1; d < current; d++) {
        if (!isWeekend(d)) {
          onlyWeekendsBetween = false;
          break;
        }
      }

      if (onlyWeekendsBetween) {
        isContinuous = true;
      }
    }

    if (isContinuous) {
      previous = current;
    } else {
      ranges.push([start, previous]);
      start = current;
      previous = current;
    }
  }

  ranges.push([start, previous]);

  return ranges.map(([rangeStart, rangeEnd]) => {
    const startText = `${String(rangeStart).padStart(2, "0")}.${String(month + 1).padStart(2, "0")}`;
    const endText = `${String(rangeEnd).padStart(2, "0")}.${String(month + 1).padStart(2, "0")}`;

    return rangeStart === rangeEnd ? startText : `${startText}-${endText}`;
  }).join(", ");
}

function openAvailabilityCalendar(employeeId) {
  closeDetailsPopup();

  const currentData = getCurrentMonthData();
  const employee = currentData.employees.find((employee) => employee.id === employeeId);

  if (!employee) return;

  const year = getCurrentYear();
  const month = getCurrentMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  const totalWorkingDays = getWorkingDaysInMonth(year, month);

  let selectedDays = [...(employee.vacationDays || [])];

  const overlay = document.createElement("div");
  overlay.className = "details-overlay";

  const popup = document.createElement("div");
  popup.className = "details-popup";

  popup.innerHTML = `
    <div class="details-popup-header">
      <h2>Availability: ${employee.name} ${employee.surname}</h2>
      <button type="button" class="details-close-btn">×</button>
    </div>

    <div class="details-popup-body">
      <h3>${monthNames[month]} ${year}</h3>

      <div class="calendar-info">
        <strong id="working-days-text"></strong><br>
        <span id="vacation-ranges-text"></span>
      </div>

      <div class="calendar-grid" id="calendar-grid"></div>

      <div class="calendar-actions">
        <button type="button" class="assignment-cancel-btn">Cancel</button>
        <button type="button" class="assignment-save-btn">Set Vacation</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  const calendarGrid = popup.querySelector("#calendar-grid");
  const workingDaysText = popup.querySelector("#working-days-text");
  const vacationRangesText = popup.querySelector("#vacation-ranges-text");

  function updateCalendarInfo() {
    const vacationWorkingDays = getVacationWorkingDays(selectedDays, year, month);
    const actualWorkingDays = totalWorkingDays - vacationWorkingDays;

    workingDaysText.textContent = `Working Days: ${actualWorkingDays}/${totalWorkingDays} days`;
    vacationRangesText.textContent = formatVacationRanges(selectedDays, month);
  }

  function renderCalendarGrid() {
    calendarGrid.innerHTML = "";

    ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((dayName) => {
      const item = document.createElement("div");
      item.className = "calendar-day-name";
      item.textContent = dayName;
      calendarGrid.appendChild(item);
    });

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement("button");
      empty.className = "calendar-day empty";
      calendarGrid.appendChild(empty);
    }

    const today = new Date();

    for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
      const date = new Date(year, month, dayNumber);
      const day = date.getDay();

      const button = document.createElement("button");
      button.type = "button";
      button.className = "calendar-day";
      button.textContent = dayNumber;
      button.dataset.day = dayNumber;

      if (day === 0 || day === 6) {
        button.classList.add("weekend");
      }

      if (
        today.getFullYear() === year &&
        today.getMonth() === month &&
        today.getDate() === dayNumber
      ) {
        button.classList.add("today");
      }

      if (selectedDays.includes(dayNumber)) {
        button.classList.add("vacation");
      }

      button.addEventListener("click", () => {
        if (selectedDays.includes(dayNumber)) {
          selectedDays = selectedDays.filter((day) => day !== dayNumber);
        } else {
          selectedDays.push(dayNumber);
        }

        renderCalendarGrid();
        updateCalendarInfo();
      });

      calendarGrid.appendChild(button);
    }
  }

  renderCalendarGrid();
  updateCalendarInfo();

  overlay.addEventListener("click", closeDetailsPopup);
  popup.querySelector(".details-close-btn").addEventListener("click", closeDetailsPopup);
  popup.querySelector(".assignment-cancel-btn").addEventListener("click", closeDetailsPopup);

  popup.querySelector(".assignment-save-btn").addEventListener("click", () => {
    employee.vacationDays = [...selectedDays].sort((a, b) => a - b);

    saveToLocalStorage();
    closeDetailsPopup();
    renderCurrentMonthData();
  });
}

employeesTableBody.addEventListener("click", (e) => {
  const button = e.target.closest(".availability-btn");

  if (!button) return;

  const employeeId = button.dataset.id;

  openAvailabilityCalendar(employeeId);
});

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
const filtersRow = document.getElementById("filters-row");

function moveFiltersRowToActiveTab() {
  const activeContent =
    getActiveTab() === "employees" ? employeesContent : projectsContent;

  const header = activeContent.querySelector(".content-header");

  header.insertAdjacentElement("afterend", filtersRow);
}

function restoreActiveTab() {
  const activeTab = localStorage.getItem(ACTIVE_TAB_KEY);

  if (activeTab === "employees") {
    employeesContent.classList.remove("hidden");
    projectsContent.classList.add("hidden");

    navEmployees.classList.add("active");
    navProjects.classList.remove("active");
  } else {
    projectsContent.classList.remove("hidden");
    employeesContent.classList.add("hidden");

    navProjects.classList.add("active");
    navEmployees.classList.remove("active");
  }
}

function restoreSelectedPeriod() {
  const savedMonth = localStorage.getItem(SELECTED_MONTH_KEY);
  const savedYear = localStorage.getItem(SELECTED_YEAR_KEY);

  const currentDate = new Date();
  const currentMonth = String(currentDate.getMonth());
  const currentYear = String(currentDate.getFullYear());

  monthSelect.value = savedMonth !== null ? savedMonth : currentMonth;

  const yearExists = [...yearSelect.options].some((option) => {
    return option.value === currentYear;
  });

  yearSelect.value = savedYear !== null ? savedYear : yearExists ? currentYear : "2026";
}

navProjects.addEventListener("click", (e) => {
  e.preventDefault();

  projectsContent.classList.remove("hidden");
  employeesContent.classList.add("hidden");

  navProjects.classList.add("active");
  navEmployees.classList.remove("active");

  localStorage.setItem(ACTIVE_TAB_KEY, "projects");
  moveFiltersRowToActiveTab();
  renderFilterChips();
});

navEmployees.addEventListener("click", (e) => {
  e.preventDefault();

  employeesContent.classList.remove("hidden");
  projectsContent.classList.add("hidden");

  navEmployees.classList.add("active");
  navProjects.classList.remove("active");

  localStorage.setItem(ACTIVE_TAB_KEY, "employees");
  moveFiltersRowToActiveTab();
  renderFilterChips();
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

// Forms
const projectForm = document.getElementById("project-form");
const employeeForm = document.getElementById("employee-form");

const projectAddBtn = projectForm.querySelector(".panel-add-btn");
const employeeAddBtn = employeeForm.querySelector(".panel-add-btn");

projectAddBtn.disabled = true;
employeeAddBtn.disabled = true;

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

  const alphanumeric = /^[A-Za-zА-Яа-яЁё0-9\s-]+$/;

  const isProjectNameValid =
    projectName.value.trim().length >= 3 &&
    alphanumeric.test(projectName.value.trim());

  const isCompanyNameValid =
    companyName.value.trim().length >= 2 &&
    alphanumeric.test(companyName.value.trim());

  const isBudgetValid =
    Number(budget.value) > 0 &&
    /^\d+(\.\d{1,2})?$/.test(budget.value);

  const isCapacityValid =
    Number(capacity.value) >= 1 &&
    Number.isInteger(Number(capacity.value));

  setFieldState(projectName, document.getElementById("project-name-error"), isProjectNameValid, "Project name must be at least 3 characters and contain only letters or numbers");
  setFieldState(companyName, document.getElementById("company-name-error"), isCompanyNameValid, "Company name must be at least 2 characters and contain only letters or numbers");
  setFieldState(budget, document.getElementById("project-budget-error"), isBudgetValid, "Budget must be greater than 0 and have max 2 decimal places");
  setFieldState(capacity, document.getElementById("employee-capacity-error"), isCapacityValid, "Employee capacity must be a whole number and at least 1");

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
  const isSalaryValid =
    Number(salary.value) > 0 &&
    /^\d+(\.\d{1,2})?$/.test(salary.value);

  setFieldState(name, document.getElementById("employee-name-error"), isNameValid, "Name must be at least 3 characters and contain only letters");
  setFieldState(surname, document.getElementById("employee-surname-error"), isSurnameValid, "Surname must be at least 3 characters and contain only letters");
  setFieldState(dob, document.getElementById("employee-dob-error"), isDobValid, "You must be at least 18 years old");
  setFieldState(position, document.getElementById("employee-position-error"), isPositionValid, "Please select a position");
  setFieldState(salary, document.getElementById("employee-salary-error"), isSalaryValid, "Salary must be greater than 0 and have max 2 decimal places");

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
    id: crypto.randomUUID(),
    companyName: document.getElementById("company-name").value.trim(),
    projectName: document.getElementById("project-name").value.trim(),
    budget: Number(document.getElementById("project-budget").value),
    employeeCapacity: Number(document.getElementById("employee-capacity").value),
  };

  currentData.projects.push(newProject);

  saveToLocalStorage();

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
    id: crypto.randomUUID(),
    name: document.getElementById("employee-name").value.trim(),
    surname: document.getElementById("employee-surname").value.trim(),
    dateOfBirth: document.getElementById("employee-dob").value,
    position: document.getElementById("employee-position").value,
    salary,
    vacationDays: [],
    assignments: [],
  };

  currentData.employees.push(newEmployee);

  saveToLocalStorage();

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
const seedTableBody = document.getElementById("seed-table-body");
const overlay = document.getElementById("seed-overlay");
const closeSeedModal = document.getElementById("close-seed-modal");
const currentSeedPeriod = document.getElementById("current-seed-period");

function renderSeedTable() {
  seedTableBody.innerHTML = "";

  const currentKey = getCurrentPeriodKey();

  Object.keys(monthlyData).forEach((key) => {
    if (key === currentKey) return;

    const data = monthlyData[key];

    if (data.projects.length === 0 && data.employees.length === 0) return;

    const [year, month] = key.split("-");
    const result = calculateTotalEstimatedIncome(data.projects, data.employees);

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${year}</td>
      <td>${monthNames[Number(month)]}</td>
      <td>${data.projects.length}</td>
      <td>${data.employees.length}</td>
      <td class="${getIncomeClass(result.totalIncome)}">
        ${formatCurrency(result.totalIncome)}
      </td>
      <td>
        <button class="seed-btn" data-source-key="${key}">Seed</button>
      </td>
    `;

    seedTableBody.appendChild(row);
  });
}

seedBtn.addEventListener("click", () => {
  renderSeedTable();

  const year = yearSelect.value;
  const month = monthNames[Number(monthSelect.value)];

  currentSeedPeriod.textContent = `${month} ${year}`;

  seedModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
});

closeSeedModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

function closeModal() {
  seedModal.classList.add("hidden");
  overlay.classList.add("hidden");
}

function seedDataFromMonth(sourceKey) {
  const currentKey = getCurrentPeriodKey();

  if (sourceKey === currentKey) return;

  const sourceData = monthlyData[sourceKey];

  if (!sourceData) return;

  openSeedConfirmationPopup(sourceKey, currentKey);
}

function openSeedConfirmationPopup(sourceKey, currentKey) {
  const sourceData = monthlyData[sourceKey];

  if (!sourceData) return;

  const [sourceYear, sourceMonth] = sourceKey.split("-");
  const [currentYear, currentMonth] = currentKey.split("-");

  const overlay = document.createElement("div");
  overlay.className = "details-overlay";

  const popup = document.createElement("div");
  popup.className = "details-popup seed-confirm-popup";

  popup.innerHTML = `
    <div class="details-popup-header">
      <h2>Confirm Seed Data</h2>
      <button type="button" class="details-close-btn">×</button>
    </div>

    <div class="details-popup-body">
      <p>
        Copy data from
        <strong>${monthNames[Number(sourceMonth)]} ${sourceYear}</strong>
        to
        <strong>${monthNames[Number(currentMonth)]} ${currentYear}</strong>?
      </p>

      <p class="assignment-error">
        Current month data will be replaced.
      </p>

      <div class="assignment-popup-actions">
        <button type="button" class="assignment-cancel-btn">Cancel</button>
        <button type="button" class="assignment-save-btn confirm-seed-btn">Seed</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(popup);

  function closeSeedConfirmationPopup() {
    overlay.remove();
    popup.remove();
  }

  overlay.addEventListener("click", closeSeedConfirmationPopup);
  popup.querySelector(".details-close-btn").addEventListener("click", closeSeedConfirmationPopup);
  popup.querySelector(".assignment-cancel-btn").addEventListener("click", closeSeedConfirmationPopup);

  popup.querySelector(".confirm-seed-btn").addEventListener("click", () => {
    monthlyData[currentKey] = cloneData(sourceData);

    monthlyData[currentKey].employees.forEach((employee) => {
      employee.vacationDays = [];
    });

    saveToLocalStorage();
    closeSeedConfirmationPopup();
    closeModal();
    renderCurrentMonthData();
  });
}

seedModal.addEventListener("click", (e) => {
  if (!e.target.classList.contains("seed-btn")) return;

  const sourceKey = e.target.dataset.sourceKey;

  seedDataFromMonth(sourceKey);
});

// Init
loadFromLocalStorage();
restoreSelectedPeriod();
restoreActiveTab();
moveFiltersRowToActiveTab();
renderCurrentMonthData();
updateSortIcons("projects-table", projectSort);
updateSortIcons("employees-table", employeeSort);