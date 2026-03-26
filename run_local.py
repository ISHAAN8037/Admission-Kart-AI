import os
import shutil
from app import app, db
from seed_db import seed

def reset_local_env():
    print("--- 1. Clearing Logs ---")
    # Clear any existing flask_run.log or flask.log
    for log_file in ['flask.log', 'flask_run.log']:
        if os.path.exists(log_file):
            os.remove(log_file)
            print(f"Removed {log_file}")
            
    print("\n--- 2 & 3. Initializing and Seeding Database ---")
    # Initialize the DB & Seed the DB within app_context
    # The existing seed() function from seed_db.py creates tables and cleanly seeds
    seed()

    print("\n--- 4. Building Netlify Dist & Patching Static Paths ---")
    # Fix Static Path: Run logic from build_netlify.py
    DIST_DIR = "netlify_dist"
    if os.path.exists(DIST_DIR):
        shutil.rmtree(DIST_DIR)
        
    os.makedirs(DIST_DIR)

    # Copy core UI logic
    shutil.copy("templates/index.html", f"{DIST_DIR}/index.html")
    shutil.copytree("static", f"{DIST_DIR}/static")

    # Patch Jinja templates for static usage
    with open(f"{DIST_DIR}/index.html", "r") as f:
        html = f.read()

    html = html.replace("{{ url_for('static', filename='css/styles.css') }}", "./static/css/styles.css")
    html = html.replace("{{ url_for('static', filename='js/app.js') }}", "./static/js/app.js")

    with open(f"{DIST_DIR}/index.html", "w") as f:
        f.write(html)

    # Patch JS logic to hit local endpoint instead of Locatunnel
    BASE_URL = "http://127.0.0.1:5001"
    
    with open(f"{DIST_DIR}/static/js/app.js", "r") as f:
        js = f.read()

    # The original endpoints in static code are usually root paths or hit locatunnel:
    # Here we replace relative fetches with our BASE_URL directly.
    # Note: If they had previously been built for Netlify, they might still be Locatunnel.
    # Replacing locatunnel explicitly if it was in source, or just patching base fetch calls:
    js = js.replace("fetch('/api/universities')", f"fetch('{BASE_URL}/api/universities')")
    js = js.replace("fetch('/api/search'", f"fetch('{BASE_URL}/api/search'")
    js = js.replace("fetch('/api/chat'", f"fetch('{BASE_URL}/api/chat'")
    js = js.replace("fetch('/api/leads'", f"fetch('{BASE_URL}/api/leads'")

    with open(f"{DIST_DIR}/static/js/app.js", "w") as f:
        f.write(js)
        
    print(f"Static outputs generated in {DIST_DIR} pointing to backend {BASE_URL}")
    print("\n--- 5. Starting Local Flask Server ---")

if __name__ == '__main__':
    reset_local_env()
    app.run(host='127.0.0.1', port=5001, debug=True)
