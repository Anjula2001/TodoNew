# Todo Application - Functionality Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Authentication System](#authentication-system)
3. [Todo/Activity Management](#todoactivity-management)
4. [Filtering and Display](#filtering-and-display)
5. [API Endpoints](#api-endpoints)
6. [Frontend Components](#frontend-components)
7. [Data Flow](#data-flow)

---

## Architecture Overview

### Tech Stack
- **Backend**: Spring Boot (Java)
  - REST API
  - JWT-based authentication
  - JPA/Hibernate for database operations
  - ModelMapper for DTO transformations
  
- **Frontend**: Next.js 14+ (React/TypeScript)
  - App Router
  - Client-side rendering for interactive components
  - localStorage for token management
  - Tailwind CSS for styling

### Project Structure
```
todoApp/
├── backend/           # Spring Boot application
│   └── src/main/java/com/todoapp/todoapp/
│       ├── controller/   # REST endpoints
│       ├── services/     # Business logic
│       ├── model/        # Entity classes
│       ├── dto/          # Data transfer objects
│       ├── repo/         # Repository interfaces
│       └── util/         # Utilities (JWT, etc.)
└── frontend/          # Next.js application
    ├── app/
    │   ├── (auth)/       # Authentication pages
    │   └── (app)/        # Protected application pages
    ├── components/       # Reusable UI components
    └── lib/              # Utility functions
```

---

## Authentication System

### How Authentication Works

#### 1. **JWT (JSON Web Token) Based Authentication**

The application uses **stateless authentication** with JWT tokens:

**Backend (Spring Boot):**
- `JwtUtil.java` handles token generation and validation
- Secret key is used to sign tokens (stored in the class)
- Tokens contain the user's email as the subject
- Tokens have an expiration time

**Frontend (Next.js):**
- `lib/auth.ts` manages token storage and retrieval
- Tokens are stored in browser's localStorage
- Every API request includes the token in the Authorization header

#### 2. **Registration Flow**

**Step-by-step process:**

1. **User submits registration form** ([frontend/app/(auth)/register/page.tsx](frontend/app/(auth)/register/page.tsx))
   - Name, email, password fields
   - Frontend validates input

2. **POST request to `/api/v1/auth/register`**
   ```typescript
   fetch("http://localhost:8080/api/v1/auth/register", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ name, email, password })
   })
   ```

3. **Backend processes registration** ([AuthController.java](backend/src/main/java/com/todoapp/todoapp/controller/AuthController.java))
   - `AuthService` checks if email already exists
   - Password is hashed (BCrypt)
   - User entity is saved to database
   - Returns success message

#### 3. **Login Flow**

**Step-by-step process:**

1. **User submits login form** ([frontend/app/(auth)/login/page.tsx](frontend/app/(auth)/login/page.tsx))
   ```typescript
   const response = await fetch("http://localhost:8080/api/v1/auth/login", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ email, password })
   });
   ```

2. **Backend validates credentials** ([AuthController.java](backend/src/main/java/com/todoapp/todoapp/controller/AuthController.java))
   - `AuthService.login()` checks email and password
   - If valid, generates JWT token using `JwtUtil.generateToken()`
   - Returns `AuthResponse` with token, name, and email

3. **Frontend stores authentication data**
   ```typescript
   const data = await response.json();
   setAuthToken(data.token);        // Stores token in localStorage
   setUserData(data.name, data.email); // Stores user info
   router.push("/today");           // Redirects to app
   ```

#### 4. **Protected Routes**

**Every protected page checks authentication:**

```typescript
useEffect(() => {
  const token = getAuthToken();
  if (!token) {
    router.push("/login"); // Redirect to login if no token
    return;
  }
  // Fetch data...
}, []);
```

#### 5. **API Request Authentication**

**All API calls to protected endpoints include the token:**

```typescript
const token = getAuthToken();
fetch("http://localhost:8080/api/v1/getactivity", {
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }
})
```

**Backend validates token:**
```java
@GetMapping("/getactivity")
public List<ActivityDTO> getActivity(@RequestHeader("Authorization") String authHeader){
    String token = authHeader.substring(7); // Remove "Bearer " prefix
    String userEmail = jwtUtil.extractEmail(token); // Extract email from token
    return activityServices.getAllActivitiesByUser(userEmail);
}
```

#### 6. **Profile Management**

**Get Profile:**
- Endpoint: `GET /api/v1/auth/profile`
- Extracts user email from JWT token
- Returns user details

**Update Profile:**
- Endpoint: `PUT /api/v1/auth/profile`
- Updates name, email
- Returns new JWT token with updated information

**Change Password:**
- Endpoint: `PUT /api/v1/auth/change-password`
- Validates old password
- Updates to new password
- Password is hashed before saving

#### 7. **Logout**

Frontend simply removes stored data:
```typescript
export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
};
```

---

## Todo/Activity Management

### Data Model

**ActivityDTO (Backend):**
```java
{
  id: Integer,          // Auto-generated
  date: String,         // Format: "YYYY-MM-DD"
  context: String,      // Task description
  completed: Boolean    // Task status
}
```

**Activity (Frontend):**
```typescript
{
  id: number,
  date: string,         // "YYYY-MM-DD"
  context: string,
  completed: boolean
}
```

### CRUD Operations

#### 1. **Create Todo**

**Frontend:** ([app/(app)/add_Task/page.tsx](frontend/app/(app)/add_Task/page.tsx))
```typescript
const response = await fetch("http://localhost:8080/api/v1/saveactivity", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    date: "2026-01-15",
    context: "Complete project documentation",
    completed: false
  })
});
```

**Backend:** ([ActivityController.java](backend/src/main/java/com/todoapp/todoapp/controller/ActivityController.java))
```java
@PostMapping("/saveactivity")
public ActivityDTO saveActivity(@RequestBody ActivityDTO activityDTO, 
                                @RequestHeader("Authorization") String authHeader){
    String token = authHeader.substring(7);
    String userEmail = jwtUtil.extractEmail(token);
    return activityServices.AddActivity(activityDTO, userEmail);
}
```

**Service Logic:** ([ActivityServices.java](backend/src/main/java/com/todoapp/todoapp/services/ActivityServices.java))
- Finds user by email from JWT
- Creates new ActivityModel
- Associates activity with the user
- Saves to database
- Returns ActivityDTO

#### 2. **Read Todos**

**Frontend:**
```typescript
const response = await fetch("http://localhost:8080/api/v1/getactivity", {
  headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
  }
});
const data = await response.json();
```

**Backend:**
```java
@GetMapping("/getactivity")
public List<ActivityDTO> getActivity(@RequestHeader("Authorization") String authHeader){
    String token = authHeader.substring(7);
    String userEmail = jwtUtil.extractEmail(token);
    return activityServices.getAllActivitiesByUser(userEmail);
}
```

**Service Logic:**
- Extracts user email from JWT
- Finds user in database
- Queries `activityrepo.findByUser(user)` to get all user's activities
- Uses ModelMapper to convert List<ActivityModel> to List<ActivityDTO>
- Returns all activities for that user

#### 3. **Update Todo**

**Frontend:** ([app/(app)/day/page.tsx](frontend/app/(app)/day/page.tsx))
```typescript
const handleTaskEdit = async (taskId: number, newName: string) => {
  await fetch(`http://localhost:8080/api/v1/updateactivity/${taskId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      context: newName,
      date: activity.date,
      completed: activity.completed
    })
  });
};
```

**Backend:**
```java
@PutMapping("/updateactivity/{id}")
public ActivityDTO updateActivity(@PathVariable Integer id, 
                                  @RequestBody ActivityDTO activityDTO) {
    return activityServices.updateActivity(id, activityDTO);
}
```

**Service Logic:**
- Finds existing activity by ID
- Updates only provided fields (date, context, completed)
- Saves updated activity
- Returns updated ActivityDTO

#### 4. **Toggle Complete Status**

**Frontend:**
```typescript
const handleTaskComplete = async (taskId: number) => {
  await fetch(`http://localhost:8080/api/v1/togglecompleted/${taskId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });
};
```

**Backend:**
```java
@PutMapping("/togglecompleted/{id}")
public ActivityDTO toggleCompleted(@PathVariable Integer id) {
    return activityServices.toggleCompleted(id);
}
```

**Service Logic:**
```java
public ActivityDTO toggleCompleted(Integer id) {
    ActivityModel activity = activityrepo.findById(id)
        .orElseThrow(() -> new RuntimeException("Activity not found"));
    
    activity.setCompleted(!activity.getCompleted()); // Toggle
    ActivityModel updated = activityrepo.save(activity);
    return modelMapper.map(updated, ActivityDTO.class);
}
```

#### 5. **Delete Todo**

**Frontend:**
```typescript
const handleTaskDelete = async (taskId: number) => {
  await fetch(`http://localhost:8080/api/v1/deleteactivity/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};
```

**Backend:**
```java
@DeleteMapping("/deleteactivity/{id}")
public void deleteActivity(@PathVariable Integer id) {
    activityServices.deleteActivity(id);
}
```

---

## Filtering and Display

### How Filtering Works

The application has several filtered views, all using the same data source but applying different filters on the frontend.

#### 1. **Today's Tasks** ([app/(app)/today/page.tsx](frontend/app/(app)/today/page.tsx))

**Filtering Logic:**
```typescript
const fetchActivities = async () => {
  // Get all activities from backend
  const response = await fetch("http://localhost:8080/api/v1/getactivity", {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  
  const data = await response.json();
  
  // Filter for today's date only
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const todayStr = `${year}-${month}-${day}`; // e.g., "2026-01-12"
  
  const todayActivities = data.filter((activity: Activity) => {
    return activity.date === todayStr;
  });
  
  setActivities(todayActivities);
};
```

**Display:**
- Shows only tasks with date matching today
- Uses `Day` component to render the tasks
- Shows "No tasks for today" if empty

#### 2. **Completed Tasks** ([app/(app)/completed/page.tsx](frontend/app/(app)/completed/page.tsx))

**Filtering Logic:**
```typescript
const fetchActivities = () => {
  fetch("http://localhost:8080/api/v1/getactivity", {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data: ActivityDTO[]) => {
      // Filter for completed tasks only
      const completedActivities = data.filter(
        (activity) => activity.completed === true
      );
      setActivities(completedActivities);
    });
};
```

**Grouping by Date:**
```typescript
// Group activities by date
const groupedActivities = activities.reduce((acc, activity) => {
  const date = activity.date;
  if (!acc[date]) {
    acc[date] = [];
  }
  acc[date].push(activity);
  return acc;
}, {} as Record<string, ActivityDTO[]>);

// Sort dates in descending order (most recent first)
const sortedDates = Object.keys(groupedActivities).sort((a, b) => 
  b.localeCompare(a)
);
```

**Display:**
- Groups completed tasks by date
- Shows most recent dates first
- Each date section uses the `Day` component

#### 3. **All Tasks / Calendar View** ([app/(app)/task/page.tsx](frontend/app/(app)/task/page.tsx))

Likely shows all tasks, possibly with calendar navigation to filter by selected date.

#### 4. **Day Component** ([app/(app)/day/page.tsx](frontend/app/(app)/day/page.tsx))

This is a reusable component that displays tasks for a specific date:

```typescript
interface DayProps {
  date: Date;              // The date to display
  activities: ActivityDTO[]; // Pre-filtered activities for this date
  onUpdate?: () => void;   // Callback to refresh parent data
}

const Day = ({ date, activities, onUpdate }: DayProps) => {
  // Renders tasks for the given date
  // Handles task selection, completion, deletion, editing
}
```

**Features:**
- Displays date header
- Lists all tasks for that date
- Task selection (expand/collapse)
- Mark as complete
- Edit task name
- Delete task
- Add new task (inline)

### Filter Types Summary

| View | Filter Criteria | Data Source |
|------|----------------|-------------|
| Today | `date === today` | GET /api/v1/getactivity |
| Completed | `completed === true` | GET /api/v1/getactivity |
| Day | `date === selectedDate` | GET /api/v1/getactivity |
| All Tasks | No filter | GET /api/v1/getactivity |

**Note:** All filtering happens on the **frontend**. The backend always returns ALL activities for the authenticated user. This is efficient for small to medium datasets but could be optimized with backend filtering for larger applications.

---

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Headers | Body | Response |
|--------|----------|---------|------|----------|
| POST | `/api/v1/auth/register` | Content-Type: application/json | `{name, email, password}` | Success message |
| POST | `/api/v1/auth/login` | Content-Type: application/json | `{email, password}` | `{token, name, email}` |
| GET | `/api/v1/auth/profile` | Authorization: Bearer {token} | - | User object |
| PUT | `/api/v1/auth/profile` | Authorization: Bearer {token} | `{name, email}` | `{token, name, email}` |
| PUT | `/api/v1/auth/change-password` | Authorization: Bearer {token} | `{oldPassword, newPassword}` | Success message |

### Activity/Todo Endpoints

| Method | Endpoint | Headers | Body | Response |
|--------|----------|---------|------|----------|
| GET | `/api/v1/getactivity` | Authorization: Bearer {token} | - | Array of ActivityDTO |
| POST | `/api/v1/saveactivity` | Authorization: Bearer {token} | `{date, context, completed}` | Created ActivityDTO |
| PUT | `/api/v1/updateactivity/{id}` | Authorization: Bearer {token} | `{date?, context?, completed?}` | Updated ActivityDTO |
| PUT | `/api/v1/togglecompleted/{id}` | Authorization: Bearer {token} | - | Updated ActivityDTO |
| DELETE | `/api/v1/deleteactivity/{id}` | Authorization: Bearer {token} | - | - |

### CORS Configuration

Backend allows requests from frontend:
```java
@CrossOrigin(origins = "http://localhost:3000")
```

---

## Frontend Components

### Layout Structure

```
app/
├── layout.tsx                    # Root layout
├── (auth)/
│   ├── layout.tsx               # Auth layout (no sidebar)
│   ├── login/page.tsx           # Login page
│   └── register/page.tsx        # Registration page
└── (app)/
    ├── layout.tsx               # App layout (with sidebar)
    ├── page.tsx                 # Dashboard/home
    ├── today/page.tsx           # Today's tasks
    ├── completed/page.tsx       # Completed tasks
    ├── task/page.tsx            # All tasks
    ├── day/page.tsx             # Day view (reusable)
    ├── add_Task/page.tsx        # Add new task
    └── profile/page.tsx         # User profile
```

### Key Components

#### 1. **App Sidebar** ([components/app-sidebar.tsx](frontend/components/app-sidebar.tsx))
- Navigation menu
- Links to all main pages
- User info display
- Logout button

#### 2. **Task Component** ([app/(app)/task/page.tsx](frontend/app/(app)/task/page.tsx))
- Individual task display
- Checkbox for completion
- Edit and delete actions
- Task details

#### 3. **Day Component** ([app/(app)/day/page.tsx](frontend/app/(app)/day/page.tsx))
- Displays tasks for a specific date
- Reusable across different pages
- Handles all task operations

### UI Components ([components/ui/](frontend/components/ui/))
- Built with Shadcn/ui
- Reusable components: Button, Input, Calendar, Avatar, etc.
- Styled with Tailwind CSS

---

## Data Flow

### Complete Flow: Creating a Todo

```
User Input (Frontend)
    ↓
Form Submission
    ↓
POST /api/v1/saveactivity
    + Authorization: Bearer {JWT_TOKEN}
    + Body: {date, context, completed}
    ↓
Backend: ActivityController
    ↓
Extract email from JWT token
    ↓
Backend: ActivityServices.AddActivity()
    ↓
Find User by email
    ↓
Create ActivityModel
    ↓
Associate with User
    ↓
Save to Database (JPA)
    ↓
Convert to ActivityDTO
    ↓
Return ActivityDTO
    ↓
Frontend receives response
    ↓
Refresh activity list
    ↓
UI updates
```

### Complete Flow: Displaying Today's Todos

```
User navigates to /today
    ↓
Check if authenticated (token exists)
    ↓
If no token → Redirect to /login
    ↓
If token exists → fetchActivities()
    ↓
GET /api/v1/getactivity
    + Authorization: Bearer {JWT_TOKEN}
    ↓
Backend: ActivityController.getActivity()
    ↓
Extract email from JWT
    ↓
Backend: ActivityServices.getAllActivitiesByUser()
    ↓
Find User by email
    ↓
Query: activityrepo.findByUser(user)
    ↓
Return all user's activities
    ↓
Frontend receives all activities
    ↓
Filter activities where date === today
    ↓
setActivities(filtered)
    ↓
Render Day component with filtered activities
```

### Authentication Flow

```
Login Form Submit
    ↓
POST /api/v1/auth/login {email, password}
    ↓
Backend: AuthController.login()
    ↓
AuthService validates credentials
    ↓
Check email exists in database
    ↓
Verify password (BCrypt)
    ↓
Generate JWT token (JwtUtil.generateToken())
    ↓
Return {token, name, email}
    ↓
Frontend: setAuthToken(token)
    ↓
Store in localStorage
    ↓
Redirect to /today
    ↓
All subsequent requests include:
    Authorization: Bearer {token}
    ↓
Backend extracts email from token
    ↓
Fetch user-specific data
```

---

## Security Considerations

### Current Implementation

1. **Password Security**
   - Passwords are hashed using BCrypt
   - Not stored in plain text

2. **JWT Token**
   - Signed with secret key
   - Contains user email
   - Has expiration time

3. **Authorization**
   - All protected endpoints require JWT token
   - User can only access their own data
   - Email extracted from token, not from request

### Best Practices (Recommendations)

1. **Environment Variables**
   - Move JWT secret to environment variables
   - Don't hardcode secrets in code

2. **HTTPS**
   - Use HTTPS in production
   - Secure token transmission

3. **Token Refresh**
   - Implement refresh token mechanism
   - Short-lived access tokens

4. **Input Validation**
   - Validate all user inputs
   - Sanitize data to prevent injection attacks

5. **CORS**
   - Configure CORS properly for production
   - Don't use wildcard origins

---

## Running the Application

### Backend
```bash
cd backend
mvn spring-boot:run
```
Server runs on: `http://localhost:8080`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:3000`

### Database
- Check `application.properties` for database configuration
- Ensure database is running and accessible

---

## Common Workflows

### Adding a New Task
1. Navigate to "Add Task" page
2. Enter task details (name, date)
3. Submit form
4. Backend creates activity linked to user
5. Redirect to task list

### Viewing Today's Tasks
1. Navigate to "Today" page
2. System fetches all user activities
3. Frontend filters for today's date
4. Display filtered tasks
5. Can toggle complete, edit, or delete

### Completing a Task
1. Click checkbox on task
2. Frontend calls toggleCompleted API
3. Backend flips completed status
4. Frontend refreshes task list
5. UI updates to show new status

### Viewing Completed Tasks
1. Navigate to "Completed" page
2. Fetch all activities
3. Filter for completed === true
4. Group by date
5. Display sorted by date (newest first)

---

## Troubleshooting

### "Not authenticated" errors
- Check if token exists in localStorage
- Verify token is included in Authorization header
- Check if token is expired

### Tasks not showing
- Verify user is logged in
- Check date format (YYYY-MM-DD)
- Inspect network requests in browser DevTools

### CORS errors
- Ensure backend CORS allows frontend origin
- Check if ports match (backend: 8080, frontend: 3000)

---

## Future Enhancements

1. **Backend Filtering**
   - Add query parameters for filtering by date/status
   - Reduce data transfer

2. **Real-time Updates**
   - WebSocket for live updates
   - Multi-device synchronization

3. **Task Categories**
   - Add categories/tags to tasks
   - Filter by category

4. **Notifications**
   - Reminder notifications
   - Due date alerts

5. **Search Functionality**
   - Search tasks by name/content
   - Advanced filters

6. **Performance**
   - Pagination for large datasets
   - Caching strategies

---

*Last Updated: January 12, 2026*
