# MedQueue HK

> A web-based Accident and Emergency (A&E) waiting time monitoring and analytics system that helps Hong Kong residents and visitors access, explore, and compare published hospital waiting time statistics.

## Team

| Name | Role |
|------|------|
| _Aisulu Bakytzhan_ | Project Manager |
| _Arujan Serkibaeva_ | Assistant Project Manager |
| _Teya Kim_ | Programmer |
| _Aruzhan Dauletkyzy_ | Testing Engineer |
| _Tomiris Aidarkhan_ | Configuration Manager |

## Description

MedQueue HK is a full-stack healthcare information and analytics application that integrates official open data from the Hong Kong Hospital Authority.
The system automatically retrieves published A&E waiting time statistics, processes and stores historical records in a persistent database, and presents the information through an interactive and user-friendly web interface.
The application is designed to improve the accessibility, transparency, and understanding of publicly available hospital waiting time information.

## Main Features

### Dashboard
- Monitoring of published waiting time statistics across 18 A&E hospitals.
- Automatic backend data synchronization every 15 minutes.
- Shortest published median waiting time statistics.
- Mean hospital median waiting time calculation.
- Data freshness monitoring.
- Manual and automatic frontend refresh.
- Search, hospital cluster filtering, and sorting.
- Simple and detailed statistics display modes.
- Educational guide explaining triage categories and statistical measurements.

### Interactive Hospital Map
- Interactive geographical visualization using Leaflet and OpenStreetMap.
- Hospital coordinates obtained from official Hospital Authority data.
- Clickable hospital markers with addresses and waiting time statistics.
- Browser-based geolocation.
- Nearest mapped hospital identification using the Haversine formula.
- Straight-line distance calculation.
- Interactive zooming and map navigation.

### Hospital Directory
- Individual hospital information cards.
- Hospital names, addresses, and geographical clusters.
- Search by hospital name, address, or cluster.
- Expandable waiting time statistics.
- External navigation links.

### Hospital Comparison
- Side-by-side comparison of up to four hospitals.
- Interactive bar charts.
- Median and 95th percentile waiting time comparison.
- Urgent and less urgent category selection.
- Detailed comparison tables.

### Historical Analytics
- Persistent collection of hospital waiting time snapshots.
- Historical waiting time visualization using line charts.
- Hospital, category, and time range selection.
- Minimum, maximum, and mean recorded median calculations.
- Waiting time changes over selected periods.
- Historical records tables.
- CSV data export.

### User Interface and Accessibility
- Responsive desktop and mobile layouts.
- Light, dark, and system appearance modes.
- Persistent theme preferences.
- Mobile bottom navigation.
- Touch-friendly interaction controls.
- Floating refresh button on mobile devices.
- Loading, empty, and error states.
- User-friendly explanations of medical and statistical terminology.

## Technology Stack

### Backend

| Technology | Purpose |
|------|------|
| Java | Backend programming language |
| Spring Boot | Application framework |
| Spring Web | REST API development |
| Spring Data JPA | Database access and persistence |
| Hibernate | Object-relational mapping |
| H2 Database | Persistent historical data storage |
| Maven | Dependency management and build automation |
| Spring Boot Actuator | Application health monitoring |
| JUnit | Automated Java testing framework |

### Frontend

| Technology | Purpose |
|------|------|
| React | User interface development |
| JavaScript | Frontend application logic |
| Vite | Development server and build tooling |
| React Router | Client-side navigation |
| Axios | REST API communication |
| Recharts | Statistical data visualization |
| Leaflet | Interactive geographical maps |
| React Leaflet | React integration with Leaflet |
| Lucide React | User interface icons |
| CSS | Styling, responsiveness, and theme management |

### External Data Sources
- Hong Kong Hospital Authority A&E Waiting Time Dataset
- Hong Kong Hospital Authority Hospital and Institution Dataset
- OpenStreetMap

## System Architecture

The application follows a client-server architecture consisting of three main layers:

1. **Presentation Layer** — React frontend responsible for user interaction and data visualization.
2. **Application Layer** — Java Spring Boot backend responsible for data retrieval, validation, processing, and REST API services.
3. **Persistence Layer** — H2 database responsible for storing historical hospital waiting time records.

```text
Hong Kong Hospital Authority API
                |
                v
      Java Spring Boot Backend
                |
                v
          H2 Database
                |
                v
            REST API
                |
                v
          React Frontend
                |
    +————+————+
    |           |           |
   Maps       Charts      Tables
```

## Requirements

- Java JDK (version: _27.0.1.1_)
- Apache Maven.
- Node.js 22.12 or later; Node.js 24 was used during development.
- npm.
- Git.

## Installation

1. Clone the repository:
```bash
git clone https:/Tomtomi777/github.com//medqueue-hk.git
cd medqueue-hk
```
2. Start the Backend

Navigate to the backend directory:
```bash 
cd backend
```

Install dependencies and build the project:
```bash 
mvn clean package
```

Start the Spring Boot application:
```bash 
mvn spring-boot:run
```

The backend will be available at:
```http://localhost:8080```

Verify that the backend is running:
 ```http://localhost:8080/actuator/health```

3. Start the Frontend
   
Open a second terminal and navigate to the frontend directory:
```bash 
cd medqueue-hk/frontend
```

Install the required dependencies:
```bash 
npm install
```

Start the development server:
```bash 
npm run dev
```

Open the application in a web browser:
```http://localhost:5173```

## Running the Executable JAR

The backend executable JAR can be generated using:
```bash
cd backend
mvn clean package
```

The generated JAR file will be located inside:
```backend/target/```

Run the generated executable using:
```bash 
java -jar target/medqueue-0.0.1-SNAPSHOT.jar
```

## Usage

### Dashboard
1. Open the application in a web browser.
2. View the latest published hospital waiting time statistics.
3. Select the desired waiting time category.
4. Search for hospitals or filter them by hospital cluster.
5. Explore hospital locations using the interactive map.
6. Click a hospital marker to view additional information.
7. Enable location access to identify the nearest mapped hospital.
8. Use the Refresh button to retrieve the latest stored backend data.

### Hospitals
1. Navigate to the Hospitals page.
2. Search for a hospital by name, address, or cluster.
3. Select View Details to display additional waiting time statistics.
4. Select Directions to open the hospital location in an external navigation service.

### Comparison
1. Navigate to the Comparison page.
2. Select between two and four hospitals.
3. Choose the desired waiting time category.
4. Compare hospital statistics using the interactive chart.
5. Review the detailed side-by-side comparison table.

### Analytics
1. Navigate to the Analytics page.
2. Select a hospital.
3. Select a waiting time category.
4. Choose a historical time range.
5. Review historical waiting time trends and calculated statistics.
6. Select Export CSV to download the selected historical records.

### Appearance
- Users can switch between light mode, dark mode, and system appearance using the theme selector.
- The selected appearance preference is saved locally in the browser.

## REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/hospitals | Retrieve the latest stored hospital waiting time records |
| GET | /api/hospitals/history?name={hospitalName} | Retrieve historical records for a selected hospital |
| GET | /actuator/health | Check backend application health |

### Example API Request
```bash
curl http://localhost:8080/api/hospitals
```
### Example API Response

The following is an illustrative example of a hospital record:
```json
{
  «hospitalName»: «Queen Mary Hospital»,
  «t1wt»: «0 minute»,
  «t2wt»: «less than 15 minutes»,
  «t3p50»: «27 minutes»,
  «t45p50»: «1.5 hours»,
  «t3p50Minutes»: 27,
  «t45p50Minutes»: 90
}
```

## Project Structure

```text
medqueue-hk/
|
|— backend/
|   |— src/
|   |   |— main/
|   |   |   |— java/
|   |   |   |   `— com/medqueue/hk/
|   |   |   |       |— adapter/
|   |   |   |       |— controller/
|   |   |   |       |— dto/
|   |   |   |       |— model/
|   |   |   |       |— repository/
|   |   |   |       |— service/
|   |   |   |       `— MedqueueApplication.java
|   |   |   `— resources/
|   |   |       `— application.properties
|   |   `— test/
|   |— data/
|   `— pom.xml
|
|— frontend/
|   |— public/
|   |— src/
|   |   |— components/
|   |   |— data/
|   |   |— hooks/
|   |   |— pages/
|   |   |— services/
|   |   |— styles/
|   |   |— utils/
|   |   |— App.jsx
|   |   |— App.css
|   |   |— index.css
|   |   `— main.jsx
|   |— index.html
|   |— package.json
|   `— vite.config.js
|
|— docs/
|   |— screenshots/
|   |— project-plan/
|   |— design/
|   |— testing/
|   |— bug-reports/
|   `— reflections/
|
|— release/
|— logs/
|— .gitignore
`— README.md
```

## Software Design Principles

The application incorporates several software engineering principles:

- Separation of Concerns
- Single Responsibility Principle
- Layered Architecture
- Component-Based Architecture
- Modularity
- Reusability
- Dependency Injection
- Error Handling
- Data Validation
- Responsive Design
- Progressive Disclosure

The backend separates external API communication, business logic, database access, and REST controllers into independent modules.

The frontend uses reusable React components, utility functions, API services, and custom hooks to improve maintainability.

## Testing

The testing process includes:

- Unit testing using JUnit.
- REST API testing.
- Database persistence testing.
- External API integration testing.
- Waiting time parsing validation.
- Statistical calculation testing.
- Hospital name normalization testing.
- Geographical distance calculation testing.
- Functional user interface testing.
- Responsive layout testing.
- Error handling and edge case testing.

Run the backend test suite using:
```bash
cd backend
mvn test
```
Generate a production frontend build using:
```bash
cd frontend
npm run build
```
