# eCFR Analyzer

eCFR Analyzer is a full‑stack web application that provides interactive analysis of Federal Regulations. The project retrieves data from the electronic Code of Federal Regulations (eCFR), aggregates regulatory text from various federal agencies (including nested child agencies via recursive processing), and computes metrics such as word counts, readability scores, keyword frequencies, and historical trends. The results are visualized through a user‑friendly frontend interface.

------------------------------------------------------------
Project Structure
------------------------------------------------------------
- **/backend**  
  Contains the FastAPI‑based backend that retrieves, aggregates, and analyzes data from the eCFR API.  
  Please refer to `/backend/README.md` for detailed setup and deployment instructions.

- **/frontend**  
  Contains the React‑based frontend that visualizes the analysis using interactive charts and dashboards.  
  Please refer to `/frontend/README.md` for detailed setup and deployment instructions.

------------------------------------------------------------
Goal
------------------------------------------------------------
The goal of the eCFR Analyzer is to help users explore and understand the regulatory landscape by:
- Aggregating data from multiple agencies (including child agencies) for comprehensive analysis.
- Computing key metrics such as total word count, readability, and keyword frequency.
- Presenting the data through interactive visualizations and dashboards.

------------------------------------------------------------
Setup & Deployment
------------------------------------------------------------
1. **Backend Setup:**  
   See `/backend/README.md` for instructions on installing dependencies, configuring, and running the FastAPI backend.

2. **Frontend Setup:**  
   See `/frontend/README.md` for instructions on installing dependencies, configuring, and running the React application.
