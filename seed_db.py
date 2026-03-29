from app import app
from models import db, UniversityModel

universities = [
    {
        "id": "u1",
        "name": "Technical University of Munich",
        "location": "Germany",
        "image": "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1000",
        "video_url": "https://www.youtube.com/embed/K8_eD897V4M",
        "tuition": 2000,
        "tags": "engineering europe germany technical cheap affordable",
        "description": "TUM is one of Europe's top universities, renowned for its engineering and technology programs.",
        "scholarships": "DAAD Scholarships, Deutschlandstipendium."
    },
    {
        "id": "u2",
        "name": "Stanford University",
        "location": "USA",
        "image": "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1000",
        "video_url": "https://www.youtube.com/embed/9XInD-N__f4",
        "tuition": 57000,
        "tags": "usa california research silicon-valley ivy-equivalent elite",
        "description": "Stanford University is one of the world's leading teaching and research institutions.",
        "scholarships": "Stanford Financial Aid, Knight-Hennessy Scholars."
    },
    {
        "id": "u3",
        "name": "MIT Manipal",
        "location": "India",
        "image": "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1000",
        "video_url": "https://www.youtube.com/embed/Z8bM_Z_N_7A",
        "tuition": 5000,
        "tags": "engineering india technology btech private",
        "description": "Manipal Institute of Technology (MIT) offers premier B.Tech programs.",
        "scholarships": "Freeship & Merit-cum-Means."
    },
    {
        "id": "u4",
        "name": "IIT Bombay",
        "location": "India",
        "image": "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1000",
        "video_url": "https://www.youtube.com/embed/SRE7SOnR3S0",
        "tuition": 3000,
        "tags": "india engineering tech elite top mumbai btech",
        "description": "IIT Bombay is one of the most prestigious engineering institutions in India.",
        "scholarships": "Merit-cum-Means Scholarship."
    },
    {
        "id": "u5",
        "name": "Harvard University",
        "location": "USA",
        "image": "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1000",
        "video_url": "https://www.youtube.com/embed/6sqnS8S_V0U",
        "tuition": 55000,
        "tags": "usa ivy-league elite research top global",
        "description": "Harvard is the oldest institution of higher learning in the United States.",
        "scholarships": "Harvard Financial Aid (Need-Blind)."
    }
]

def seed():
    with app.app_context():
        db.drop_all()
        db.create_all()
        for uni_data in universities:
            uni = UniversityModel(**uni_data)
            db.session.add(uni)
        db.session.commit()
        print(f"Database seeded successfully with {len(universities)} flagship universities!")

if __name__ == "__main__":
    seed()
