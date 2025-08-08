# Aliotte Leave Request System

A modern, responsive leave request management system built with HTML, CSS, and JavaScript. This application provides the same UI/UX as the original React version but is now optimized for hosting on GitHub Pages.

## Features

- **Dashboard**: Overview of leave statistics and recent requests
- **Submit Requests**: Submit leave requests with automatic business rule validation
- **Leave Calendar**: Visual calendar showing approved leave dates
- **Employee Management**: Add and manage employees (Admin only)
- **Request Approval**: Review and approve/reject pending requests (Admin only)
- **Business Rules**: Automatic validation of leave policies
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Business Rules

The system enforces the following leave policies:
- Maximum 4 days leave per month
- No leave allowed on single digit days (1-9) and day before
- No leave allowed on promotion days: Feb 2, Mar 3, Apr 4
- No department conflicts allowed

## Hosting on GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it something like `aliotte-leave-request` or `leave-request-system`
3. Make it public (required for GitHub Pages)

### Step 2: Upload Files

1. Clone your repository to your local machine:
   ```bash
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name
   ```

2. Copy the following files to your repository:
   - `index.html` (main application file)
   - `app.js` (JavaScript functionality)
   - `README.md` (this file)

3. Commit and push the files:
   ```bash
   git add .
   git commit -m "Initial commit: Aliotte Leave Request System"
   git push origin main
   ```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

### Step 4: Access Your Application

After a few minutes, your application will be available at:
```
https://yourusername.github.io/your-repo-name
```

## File Structure

```
your-repo-name/
├── index.html          # Main HTML file
├── app.js             # JavaScript functionality
└── README.md          # This file
```

## Features Included

### Dashboard
- Statistics cards showing pending requests, approved requests, employee count, and monthly requests
- Recent requests list
- Calendar preview
- Policy reminder
- Quick actions for admins

### Submit Request
- Employee selection dropdown
- Date range picker
- Reason text area
- Real-time business rule validation
- Success/error feedback

### Leave Calendar
- Full month calendar view
- Visual indication of approved leave dates
- Responsive grid layout

### Employee Management (Admin Only)
- Add new employees with name, email, ID, and department
- View existing employees
- Form validation

### Request Approval (Admin Only)
- View all pending requests
- Approve or reject requests
- Request details with employee info and dates

## Customization

### Changing the Admin User
To change the admin user, edit the `mockData.currentUser` object in `app.js`:

```javascript
currentUser: {
    name: 'Your Name',
    email: 'your-email@company.com',
    role: 'admin'  // or 'employee' for non-admin
}
```

### Adding More Employees
You can add more employees to the `mockData.employees` array in `app.js`:

```javascript
employees: [
    { id: 1, name: 'John Doe', email: 'john@company.com', employee_id: 'EMP001', department: 'Engineering' },
    // Add more employees here
]
```

### Modifying Business Rules
The business rules are implemented in the `validateBusinessRules` function in `app.js`. You can modify:
- Monthly leave limits
- Blackout dates
- Promotion days
- Department restrictions

## Browser Compatibility

This application works on all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Local Development

To run the application locally:

1. Download all files to a folder
2. Open `index.html` in your web browser
3. Or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   ```

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Styling with Tailwind CSS
- **JavaScript**: Vanilla JS for functionality
- **Lucide Icons**: Modern icon library
- **Tailwind CSS**: Utility-first CSS framework (via CDN)

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions about hosting on GitHub Pages, please check:
1. GitHub Pages documentation: https://pages.github.com/
2. Your repository settings
3. Browser console for any JavaScript errors

The application is designed to work immediately after deployment without any additional configuration.
