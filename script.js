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
  const resetForm = document.getElementById("resetForm");

  if (resetForm) {
    resetForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const newPassword = document.getElementById("newPassword").value.trim();
      const confirmPassword = document.getElementById("confirmPassword").value.trim();

      if (newPassword !== confirmPassword) {
        alert("❌ Passwords do not match.");
        return;
      }

      if (!isStrongPassword(newPassword)) {
        alert("⚠️ Password must be at least 8 characters, include a number and an uppercase letter.");
        return;
      }

      // Simulate saving to backend or localStorage
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



// Function to show the report table
function showReportTable() {
  document.getElementById('reportTable').classList.remove('hidden');
}

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

  if (!title || !jobDescription || !location || !remarks || !reportDate || !reportTime || !toolsUsed || !status) {
    alert('Please fill in all fields before generating the report.');
    return;
  }

  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${title}</td>
    <td>${jobDescription}</td>
    <td>${location}</td>
    <td>${remarks}</td>
    <td>${reportDate}</td>
    <td>${reportTime}</td>
    <td>${toolsUsed}</td>
    <td class="status">${status}</td>
    <td>
      <button class="edit-btn" onclick="editReport(this)">Edit</button>
    </td>
  `;

  document.querySelector('#reportTable tbody').appendChild(row);
  saveReportToLocalStorage({
    title, jobDescription, location, remarks, reportDate, reportTime, toolsUsed, status
  });
  showReportTable();
}

// Save to localStorage
function saveReportToLocalStorage(report) {
  let reports = JSON.parse(localStorage.getItem('reports')) || [];
  reports.push(report);
  localStorage.setItem('reports', JSON.stringify(reports));
}

// Edit/Save toggle
function editReport(button) {
  const row = button.closest('tr');
  const cells = row.querySelectorAll('td');

  if (button.textContent === 'Save') {
    const updatedReport = {
      title: row.querySelector('#editTitle').value,
      jobDescription: row.querySelector('#editJobDescription').value,
      location: row.querySelector('#editLocation').value,
      remarks: row.querySelector('#editRemarks').value,
      reportDate: row.querySelector('#editReportDate').value,
      reportTime: row.querySelector('#editReportTime').value,
      toolsUsed: row.querySelector('#editToolsUsed').value,
      status: 'Completed'
    };

    // Update cells with new values
    cells[0].textContent = updatedReport.title;
    cells[1].textContent = updatedReport.jobDescription;
    cells[2].textContent = updatedReport.location;
    cells[3].textContent = updatedReport.remarks;
    cells[4].textContent = updatedReport.reportDate;
    cells[5].textContent = updatedReport.reportTime;
    cells[6].textContent = updatedReport.toolsUsed;
    cells[7].textContent = 'Completed';
    cells[8].innerHTML = `<span class="completed">Completed</span>`;

    updateReportInLocalStorage(updatedReport);
  } else {
    // Replace text with input fields
    cells[0].innerHTML = `<input type="text" id="editTitle" value="${cells[0].textContent}">`;
    cells[1].innerHTML = `<input type="text" id="editJobDescription" value="${cells[1].textContent}">`;
    cells[2].innerHTML = `<input type="text" id="editLocation" value="${cells[2].textContent}">`;
    cells[3].innerHTML = `<input type="text" id="editRemarks" value="${cells[3].textContent}">`;
    cells[4].innerHTML = `<input type="date" id="editReportDate" value="${cells[4].textContent}">`;
    cells[5].innerHTML = `<input type="time" id="editReportTime" value="${cells[5].textContent}">`;
    cells[6].innerHTML = `<input type="text" id="editToolsUsed" value="${cells[6].textContent}">`;

    button.textContent = 'Save';
  }
}

// Update edited report in localStorage
function updateReportInLocalStorage(updatedReport) {
  let reports = JSON.parse(localStorage.getItem('reports')) || [];
  const index = reports.findIndex(report => report.title === updatedReport.title);
  if (index !== -1) {
    reports[index] = updatedReport;
    localStorage.setItem('reports', JSON.stringify(reports));
  }
}

// Load from localStorage
window.onload = function () {
  const savedReports = JSON.parse(localStorage.getItem('reports')) || [];
  savedReports.forEach(report => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${report.title}</td>
      <td>${report.jobDescription}</td>
      <td>${report.location}</td>
      <td>${report.remarks}</td>
      <td>${report.reportDate}</td>
      <td>${report.reportTime}</td>
      <td>${report.toolsUsed}</td>
      <td class="status">${report.status}</td>
      <td>
        ${report.status === 'Completed'
          ? '<span class="completed">Completed</span>'
          : '<button class="edit-btn" onclick="editReport(this)">Edit</button>'
        }
      </td>
    `;
    document.querySelector('#reportTable tbody').appendChild(row);
    showReportTable();
  });
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
// Dark Mode Toggle
// Check for saved preference on load
window.addEventListener('DOMContentLoaded', () => {
  const isDark = localStorage.getItem('dark-mode') === 'enabled';
  if (isDark) {
    document.body.classList.add('dark-mode');
  }
});

// Toggle dark mode and save preference
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');

  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('dark-mode', 'enabled');
  } else {
    localStorage.setItem('dark-mode', 'disabled');
  }
}


// Load settings from localStorage
function applySavedSettings() {
  const darkModeStatus = localStorage.getItem("darkMode");



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



// tool box //
  document.getElementById('toolboxForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Stop form from submitting normally

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Collect values
    const formData = {
      WorkActivity: document.getElementById('workActivity').value,
      Date: document.getElementById('date').value,
      WorkLocation: document.getElementById('workLocation').value,
      NameCompany: document.getElementById('name/company').value,
      Sign: document.getElementById('ppe').value,
      PPENo: document.getElementById('ppe').value,
      ToolsUsed: document.getElementById('toolsUsed').value,
      Hazards: document.getElementById('hazards').value,
      Circulars: document.getElementById('circulars').value,
      RiskAssessment: document.getElementById('riskAssessment').value,
      Permit: document.getElementById('permit').value,
      Remarks: document.getElementById('remarks').value,
      PreparedBy: document.getElementById('preparedBy').value,
      VerifiedBy: document.getElementById('verifiedBy').value,
    };

    // Add to PDF
    let y = 10;
    doc.setFontSize(12);
    doc.text("Toolbox Form Submission", 10, y);
    y += 10;

    for (let key in formData) {
      doc.text(`${key.replace(/([A-Z])/g, ' $1')}: ${formData[key]}`, 10, y);
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    }

    // Save the PDF
    doc.save('Toolbox_Form.pdf');
    alert("✅ PDF downloaded successfully!");
  });

