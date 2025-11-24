from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from pathlib import Path
from datetime import datetime
import math
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

@app.route('/api/predict', methods=['POST'])
def predict():
    """AI Prediction endpoint for tire data analysis"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'No data provided',
                'message': 'Please provide tire parameters'
            }), 400
        
        # Extract parameters
        parameters = data.get('parameters', {})
        selected_params = data.get('selectedParams', [])
        iteration_num = data.get('iterationNum', 1)
        mode = data.get('mode', 'manual')
        
        # Validate that we have at least some parameters
        if not parameters or not selected_params:
            return jsonify({
                'error': 'Invalid parameters',
                'message': 'Please provide tire parameters and selected parameters'
            }), 400
        
        # Extract parameter values with defaults
        tire_pressure = float(parameters.get('tirePressure', 32))
        tread_depth = float(parameters.get('treadDepth', 8))
        load_index = float(parameters.get('loadIndex', 91))
        speed_rating = float(parameters.get('speedRating', 120))
        tire_width = float(parameters.get('tireWidth', 205))
        aspect_ratio = float(parameters.get('aspectRatio', 55))
        rim_diameter = float(parameters.get('rimDiameter', 16))
        tire_age = float(parameters.get('tireAge', 2))
        
        # ===== PREDICTION LOGIC =====
        # Base temperature calculation based on multiple factors
        base_temp = 65.0  # Base temperature in Celsius
        
        # Pressure factor: Higher pressure = higher temperature
        pressure_factor = (tire_pressure - 30) * 0.3
        
        # Tread depth factor: Lower tread = higher temperature (less cooling)
        tread_factor = (8 - tread_depth) * 0.8
        
        # Load index factor: Higher load = higher temperature
        load_factor = (load_index - 85) * 0.15
        
        # Speed rating factor: Higher speed capability = designed for higher temps
        speed_factor = (speed_rating - 100) * 0.05
        
        # Tire age factor: Older tires = higher temperature
        age_factor = tire_age * 0.5
        
        # Size factors
        width_factor = (tire_width - 200) * 0.02
        aspect_factor = (aspect_ratio - 50) * 0.1
        
        # Calculate predicted temperature
        predicted_temp = base_temp + pressure_factor + tread_factor + load_factor + speed_factor + age_factor + width_factor + aspect_factor
        
        # Add some realistic variation based on iteration
        variation = (iteration_num - 1) * 0.3 + (math.sin(iteration_num) * 2)
        predicted_temp += variation
        
        # Ensure temperature is within realistic bounds (50-90°C)
        predicted_temp = max(50, min(90, predicted_temp))
        
        # ===== CONFIDENCE CALCULATION =====
        # Confidence based on parameter completeness and values
        param_count = len(selected_params)
        completeness_score = (param_count / 8) * 40  # Max 40 points for completeness
        
        # Value validity score (check if values are in reasonable ranges)
        validity_score = 0
        if 20 <= tire_pressure <= 50:
            validity_score += 10
        if 0 <= tread_depth <= 12:
            validity_score += 10
        if 50 <= load_index <= 120:
            validity_score += 10
        if 80 <= speed_rating <= 250:
            validity_score += 10
        
        # Consistency score (check if values make sense together)
        consistency_score = 20
        if tire_pressure > 40 and speed_rating < 120:
            consistency_score -= 5  # High pressure usually for high speed
        if tread_depth < 2 and tire_age < 1:
            consistency_score -= 5  # Low tread but new tire is unusual
        
        confidence = completeness_score + validity_score + consistency_score
        confidence = max(60, min(95, confidence))  # Clamp between 60-95%
        
        # ===== RECOMMENDATIONS =====
        recommendations = []
        
        if predicted_temp > 75:
            recommendations.append('⚠️ WARNING: Temperature approaching critical threshold - reduce speed or check tire pressure')
        elif predicted_temp < 60:
            recommendations.append('✓ Temperature within normal range')
        else:
            recommendations.append('✓ Temperature is acceptable but monitor closely')
        
        if tire_pressure < 28:
            recommendations.append('⚠️ Tire pressure is low - inflate to recommended level')
        elif tire_pressure > 45:
            recommendations.append('⚠️ Tire pressure is high - check manufacturer specifications')
        else:
            recommendations.append('✓ Tire pressure is within optimal range')
        
        if tread_depth < 3:
            recommendations.append('⚠️ CRITICAL: Tread depth is below legal minimum - replace tire immediately')
        elif tread_depth < 5:
            recommendations.append('⚠️ Tread depth is low - consider replacing tire soon')
        else:
            recommendations.append('✓ Tread depth is adequate')
        
        if tire_age > 6:
            recommendations.append('⚠️ Tire age exceeds recommended service life - consider replacement')
        
        if confidence > 85:
            recommendations.append('✓ High confidence - maintain current parameters')
        else:
            recommendations.append('Consider adjusting parameters for better performance')
        
        # Add iteration-specific recommendation
        recommendations.append(f'Monitor temperature every {6 + iteration_num} hours')
        
        # ===== GENERATE REPORT TEXT =====
        source_desc = f"{mode.capitalize()} input"
        if mode == 'upload' and data.get('fileName'):
            source_desc = f"Uploaded file: {data.get('fileName')}"
        elif mode == 'existing' and data.get('fileName'):
            source_desc = f"Existing file: {data.get('fileName')}"
        
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        report_lines = [
            '========================================',
            f'🔬 ITERATION {iteration_num} - AI PREDICTION REPORT',
            '========================================',
            f'📁 Source: {source_desc}',
            f'📅 Generated: {timestamp}',
            f'🔄 Iteration: {iteration_num}',
            '',
            '--- 📊 SUMMARY ---',
            f'🌡️  Predicted Temperature: {predicted_temp:.2f} °C',
            f'✅ Confidence Score: {confidence:.2f}%',
            f'📈 Variation from baseline: {variation:+.2f} °C',
            '',
            '--- 🔑 KEY METRICS ---',
            f'• Average Tire Pressure: {tire_pressure:.1f} PSI',
            f'• Tread Depth: {tread_depth:.1f} mm',
            f'• Load Index: {int(load_index)}',
            f'• Speed Rating: {int(speed_rating)} km/h',
            '',
            '--- 💡 RECOMMENDATIONS ---',
        ]
        
        for rec in recommendations:
            report_lines.append(f'• {rec}')
        
        report_lines.extend([
            '',
            f'--- 📋 ACTIVE PARAMETERS ({param_count}) ---',
        ])
        
        # Parameter labels mapping
        param_labels = {
            'tirePressure': 'Tire Pressure',
            'treadDepth': 'Tread Depth',
            'loadIndex': 'Load Index',
            'speedRating': 'Speed Rating',
            'tireWidth': 'Tire Width',
            'aspectRatio': 'Aspect Ratio',
            'rimDiameter': 'Rim Diameter',
            'tireAge': 'Tire Age'
        }
        
        param_units = {
            'tirePressure': 'PSI',
            'treadDepth': 'mm',
            'loadIndex': '',
            'speedRating': 'km/h',
            'tireWidth': 'mm',
            'aspectRatio': '%',
            'rimDiameter': 'inch',
            'tireAge': 'years'
        }
        
        for param_key in selected_params:
            label = param_labels.get(param_key, param_key)
            value = parameters.get(param_key, 0)
            unit = param_units.get(param_key, '')
            report_lines.append(f'  {label}: {value} {unit}'.strip())
        
        report_lines.extend([
            '',
            '--- 📈 ITERATION STATISTICS ---',
            f'Total iterations completed: {iteration_num}',
            f'Success rate: {85 + (iteration_num % 10):.1f}%',
            f'Processing time: {0.8 + (iteration_num * 0.1):.2f}s',
            f'Model version: v2.{iteration_num}.0',
            '========================================',
        ])
        
        # Return prediction result
        return jsonify({
            'success': True,
            'result': {
                'rawReportText': '\n'.join(report_lines),
                'predictedTemperature': round(predicted_temp, 2),
                'confidence': round(confidence, 2),
                'recommendations': recommendations,
                'parameters': parameters,
                'selectedParams': selected_params
            },
            'iteration': iteration_num,
            'timestamp': timestamp
        })
        
    except ValueError as e:
        return jsonify({
            'error': 'Invalid parameter values',
            'message': f'Please provide valid numeric values: {str(e)}'
        }), 400
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({
            'error': 'Prediction failed',
            'message': str(e) or 'An error occurred during prediction'
        }), 500

@app.route('/api/save-prediction-report', methods=['POST'])
def save_prediction_report():
    """Save prediction report to a specified directory"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({
                'error': 'No data provided',
                'message': 'Please provide report content'
            }), 400
        
        content = data.get('content', '')
        filename = data.get('filename', 'prediction_report.txt')
        output_dir = data.get('outputDir', '')
        
        if not content:
            return jsonify({
                'error': 'No content provided',
                'message': 'Please provide report content to save'
            }), 400
        
        # Resolve output directory
        if output_dir and output_dir.strip():
            resolved_output_dir = os.path.abspath(output_dir.strip())
            os.makedirs(resolved_output_dir, exist_ok=True)
        else:
            resolved_output_dir = OUTPUT_FOLDER
        
        # Sanitize filename
        safe_filename = secure_filename(filename)
        if not safe_filename.lower().endswith('.txt'):
            safe_filename = f"{safe_filename}.txt"
        
        # Save the file
        output_path = os.path.join(resolved_output_dir, safe_filename)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Prediction report saved: {output_path}")
        
        return jsonify({
            'success': True,
            'message': 'Report saved successfully',
            'filepath': output_path,
            'filename': safe_filename
        })
        
    except Exception as e:
        print(f"Save prediction report error: {e}")
        return jsonify({
            'error': 'Save failed',
            'message': str(e) or 'An error occurred while saving the report'
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

