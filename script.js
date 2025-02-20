// Ensure DOM is fully loaded before running the script
document.addEventListener("DOMContentLoaded", function () {
    
    // Handle login form submission
    const loginForm = document.getElementById("LoginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission

            // Get input values
            const staffID = document.querySelector('input[type="text"]').value;
            const password = document.querySelector('input[type="password"]').value;

            // Dummy authentication (Replace with real backend authentication)
            if (staffID === "h2412031" && password === "password123") {
                alert("Login successful!");
                window.location.href = "dashboard.html"; // Redirect to dashboard
            } else {
                alert("Invalid Staff ID or Password. Please try again.");
            }
        });
    }

    // Handle password reset request
    const resetBtn = document.querySelector(".reset-password-btn");
    if (resetBtn) {
        resetBtn.addEventListener("click", async function (event) {
            event.preventDefault(); // Prevent form submission
            
            const emailInput = document.querySelector('input[type="email"]');
            if (!emailInput) {
                alert("Email input field not found.");
                return;
            }

            const email = emailInput.value.trim();
            if (!email) {
                alert("Please enter a valid email address.");
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/send-reset-email", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();
                if (response.ok) {
                    alert(data.message);
                } else {
                    alert("Error: " + (data.error || "Failed to send reset email."));
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Error sending reset email. Please try again.");
            }
        });
    }
});


// Toggle Sidebar
function openSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
}
// Event Listener for Menu Icon Click
document.querySelector(".menu-icon").addEventListener("click", toggleSidebar);

// Toggle Search Bar Visibility
function toggleSearch() {
    const searchBox = document.getElementById("search-box");
    searchBox.classList.toggle("hidden");
    if (!searchBox.classList.contains("hidden")) {
        searchBox.focus();
    }
}

// Show Notifications
function showNotifications() {
    alert("You have new notifications!");
}

// Show Messages
function showMessages() {
    alert("You have unread messages!");
}

// Show Profile Settings
function showProfile() {
    alert("Opening profile settings...");
}

// Logout Functionality
function logout() {
    const confirmLogout = confirm("Are you sure you want to log out?");
    if (confirmLogout) {
        window.location.href = "index.html"; // Redirect to login page
    }
}

// Event Listeners for Icons (Best Practice)
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("menu-icon").addEventListener("click", openSidebar);
    document.getElementById("search-icon").addEventListener("click", toggleSearch);
    document.getElementById("notification-icon").addEventListener("click", showNotifications);
    document.getElementById("email-icon").addEventListener("click", showMessages);
    document.getElementById("profile-icon").addEventListener("click", showProfile);
    document.getElementById("logout-btn").addEventListener("click", logout);
});
