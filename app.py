from flask import Flask, render_template, request, jsonify, session
from models import db, UniversityModel, LeadModel
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
from flask_cors import CORS
import google.generativeai as genai
import json
import threading

load_dotenv()
genai.configure(api_key=os.environ.get("GEMINI_API_KEY", ""))

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'super_secret_consultancy_key_for_sessions')
CORS(app) # Enable cross-origin calls from Netlify

# Configure SQLite Database
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'admission_kart.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/')
def home():
    """Route to render the Admission Kart homepage"""
    return render_template('index.html')

def get_roi_score(u):
    """Utility to calculate ROI for any given university model object"""
    score = 50 # Base score
    tag_list = u.tags.lower() if u.tags else ""
    is_elite = 'elite' in tag_list or 'prestigious' in tag_list
    tuition = u.tuition if u.tuition else 999999
    
    # Massive ROI bonus for low tuition elite institutions
    if is_elite and tuition < 10000:
        score += 40
    elif is_elite:
        score += 20
    elif tuition < 15000:
        score += 10
        
    return min(99, max(score, 45))

@app.route('/api/universities', methods=['GET'])
def get_universities():
    unis = UniversityModel.query.all()
    results = []
    for u in unis:
        s = u.serialize()
        s['value_score'] = get_roi_score(u)
        results.append(s)
    return jsonify(results)

@app.route('/api/search', methods=['POST'])
def ai_search():
    """
    Semantic ROI Engine: Calculates a 'Value Score' factoring in Elite status vs Tuition.
    """
    data = request.json
    query = data.get('query', '').lower()
    
    if not query:
        unis = UniversityModel.query.all()
        results = []
        for u in unis:
            s = u.serialize()
            s['value_score'] = get_roi_score(u)
            results.append(s)
        return jsonify(results)
        
    keywords = query.split()
    results = []
    for u in UniversityModel.query.all():
        semantic_score = 0
        tag_list = u.tags.lower() if u.tags else ""
        text_corpus = f"{u.name.lower()} {u.location.lower()} {tag_list} {u.description.lower() if u.description else ''}"
        
        # Keyword Intersection
        for kw in keywords:
            if kw in text_corpus:
                semantic_score += 15
                
        if semantic_score > 0:
            final_value = get_roi_score(u) + (semantic_score // 5) # Adding keyword match weight
            final_value = min(99, final_value)
            
            serialized = u.serialize()
            serialized['value_score'] = final_value
            results.append((final_value, serialized))
            
    # Sort by mathematical ROI relevance descending
    results.sort(key=lambda x: x[0], reverse=True)
    return jsonify([r[1] for r in results])

@app.route('/api/predict', methods=['POST'])
def admission_predictor():
    """Visual Admission Predictor"""
    data = request.json
    try:
        gpa = float(data.get('gpa', 3.0))
        test_score = int(data.get('test_score', 1200))
    except (ValueError, TypeError):
        gpa, test_score = 3.0, 1200
        
    university_id = data.get('university_id')
    
    uni = UniversityModel.query.get(university_id)
    if not uni:
        return jsonify({"error": "University not found"}), 404
        
    tags = uni.tags.lower() if uni.tags else ""
    is_elite = 'elite' in tags or 'prestigious' in tags
    
    probability = 50
    category = "Target"
    
    if is_elite:
        if gpa >= 3.8 and test_score >= 1450:
            probability = 60
            category = "Reach"
        elif gpa >= 3.9 and test_score >= 1550:
            probability = 75
            category = "Target"
        else:
            probability = 15
            category = "Reach"
    else:
        if gpa >= 3.5 and test_score >= 1200:
            probability = 85
            category = "Safe"
        elif gpa >= 3.0 and test_score >= 1100:
            probability = 65
            category = "Target"
        else:
            probability = 40
            category = "Reach"
            
    return jsonify({
        "university": uni.name,
        "probability_score": probability,
        "category": category
    })

@app.route('/api/evaluate', methods=['POST'])
def check_matchmaker():
    """Feature 1: AI Profile Evaluator (The Matchmaker)"""
    data = request.json
    gpa = data.get('gpa', 'N/A')
    budget = data.get('budget', 'Unknown')
    preferred_country = data.get('preferred_country', 'Any')
    
    unis = UniversityModel.query.limit(15).all()
    uni_list_str = "\n".join([f"{u.name} (Location: {u.location}, Tuition: ${u.tuition}, Tags: {u.tags})" for u in unis])
    
    prompt = f"""
    The student has GPA: {gpa}, Budget: ${budget}, Preferred Country: {preferred_country}.
    Here is a subset of our university database:
    {uni_list_str}
    
    Evaluate the student's profile against these universities.
    Provide a JSON response with exactly two keys:
    1. "probability_score": An integer from 0 to 100 representing their overall chance of admission to their realistically matched schools.
    2. "strategic_fit": A string (max 2-3 sentences) explaining the best fit (e.g. "While MIT is a reach, your budget aligns perfectly with TUM Germany").
    Return ONLY valid JSON without Markdown blocks.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
        result = json.loads(text)
        return jsonify({
            "success": True, 
            "probability": result.get("probability_score", 50),
            "strategic_fit": result.get("strategic_fit", "We recommend speaking to a counselor.")
        })
    except Exception as e:
        print(f"Matchmaker Error: {e}")
        return jsonify({
            "success": False,
            "probability": 50,
            "strategic_fit": "Unable to process AI evaluation. Our counselors will review your profile."
        })

# Configure SMTP (Real environment config via .env)
SMTP_SERVER = os.environ.get("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
SMTP_USERNAME = os.environ.get("SMTP_USERNAME")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD")

def send_confirmation_email(to_email, name, course):
    subject = "Welcome to Admission Kart! Your Counseling Request is Confirmed"
    body = f"""Hi {name},

Thank you for requesting free career counseling with Admission Kart!
We have received your interest in: {course}.

One of our expert counselors is reviewing your profile and will contact you shortly to schedule your free, personalized session.

In the meantime, feel free to explore more renowned universities on our website.

Best Regards,
The Admission Kart Team
info@admissionkart.com
"""

    msg = MIMEMultipart()
    msg['From'] = "Admission Kart <info@admissionkart.com>"
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        # If no password is provided in ENV, log it to terminal to simulate success locally
        if not SMTP_PASSWORD or SMTP_PASSWORD == "your_16_digit_app_password":
            print("\n" + "="*45)
            print("🔔  SIMULATED EMAIL DISPATCH SUCCESSFUL  🔔")
            print("="*45)
            print(f"From: Admission Kart <{SMTP_USERNAME}>")
            print(f"To: {to_email}")
            print(f"Subject: {subject}")
            print("-" * 45)
            print(body)
            print("="*45 + "\n")
            return
        
        # Real Production Dispatch
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=10)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"✅ Email successfully sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {e}")

def async_email(to_email, name, course):
    thread = threading.Thread(target=send_confirmation_email, args=(to_email, name, course))
    thread.start()

@app.route('/api/leads', methods=['POST'])
def create_lead():
    data = request.json
    name=data.get('name')
    email=data.get('email')
    course=data.get('course', '')
    
    # Smart Lead Scoring Execution based on High-Intent NLP triggers
    high_intent = ['mbbs', 'medicine', 'dental', 'mba', 'phd', 'ivy', 'law']
    quality_score = 5
    course_clean = course.lower()
    
    if any(hi in course_clean for hi in high_intent):
        quality_score = 9
    elif len(course_clean) > 8:
        quality_score = 7
        
    session['last_lead_quality'] = quality_score  # Bind state to session
    
    new_lead = LeadModel(
        name=name,
        email=email,
        desired_course=course,
        lead_quality=quality_score
    )
    db.session.add(new_lead)
    db.session.commit()
    
    # Trigger automated mailer asynchronously
    async_email(email, name, course)
    
    # Feature 3: Agentic Interview Prep
    interview_questions = []
    try:
        prompt = f"""
        A prospective student is applying for: {course}.
        Generate 3 highly specific, challenging university interview questions for this specific program. 
        If they mentioned a specific school (like IIM Ahmedabad or Harvard) in the course text, adapt the questions (e.g. case study for IIM).
        Provide only a valid JSON array of strings containing the 3 questions.
        """
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:-3]
        elif text.startswith("```"):
            text = text[3:-3]
        interview_questions = json.loads(text)
    except Exception as e:
        print(f"Agentic Prep Error: {e}")
        interview_questions = ["Why do you want to study this course?", "What are your long term goals?", "How will you contribute to the campus?"]
        
    return jsonify({
        "success": True, 
        "lead_id": new_lead.id, 
        "lead_quality_assigned": quality_score,
        "interview_prep": interview_questions
    }), 201

CONSULTANT_SYSTEM_PROMPT = """
You are the "Elite Admission Architect" for Admission Kart. Your goal is to provide hyper-personalized, data-backed consultancy that feels like a $500/hour human expert.

### CORE OPERATING MODES:
1. [MODE: PREDICTOR] -> Input: {GPA, Test Scores, University}. 
   - Task: Calculate a 'Match Score' (0-100%). Rule: Be realistic. 
   - Output: Match %, Pros, Cons, and 1 "Actionable Boost".

2. [MODE: ANALYZER] -> Input: {SOP/Resume Text}. 
   - Task: Conduct a "Narrative Audit." Look for 'Passive Voice', 'Clichés'.
   - Output: 1-10 Strength Score and a "Critique Table" with [Current Sentence] vs [Proposed Elite Version].

3. [MODE: PATHFINDER] -> Input: {Target Country, Current Month}. 
   - Task: Generate a "High-Pressure Timeline." 
   - Output: Markdown list of what to do in the next 30, 60, and 90 days.

4. [MODE: SCHOLAR] -> Input: {User Background}. 
   - Task: Identify "Niche Scholarships".

### GLOBAL CONSTRAINTS:
- Use Professional "Consultancy Speak" (e.g., "Strategic Alignment", "Quantitative Benchmark").
- Every response must include one specific fact about the target country or university.
- Always end with a "Next Strategic Step."
- Return all data in clean Markdown.
"""

@app.route('/api/chat', methods=['POST'])
def chat_agent():
    """Elite Admission Architect: AI Agentic Layer"""
    data = request.json
    message = data.get('message', '')
    
    # Detect Mode based on trigger words
    mode = "GENERAL"
    if any(k in message.lower() for k in ['predict', 'gpa', 'score', 'match']):
        mode = "PREDICTOR"
    elif any(k in message.lower() for k in ['sop', 'essay', 'resume', 'audit', 'analyze']):
        mode = "ANALYZER"
    elif any(k in message.lower() for k in ['timeline', 'roadmap', 'apply', 'when']):
        mode = "PATHFINDER"
    elif any(k in message.lower() for k in ['scholarship', 'funding', 'money', 'free']):
        mode = "SCHOLAR"

    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        prompt = f"{CONSULTANT_SYSTEM_PROMPT}\n\nCURRENT MODE: {mode}\nUSER QUERY: {message}\n\nRespond as the Elite Admission Architect."
        
        response = model.generate_content(prompt)
        reply = response.text.strip()
        
        # Contextual Recommendation Logic (Existing)
        recommended_unis = []
        if 'germany' in message.lower() or 'tum' in message.lower():
            unis = UniversityModel.query.filter(UniversityModel.location.ilike('%germany%')).limit(1).all()
            recommended_unis = [u.serialize() for u in unis]
            
        return jsonify({
            "reply": reply,
            "recommendations": recommended_unis
        })
    except Exception as e:
        print(f"Architect Error: {e}")
        return jsonify({"reply": "I am currently optimizing my Strategic Alignment algorithms. Please try again in a moment.", "recommendations": []})
        reply = "Studying in Europe offers exceptional quality of life and Schengen mobility. Germany in particular dominates affordable STEM."
        unis = UniversityModel.query.filter(db.or_(UniversityModel.location.ilike('%germany%'), UniversityModel.location.ilike('%uk%'), UniversityModel.location.ilike('%france%'))).limit(3).all()
        recommended_unis = [u.serialize() for u in unis]
    else:
        # Agentic Parsing
        keywords = message.split()
        unis = []
        for kw in keywords:
            if len(kw) > 3:
                kw_unis = UniversityModel.query.filter(db.or_(
                    UniversityModel.name.ilike(f'%{kw}%'), 
                    UniversityModel.tags.ilike(f'%{kw}%'),
                    UniversityModel.location.ilike(f'%{kw}%')
                )).limit(3).all()
                unis.extend(kw_unis)
        
        unique_unis = list({u.id: u for u in unis}.values())
        recommended_unis = [u.serialize() for u in unique_unis]
        
        if recommended_unis:
            reply = "I found some highly relevant institutions! (By the way, ask me 'What are the scholarships?' to dynamically pull their funding data!)"
        else:
            reply = "Could you tell me a little more about what you're tracking? Give me a specific country or major (e.g., 'Law in India')."

    # Feature 2: Proactive Scholarship Sidebar
    if recommended_unis:
        for u in recommended_unis:
            scholarships_text = (u.get('scholarships') or '').lower()
            u_location = (u.get('location') or '').lower()
            if 'daad' in scholarships_text and 'germany' in u_location:
                reply += f"\n\nWait! You might qualify for the DAAD Scholarship (fully-funded) at {u['name']}."
                break
            elif 'pearson' in scholarships_text and 'canada' in u_location:
                reply += f"\n\nWait! You might qualify for the Lester B. Pearson Scholarship at {u['name']}."
                break

    # Save contextual memory in Flask Session State
    if recommended_unis:
        session['last_context_uni_id'] = recommended_unis[0]['id']

    return jsonify({
        "reply": reply,
        "recommendations": recommended_unis
    })
    
@app.route('/api/compare', methods=['POST'])
def roi_battle_comparison():
    data = request.json
    id1 = data.get('uni_id_1')
    id2 = data.get('uni_id_2')
    
    u1 = UniversityModel.query.get(id1)
    u2 = UniversityModel.query.get(id2)
    
    if not u1 or not u2:
        return jsonify({"error": "Universities not found"}), 404
        
    prompt = f"""
    Compare these two universities for a specific ROI Battle:
    1. {u1.name} (Location: {u1.location}, Tuition: ${u1.tuition})
    2. {u2.name} (Location: {u2.location}, Tuition: ${u2.tuition})
    
    Provide a 3-sentence "Consultant's Verdict" strictly comparing their tuition value against their location prestige (e.g., studying in India for $100 vs UK for $50k).
    Return only the 3 sentences.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        response = model.generate_content(prompt)
        verdict = response.text.strip()
    except Exception as e:
        verdict = f"Comparing {u1.name} and {u2.name} requires evaluating their respective tuition costs against location prestige. Both offer unique ROI pathways. Consult with an expert for a detailed financial breakdown."
        
    return jsonify({
        "university_1": u1.name,
        "university_2": u2.name,
        "consultants_verdict": verdict
    })
    
@app.route('/api/timeline', methods=['POST'])
def location_specific_timeline():
    """Location-Specific 12-Month Roadmap"""
    data = request.json
    location = data.get('location', '').lower()
    
    if 'uk' in location:
        timeline = [
            {"month": "Months 1-3", "action": "Research and UCAS prep; target universities based on predicted grades."},
            {"month": "Months 4-6", "action": "Take IELTS/PTE. Finalize Personal Statement and submit UCAS application."},
            {"month": "Months 7-9", "action": "Wait for CAS (Confirmation of Acceptance). Secure student accommodation."},
            {"month": "Months 10-12", "action": "Apply for Tier 4 Student Visa. Book flights and attend pre-departure briefing."}
        ]
    elif 'usa' in location:
        timeline = [
            {"month": "Months 1-3", "action": "Prepare for standardized tests (SAT/ACT/GRE). Shortlist safety, target, and reach schools."},
            {"month": "Months 4-6", "action": "Take English proficiency tests (TOEFL/IELTS). Write Common App essays."},
            {"month": "Months 7-9", "action": "Submit applications and CSS Profile for financial aid. Wait for admission decisions."},
            {"month": "Months 10-12", "action": "Receive I-20 form. Demonstrate finances, book F-1 Visa interview, and prepare for travel."}
        ]
    elif 'japan' in location:
        timeline = [
            {"month": "Months 1-3", "action": "Identify MEXT scholarship opportunities and English-taught programs (G30)."},
            {"month": "Months 4-6", "action": "Take the EJU (if required) or standard English tests. Prepare academic transcripts."},
            {"month": "Months 7-9", "action": "Submit university applications directly. Await Certificate of Eligibility (CoE) processing."},
            {"month": "Months 10-12", "action": "Convert CoE into a Student Visa at the local embassy. Arrange dormitories in Japan."}
        ]
    elif 'germany' in location:
        timeline = [
            {"month": "Months 1-3", "action": "Learn foundational German (B1 level). Submit documents to APS India for certification."},
            {"month": "Months 4-6", "action": "Take the TestAS exam. Prepare physical dossiers for Uni-Assist submission."},
            {"month": "Months 7-9", "action": "Receive admission letter. Transfer funds to a Blocked Account (Expatrio/Fintiba)."},
            {"month": "Months 10-12", "action": "Submit visa application via VFS Global. Finalize health insurance and enroll at university."}
        ]
    else:
        timeline = [
            {"month": "Months 1-3", "action": "Determine target destination budget and program alignment. Start standardized test prep."},
            {"month": "Months 4-6", "action": "Complete required language/academic exams. Request Letters of Recommendation."},
            {"month": "Months 7-9", "action": "Submit online applications. Apply for university-specific aid and generic scholarships."},
            {"month": "Months 10-12", "action": "Accept university offer, secure funding/loans, execute visa documentation, and travel logistics."}
        ]
        
    return jsonify({
        "location": location.capitalize() if location else "Global",
        "timeline": timeline
    })

@app.route('/api/roadmap', methods=['POST'])
def generate_roadmap():
    """Dynamic Application Roadmap Engine"""
    data = request.json
    location = data.get('location', '').lower()
    
    if 'germany' in location:
        timeline = [
            {"step": 1, "action": "Language Benchmark", "desc": "Clear Goethe Zertifikat B1/B2 (if pursuing German track)."},
            {"step": 2, "action": "APS Certification", "desc": "Submit academic documents to APS India for academic authenticity verification."},
            {"step": 3, "action": "TestAS Examination", "desc": "Take the standard TestAS for analytical aptitude scaling."},
            {"step": 4, "action": "Uni-Assist Application", "desc": "Send digital/physical dossiers through the central Uni-Assist pipeline."},
            {"step": 5, "action": "Blocked Account Setup", "desc": "Transfer ~11,208 EUR to Expatrio/Fintiba for living expense guarantees."},
            {"step": 6, "action": "Visa Enrollment", "desc": "VFS Global biometrics and final student visa issuance."}
        ]
    elif 'usa' in location:
        timeline = [
            {"step": 1, "action": "Standardized Testing", "desc": "Achieve target scores on SAT/ACT or GRE/GMAT depending on degree level."},
            {"step": 2, "action": "English Proficiency", "desc": "Clear TOEFL iBT (90+) or IELTS Academic (7.0+)."},
            {"step": 3, "action": "Common App & Essays", "desc": "Draft compelling Statement of Purpose and coordinate 2-3 Letters of Recommendation."},
            {"step": 4, "action": "University Portals", "desc": "Submit CSS profiles for financial aid alongside major applications."},
            {"step": 5, "action": "I-20 Form Processing", "desc": "Demonstrate liquid financial backing to university to secure immigration documents."},
            {"step": 6, "action": "F1 Visa Interview", "desc": "Book US Embassy slot and defend non-immigrant intent."}
        ]
    elif 'india' in location:
        timeline = [
            {"step": 1, "action": "Entrance Prep", "desc": "Rigorous coaching for JEE (Engineering), NEET (Medical), or CLAT (Law)."},
            {"step": 2, "action": "Examination", "desc": "Sit for national or state-level entrance benchmarks."},
            {"step": 3, "action": "Counseling Rounds", "desc": "Participate in JoSAA/MCC online seat allocation processes based on percentile rankings."},
            {"step": 4, "action": "Document Verification", "desc": "Physical submittal of 10+2 boards and localized domicile certificates."},
            {"step": 5, "action": "Fee Payment & Induction", "desc": "Secure the allotted seat physically and commence classes."}
        ]
    else:
        # Default Generic Blueprint
        timeline = [
            {"step": 1, "action": "Profile Evaluation", "desc": "Finalize destination budget and course alignment."},
            {"step": 2, "action": "Document Preparation", "desc": "Compile Transcripts, LORs, and standardized testing records."},
            {"step": 3, "action": "Application Submission", "desc": "Apply directly or via generalized global portals."},
            {"step": 4, "action": "Visa & Logistics", "desc": "Finalize immigration paperwork and housing contracts."}
        ]
        
    return jsonify({
        "success": True,
        "region": location.capitalize() if location else "Global",
        "roadmap": timeline
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Ensure tables exist
    app.run(host='0.0.0.0', debug=True, port=8000)
