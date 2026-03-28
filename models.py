from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class UniversityModel(db.Model):
    __tablename__ = 'universities'
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(500))
    video_url = db.Column(db.String(500)) # Full YouTube/Video embed URL
    tuition = db.Column(db.Integer)  # approximate yearly tuition in USD
    tags = db.Column(db.String(1000)) # AI keywords for matching
    description = db.Column(db.Text)
    scholarships = db.Column(db.Text)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "image": self.image,
            "video_url": self.video_url,
            "tuition": self.tuition,
            "tags": self.tags,
            "description": self.description,
            "scholarships": self.scholarships
        }

class LeadModel(db.Model):
    __tablename__ = 'leads'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    desired_course = db.Column(db.String(100))
    lead_quality = db.Column(db.Integer, default=5) # 1-10 predictive AI score
    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "desired_course": self.desired_course,
            "lead_quality": self.lead_quality,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
