import os
import shutil

DIST_DIR = "netlify_dist"
if os.path.exists(DIST_DIR):
    shutil.rmtree(DIST_DIR)

os.makedirs(DIST_DIR)

# Copy the core UI architecture
shutil.copy("templates/index.html", f"{DIST_DIR}/index.html")
shutil.copytree("static", f"{DIST_DIR}/static")

# Compile out Jinja2 templating syntax for pure Netlify static compatibility
with open(f"{DIST_DIR}/index.html", "r") as f:
    html = f.read()

html = html.replace("{{ url_for('static', filename='css/styles.css') }}", "./static/css/styles.css")
html = html.replace("{{ url_for('static', filename='js/app.js') }}", "./static/js/app.js")

with open(f"{DIST_DIR}/index.html", "w") as f:
    f.write(html)

# Patch the JavaScript endpoints to forcefully route to the live locatunnel python backend
BASE_URL = "https://shy-vans-press.loca.lt"

with open(f"{DIST_DIR}/static/js/app.js", "r") as f:
    js = f.read()

js = js.replace("fetch('/api/universities')", f"fetch('{BASE_URL}/api/universities')")
js = js.replace("fetch('/api/search'", f"fetch('{BASE_URL}/api/search'")
js = js.replace("fetch('/api/chat'", f"fetch('{BASE_URL}/api/chat'")
js = js.replace("fetch('/api/leads'", f"fetch('{BASE_URL}/api/leads'")

with open(f"{DIST_DIR}/static/js/app.js", "w") as f:
    f.write(js)

print("Netlify Build Compilation Complete. Output ready in /netlify_dist")
