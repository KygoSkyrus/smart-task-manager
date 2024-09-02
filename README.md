# Task Manager App

A task management application built with Next.js 14 and TypeScript. The app enables users to create, manage, and track tasks with various features, including priority and location-based tasks, real-time updates, and a dashboard for visualizing task statistics and progress.

## Features

- **Create Tasks:** Add tasks with title, description, due date, priority (Low, Medium, High), and location (lat/lng).
- **Dashboard:** Visualize your task statistics and progress with charts and graphs.
- **Search Functionality:** Easily find tasks using keywords.
- **Edit & Delete Tasks:** Modify or remove tasks as needed.
- **Mark Tasks Complete:** Track your progress by marking tasks as complete.
- **Real-time Updates:** Experience seamless updates to tasks without needing to refresh the page.
- **Responsive Design:** The app is fully responsive, providing a great user experience on all devices.
- **Integration with Libraries & Packages:** 
  - **Firebase & Firestore:** For real-time database and authentication.
  - **Axios:** For API requests.
  - **Leaflet:** For interactive maps.
  - **Chart.js:** For visualizing task statistics.
  - **Redux:** For state management.
  - **JWT:** For secure authentication.

## Getting Started

### Prerequisites

- **Node.js**: Install Node.js from [nodejs.org](https://nodejs.org/).
- **Firebase Project**: Set up a Firebase project and enable Firestore.

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/KygoSkyrus/smart-task-manager.git
    cd smart-task-manager
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**
  - For testing purpose all environment variables are public for now. Also firebase client side scerets are not secrets anymore.

### Running the App

1. **Start the development server:**

    ```bash
    npm run dev
    ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

2. **Build for production:**

    ```bash
    npm run build
    ```

3. **Run the production server:**

    ```bash
    npm start
    ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

### Deployment

The app can be deployed on any platform that supports Node.js. Popular choices include Vercel, Netlify, and Firebase Hosting.

1. **Deploy to Vercel:**

   - Connect your repository to Vercel.
   - Set up your environment variables in Vercel.
   - Deploy the project.

2. **Deploy to Firebase Hosting:**

    - Build the app:

      ```bash
      npm run build
      ```

    - Deploy:

      ```bash
      firebase deploy
      ```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Leaflet](https://leafletjs.com/)
- [Chart.js](https://www.chartjs.org/)
- [Redux](https://redux.js.org/)
- [JWT](https://jwt.io/)

