from flask import Flask, request, jsonify
from flask_cors import CORS
import random
from models import db, City, GameScore

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///city_game.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app)
db.init_app(app)

@app.route('/api/question', methods=['GET'])
def get_question():
    city = City.query.order_by(db.func.random()).first()
    if not city:
        return jsonify({'error': 'No cities found'}), 404
    
    correct_state = city.state
    all_states = db.session.query(City.state).distinct().all()
    all_states = [state[0] for state in all_states]
    
    incorrect_states = [s for s in all_states if s != correct_state]
    selected_incorrect = random.sample(incorrect_states, min(3, len(incorrect_states)))
    
    choices = [correct_state] + selected_incorrect
    random.shuffle(choices)
    
    return jsonify({
        'city': city.name,
        'county': city.county,
        'choices': choices,
        'correct_answer': correct_state
    })

@app.route('/api/submit-score', methods=['POST'])
def submit_score():
    data = request.json
    
    score = GameScore(
        player_name=data['player_name'],
        score=data['score'],
        total_time=data['total_time'],
        correct_answers=data['correct_answers']
    )
    
    db.session.add(score)
    db.session.commit()
    
    return jsonify({'message': 'Score submitted successfully'})

@app.route('/api/leaderboard', methods=['GET'])
def get_leaderboard():
    scores = GameScore.query.order_by(
        GameScore.score.desc(),
        GameScore.correct_answers.desc(),
        GameScore.total_time.asc()
    ).limit(10).all()
    
    return jsonify([score.to_dict() for score in scores])

@app.route('/api/stats', methods=['GET'])
def get_stats():
    total_cities = City.query.count()
    total_states = db.session.query(City.state).distinct().count()
    
    return jsonify({
        'total_cities': total_cities,
        'total_states': total_states
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
