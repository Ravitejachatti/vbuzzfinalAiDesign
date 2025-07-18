# Student Dashboard Mobile App

A React Native mobile application built with Expo for student dashboard functionality, providing access to notices, job opportunities, interview rounds, placement reports, and profile management.

## Features

- **Authentication**: Student login with university integration
- **Notices**: View and manage important announcements
- **Job Opportunities**: Browse and apply for available positions
- **Interview Rounds**: Track interview progress and status
- **Placement Reports**: Analyze placement data and success metrics
- **Profile Management**: Update personal, education, and skill information

## Tech Stack

- **React Native** with Expo
- **Redux Toolkit** for state management
- **React Navigation** for navigation
- **Axios** for API calls
- **AsyncStorage** for local data persistence
- **Expo Vector Icons** for icons
- **React Native Paper** for UI components

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd StudentDashboardApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on device/simulator:
```bash
# For iOS
npm run ios

# For Android
npm run android
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── NoticeModal.js
│   └── profile/         # Profile-related components
├── navigation/          # Navigation configuration
│   ├── AppNavigator.js
│   └── MainTabNavigator.js
├── redux/              # Redux store and slices
│   ├── store.js
│   └── slices/
├── screens/            # Screen components
│   ├── auth/
│   ├── jobs/
│   ├── notices/
│   ├── profile/
│   ├── reports/
│   └── rounds/
└── utils/              # Utility functions
```

## Configuration

Update the API base URL in the Redux slices:
```javascript
const BASE_URL = 'your-api-url-here';
```

## Key Features

### Authentication
- Secure login with university credentials
- Token-based authentication
- Persistent login state

### Dashboard Navigation
- Bottom tab navigation
- Intuitive user interface
- Badge notifications for unread notices

### Real-time Updates
- Pull-to-refresh functionality
- Real-time notice notifications
- Job application status tracking

### Profile Management
- Personal details management
- Education information
- Skills and competencies
- Document management

## API Integration

The app integrates with the existing backend API endpoints:
- Student authentication
- Notice management
- Job applications
- Round status tracking
- Profile updates

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.