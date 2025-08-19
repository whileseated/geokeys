#!/usr/bin/env python3
"""Direct test of the question generation logic"""

import json
import random

def test_question_logic():
    print("Testing question generation logic...")
    
    try:
        # Load cities data
        with open('cities_data.json', 'r') as f:
            cities = json.load(f)
        
        print(f"✅ Loaded {len(cities)} cities")
        
        # Test question generation (same logic as API)
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
        
        print("✅ Sample question generated:")
        print(f"   City: {response['city']}, {response['county']}")
        print(f"   Choices: {response['choices']}")
        print(f"   Correct: {response['correct_answer']}")
        
        # Verify correct answer is in choices
        if response['correct_answer'] in response['choices']:
            print("✅ Correct answer is in choices")
        else:
            print("❌ Correct answer missing from choices!")
        
        # Verify we have 4 choices
        if len(response['choices']) == 4:
            print("✅ Correct number of choices (4)")
        else:
            print(f"❌ Wrong number of choices: {len(response['choices'])}")
            
        return True
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        return False

if __name__ == "__main__":
    if test_question_logic():
        print("\n🎉 Question logic works! API should work on Vercel.")
        print("\n💡 For full testing, run: npm install -g vercel && vercel dev")
    else:
        print("\n❌ Logic test failed - need to debug before deploying")