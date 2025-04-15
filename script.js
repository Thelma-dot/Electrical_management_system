//   login   //
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("LoginForm");
  const staffIDInput = document.getElementById("staffID");
  const passwordInput = document.querySelector('input[type="password"]');

  // Demo users list
  const users = [
    { staffID: "h2412031", password: "password123" },
    { staffID: "tech002", password: "pass789" },
    { staffID: "supervisor03", password: "power123" }
];

  form.addEventListener("submit", (e) => {
      e.preventDefault();

      const staffID = staffIDInput.value.trim();
      const password = passwordInput.value.trim();

      if (staffID === "" || password === "") {
          alert("Please fill in all fields.");
          return;
      }

      const foundUser = users.find(
        (user) => user.staffID === staffID && user.password === password
    );

    if (foundUser) {
        console.log("Login successful. Redirecting...");
        window.location.href = "dashboard.html"; // Make sure this file exists
    } else {
        alert("Invalid Staff ID or Password.");
    }
});
});



// reset-password //
document.addEventListener("DOMContentLoaded", function () {
  const resetForm = document.querySelector("form");

  if (resetForm) {
      resetForm.addEventListener("submit", function (e) {
          e.preventDefault();

          const newPassword = document.querySelectorAll("input[type='password']")[0].value;
          const confirmPassword = document.querySelectorAll("input[type='password']")[1].value;

          if (newPassword !== confirmPassword) {
              alert("❌ Passwords do not match.");
              return;
          }

          if (!isStrongPassword(newPassword)) {
              alert("⚠️ Password must be at least 8 characters, include a number and an uppercase letter.");
              return;
          }

          // Save new password to localStorage (as a placeholder for a real backend)
          localStorage.setItem("resetPassword", newPassword);
          alert("✅ Password reset successfully! Redirecting to login...");

          setTimeout(() => {
              window.location.href = "index.html";
          }, 1500);
      });
  }
});

function isStrongPassword(password) {
  const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
}



// Bar Chart - Project Progress
const ctxBar = document.getElementById('progressChart').getContext('2d');
new Chart(ctxBar, {
  type: 'bar',
  data: {
    labels: ['Reports', 'Inventory', 'In Progress', 'Completed Task'],
    datasets: [{
      label: 'Progress',
      data: [15, 18, 25, 22],
      backgroundColor: '#3498db'
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    }
  }
});

// Line Chart - Reports
const ctxLine = document.getElementById('lineChart').getContext('2d');
new Chart(ctxLine, {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'sept', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Reports',
      data: [10, 15, 25, 22, 35, 25, 10, 20, 30, 45, 15, 35],
      borderColor: '#2980b9',
      backgroundColor: 'rgba(41, 128, 185, 0.2)',
      tension: 0.3
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    }
  }
});



// generate report //
// Function to generate a new report
function generateReport() {
  const title = document.getElementById('reportTitle').value;
  const jobDescription = document.getElementById('jobDescription').value;
  const location = document.getElementById('location').value;
  const remarks = document.getElementById('remarks').value;
  const reportDate = document.getElementById('reportDate').value;
  const reportTime = document.getElementById('reportTime').value;
  const toolsUsed = document.getElementById('toolsUsed').value;
  const status = document.querySelector('input[name="status"]:checked')?.value;

  // Ensure all fields are filled
  if (!title || !jobDescription || !location || !remarks || !reportDate || !reportTime || !toolsUsed || !status) {
    alert('Please fill in all fields before generating the report.');
    return;
  }

  // Create the report object
  const report = {
    title,
    jobDescription,
    location,
    remarks,
    reportDate,
    reportTime,
    toolsUsed,
    status
  };

  // Add the report to the table and save it to localStorage
  addReportToTable(report);
  saveReportToLocalStorage(report);
}

// Function to add a report to the table
function addReportToTable(report) {
  const tableBody = document.querySelector('#reportsTable tbody');
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${report.title}</td>
    <td>${report.jobDescription}</td>
    <td>${report.location}</td>
    <td>${report.remarks}</td>
    <td>${report.reportDate}</td>
    <td>${report.reportTime}</td>
    <td>${report.toolsUsed}</td>
    <td>${report.status}</td>
    <td>
      <button class="edit-btn" onclick="editReport(this)">Edit</button>
      <button class="save-btn hidden" onclick="saveReport(this)">Save</button>
    </td>
  `;

  tableBody.appendChild(row);
}

// Function to save a report to localStorage
function saveReportToLocalStorage(report) {
  let reports = JSON.parse(localStorage.getItem('reports')) || [];
  reports.push(report);
  localStorage.setItem('reports', JSON.stringify(reports));
}

// Function to edit a report
function editReport(button) {
  const row = button.closest('tr');
  const cells = row.querySelectorAll('td');

  // Make the table cells editable
  cells.forEach(cell => {
    if (cell !== cells[cells.length - 1]) {
      cell.contentEditable = true;
    }
  });

  // Show the save button and hide the edit button
  button.classList.add('hidden');
  row.querySelector('.save-btn').classList.remove('hidden');
}

// Function to save the edited report
function saveReport(button) {
  const row = button.closest('tr');
  const cells = row.querySelectorAll('td');

  // Get the edited values
  const updatedReport = {
    title: cells[0].innerText,
    jobDescription: cells[1].innerText,
    location: cells[2].innerText,
    remarks: cells[3].innerText,
    reportDate: cells[4].innerText,
    reportTime: cells[5].innerText,
    toolsUsed: cells[6].innerText,
    status: cells[7].innerText
  };

  // Save the updated report in localStorage
  updateReportInLocalStorage(updatedReport);

  // Disable editing and show the edit button
  cells.forEach(cell => {
    cell.contentEditable = false;
  });
  button.classList.add('hidden');
  row.querySelector('.edit-btn').classList.remove('hidden');
}

// Function to update the report in localStorage after saving
function updateReportInLocalStorage(updatedReport) {
  let reports = JSON.parse(localStorage.getItem('reports')) || [];
  const index = reports.findIndex(report => report.title === updatedReport.title);
  if (index !== -1) {
    reports[index] = updatedReport;
    localStorage.setItem('reports', JSON.stringify(reports));
  }
}

// Function to load saved reports from localStorage
window.onload = function() {
  const savedReports = JSON.parse(localStorage.getItem('reports')) || [];
  savedReports.forEach(report => addReportToTable(report));
};





//  inventory //
// Function to show the Add Inventory modal
function showAddModal() {
  document.getElementById('addModal').style.display = 'flex';
}

// Function to hide the Add Inventory modal
function hideAddModal() {
  document.getElementById('addModal').style.display = 'none';
}

// Function to add inventory to the table
function addInventory() {
  const type = document.getElementById('type').value;
  const status = document.getElementById('status').value;
  const size = document.getElementById('size').value;
  const serial = document.getElementById('serial').value;
  const date = document.getElementById('date').value;
  const location = document.getElementById('location').value;
  const issued = document.getElementById('issued').value;

  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td>${type}</td>
    <td>${status}</td>
    <td>${size}</td>
    <td>${serial}</td>
    <td>${date}</td>
    <td>${location}</td>
    <td>${issued}</td>
    <td><button class="edit-button" onclick="editInventory(this)">Edit</button></td>
  `;

  document.getElementById('inventoryBody').appendChild(newRow);
  document.getElementById('inventoryTable').classList.remove('hidden');
  hideAddModal();
}

// Function to edit inventory (this will change to a save button)
function editInventory(button) {
  const row = button.closest('tr');
  const cells = row.getElementsByTagName('td');
  
  // Disable editing after save
  if (button.textContent === "Save") {
    // Save the edited values
    cells[0].textContent = document.getElementById('editType').value;
    cells[1].textContent = document.getElementById('editStatus').value;
    cells[2].textContent = document.getElementById('editSize').value;
    cells[3].textContent = document.getElementById('editSerial').value;
    cells[4].textContent = document.getElementById('editDate').value;
    cells[5].textContent = document.getElementById('editLocation').value;
    cells[6].textContent = document.getElementById('editIssued').value;

    // Replace the Edit/Save button with 'Completed'
    const actionCell = cells[7];
    actionCell.innerHTML = '<span class="completed">Completed</span>';
  } else {
    // Change to save button
    button.textContent = 'Save';
    button.setAttribute('onclick', 'editInventory(this)');  // Reassign the function to handle save
    // Edit the row values by adding editable input fields
    cells[0].innerHTML = `<input type="text" id="editType" value="${cells[0].textContent}">`;
    cells[1].innerHTML = `<input type="text" id="editStatus" value="${cells[1].textContent}">`;
    cells[2].innerHTML = `<input type="text" id="editSize" value="${cells[2].textContent}">`;
    cells[3].innerHTML = `<input type="text" id="editSerial" value="${cells[3].textContent}">`;
    cells[4].innerHTML = `<input type="text" id="editDate" value="${cells[4].textContent}">`;
    cells[5].innerHTML = `<input type="text" id="editLocation" value="${cells[5].textContent}">`;
    cells[6].innerHTML = `<input type="text" id="editIssued" value="${cells[6].textContent}">`;
  }
}

// Function to search inventory
document.getElementById('searchButton').addEventListener('click', function() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#inventoryBody tr');
  
  rows.forEach(row => {
    const cells = row.getElementsByTagName('td');
    const matches = Array.from(cells).some(cell => 
      cell.textContent.toLowerCase().includes(query)
    );
    
    row.style.display = matches ? '' : 'none';
  });
});

// Export to Excel (Dummy function, requires more logic for actual export)
function exportToExcel() {
  alert("Exporting to Excel...");
}



//  search button //
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById('searchButton').addEventListener('click', function() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#inventoryBody tr');

    let found = false;

    rows.forEach(row => {
      const cells = row.getElementsByTagName('td');
      const matches = Array.from(cells).some(cell =>
        cell.textContent.toLowerCase().includes(query)
      );

      if (matches) {
        row.style.display = '';
        found = true;
      } else {
        row.style.display = 'none';
      }
    });

    const noResultsMessage = document.getElementById('noResultsMessage');
    if (!found) {
      if (!noResultsMessage) {
        const message = document.createElement('div');
        message.id = 'noResultsMessage';
        message.textContent = 'No results found';
        message.style.color = 'red';
        message.style.textAlign = 'center';
        document.querySelector('.main-content').appendChild(message);
      }
    } else {
      const existingMessage = document.getElementById('noResultsMessage');
      if (existingMessage) {
        existingMessage.remove();
      }
    }
  });
});



// settings //
// Function to apply saved settings from localStorage on page load
document.addEventListener("DOMContentLoaded", () => {
  applySavedSettings();

  // Font size change
  const fontSizeSelect = document.getElementById("fontSizeSelect");
  fontSizeSelect.addEventListener("change", (e) => {
    const selectedFont = e.target.value;
    document.body.classList.remove("font-small", "font-medium", "font-large");
    document.body.classList.add(selectedFont);
    localStorage.setItem("fontSize", selectedFont);
  });

  // Language selection
  const languageSelect = document.getElementById("languageSelect");
  languageSelect.addEventListener("change", (e) => {
    const selectedLanguage = e.target.value;
    localStorage.setItem("language", selectedLanguage);
    // You can expand this for multi-language support
    alert("Language preference saved: " + selectedLanguage);
  });
});

// Dark Mode Toggle
function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
}

// Load settings from localStorage
function applySavedSettings() {
  const savedFontSize = localStorage.getItem("fontSize");
  const savedLanguage = localStorage.getItem("language");
  const darkModeStatus = localStorage.getItem("darkMode");

  // Apply font size
  if (savedFontSize) {
    document.body.classList.add(savedFontSize);
    const fontSizeSelect = document.getElementById("fontSizeSelect");
    if (fontSizeSelect) fontSizeSelect.value = savedFontSize;
  }

  // Apply language (placeholder for future translation features)
  if (savedLanguage) {
    const languageSelect = document.getElementById("languageSelect");
    if (languageSelect) languageSelect.value = savedLanguage;
  }

  // Apply dark mode
  if (darkModeStatus === "enabled") {
    document.body.classList.add("dark-mode");
  }
}


// deadline prompt //
// Save deadline to localStorage
function saveDeadline() {
  const input = document.getElementById("deadlineInput");
  const deadline = input.value;

  if (!deadline) {
    alert("Please select a valid date and time.");
    return;
  }

  localStorage.setItem("userDeadline", deadline);
  displayDeadlineCountdown(deadline);
}

// Display countdown
function displayDeadlineCountdown(deadline) {
  const display = document.getElementById("deadlineDisplay");

  function updateCountdown() {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate - now;

    if (timeDiff <= 0) {
      display.textContent = "🚨 Deadline reached!";
      clearInterval(countdownInterval);
      return;
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDiff / 1000) % 60);

    display.textContent = `⏳ Time Left: ${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  updateCountdown(); // Initial display
  const countdownInterval = setInterval(updateCountdown, 1000);
}

// On page load, check if deadline exists
document.addEventListener("DOMContentLoaded", () => {
  const savedDeadline = localStorage.getItem("userDeadline");
  if (savedDeadline) {
    const input = document.getElementById("deadlineInput");
    if (input) input.value = savedDeadline;
    displayDeadlineCountdown(savedDeadline);
  }
});
