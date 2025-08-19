import json
import random
import os
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Load cities data
            cities_path = os.path.join(os.path.dirname(__file__), '..', 'cities_data.json')
            with open(cities_path, 'r') as f:
                cities = json.load(f)
            
            if not cities:
                self.send_response(404)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'No cities found'}).encode())
                return
            
            # Pick random city
            city = random.choice(cities)
            correct_state = city['state']
            
            # Get all unique states
            all_states = list(set(c['state'] for c in cities))
            
            # Create choices (correct + 3 random incorrect)
            incorrect_states = [s for s in all_states if s != correct_state]
            selected_incorrect = random.sample(incorrect_states, min(3, len(incorrect_states)))
            
            choices = [correct_state] + selected_incorrect
            random.shuffle(choices)
            
            response = {
                'city': city['name'],
                'county': city['county'],
                'choices': choices,
                'correct_answer': correct_state
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