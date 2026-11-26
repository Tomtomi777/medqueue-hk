# MedQueue HK

> A web-based Accident and Emergency (A&E) waiting time monitoring and analytics system that helps Hong Kong residents and visitors access, explore, and compare published hospital waiting time statistics.
Developed as a group project for CS3383 — AI for Software Engineering at City University of Hong Kong.

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
|————|———|
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
|————|———|
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

1. Presentation Layer — React frontend responsible for user interaction and data visualization.
2. Application Layer — Java Spring Boot backend responsible for data retrieval, validation, processing, and REST API services.
3. Persistence Layer — H2 database responsible for storing historical hospital waiting time records.
   
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

The backend automatically retrieves government data at scheduled intervals, converts waiting time values into numerical representations, and prevents duplicate historical records.

The frontend retrieves processed data through REST API endpoints and combines waiting time information with geographical hospital data.

## Requirements

- Java JDK (version: _27.0.1.1_)
- Other dependencies: _Apache Maven_
- _Node.js 22.12 or later; Node.js 24 was used during development._
- _npm._
- _Git_
- _Internet connection for government data synchronization and map tiles._

## Installation

1. Clone the repository: `git clone https://github.com/Tomtomi777/medqueue-hk.git`
2. Start the Backend. Navigate to the backend directory: 

## Usage

1. Run: `java -jar medqueue-hk.jar` (or run the `.bat` file).
2. _Describe the main steps._

Example:

```
(paste an example of input / output or a screenshot here)
```

## Project Structure

```
/src      Java source code
/test     JUnit test cases
/docs     Project plan, design report, bug report, test report, reflections
/release  Executable files (.jar, .bat)
/logs     Weekly Activity Log
```

## Versions and Bug Fixes

| Version | Date | Changes / Bugs fixed |
|---------|------|----------------------|
| v0.1 | _date_ | Initial structure |
