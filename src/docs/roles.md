# SmartParkr Role System

SmartParkr implements a role-based access control (RBAC) system with three distinct roles:
1. **User** - Regular users who can search for and book parking lots
2. **Owner** - Parking lot owners who can manage their lots
3. **Admin** - System administrators with full access

## Role Permissions

### Regular User (`user`)
- Search and browse parking lots
- View parking lot details
- Book parking slots
- View their own bookings
- Manage their profile

### Parking Lot Owner (`owner`)
- All permissions of a regular user
- Register as a parking lot owner
- Manage their own parking lots (create, update, delete)
- View analytics for their lots
- View bookings for their lots

### Administrator (`admin`)
- All permissions of both users and owners
- Manage all parking lots in the system
- Manage all users
- View system-wide analytics
- Access admin dashboard

## Role Hierarchy
```
Admin
├── Owner
└── User
```

Admins have the highest level of access, followed by owners, then regular users.

## Implementation Details

### User Model
The User model includes a `role` field that can be one of:
- `'user'` (default)
- `'owner'`
- `'admin'`

### Registration
During registration, users can select to register as either a regular user or parking lot owner. Admin roles are assigned separately by system administrators.

### Authentication
User roles are included in the JWT token payload and can be accessed throughout the application.

### Authorization
Role-based access control is implemented in:
1. UI components (show/hide based on role)
2. API routes (validate permissions before processing)
3. Database queries (filter data based on user role)

## API Endpoints by Role

### Public Endpoints
- `/api/parking-lots` - List all parking lots
- `/api/parking-lots/[id]` - Get parking lot details

### User Endpoints
- `/api/bookings` - Manage user bookings
- `/api/profile` - Manage user profile

### Owner Endpoints
- `/api/owner/register` - Register as parking lot owner
- `/api/owner/lots` - Manage owned parking lots
- `/api/owner/lots/[id]` - Manage specific parking lot

### Admin Endpoints
- `/api/admin/*` - All administrative functions

## Adding New Roles
To add a new role:

1. Update the User model enum to include the new role
2. Update the RBAC utility functions
3. Create appropriate API endpoints
4. Update UI components to handle the new role
5. Update navigation to include access to new features