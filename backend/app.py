from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from pathlib import Path
from converter import convert_files_to_excel, extract_text_from_pdf, extract_text_from_docx, extract_text_from_txt, extract_data_from_csv

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
UPLOAD_FOLDER = 'uploads'
OUTPUT_FOLDER = 'output'
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
ALLOWED_EXTENSIONS = {'.pdf', '.docx', '.csv', '.txt'}

# Create directories if they don't exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def allowed_file(filename):
    """Check if file has allowed extension"""
    return Path(filename).suffix.lower() in ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'OK',
        'message': 'File Converter API is running',
        'timestamp': str(os.path.getmtime(__file__) if os.path.exists(__file__) else 'unknown')
    })

@app.route('/api/extract-content', methods=['POST'])
def extract_content():
    """Extract content from uploaded files for preview"""
    try:
        # Check if files are present
        if 'files' not in request.files:
            return jsonify({
                'error': 'No files uploaded',
                'message': 'Please select at least one file'
            }), 400
        
        files = request.files.getlist('files')
        
        if not files or len(files) == 0 or (len(files) == 1 and files[0].filename == ''):
            return jsonify({
                'error': 'No files uploaded',
                'message': 'Please select at least one file'
            }), 400
        
        file_contents = []
        
        for file in files:
            if file.filename == '':
                continue
            
            if not allowed_file(file.filename):
                continue
            
            # Check file size
            file.seek(0, os.SEEK_END)
            file_size = file.tell()
            file.seek(0)
            
            if file_size > MAX_FILE_SIZE:
                file_contents.append({
                    'name': file.filename,
                    'content': f'⚠️ File too large (exceeds 50MB limit)',
                    'error': True
                })
                continue
            
            # Save file temporarily to extract content
            filename = secure_filename(file.filename)
            from datetime import datetime
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S_%f')
            name_parts = Path(filename).stem, Path(filename).suffix
            temp_filename = f"temp_{timestamp}_{name_parts[0]}{name_parts[1]}"
            temp_filepath = os.path.join(UPLOAD_FOLDER, temp_filename)
            file.save(temp_filepath)
            
            try:
                file_extension = Path(file.filename).suffix.lower()
                content = ""
                
                if file_extension == '.pdf':
                    content = extract_text_from_pdf(temp_filepath)
                elif file_extension == '.docx':
                    content = extract_text_from_docx(temp_filepath)
                elif file_extension == '.csv':
                    csv_data = extract_data_from_csv(temp_filepath)
                    # Format CSV data nicely
                    if csv_data:
                        headers = list(csv_data[0].keys())
                        content = " | ".join(headers) + "\n"
                        content += "-" * (len(content) - 1) + "\n"
                        for row in csv_data[:20]:  # Limit to first 20 rows for preview
                            content += " | ".join(str(row.get(h, '')) for h in headers) + "\n"
                        if len(csv_data) > 20:
                            content += f"\n... and {len(csv_data) - 20} more rows"
                    else:
                        content = "No data found in CSV file"
                elif file_extension == '.txt':
                    content = extract_text_from_txt(temp_filepath)
                else:
                    content = f"Unsupported file type: {file_extension}"
                
                # Limit content length for preview (first 5000 characters)
                if len(content) > 5000:
                    content = content[:5000] + "\n\n... (content truncated for preview, full content will be in Excel file)"
                
                file_contents.append({
                    'name': file.filename,
                    'content': content or 'No content extracted from file',
                    'size': file_size
                })
                
            except Exception as e:
                file_contents.append({
                    'name': file.filename,
                    'content': f'❌ Error extracting content: {str(e)}',
                    'error': True
                })
            finally:
                # Clean up temp file
                try:
                    os.remove(temp_filepath)
                except:
                    pass
        
        return jsonify({
            'files': file_contents
        })
        
    except Exception as e:
        return jsonify({
            'error': 'Extraction failed',
            'message': str(e)
        }), 500

@app.route('/api/convert', methods=['POST'])
def convert_files():
    """Convert uploaded files to Excel format"""
    try:
        # Check if files are present
        if 'files' not in request.files:
            return jsonify({
                'error': 'No files uploaded',
                'message': 'Please select at least one file to convert'
            }), 400
        
        files = request.files.getlist('files')
        
        if not files or len(files) == 0 or (len(files) == 1 and files[0].filename == ''):
            return jsonify({
                'error': 'No files uploaded',
                'message': 'Please select at least one file to convert'
            }), 400
        
        # Get conversion method
        conversion_method = request.form.get('conversionMethod', 'text-extraction')

        # Optional output preferences
        raw_output_dir = request.form.get('outputDir')
        raw_output_filename = request.form.get('outputFilename')
        
        # Validate and save files
        saved_files = []
        for file in files:
            if file.filename == '':
                continue
                
            if not allowed_file(file.filename):
                return jsonify({
                    'error': 'Invalid file type',
                    'message': f'File type not allowed. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'
                }), 400
            
            # Check file size
            file.seek(0, os.SEEK_END)
            file_size = file.tell()
            file.seek(0)
            
            if file_size > MAX_FILE_SIZE:
                return jsonify({
                    'error': 'File too large',
                    'message': f'File size exceeds the maximum limit of 50MB'
                }), 400
            
            # Save file to uploads folder
            filename = secure_filename(file.filename)
            # Add timestamp to avoid overwriting
            from datetime import datetime
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            name_parts = Path(filename).stem, Path(filename).suffix
            unique_filename = f"{timestamp}_{name_parts[0]}{name_parts[1]}"
            filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
            file.save(filepath)
            saved_files.append({
                'path': filepath,
                'originalname': file.filename
            })
            print(f"📁 File saved to uploads: {unique_filename}")
        
        if not saved_files:
            return jsonify({
                'error': 'No valid files',
                'message': 'No valid files were uploaded'
            }), 400
        
        print(f"Converting {len(saved_files)} file(s) using method: {conversion_method}")
        
        # Resolve output options
        # If outputDir provided, allow absolute or relative to current working directory
        resolved_output_dir = None
        if raw_output_dir and raw_output_dir.strip():
            # Normalize path
            resolved_output_dir = os.path.abspath(raw_output_dir)
            os.makedirs(resolved_output_dir, exist_ok=True)

        # Sanitize filename if provided
        safe_output_filename = None
        if raw_output_filename and raw_output_filename.strip():
            # secure_filename removes unsafe characters; we keep extension handling in converter
            safe_output_filename = secure_filename(raw_output_filename)

        # Convert files to Excel (saved to output folder)
        result = convert_files_to_excel(
            saved_files,
            conversion_method,
            output_dir=resolved_output_dir,
            output_filename=safe_output_filename
        )
        
        print(f"✅ Excel file saved to output: {result['filename']}")
        print(f"📁 Uploaded files kept in uploads folder")
        
        # Send the Excel file (file remains in output folder)
        return send_file(
            result['filepath'],
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name=result['filename']
        )
        
    except Exception as e:
        print(f"Conversion error: {e}")
        
        return jsonify({
            'error': 'Conversion failed',
            'message': str(e) or 'An error occurred during file conversion'
        }), 500

@app.errorhandler(413)
def request_entity_too_large(error):
    """Handle file too large error"""
    return jsonify({
        'error': 'File too large',
        'message': 'File size exceeds the maximum limit of 50MB'
    }), 413

@app.errorhandler(500)
def internal_error(error):
    """Handle internal server errors"""
    return jsonify({
        'error': 'Server error',
        'message': 'An unexpected error occurred'
    }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"🚀 Server is running on http://localhost:{port}")
    print(f"📁 Upload directory: {os.path.abspath(UPLOAD_FOLDER)}")
    print(f"📁 Output directory: {os.path.abspath(OUTPUT_FOLDER)}")
    app.run(host='0.0.0.0', port=port, debug=True)

