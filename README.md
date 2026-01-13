# Sanjeevani (Project Phoenix)

## Description
Sanjeevani is a comprehensive healthcare emergency response platform designed to bridge the gap between patients and critical medical resources. It helps users find the nearest emergency hospitals with real-time availability of ICU beds, oxygen, and doctors. It also provides blood bank information, ambulance availability, and essential first aid tips.

## Demo Video Link
https://drive.google.com/file/d/10k8OJcqClCbWD03TFLek8esPXC5YMfl7/view?usp=drivesdk

## Features
- **Emergency Hospital Finder:** Locates nearest hospitals based on geolocation and sorts them by distance and resource availability.
- **Real-time Resource Tracking:** Displays live status of ICU beds, Oxygen, and Doctors.
- **Role-Based Access:** Dedicated portals for Users, Hospitals, and Admins.
- **Blood Bank Directory:** Information on blood availability.
- **Ambulance Services:** Check ambulance availability.
- **First Aid Guide:** Quick access to life-saving first aid tips.

## Tech Stack
- **Frontend:** React.js, TailwindCSS, Framer Motion
- **Backend:** Firebase (Authentication, Firestore)

## Google Technologies Used

- **Firebase Authentication:** Used for secure role-based login (User, Hospital, Admin) to ensure data privacy and authorized access.
- **Firebase Firestore:** Utilized as a real-time database to store and sync hospital data instantly across all user devices.
- **Google Maps:** Integrated to provide accurate driving directions to the chosen hospital directly from the user's location.

## Setup Instructions
Steps to run the project locally:
1. Clone the repository
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory
   ```bash
   cd sanjeevani
   ```
3. Install dependencies
   ```bash
   npm install
   ```
4. Create a `firebase.js` file in `src` with your Firebase config (if not present).
5. Run the project
   ```bash
   npm start
   ```

## Team Members
- Aditi J N
- Dakshayini
- Joylin Mathias
- Tejashwini K M

## Contribution
Frontend- Aditi, Dakshayini, Tejashwini, Joylin
Backend- Joylin, Dakshayini
