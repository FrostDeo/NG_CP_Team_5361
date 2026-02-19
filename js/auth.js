/**
 * Safar.com - Authentication Functionality
 */

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update form sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(tabName + 'Form').classList.add('active');
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Mock login - in real app, this would call an API
    if (email === 'demo@safar.com' && password === 'demo123') {
        // Store login state
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userName', 'John Doe');
        localStorage.setItem('userEmail', email);

        alert('Login successful! Welcome back to Safar!');
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password. Try demo@safar.com / demo123');
    }
}

function handleSignup(event) {
    event.preventDefault();

    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }

    // Mock signup - in real app, this would call an API
    localStorage.setItem('userLoggedIn', 'true');
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);

    alert('Account created successfully! Welcome to Safar!');
    window.location.href = 'index.html';
}

function loginWithGoogle() {
    alert('Google login would be implemented here. For demo, use demo@safar.com / demo123');
}

function loginWithFacebook() {
    alert('Facebook login would be implemented here. For demo, use demo@safar.com / demo123');
}

function forgotPassword() {
    const email = prompt('Enter your email address:');
    if (email) {
        alert('Password reset link sent to ' + email);
    }
}

// Check login status on page load
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    const userName = localStorage.getItem('userName');

    // Update navigation if user is logged in
    updateNavigation(isLoggedIn, userName);
});

function updateNavigation(isLoggedIn, userName) {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const loginLink = navLinks.querySelector('a[href="login.html"]');
    const profileLink = navLinks.querySelector('a[href="profile.html"]');

    if (isLoggedIn) {
        // User is logged in
        if (loginLink) {
            loginLink.innerHTML = `<i class="ri-logout-box-line"></i> Logout`;
            loginLink.href = '#';
            loginLink.onclick = handleLogout;
        }
        if (profileLink && userName) {
            profileLink.innerHTML = `<i class="ri-user-line"></i> ${userName}`;
        }
    } else {
        // User is not logged in
        if (loginLink) {
            loginLink.innerHTML = `<i class="ri-login-box-line"></i> Login`;
            loginLink.href = 'login.html';
            loginLink.onclick = null;
        }
        if (profileLink) {
            profileLink.innerHTML = `<i class="ri-user-line"></i> Profile`;
        }
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        window.location.href = 'index.html';
    }
}

// Export functions for global use
window.AuthUtils = {
    updateNavigation,
    handleLogout
};