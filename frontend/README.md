# eCFR Analyzer Frontend

The eCFR Analyzer Frontend is a React-based web application that visualizes the analysis of Federal Regulations data provided by the backend. It allows users to interact with and explore aggregated statistics, detailed agency metrics, and historical trends derived from the eCFR API.

------------------------------------------------------------
TABLE OF CONTENTS
------------------------------------------------------------
1. Overview
2. Features
3. Technology Stack
4. Project Structure
5. Setup Instructions
6. Available Views and Components
7. Deployment
8. Notes
9. License
10. Contact

------------------------------------------------------------
1. OVERVIEW
------------------------------------------------------------
The eCFR Analyzer Frontend enables users to explore and interact with regulatory data through a user-friendly interface. Data is fetched from the backend API, which aggregates content from the electronic Code of Federal Regulations (eCFR) – including data from all agencies and their child agencies (via recursive processing). The frontend presents overall aggregated statistics, detailed agency analysis, interactive charts, and historical trends.

------------------------------------------------------------
2. FEATURES
------------------------------------------------------------
- **Interactive Dashboard:**  
  Explore aggregated statistics such as total word count, agency count, average/median word counts, and more.

- **Detailed Agency Analysis:**  
  View detailed metrics for individual agencies including result count, total word count, readability scores (Flesch Reading Ease, Flesch-Kincaid Grade), average sentence length, and top keywords.  

- **Visualizations:**  
  Display charts for keywords (using a KeywordChart component) and per‑agency word counts (using an AgencyWordCountChart component), as well as historical trends (using a TimeSeriesChart component).

- **Caching Information:**  
  The frontend indicates when the statistics were last updated using data from the backend cache.

------------------------------------------------------------
3. TECHNOLOGY STACK
------------------------------------------------------------
- **React:** For building the user interface.
- **React Router:** For client-side routing.
- **Material UI:** For UI components and styling.
- **Chart.js (via react-chartjs-2):** For rendering interactive charts.
- **Axios:** For making HTTP requests to the backend API.
- **Other:** Standard JavaScript/React libraries.

------------------------------------------------------------
4. PROJECT STRUCTURE
------------------------------------------------------------
The project is organized as follows:
  
frontend/
├── public/
│   ├── index.html                # Main HTML file; includes static assets
│   └── ...                       # Other public assets (images, favicon, etc.)
├── src/
│   ├── components/               # Reusable React components
│   │   ├── DetailedAnalysis.js   # Detailed analysis view for a selected agency
│   │   ├── KeywordChart.js       # Chart component to display top keywords
│   │   ├── AgencyWordCountChart.js  # Chart component for per-agency word counts
│   │   ├── TimeSeriesChart.js    # Chart component to show historical trends
│   │   └── ...                   # Additional reusable components
│   ├── pages/                    # Page-level components
│   │   ├── StatisticsPage.js     # Displays aggregated statistics
│   │   ├── HomePage.js           # Homepage with an overview of the project
│   │   ├── AboutPage.js          # Information about the project
│   │   └── ...                   # Other page components
│   ├── App.js                    # Main application component (includes routing)
│   ├── index.js                  # Entry point for the React application
│   └── ...                       # Additional assets, helper files, and styles
├── package.json                  # Lists project dependencies and scripts
└── README.txt                    # This file (Project documentation)

------------------------------------------------------------
5. SETUP INSTRUCTIONS
------------------------------------------------------------
1. **Clone the Repository and Navigate to the Frontend Directory:**
2. **Install Dependencies:**
Use Yarn or npm to install the project dependencies:
`yarn install`
3. **Run the Frontend:**
Start the development server:
`yarn start`

The app will typically run at [http://localhost:3000](http://localhost:3000).

------------------------------------------------------------
6. AVAILABLE VIEWS AND COMPONENTS
------------------------------------------------------------
- **HomePage:**  
Provides an overview of the project and navigation links to key sections.

- **DetailedAnalysis:**  
Fetches and displays detailed metrics for a selected agency. It calls the backend `/metrics` endpoint and shows key values such as word count, readability scores, top keywords, and historical trends.

- **StatisticsPage:**  
Fetches overall aggregated statistics and per‑agency word counts from the backend (via `/statistics` and `/agency_word_count` endpoints). Displays overall metrics, a top keywords chart, and an Agency Word Count bar chart.

- **Additional Components:**  
- **KeywordChart:** Visualizes top keywords using Chart.js.
- **AgencyWordCountChart:** Renders a bar chart of per‑agency word counts.
- **TimeSeriesChart:** Displays historical trends.

------------------------------------------------------------
7. NOTES
------------------------------------------------------------
- **Backend Dependency:**  
Ensure that the backend is running (typically on [http://localhost:8091](http://localhost:8091)) so that the frontend can successfully fetch data.
- **API Integration:**  
The frontend makes HTTP requests to the backend using Axios. If the backend URL changes, update the endpoints accordingly (consider using a configuration file such as `src/config.js`).
- **Caching:**  
The statistics page relies on cached JSON data from the backend. A note is displayed showing when the data was last updated.
