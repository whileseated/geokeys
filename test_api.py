#!/usr/bin/env python3
"""Simple test script for the API functions"""

import json
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

def test_question():
    print("Testing question endpoint...")
    try:
        # Import and test the question handler
        from api.question import handler
        
        # Create a mock request
        class MockRequest:
            def __init__(self):
                self.responses = []
                self.headers_sent = []
                self.data_written = []
            
            def send_response(self, code):
                self.responses.append(code)
            
            def send_header(self, name, value):
                self.headers_sent.append((name, value))
            
            def end_headers(self):
                pass
            
            def do_GET(self):
                handler.do_GET(self)
            
            class wfile:
                def __init__(self, parent):
                    self.parent = parent
                
                def write(self, data):
                    self.parent.data_written.append(data)
        
        # Test it
        mock_handler = handler()
        mock_handler.wfile = type('MockFile', (), {'write': lambda self, data: print("Response:", data.decode())})()
        mock_handler.send_response = lambda code: print(f"Status: {code}")
        mock_handler.send_header = lambda name, value: print(f"Header: {name}: {value}")
        mock_handler.end_headers = lambda: None
        
        mock_handler.do_GET()
        print("✅ Question endpoint test passed!")
        
    except Exception as e:
        print(f"❌ Question endpoint test failed: {e}")

def test_cities_data():
    print("\nTesting cities data...")
    try:
        with open('cities_data.json', 'r') as f:
            cities = json.load(f)
        
        print(f"✅ Loaded {len(cities)} cities")
        
        # Check structure
        if cities and all('name' in city and 'state' in city and 'county' in city for city in cities[:10]):
            print("✅ City data structure is correct")
        else:
            print("❌ City data structure is invalid")
            
        # Check states
        states = set(city['state'] for city in cities)
        print(f"✅ Found {len(states)} unique states")
        
    except Exception as e:
        print(f"❌ Cities data test failed: {e}")

if __name__ == "__main__":
    test_cities_data()
    test_question()
    print("\n🚀 API tests complete!")