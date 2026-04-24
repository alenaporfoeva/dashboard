// Side-panel
const sidePanel = document.getElementById("side-panel");
const toggleButton = document.getElementById("toggle-button");
const openButton = document.getElementById("open-button");
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

// Project/Employee
const navProjects = document.getElementById("nav-projects");
const navEmployees = document.getElementById("nav-employees");

const projectsContent = document.getElementById("projects-content");
const employeesContent = document.getElementById("employees-content");

navProjects.addEventListener("click", () => {
  projectsContent.classList.remove("hidden-section");
  employeesContent.classList.add("hidden-section");

  navProjects.classList.add("active");
  navEmployees.classList.remove("active");
});

navEmployees.addEventListener("click", () => {
  employeesContent.classList.remove("hidden-section");
  projectsContent.classList.add("hidden-section");

  navEmployees.classList.add("active");
  navProjects.classList.remove("active");
});

// Add project button
const addProjectBtn = document.getElementById("add-project-btn");
const projectPanel = document.getElementById("project-panel");
const cancelProjectBtn = document.getElementById("cancel-project-btn");

addProjectBtn.addEventListener("click", () => {
  projectPanel.classList.add("open");
});

cancelProjectBtn.addEventListener("click", () => {
  projectPanel.classList.remove("open");
});

// Add employee button
const addEmployeeBtn = document.getElementById("add-employee-btn");
const employeePanel = document.getElementById("employee-panel");
const cancelEmployeeBtn = document.getElementById("cancel-employee-btn");

addEmployeeBtn.addEventListener("click", () => {
  employeePanel.classList.add("open");
});

cancelEmployeeBtn.addEventListener("click", () => {
  employeePanel.classList.remove("open");
});

// Submit of project and employee form
const projectForm = document.getElementById("project-form");
const employeeForm = document.getElementById("employee-form");

projectForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

employeeForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

// Seed Data popup
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

// Januar 2025
const monthSelect = document.getElementById("month-select");
const yearSelect = document.getElementById("year-select");

const projectsTableBody = document.querySelector("#projects-table tbody");
const employeesTableBody = document.querySelector("#employees-table tbody");
const totalIncomeBlock = document.getElementById("projects-total-income");

const initialProjectsHTML = projectsTableBody.innerHTML;
const initialEmployeesHTML = employeesTableBody.innerHTML;

function updateDataByPeriod() {
  const selectedMonth = monthSelect.value;
  const selectedYear = yearSelect.value;

  if (selectedMonth === "0" && selectedYear === "2025") {
    projectsTableBody.innerHTML = initialProjectsHTML;
    employeesTableBody.innerHTML = initialEmployeesHTML;
    totalIncomeBlock.classList.remove("hidden");
  } else {
    projectsTableBody.innerHTML = "";
    employeesTableBody.innerHTML = "";
    totalIncomeBlock.classList.add("hidden");
  }
}

monthSelect.addEventListener("change", updateDataByPeriod);
yearSelect.addEventListener("change", updateDataByPeriod);

updateDataByPeriod();