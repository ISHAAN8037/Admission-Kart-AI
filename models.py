from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class UniversityModel(db.Model):
    __tablename__ = 'universities'
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(500)) # High-Res Cinematic Image URL
    tuition = db.Column(db.Integer)  # approximate yearly tuition in USD
    tags = db.Column(db.String(1000)) # AI keywords for matching
    description = db.Column(db.Text)
    scholarships = db.Column(db.Text)
    video_url = db.Column(db.String(500)) # YouTube Embed URL

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "image": self.image,
            "tuition": self.tuition,
            "tags": self.tags,
            "description": self.description,
            "scholarships": self.scholarships,
            "video_url": self.video_url
        }

class LeadModel(db.Model):
    __tablename__ = 'leads'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    desired_course = db.Column(db.String(100))
    lead_quality = db.Column(db.Integer, default=5) # 1-10 predictive AI score
    status = db.Column(db.String(20), default="New") # New, Contacted, Enrolled
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "desired_course": self.desired_course,
            "lead_quality": self.lead_quality,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class ChatLogModel(db.Model):
    __tablename__ = 'chat_logs'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    timestamp = db.Column(db.DateTime, server_default=db.func.now())
    user_message = db.Column(db.Text, nullable=False)
    ai_response = db.Column(db.Text, nullable=False)
    persona_mode = db.Column(db.String(50))

    def serialize(self):
        return {
            "id": self.id,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "user_message": self.user_message,
            "ai_response": self.ai_response,
            "persona_mode": self.persona_mode
        }
