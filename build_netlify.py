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

# We no longer patch the BASE_URL here because app.js now has a built-in 
# 'Simulation Fallback' for static hosts like GitHub Pages.
print("Build optimized for Static Simulation Mode.")

print("Netlify Build Compilation Complete. Output ready in /netlify_dist")
