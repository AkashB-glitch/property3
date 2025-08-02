// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Property Listings Functionality
    initializeListings();
    
    // Authentication
    initializeAuth();
    
    // Admin Dashboard
    initializeAdmin();
});

// Property Listings Functions
function initializeListings() {
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view'); 
    const propertiesContainer = document.getElementById('properties-container');
    
    if (gridViewBtn && listViewBtn && propertiesContainer) {
        // View toggle functionality
        gridViewBtn.addEventListener('click', () => {
            propertiesContainer.className = 'properties-container grid-view';
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        });

        listViewBtn.addEventListener('click', () => {
            propertiesContainer.className = 'properties-container list-view';
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
        });

        // Filter functionality
        const typeFilter = document.getElementById('property-type');
        const priceFilter = document.getElementById('price-range');
        const bedroomsFilter = document.getElementById('bedrooms');

        if (typeFilter && priceFilter && bedroomsFilter) {
            [typeFilter, priceFilter, bedroomsFilter].forEach(filter => {
                filter.addEventListener('change', filterProperties);
            });
        }
    }
}

function filterProperties() {
    const typeFilter = document.getElementById('property-type').value;
    const priceFilter = document.getElementById('price-range').value;
    const bedroomsFilter = document.getElementById('bedrooms').value;
    const properties = document.querySelectorAll('.property-card');

    properties.forEach(property => {
        let show = true;
        
        // Type filter
        if (typeFilter !== 'all') {
            const propertyType = property.dataset.type;
            if (propertyType !== typeFilter) {
                show = false;
            }
        }
        
        // Price filter
        if (priceFilter !== 'all' && show) {
            const propertyPrice = parseInt(property.dataset.price);
            switch(priceFilter) {
                case '0-2000':
                    if (propertyPrice > 2000) show = false;
                    break;
                case '2000-4000':
                    if (propertyPrice < 2000 || propertyPrice > 4000) show = false;
                    break;
                case '4000+':
                    if (propertyPrice < 4000) show = false;
                    break;
            }
        }
        
        // Bedrooms filter
        if (bedroomsFilter !== 'all' && show) {
            const propertyBedrooms = parseInt(property.dataset.bedrooms);
            if (bedroomsFilter === '4+') {
                if (propertyBedrooms < 4) show = false;
            } else {
                if (propertyBedrooms !== parseInt(bedroomsFilter)) show = false;
            }
        }
        
        property.style.display = show ? 'block' : 'none';
    });
}

// Authentication Functions
function initializeAuth() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const userType = document.getElementById('user-type').value;
    
    // Demo credentials validation
    const validCredentials = {
        user: { username: 'user@demo.com', password: 'user123' },
        admin: { username: 'admin@demo.com', password: 'admin123' }
    };
    
    const credentials = validCredentials[userType];
    
    if (username === credentials.username && password === credentials.password) {
        // Store user session (mock)
        sessionStorage.setItem('userType', userType);
        sessionStorage.setItem('username', username);
        
        // Success message
        showNotification('Login successful! Redirecting...', 'success');
        
        // Redirect based on user type
        setTimeout(() => {
            if (userType === 'admin') {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 1500);
    } else {
        showNotification('Invalid credentials. Please check the demo credentials below.', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const accountType = document.getElementById('account-type').value;
    const terms = document.getElementById('terms').checked;
    
    // Basic validation
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    if (!terms) {
        showNotification('Please accept the terms and conditions.', 'error');
        return;
    }
    
    // Mock user creation
    const userData = {
        firstName,
        lastName,
        email,
        accountType,
        joinDate: new Date().toISOString()
    };
    
    // Store user data (mock)
    localStorage.setItem('userData', JSON.stringify(userData));
    sessionStorage.setItem('userType', 'user');
    sessionStorage.setItem('username', email);
    
    showNotification('Account created successfully! Redirecting...', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Admin Dashboard Functions
function initializeAdmin() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const adminSections = document.querySelectorAll('.admin-section');
    
    if (sidebarLinks.length > 0) {
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all links and sections
                sidebarLinks.forEach(l => l.classList.remove('active'));
                adminSections.forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Show corresponding section
                const sectionId = this.dataset.section;
                const targetSection = document.getElementById(sectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        });
    }
    
    // Add click handlers for action buttons
    const actionButtons = document.querySelectorAll('.btn-action');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.classList.contains('edit') ? 'edit' : 
                          this.classList.contains('delete') ? 'delete' : 'suspend';
            
            switch(action) {
                case 'edit':
                    showNotification('Edit functionality would open a modal here.', 'info');
                    break;
                case 'delete':
                    if (confirm('Are you sure you want to delete this item?')) {
                        showNotification('Item deleted successfully.', 'success');
                        // Remove the row
                        this.closest('tr').remove();
                    }
                    break;
                case 'suspend':
                    showNotification('User suspended successfully.', 'success');
                    break;
            }
        });
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        maxWidth: '400px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Property card interactions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-small') || e.target.textContent === 'View Details') {
        e.preventDefault();
        showNotification('Property details would open in a modal or new page.', 'info');
    }
});

// Check authentication status on page load  
function checkAuthStatus() {
    const userType = sessionStorage.getItem('userType');
    const username = sessionStorage.getItem('username');
    
    if (userType && username) {
        // Update navigation for logged-in users
        const loginLink = document.querySelector('a[href="login.html"]');
        if (loginLink) {
            loginLink.textContent = userType === 'admin' ? 'Admin Panel' : 'Profile';
            loginLink.href = userType === 'admin' ? 'admin-dashboard.html' : '#';
        }
    }
}

// Initialize auth status check
checkAuthStatus();

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href && href !== '#') {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});