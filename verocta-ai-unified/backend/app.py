import os
import logging
from flask import Flask, send_from_directory, send_file

# Load environment variables from .env file if it exists
try:
    from dotenv import load_dotenv
    load_dotenv()
    logging.info("Environment variables loaded from .env file")
except ImportError:
    logging.warning("python-dotenv not installed. Install with: pip install python-dotenv")
except Exception as e:
    logging.error(f"Error loading .env file: {e}")

# Configure logging for debugging
logging.basicConfig(level=logging.DEBUG)

# Get the directory of this script
basedir = os.path.abspath(os.path.dirname(__file__))
frontend_build_dir = os.path.join(os.path.dirname(basedir), 'frontend', 'dist')

# Create the Flask app
app = Flask(__name__, 
            static_folder=frontend_build_dir,
            static_url_path='',
            template_folder=frontend_build_dir)
app.secret_key = os.environ.get("SESSION_SECRET", "verocta-secret-key-2024")

# Import routes after app creation to avoid circular imports
from routes import *

if __name__ == '__main__':
    print('🚀 Starting VeroctaAI Flask Application...')
    print('📍 Local URL: http://127.0.0.1:5001')
    print('📊 Platform: Financial Intelligence & SpendScore Analysis')
    
    # Check OpenAI API key
    openai_key = os.environ.get("OPENAI_API_KEY")
    if openai_key:
        print('🤖 AI: GPT-4o Integration Ready ✅')
    else:
        print('⚠️  WARNING: OPENAI_API_KEY not set! AI features will not work.')
        print('💡 Fix: Set environment variable or create .env file with your API key')
    
    print('📁 CSV Support: QuickBooks, Wave, Revolut, Xero')
    print('✅ Server starting on port 5001...')
    app.run(host='127.0.0.1', port=5001, debug=True)  # type: ignore
