# Overview

VeroctaAI Financial Intelligence Platform is a unified full-stack application that provides AI-powered financial analysis and insights. The platform processes financial CSV data (from various sources like QuickBooks, Wave, Revolut, Xero) to generate SpendScore analytics, AI-driven recommendations, and professional PDF reports. It combines a Flask backend with a React TypeScript frontend to deliver comprehensive financial intelligence for businesses.

The core value proposition centers around the SpendScore engine - a 6-metric weighted financial health calculation system that analyzes spending patterns, detects inefficiencies, and provides actionable insights to optimize business expenses and improve financial health.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Backend Architecture
- **Framework**: Flask 3.1.1 with Python 3.11+
- **Structure**: Modular design with separate modules for core functionality
  - `app.py`: Main Flask application and server configuration
  - `routes.py`: API endpoints and request handling
  - `spend_score_engine.py`: Core financial analysis and scoring logic
  - `csv_parser.py`: Multi-format CSV processing with intelligent header mapping
  - `gpt_utils.py`: OpenAI GPT-4o integration for AI insights
  - `pdf_generator.py`: Professional report generation with charts and branding

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS for responsive design
- **Structure**: Component-based architecture with clear separation
  - Pages for main views (Home, About, Services, Contact)
  - Reusable Layout components (Header, Footer)
  - Utility functions and type definitions

## Data Processing Pipeline
- **CSV Parsing**: Intelligent header mapping supporting multiple accounting platforms
- **SpendScore Calculation**: 6-metric weighted analysis system
  - Frequency scoring (15% weight)
  - Category diversity (10% weight) 
  - Budget adherence (20% weight)
  - Redundancy detection (15% weight)
  - Spike detection (20% weight)
  - Waste ratio analysis (20% weight)
- **AI Analysis**: GPT-4o powered insights with structured prompt templates
- **Report Generation**: PDF creation with charts, branding, and professional formatting

## File Management
- **Upload Handling**: Support for CSV files up to 16MB
- **Logo Support**: Company branding with PNG, JPG, JPEG, SVG formats
- **Static Assets**: Organized structure for images, CSS, and JavaScript
- **Output Management**: Generated PDFs and analysis reports

## API Design
- **RESTful Endpoints**: Clean API structure for file upload and analysis
- **Health Monitoring**: System status and verification endpoints  
- **Error Handling**: Comprehensive error responses with proper HTTP status codes
- **File Validation**: Type checking and size limits for uploaded content

# Recent Changes

**September 9, 2025**: 
- Successfully imported GitHub repository and configured for Replit environment
- Installed Python 3.11 and Node.js 20 environments
- Set up development workflows: Frontend (port 5000) and Backend (port 3001)
- Updated Vite configuration to allow all hosts for Replit proxy compatibility
- Installed all Python dependencies (Flask, OpenAI, Pandas, etc.) and Node.js dependencies
- Added missing authentication dependencies (bcrypt, flask-jwt-extended, flask-cors)
- Configured frontend API client to communicate with backend on correct port
- Set up deployment configuration for production using VM deployment target
- Both frontend and backend are running successfully in development mode

# Current Status

**Frontend**: ✅ Running on port 5000 with React + TypeScript + Vite
**Backend**: ✅ Running on port 3001 with Flask + Python
**Database**: Not currently configured (using in-memory storage for auth)
**API Communication**: ✅ Frontend configured to communicate with backend

# External Dependencies

## AI Services
- **OpenAI API**: GPT-4o integration for financial insights and recommendations
- **Configuration**: Environment variable-based API key management

## Data Processing Libraries
- **Pandas 2.3.1**: CSV processing and data manipulation
- **NumPy**: Numerical computations for scoring algorithms
- **Python-dateutil**: Date parsing and handling for transaction data

## Visualization and Reports
- **Matplotlib**: Chart generation for spending visualizations
- **ReportLab 4.4.3**: Professional PDF report generation
- **Pillow**: Image processing for logo handling and chart optimization

## Web Framework Dependencies
- **Flask 3.1.1**: Core web framework
- **Werkzeug 3.1.3**: WSGI utilities and development server
- **Gunicorn 23.0.0**: Production WSGI server

## Frontend Dependencies
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client for API communication
- **Heroicons**: Icon library for UI elements
- **Tailwind CSS**: Utility-first styling framework

## Development Tools
- **Python-dotenv**: Environment variable management
- **Concurrently**: Parallel development server execution
- **TypeScript**: Type safety for frontend development
- **ESLint & Prettier**: Code quality and formatting tools