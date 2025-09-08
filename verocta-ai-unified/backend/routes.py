import os
import json
import logging
from datetime import datetime
from flask import render_template, request, flash, redirect, url_for, send_file, jsonify
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
from werkzeug.utils import secure_filename
from app import app
from auth import validate_user, create_user, get_current_user, require_admin
from csv_parser import parse_csv_file
from gpt_utils import generate_financial_insights
from spend_score_engine import calculate_spend_score, get_score_label, get_score_color, get_enhanced_analysis
from pdf_generator import generate_report_pdf
from clone_verifier import verify_project_integrity

# Configure upload settings
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'csv'}
ALLOWED_LOGO_EXTENSIONS = {'png', 'jpg', 'jpeg', 'svg'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs('outputs', exist_ok=True)

def allowed_file(filename):
    """Check if uploaded file has allowed extension"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def allowed_logo_file(filename):
    """Check if uploaded logo file has allowed extension"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_LOGO_EXTENSIONS

# Legacy routes removed - now using React frontend with API endpoints

@app.route('/api/health', methods=['GET'])
def health_check():
    """API health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Verocta Financial Insight Platform is running',
        'version': '2.0.0'
    })

# Authentication Routes
@app.route('/api/auth/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        user = validate_user(email, password)
        if not user:
            return jsonify({'error': 'Invalid credentials'}), 401
        
        access_token = create_access_token(identity=email)
        
        return jsonify({
            'token': access_token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'role': user['role'],
                'company': user['company']
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        company = data.get('company', 'Default Company')
        
        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        user = create_user(email, password, company)
        if not user:
            return jsonify({'error': 'User already exists'}), 409
        
        access_token = create_access_token(identity=email)
        
        return jsonify({
            'token': access_token,
            'user': {
                'id': user['id'],
                'email': user['email'],
                'role': user['role'],
                'company': user['company']
            }
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/me', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        user = get_current_user()
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': {
                'id': user['id'],
                'email': user['email'],
                'role': user['role'],
                'company': user['company'],
                'created_at': user['created_at'].isoformat()
            }
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/upload', methods=['POST'])
def api_upload():
    """API endpoint for CSV upload and analysis"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '' or not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type. Only CSV files are allowed.'}), 400
        
        # Get company branding information
        company_name = request.form.get('companyName', '').strip()
        logo_path = None
        
        # Handle logo upload
        if 'companyLogo' in request.files:
            logo_file = request.files['companyLogo']
            if logo_file and logo_file.filename and allowed_logo_file(logo_file.filename):
                logo_filename = secure_filename(f"logo_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{logo_file.filename}")
                logo_path = os.path.join(app.config['UPLOAD_FOLDER'], logo_filename)
                logo_file.save(logo_path)
                logging.info(f"Logo uploaded: {logo_filename}")
        
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Parse CSV file
        transactions = parse_csv_file(filepath)
        
        if not transactions:
            return jsonify({'error': 'No valid transactions found in the CSV file'}), 400
        
        # Calculate enhanced spend score
        enhanced_analysis = get_enhanced_analysis(transactions)
        
        # Generate AI insights
        insights = generate_financial_insights(transactions)
        
        # Prepare analysis results with enhanced data
        analysis_data = {
            'spend_score': enhanced_analysis['final_score'],
            'tier_info': enhanced_analysis['tier_info'],
            'score_breakdown': enhanced_analysis['score_breakdown'],
            'suggestions': insights,
            'total_transactions': len(transactions),
            'total_amount': sum(t.get('amount', 0) for t in transactions),
            'enhanced_metrics': enhanced_analysis['transaction_summary'],
            'filename': filename,
            'green_reward_eligible': enhanced_analysis['tier_info'].get('green_reward_eligible', False),
            'company_name': company_name if company_name else None,
            'logo_path': logo_path if logo_path else None
        }
        
        # Save JSON output
        output_json_path = os.path.join('outputs', 'verocta_analysis_output.json')
        with open(output_json_path, 'w') as f:
            json.dump(analysis_data, f, indent=2, default=str)
        
        # Generate PDF report with company branding
        pdf_path = generate_report_pdf(analysis_data, transactions, company_name, logo_path)
        
        # Prepare API response
        response_data = {
            'success': True,
            'filename': filename,
            'spend_score': enhanced_analysis['final_score'],
            'tier_info': enhanced_analysis['tier_info'],
            'score_breakdown': enhanced_analysis['score_breakdown'],
            'transaction_summary': enhanced_analysis['transaction_summary'],
            'ai_insights': insights,
            'analysis_timestamp': datetime.now().isoformat(),
            'company_name': company_name if company_name else None,
            'logo_path': logo_path if logo_path else None,
            'pdf_available': os.path.exists(pdf_path)
        }
        
        return jsonify(response_data)
        
    except Exception as e:
        logging.error(f"API upload error: {str(e)}")
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/api/spend-score', methods=['GET'])
def api_spend_score():
    """API endpoint to get latest SpendScore metrics"""
    try:
        # Check if we have recent analysis data
        output_json_path = os.path.join('outputs', 'verocta_analysis_output.json')
        
        if not os.path.exists(output_json_path):
            return jsonify({'error': 'No analysis data available. Please upload a CSV file first.'}), 404
        
        with open(output_json_path, 'r') as f:
            analysis_data = json.load(f)
        
        # Return SpendScore metrics
        response = {
            'spend_score': analysis_data.get('spend_score'),
            'tier_info': analysis_data.get('tier_info', {}),
            'score_breakdown': analysis_data.get('score_breakdown', {}),
            'enhanced_metrics': analysis_data.get('enhanced_metrics', {}),
            'green_reward_eligible': analysis_data.get('green_reward_eligible', False),
            'last_updated': analysis_data.get('analysis_timestamp')
        }
        
        return jsonify(response)
        
    except Exception as e:
        logging.error(f"API spend-score error: {str(e)}")
        return jsonify({'error': f'Failed to retrieve SpendScore: {str(e)}'}), 500

@app.route('/api/report', methods=['GET'])
def api_download_report():
    """API endpoint to download latest PDF report"""
    try:
        pdf_path = os.path.join('outputs', 'verocta_report.pdf')
        
        if not os.path.exists(pdf_path):
            return jsonify({'error': 'No PDF report available. Please analyze a CSV file first.'}), 404
        
        return send_file(
            pdf_path, 
            as_attachment=True, 
            download_name='verocta_financial_report.pdf',
            mimetype='application/pdf'
        )
        
    except Exception as e:
        logging.error(f"API report download error: {str(e)}")
        return jsonify({'error': f'Failed to download report: {str(e)}'}), 500

@app.route('/api/verify-clone', methods=['GET'])
def api_verify_clone():
    """API endpoint to check clone integrity status"""
    try:
        integrity_report = verify_project_integrity()
        
        # Simplified response for API
        response = {
            'status': integrity_report['status'],
            'message': integrity_report['message'],
            'files_checked': integrity_report['files_checked'],
            'files_matched': integrity_report['files_matched'],
            'files_modified': integrity_report['files_modified'],
            'files_missing': integrity_report['files_missing'],
            'total_deviations': len(integrity_report['deviations']),
            'timestamp': integrity_report['timestamp']
        }
        
        return jsonify(response)
        
    except Exception as e:
        logging.error(f"API clone verification error: {str(e)}")
        return jsonify({'error': f'Clone verification failed: {str(e)}'}), 500

@app.route('/api/docs')
def api_documentation():
    """API documentation endpoint"""
    docs = {
        "title": "VeroctaAI Financial Analysis API",
        "version": "2.0.0",
        "description": "AI-powered financial intelligence and SpendScore analysis platform",
        "base_url": request.host_url + "api/",
        "endpoints": {
            "POST /upload": {
                "description": "Upload CSV and trigger analysis",
                "parameters": {
                    "file": "CSV file (multipart/form-data)"
                },
                "response": "Analysis results with SpendScore and insights"
            },
            "GET /spend-score": {
                "description": "Return JSON of latest SpendScore metrics",
                "response": "SpendScore breakdown and tier information"
            },
            "GET /report": {
                "description": "Download latest PDF report",
                "response": "PDF file download"
            },
            "GET /verify-clone": {
                "description": "Returns sync integrity status",
                "response": "Clone verification report"
            },
            "GET /health": {
                "description": "Health check endpoint",
                "response": "Service status"
            },
            "GET /docs": {
                "description": "This API documentation",
                "response": "API documentation JSON"
            }
        },
        "authentication": {
            "type": "Bearer Token",
            "header": "Authorization: Bearer <token>",
            "note": "API key authentication coming in v2.1"
        },
        "supported_formats": [
            "QuickBooks CSV",
            "Wave Accounting CSV", 
            "Revolut CSV",
            "Xero CSV",
            "Generic transaction CSV"
        ]
    }
    
    return jsonify(docs)

# Serve React App for all non-API routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    """Serve the React app for all non-API routes"""
    # If it's an API route, let it be handled by other routes
    if path.startswith('api/'):
        return "API route not found", 404
    
    # Check if the file exists in the frontend build directory
    frontend_build_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'dist')
    
    if path and os.path.exists(os.path.join(frontend_build_dir, path)):
        return send_from_directory(frontend_build_dir, path)
    else:
        # Serve index.html for all other routes (React Router will handle routing)
        return send_from_directory(frontend_build_dir, 'index.html')

@app.errorhandler(413)
def too_large(e):
    """Handle file too large error"""
    return jsonify({'error': 'File is too large. Maximum size is 16MB.'}), 413

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    # For API routes, return JSON error
    if request.path.startswith('/api/'):
        return jsonify({'error': 'API endpoint not found'}), 404
    # For other routes, serve React app
    frontend_build_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'dist')
    return send_from_directory(frontend_build_dir, 'index.html')

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors"""
    logging.error(f"Server error: {str(e)}")
    # For API routes, return JSON error
    if request.path.startswith('/api/'):
        return jsonify({'error': 'Internal server error'}), 500
    # For other routes, serve React app
    frontend_build_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'frontend', 'dist')
    return send_from_directory(frontend_build_dir, 'index.html')
