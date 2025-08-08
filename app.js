// Initialize Lucide icons
lucide.createIcons();

// Mock data storage (in a real app, this would be a database)
let mockData = {
    employees: [
        { id: 1, name: 'John Doe', email: 'john@aliotte.com', employee_id: 'EMP001', department: 'Engineering' },
        { id: 2, name: 'Jane Smith', email: 'jane@aliotte.com', employee_id: 'EMP002', department: 'Marketing' },
        { id: 3, name: 'Bob Johnson', email: 'bob@aliotte.com', employee_id: 'EMP003', department: 'Sales' }
    ],
    requests: [
        {
            id: 1,
            employee_name: 'John Doe',
            employee_email: 'john@aliotte.com',
            start_date: '2024-01-15',
            end_date: '2024-01-17',
            days_count: 3,
            reason: 'Personal vacation',
            status: 'approved',
            created_date: '2024-01-10',
            approval_token: 'token_123',
            approved_by: 'pinyapat.prw@gmail.com',
            approved_date: '2024-01-12'
        },
        {
            id: 2,
            employee_name: 'Jane Smith',
            employee_email: 'jane@aliotte.com',
            start_date: '2024-01-20',
            end_date: '2024-01-22',
            days_count: 3,
            reason: 'Family event',
            status: 'pending',
            created_date: '2024-01-12',
            approval_token: 'token_456'
        }
    ],
    currentUser: {
        name: 'Admin User',
        email: 'admin@aliotte.com',
        role: 'admin'
    },
    // Email configuration
    emailSettings: {
        managerEmail: 'pinyapat.prw@gmail.com',
        companyName: 'Aliotte Store',
        approvalBaseUrl: window.location.origin + window.location.pathname
    }
};

// App state
let currentPage = 'dashboard';
let isAdmin = mockData.currentUser.role === 'admin';

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadDashboard();
    
    // Check for approval token in URL
    checkForApprovalToken();
});

function initializeApp() {
    // Set user info
    document.getElementById('user-name').textContent = mockData.currentUser.name;
    document.getElementById('user-initial').textContent = mockData.currentUser.name[0];
    document.getElementById('user-role').textContent = isAdmin ? 'Administrator' : 'Employee';
    
    // Show/hide admin elements
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => {
        el.style.display = isAdmin ? 'block' : 'none';
    });
    
    // Initialize Lucide icons
    lucide.createIcons();
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateToPage(page);
        });
    });
    
    // Mobile sidebar toggle
    document.getElementById('sidebar-toggle').addEventListener('click', function() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('hidden');
    });
    
    // Forms
    document.getElementById('request-form').addEventListener('submit', handleRequestSubmit);
    document.getElementById('employee-form').addEventListener('submit', handleEmployeeSubmit);
    
    // Handle hash changes
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
}

function checkForApprovalToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const action = urlParams.get('action');
    
    if (token && action) {
        handleEmailApproval(token, action);
    }
}

function handleEmailApproval(token, action) {
    const request = mockData.requests.find(r => r.approval_token === token);
    
    if (!request) {
        showNotification('error', 'Invalid approval link');
        return;
    }
    
    if (request.status !== 'pending') {
        showNotification('info', 'This request has already been processed');
        return;
    }
    
    if (action === 'approve') {
        request.status = 'approved';
        request.approved_by = mockData.emailSettings.managerEmail;
        request.approved_date = new Date().toISOString().split('T')[0];
        showNotification('success', `Leave request for ${request.employee_name} has been approved!`);
    } else if (action === 'reject') {
        request.status = 'rejected';
        request.rejected_by = mockData.emailSettings.managerEmail;
        request.rejected_date = new Date().toISOString().split('T')[0];
        showNotification('success', `Leave request for ${request.employee_name} has been rejected.`);
    }
    
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
    
    // Reload dashboard to show updated status
    if (currentPage === 'dashboard') {
        loadDashboard();
    }
}

function showNotification(type, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' : 
        type === 'error' ? 'bg-red-500 text-white' : 
        'bg-blue-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center gap-2">
            <i data-lucide="${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info'}" class="w-5 h-5"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    lucide.createIcons();
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function handleHashChange() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    navigateToPage(hash);
}

function navigateToPage(page) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(p => p.classList.add('hidden'));
    
    // Show selected page
    const targetPage = document.getElementById(page + '-page');
    if (targetPage) {
        targetPage.classList.remove('hidden');
        currentPage = page;
        
        // Update navigation active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('bg-indigo-50', 'text-indigo-700', 'border', 'border-indigo-100', 'shadow-sm');
            item.classList.add('text-slate-600', 'hover:text-slate-900');
        });
        
        const activeNav = document.querySelector(`[data-page="${page}"]`);
        if (activeNav) {
            activeNav.classList.remove('text-slate-600', 'hover:text-slate-900');
            activeNav.classList.add('bg-indigo-50', 'text-indigo-700', 'border', 'border-indigo-100', 'shadow-sm');
        }
        
        // Load page-specific content
        switch(page) {
            case 'dashboard':
                loadDashboard();
                break;
            case 'submit-request':
                loadSubmitRequest();
                break;
            case 'leave-calendar':
                loadLeaveCalendar();
                break;
            case 'manage-employees':
                loadManageEmployees();
                break;
            case 'approve-requests':
                loadApproveRequests();
                break;
        }
    }
}

function loadDashboard() {
    const visibleRequests = isAdmin ? mockData.requests : mockData.requests.filter(r => r.employee_email === mockData.currentUser.email);
    const pendingCount = visibleRequests.filter(r => r.status === 'pending').length;
    const approvedCount = visibleRequests.filter(r => r.status === 'approved').length;
    const thisMonthRequests = visibleRequests.filter(r => {
        const requestDate = new Date(r.created_date);
        const now = new Date();
        return requestDate.getMonth() === now.getMonth() && requestDate.getFullYear() === now.getFullYear();
    }).length;
    
    // Update stats
    document.getElementById('pending-count').textContent = pendingCount;
    document.getElementById('approved-count').textContent = approvedCount;
    document.getElementById('employees-count').textContent = isAdmin ? mockData.employees.length : visibleRequests.length;
    document.getElementById('month-count').textContent = thisMonthRequests;
    
    // Update titles
    document.getElementById('dashboard-title').textContent = isAdmin ? 'Admin Dashboard' : 'My Leave Dashboard';
    document.getElementById('dashboard-subtitle').textContent = isAdmin 
        ? 'Monitor and manage leave requests across your organization' 
        : 'Track your leave requests and remaining balance';
    document.getElementById('employees-title').textContent = isAdmin ? 'Total Employees' : 'Your Requests';
    document.getElementById('employees-subtitle').textContent = isAdmin ? 'In the system' : 'All time';
    
    // Load recent requests
    loadRecentRequests(visibleRequests);
    
    // Load calendar preview
    loadCalendarPreview();
}

function loadRecentRequests(requests) {
    const container = document.getElementById('recent-requests');
    const recentRequests = requests.slice(0, 5);
    
    if (recentRequests.length === 0) {
        container.innerHTML = '<p class="text-slate-500 text-center py-8">No requests found</p>';
        return;
    }
    
    container.innerHTML = recentRequests.map(request => `
        <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center">
                    <i data-lucide="user" class="w-5 h-5 text-indigo-600"></i>
                </div>
                <div>
                    <p class="font-semibold text-slate-900">${request.employee_name}</p>
                    <p class="text-sm text-slate-500">${request.start_date} - ${request.end_date} (${request.days_count} days)</p>
                    ${request.approved_by ? `<p class="text-xs text-emerald-600">Approved by ${request.approved_by}</p>` : ''}
                </div>
            </div>
            <div class="flex items-center gap-2">
                <span class="px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}">
                    ${request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

function loadCalendarPreview() {
    const container = document.getElementById('calendar-preview');
    const approvedRequests = mockData.requests.filter(r => r.status === 'approved');
    
    if (approvedRequests.length === 0) {
        container.innerHTML = '<p class="text-slate-500 text-center py-8">No approved leave requests</p>';
        return;
    }
    
    container.innerHTML = `
        <div class="grid grid-cols-7 gap-2">
            ${generateCalendarDays(approvedRequests)}
        </div>
    `;
}

function generateCalendarDays(requests) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let html = '';
    
    // Header
    days.forEach(day => {
        html += `<div class="text-center text-xs font-medium text-slate-500 py-2">${day}</div>`;
    });
    
    // Calendar days (simplified for preview)
    for (let i = 1; i <= 31; i++) {
        const hasLeave = requests.some(req => {
            const start = new Date(req.start_date);
            const end = new Date(req.end_date);
            const checkDate = new Date(2024, 0, i);
            return checkDate >= start && checkDate <= end;
        });
        
        html += `
            <div class="text-center py-2 text-sm ${hasLeave ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-slate-700'}">
                ${i}
            </div>
        `;
    }
    
    return html;
}

function loadSubmitRequest() {
    const employeeSelect = document.getElementById('employee-select');
    employeeSelect.innerHTML = '<option value="">Select employee...</option>';
    
    mockData.employees.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.email;
        option.textContent = `${employee.name} (${employee.department})`;
        employeeSelect.appendChild(option);
    });
}

function handleRequestSubmit(e) {
    e.preventDefault();
    
    const formData = {
        employee_email: document.getElementById('employee-select').value,
        start_date: document.getElementById('start-date').value,
        end_date: document.getElementById('end-date').value,
        reason: document.getElementById('reason').value
    };
    
    // Validate form
    if (!formData.employee_email || !formData.start_date || !formData.end_date || !formData.reason) {
        showValidationResult('error', 'Please fill in all fields');
        return;
    }
    
    // Business rule validation
    const validation = validateBusinessRules(formData);
    showValidationResult(validation.approved ? 'success' : 'error', validation.reason);
    
    if (validation.approved) {
        // Generate approval token
        const approvalToken = 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Add request to mock data
        const newRequest = {
            id: mockData.requests.length + 1,
            employee_name: mockData.employees.find(e => e.email === formData.employee_email)?.name || 'Unknown',
            employee_email: formData.employee_email,
            start_date: formData.start_date,
            end_date: formData.end_date,
            days_count: calculateDays(formData.start_date, formData.end_date),
            reason: formData.reason,
            status: 'pending',
            created_date: new Date().toISOString().split('T')[0],
            approval_token: approvalToken
        };
        
        mockData.requests.push(newRequest);
        
        // Send approval email
        sendApprovalEmail(newRequest);
        
        // Reset form
        e.target.reset();
        
        // Show success message
        setTimeout(() => {
            showValidationResult('success', 'Request submitted successfully! Approval email sent to manager.');
        }, 1000);
    }
}

function sendApprovalEmail(request) {
    const approvalUrl = `${mockData.emailSettings.approvalBaseUrl}?token=${request.approval_token}`;
    
    // Create email content
    const emailSubject = `Leave Request Approval Required - ${request.employee_name}`;
    const emailBody = `
Leave Request Approval Required

Hello,

A new leave request has been submitted and requires your approval:

Employee: ${request.employee_name}
Email: ${request.employee_email}
Dates: ${formatDate(new Date(request.start_date))} - ${formatDate(new Date(request.end_date))}
Duration: ${request.days_count} days
Reason: ${request.reason}

To approve this request, click: ${approvalUrl}&action=approve
To reject this request, click: ${approvalUrl}&action=reject

This email was sent from the Aliotte Leave Request System.
If you have any questions, please contact the system administrator.
    `;
    
    // Use mailto: link to open user's email client
    const mailtoLink = `mailto:${mockData.emailSettings.managerEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.open(mailtoLink, '_blank');
    
    // Show notification
    showNotification('success', `Email client opened for ${mockData.emailSettings.managerEmail}. Please send the email manually.`);
    
    // Also show the email content in a modal for easy copying
    showEmailModal(emailSubject, emailBody, approvalUrl);
}

function showEmailModal(subject, body, approvalUrl) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-bold text-slate-900">Email Content</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-slate-500 hover:text-slate-700">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">To:</label>
                    <input type="text" value="${mockData.emailSettings.managerEmail}" class="w-full px-3 py-2 border border-slate-300 rounded-lg" readonly>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Subject:</label>
                    <input type="text" value="${subject}" class="w-full px-3 py-2 border border-slate-300 rounded-lg" readonly>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-2">Body:</label>
                    <textarea rows="15" class="w-full px-3 py-2 border border-slate-300 rounded-lg" readonly>${body}</textarea>
                </div>
                
                <div class="flex items-center gap-4">
                    <button onclick="copyToClipboard('${subject}', '${body.replace(/'/g, "\\'")}')" class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        Copy to Clipboard
                    </button>
                    <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    lucide.createIcons();
}

function copyToClipboard(subject, body) {
    const emailContent = `To: ${mockData.emailSettings.managerEmail}\nSubject: ${subject}\n\n${body}`;
    
    navigator.clipboard.writeText(emailContent).then(() => {
        showNotification('success', 'Email content copied to clipboard!');
    }).catch(() => {
        showNotification('error', 'Failed to copy to clipboard');
    });
}

function validateBusinessRules(requestData) {
    const startDate = new Date(requestData.start_date);
    const endDate = new Date(requestData.end_date);
    
    // Check blackout dates (2/2 to 12/12 of every year)
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const checkDate = new Date(d);
        const day = checkDate.getDate();
        const month = checkDate.getMonth() + 1;
        
        // Blackout period: February 2nd to December 12th of every year
        if ((month === 2 && day >= 2) || (month > 2 && month < 12) || (month === 12 && day <= 12)) {
            return {
                approved: false,
                reason: `Leave not allowed on ${formatDate(checkDate)} (blackout period: Feb 2 - Dec 12)`
            };
        }
    }
    
    // Check monthly limit
    const currentMonth = startDate.getMonth();
    const currentYear = startDate.getFullYear();
    
    const monthlyRequests = mockData.requests.filter(req => 
        req.employee_email === requestData.employee_email && 
        req.status === 'approved'
    );
    
    let currentMonthDays = 0;
    monthlyRequests.forEach(req => {
        const reqStart = new Date(req.start_date);
        if (reqStart.getMonth() === currentMonth && reqStart.getFullYear() === currentYear) {
            currentMonthDays += req.days_count;
        }
    });
    
    const requestDays = calculateDays(requestData.start_date, requestData.end_date);
    if (currentMonthDays + requestDays > 4) {
        return {
            approved: false,
            reason: `Monthly limit exceeded. You have ${currentMonthDays} days approved this month, requesting ${requestDays} more days. Maximum is 4 days.`
        };
    }
    
    return {
        approved: true,
        reason: 'Request passes all business rules and can be submitted.'
    };
}

function showValidationResult(type, message) {
    const container = document.getElementById('validation-results');
    const alertClass = type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700';
    const icon = type === 'success' ? 'check-circle' : 'alert-triangle';
    
    container.innerHTML = `
        <div class="border rounded-lg p-4 ${alertClass}">
            <div class="flex items-center gap-2">
                <i data-lucide="${icon}" class="w-4 h-4"></i>
                <span class="font-medium">${message}</span>
            </div>
        </div>
    `;
    
    lucide.createIcons();
}

function loadLeaveCalendar() {
    const container = document.getElementById('calendar-container');
    const approvedRequests = mockData.requests.filter(r => r.status === 'approved');
    
    container.innerHTML = `
        <div class="grid grid-cols-7 gap-2">
            ${generateFullCalendar(approvedRequests)}
        </div>
    `;
}

function generateFullCalendar(requests) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let html = '';
    
    // Header
    days.forEach(day => {
        html += `<div class="text-center text-sm font-medium text-slate-500 py-3 border-b">${day}</div>`;
    });
    
    // Calendar days (full month view)
    const currentDate = new Date();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    for (let i = 0; i < 42; i++) {
        const currentDay = new Date(startDate);
        currentDay.setDate(startDate.getDate() + i);
        
        const hasLeave = requests.some(req => {
            const start = new Date(req.start_date);
            const end = new Date(req.end_date);
            return currentDay >= start && currentDay <= end;
        });
        
        const isCurrentMonth = currentDay.getMonth() === currentDate.getMonth();
        const isToday = currentDay.toDateString() === new Date().toDateString();
        
        let dayClass = 'text-center py-3 text-sm';
        if (!isCurrentMonth) {
            dayClass += ' text-slate-300';
        } else if (hasLeave) {
            dayClass += ' bg-indigo-100 text-indigo-700 font-medium';
        } else if (isToday) {
            dayClass += ' bg-indigo-50 text-indigo-600 font-medium';
        } else {
            dayClass += ' text-slate-700';
        }
        
        html += `<div class="${dayClass}">${currentDay.getDate()}</div>`;
    }
    
    return html;
}

function loadManageEmployees() {
    loadEmployeeList();
}

function loadEmployeeList() {
    const container = document.getElementById('employee-list');
    
    if (mockData.employees.length === 0) {
        container.innerHTML = '<p class="text-slate-500 text-center py-8">No employees found</p>';
        return;
    }
    
    container.innerHTML = mockData.employees.map(employee => `
        <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center">
                    <i data-lucide="user" class="w-5 h-5 text-indigo-600"></i>
                </div>
                <div>
                    <p class="font-semibold text-slate-900">${employee.name}</p>
                    <p class="text-sm text-slate-500">${employee.email} • ${employee.department}</p>
                </div>
            </div>
            <div class="text-sm text-slate-500">
                ID: ${employee.employee_id}
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

function handleEmployeeSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('employee-name').value,
        email: document.getElementById('employee-email').value,
        employee_id: document.getElementById('employee-id').value,
        department: document.getElementById('employee-department').value
    };
    
    // Validate form
    if (!formData.name || !formData.email || !formData.employee_id || !formData.department) {
        alert('Please fill in all fields');
        return;
    }
    
    // Check if email already exists
    if (mockData.employees.some(e => e.email === formData.email)) {
        alert('Employee with this email already exists');
        return;
    }
    
    // Add employee
    const newEmployee = {
        id: mockData.employees.length + 1,
        ...formData
    };
    
    mockData.employees.push(newEmployee);
    
    // Reset form
    e.target.reset();
    
    // Reload employee list
    loadEmployeeList();
    
    // Show success message
    alert('Employee added successfully!');
}

function loadApproveRequests() {
    const container = document.getElementById('requests-container');
    const pendingRequests = mockData.requests.filter(r => r.status === 'pending');
    
    if (pendingRequests.length === 0) {
        container.innerHTML = '<p class="text-slate-500 text-center py-8">No pending requests</p>';
        return;
    }
    
    container.innerHTML = pendingRequests.map(request => `
        <div class="bg-white border border-slate-200 rounded-xl p-6">
            <div class="flex items-start justify-between">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full flex items-center justify-center">
                        <i data-lucide="user" class="w-6 h-6 text-indigo-600"></i>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-slate-900">${request.employee_name}</h3>
                        <p class="text-sm text-slate-500">${request.employee_email}</p>
                        <div class="flex items-center gap-4 mt-2">
                            <span class="flex items-center gap-1 text-sm text-slate-600">
                                <i data-lucide="calendar" class="w-4 h-4"></i>
                                ${formatDate(new Date(request.start_date))} - ${formatDate(new Date(request.end_date))}
                            </span>
                            <span class="text-sm text-slate-600">${request.days_count} days</span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <span class="px-3 py-1 text-sm font-medium bg-amber-100 text-amber-700 border border-amber-200 rounded-full">
                        Pending
                    </span>
                </div>
            </div>
            
            <div class="mt-4 p-4 bg-slate-50 rounded-lg">
                <p class="text-sm text-slate-700"><strong>Reason:</strong> ${request.reason}</p>
            </div>
            
            <div class="flex items-center gap-3 mt-6">
                <button onclick="approveRequest(${request.id})" class="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200">
                    <i data-lucide="check" class="w-4 h-4"></i>
                    Approve
                </button>
                <button onclick="rejectRequest(${request.id})" class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                    <i data-lucide="x" class="w-4 h-4"></i>
                    Reject
                </button>
                <button onclick="sendApprovalEmail(${JSON.stringify(request).replace(/"/g, '&quot;')})" class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    <i data-lucide="mail" class="w-4 h-4"></i>
                    Send Email
                </button>
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

function approveRequest(requestId) {
    const request = mockData.requests.find(r => r.id === requestId);
    if (request) {
        request.status = 'approved';
        request.approved_by = mockData.emailSettings.managerEmail;
        request.approved_date = new Date().toISOString().split('T')[0];
        loadApproveRequests();
        showNotification('success', 'Request approved successfully!');
    }
}

function rejectRequest(requestId) {
    const request = mockData.requests.find(r => r.id === requestId);
    if (request) {
        request.status = 'rejected';
        request.rejected_by = mockData.emailSettings.managerEmail;
        request.rejected_date = new Date().toISOString().split('T')[0];
        loadApproveRequests();
        showNotification('success', 'Request rejected');
    }
}

// Utility functions
function calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
}

function getStatusColor(status) {
    switch(status) {
        case 'pending':
            return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'approved':
            return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        case 'rejected':
            return 'bg-red-100 text-red-700 border-red-200';
        default:
            return 'bg-slate-100 text-slate-700 border-slate-200';
    }
}
