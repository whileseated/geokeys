import json
import os
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Load cities data
            cities_path = os.path.join(os.path.dirname(__file__), '..', 'cities_data.json')
            with open(cities_path, 'r') as f:
                cities = json.load(f)
            
            total_cities = len(cities)
            total_states = len(set(c['state'] for c in cities))
            
            response = {
                'total_cities': total_cities,
                'total_states': total_states
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())