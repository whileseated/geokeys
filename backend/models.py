from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class City(db.Model):
    __tablename__ = 'cities'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    county = db.Column(db.String(200))
    state = db.Column(db.String(100), nullable=False)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'county': self.county,
            'state': self.state
        }

class GameScore(db.Model):
    __tablename__ = 'game_scores'
    
    id = db.Column(db.Integer, primary_key=True)
    player_name = db.Column(db.String(100), nullable=False)
    score = db.Column(db.Integer, default=0)
    total_time = db.Column(db.Float, default=0.0)
    correct_answers = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'player_name': self.player_name,
            'score': self.score,
            'total_time': self.total_time,
            'correct_answers': self.correct_answers,
            'created_at': self.created_at.isoformat()
        }