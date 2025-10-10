# Blogger Platform - Admin Portal & Dashboard

This platform now includes a comprehensive admin portal with dashboard analytics and fixed slug management capabilities.

## Features

### 🎯 Admin Dashboard
- **Statistical Overview**: Real-time analytics with user growth, post statistics, and content distribution
- **Interactive Charts**: Built with Chart.js for data visualization
- **Growth Metrics**: Month-over-month growth percentages for users and posts
- **Recent Activity**: Latest users and top-performing posts

### 🔗 Fixed Slug Management
- **Create Fixed Slugs**: Create custom pages with fixed URLs (e.g., `/page/about-us`)
- **SEO Optimization**: Meta titles and descriptions for better search engine visibility
- **Content Management**: Rich text content with HTML support
- **Tag System**: Organize fixed slugs with tags
- **View Analytics**: Track page views for each fixed slug
- **Status Control**: Activate/deactivate slugs as needed

### 👥 User Management
- **User Overview**: View all platform users with role and status information
- **Role Management**: Assign admin/superadmin roles (superadmin only)
- **Account Status**: Activate/deactivate user accounts

## Getting Started

### 1. Admin User Setup
An admin user has been automatically created:
- **Email**: `admin@blogger.com`
- **Password**: `admin123`
- **Role**: `superadmin`

### 2. Access Admin Portal
1. Login with the admin credentials
2. Navigate to `/admin` in your browser
3. You'll see the admin dashboard with analytics and management tools

### 3. Creating Fixed Slugs
1. Go to the "Fixed Slugs" tab in the admin dashboard
2. Click "Create New Slug"
3. Fill in the required information:
   - **Slug**: URL-friendly identifier (e.g., `about-us`, `privacy-policy`)
   - **Title**: Page title
   - **Description**: Brief description
   - **Content**: Main content (HTML supported)
   - **Tags**: Comma-separated tags
   - **Meta Title/Description**: SEO optimization
4. Save the slug

### 4. Accessing Fixed Slugs
Fixed slugs are accessible at `/page/{slug}`:
- Example: `/page/about-us` for a slug named "about-us"
- Public access (no authentication required)
- View count tracking

## API Endpoints

### Admin Routes (Authentication Required)
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `POST /api/admin/fixed-slugs` - Create fixed slug
- `GET /api/admin/fixed-slugs` - List fixed slugs
- `PUT /api/admin/fixed-slugs/:id` - Update fixed slug
- `DELETE /api/admin/fixed-slugs/:id` - Delete fixed slug
- `GET /api/admin/users` - List users
- `PUT /api/admin/users/:id/role` - Update user role (superadmin only)

### Public Routes
- `GET /api/pages` - List active fixed slugs
- `GET /api/pages/:slug` - Get fixed slug by slug

## User Roles

### User (Default)
- Standard platform access
- Create posts, comments, etc.

### Admin
- Access to admin dashboard
- Manage fixed slugs
- View user statistics
- User management (view only)

### Superadmin
- All admin privileges
- User role management
- Account activation/deactivation
- Full platform control

## Chart.js Integration

The dashboard includes several chart types:
- **Line Charts**: User growth over time
- **Bar Charts**: Post creation trends
- **Doughnut Charts**: Content distribution

## Security Features

- **Role-based Access Control**: Different permission levels
- **Authentication Middleware**: Protects admin routes
- **Input Validation**: Slug format validation
- **XSS Protection**: Content sanitization

## Technical Stack

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 18
- Chart.js + react-chartjs-2
- Tailwind CSS
- React Router

## File Structure

```
server/
├── models/
│   ├── user.js (updated with roles)
│   ├── fixedSlug.js (new)
│   └── profile.js
├── controllers/
│   ├── adminController.js (new)
│   └── fixedSlugController.js (new)
├── routes/
│   ├── adminRoutes.js (new)
│   └── fixedSlugRoutes.js (new)
├── middleware/
│   └── adminAuth.js (new)
└── createAdmin.js (utility script)

client/
├── src/
│   ├── pages/
│   │   ├── AdminDashboard.jsx (new)
│   │   └── FixedSlugPage.jsx (new)
│   └── App.jsx (updated with routes)
└── package.json (updated with Chart.js)
```

## Usage Examples

### Creating a Privacy Policy Page
1. Login as admin
2. Go to Admin Dashboard → Fixed Slugs
3. Create new slug with:
   - Slug: `privacy-policy`
   - Title: `Privacy Policy`
   - Content: Your privacy policy HTML content
4. Access at `/page/privacy-policy`

### Creating an About Page
1. Create slug: `about-us`
2. Add company information
3. Access at `/page/about-us`

## Monitoring & Analytics

The dashboard provides insights into:
- Platform growth metrics
- Content performance
- User engagement
- Fixed slug popularity

## Future Enhancements

Potential additions:
- Advanced analytics dashboard
- Content scheduling
- Bulk operations
- Export functionality
- Advanced SEO tools
- Custom themes for fixed slugs

---

**Note**: Remember to change the default admin password in production environments for security.
