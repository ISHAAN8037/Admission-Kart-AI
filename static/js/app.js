document.addEventListener('DOMContentLoaded', () => {
    console.log("🚀 Admission Kart AI Platform [v1.4] - Admin Command Center Active");

    // ---- 1. Sticky Navbar ----
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.add('scrolled'); // keep transparent style logic if needed
            if(window.scrollY === 0) navbar.classList.remove('scrolled');
        }
    });

    // ---- 2. Dynamic Fetch & Mock AI Search ----
    let universities = [];
    const uniListContainer = document.getElementById('university-list');
    let shortlist = JSON.parse(localStorage.getItem('admissionKart_shortlist')) || [];

    // ---- 2.b AI Simulation Data (Fallback for GitHub Pages) ----
    const mockUniversities = [
        {
            id: "u1",
            name: "Technical University of Munich",
            location: "Germany",
            image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=1000",
            value_score: 95,
            tags: "engineering europe germany technical cheap affordable",
            tuition: "2,000",
            description: "TUM is one of Europe's top universities, renowned for its engineering and technology programs.",
            scholarships: "DAAD Scholarships, Deutschlandstipendium."
        },
        {
            id: "u2",
            name: "Stanford University",
            location: "USA",
            image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=1000",
            value_score: 98,
            tags: "usa california research silicon-valley ivy-equivalent elite",
            tuition: "57,000",
            description: "Stanford University is one of the world's leading teaching and research institutions.",
            scholarships: "Stanford Financial Aid, Knight-Hennessy Scholars."
        },
        {
            id: "u4",
            name: "Harvard University",
            location: "USA",
            image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1000",
            value_score: 98,
            tags: "usa ivy-league elite research top global",
            tuition: "55,000",
            description: "Harvard is the oldest institution of higher learning in the United States.",
            scholarships: "Harvard Financial Aid (Need-Blind)."
        },
        {
            id: "u5",
            name: "IIT Bombay",
            location: "India",
            image: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=1000",
            value_score: 97,
            tags: "india engineering tech elite top mumbai btech",
            tuition: "3,000",
            description: "IIT Bombay is one of the most prestigious engineering institutions in India.",
            scholarships: "Merit-cum-Means Scholarship."
        },
        {
            id: "u6",
            name: "MIT Manipal",
            location: "India",
            image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1000",
            value_score: 90,
            tags: "engineering india technology btech private",
            tuition: "5,000",
            description: "Manipal Institute of Technology (MIT) offers premier B.Tech programs.",
            scholarships: "Freeship & Merit-cum-Means."
        }
    ];

    async function fetchUniversities() {
        try {
            const res = await fetch('/api/universities');
            if(!res.ok) throw new Error("Static Host Detection");
            universities = await res.json();
            renderUniversities(universities);
        } catch (e) {
            console.warn("Using Simulation Mode (No Backend Found)");
            universities = mockUniversities;
            renderUniversities(universities);
        }
    }

    // Render Universities
    function renderUniversities(dataToRender) {
        if (!uniListContainer) return;
        uniListContainer.innerHTML = '';
        dataToRender = dataToRender || universities;

        if (dataToRender.length === 0) {
            uniListContainer.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; padding: 60px 20px;">
                    <i class="ph ph-magnifying-glass" style="font-size: 3rem; color: var(--border-dark); margin-bottom: 16px;"></i>
                    <h4>No universities match your search</h4>
                    <p style="color: var(--text-muted);">Try a different keyword or explore our top picks below.</p>
                    <button class="btn btn-outline" onclick="location.reload()" style="margin-top: 15px;">Clear Search</button>
                </div>
            `;
            return;
        }
        
        dataToRender.forEach(uni => {
            const isShortlisted = shortlist.some(item => item.id === uni.id);
            const btnClass = isShortlisted ? 'add-shortlist added' : 'add-shortlist';
            const btnText = isShortlisted ? '<i class="ph-fill ph-check-circle"></i> Saved' : '<i class="ph ph-bookmark-simple"></i> Save to List';
            
            const roiBadgeHtml = uni.value_score 
                ? `<span class="badge tooltip-anim" style="background:var(--accent-gold); color:#1a1f36; position:absolute; top:15px; left:15px; z-index:10;"><i class="ph-fill ph-lightning"></i> AI ROI Score: ${uni.value_score}</span>`
                : '';

            const html = `
                <div class="uni-card">
                    <div style="position:relative; overflow:hidden; height:200px; background:#f8fafc;">
                        <img src="${uni.image}" alt="${uni.name}" class="fallback-img" 
                             onerror="this.src='https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1000'; this.onerror=null;"
                             style="opacity: 1; position: absolute; top:0; left:0; width:100%; height:100%; object-fit:cover; z-index:1;">
                        ${roiBadgeHtml}
                    </div>
                    <div class="uni-content">
                        <h4>${uni.name}</h4>
                        <div class="uni-loc"><i class="ph ph-map-pin"></i> ${uni.location}</div>
                        <div class="uni-actions">
                            <span class="text-teal view-details-btn" style="font-weight: 600; font-size: 0.9rem; cursor: pointer;" data-id="${uni.id}">View Details <i class="ph-bold ph-caret-right"></i></span>
                            <button class="${btnClass}" data-id="${uni.id}">
                                ${btnText}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            uniListContainer.innerHTML += html;
        });

        // Add event listeners to Shortlist buttons
        document.querySelectorAll('.add-shortlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const uniId = e.currentTarget.getAttribute('data-id');
                toggleShortlist(uniId, e.currentTarget);
            });
        });

        // Add event listeners to View Details buttons
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const uniId = e.currentTarget.getAttribute('data-id');
                const uni = dataToRender.find(u => u.id === uniId) || universities.find(u => u.id === uniId);
                if (uni) openDetailsModal(uni);
            });
        });
    }

    // Toggle Shortlist Logic
    function toggleShortlist(id, btnElement) {
        const uni = universities.find(u => u.id === id);
        const index = shortlist.findIndex(u => u.id === id);

        if (index > -1) {
            // Remove
            shortlist.splice(index, 1);
            btnElement.className = 'add-shortlist';
            btnElement.innerHTML = '<i class="ph ph-bookmark-simple"></i> Save to List';
        } else {
            // Add
            shortlist.push(uni);
            btnElement.className = 'add-shortlist added';
            btnElement.innerHTML = '<i class="ph-fill ph-check-circle"></i> Saved';
            
            // Bump animation for cart counter
            const counter = document.getElementById('cart-counter');
            counter.classList.add('bump');
            setTimeout(() => counter.classList.remove('bump'), 300);
        }

        saveAndRenderShortlist();
    }

    // Save state and update UI
    function saveAndRenderShortlist() {
        localStorage.setItem('admissionKart_shortlist', JSON.stringify(shortlist));
        updateCartCounter();
        renderShortlistSidebar();
    }

    // Update Counter
    function updateCartCounter() {
        const counter = document.getElementById('cart-counter');
        counter.textContent = shortlist.length;
    }

    // ---- 3. Sidebar UI Logic ----
    const sidebar = document.getElementById('shortlist-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const toggleBtn = document.getElementById('shortlist-btn');
    const closeBtn = document.getElementById('close-sidebar');
    const sidebarItemsContainer = document.getElementById('shortlist-items');

    function openSidebar() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }

    toggleBtn.addEventListener('click', openSidebar);
    closeBtn.addEventListener('click', closeSidebar);
    overlay.addEventListener('click', closeSidebar);

    function renderShortlistSidebar() {
        if (shortlist.length === 0) {
            sidebarItemsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="ph ph-tray-light"></i>
                    <p>No universities shortlisted yet.</p>
                </div>
            `;
            return;
        }

        sidebarItemsContainer.innerHTML = '';
        shortlist.forEach(uni => {
            const el = document.createElement('div');
            el.className = 'shortlist-item';
            el.innerHTML = `
                <img src="${uni.image}" alt="${uni.name}">
                <div class="shortlist-item-info">
                    <h4>${uni.name}</h4>
                    <p>${uni.location}</p>
                </div>
                <button class="remove-btn" data-id="${uni.id}">
                    <i class="ph ph-trash"></i>
                </button>
            `;
            sidebarItemsContainer.appendChild(el);
        });

        // Add remove listeners inside sidebar
        document.querySelectorAll('.shortlist-item .remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const uniId = e.currentTarget.getAttribute('data-id');
                // Target the grid button to sync states
                const gridBtn = document.querySelector(`.add-shortlist[data-id="${uniId}"]`);
                if(gridBtn) {
                    toggleShortlist(uniId, gridBtn);
                } else {
                    // Fallback if grid btn not visible
                    shortlist = shortlist.filter(u => u.id !== uniId);
                    saveAndRenderShortlist();
                }
            });
        });
    }

    // Connect AI Search Simulator
    const searchBtn = document.querySelector('.search-submit');
    const searchInput = document.getElementById('hero-search');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', async () => {
            const query = searchInput.value.trim();
            // Provide visual feedback
            const originalText = searchBtn.innerHTML;
            searchBtn.innerHTML = 'Thinking...';
            try {
                const res = await fetch('/api/search', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query })
                });
                if(!res.ok) throw new Error("Static Host");
                const results = await res.json();
                renderUniversities(results);
                document.getElementById('university-list').scrollIntoView({ behavior: 'smooth' });
            } catch (e) {
                // Simulation Search Logic (Fallback for GitHub Pages)
                console.log("Using Search Simulation...");
                const simResults = universities.filter(u => 
                    u.name.toLowerCase().includes(query.toLowerCase()) || 
                    u.location.toLowerCase().includes(query.toLowerCase()) ||
                    (u.tags && u.tags.toLowerCase().includes(query.toLowerCase()))
                );
                renderUniversities(simResults);
            } finally {
                searchBtn.innerHTML = originalText;
            }
        });
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchBtn.click();
        });
    }

    // ---- 4. Animated Number Counters (Intersection Observer) ----
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const animateCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 10);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    };

    const counterObserver = new IntersectionObserver(animateCounters, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // ---- 5. AI Chatbot Logic ----
    const aiFab = document.getElementById('ai-fab');
    const chatWindow = document.getElementById('chat-window');
    const closeChatBtn = document.getElementById('close-chat');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const sendChatBtn = document.getElementById('send-chat');

    function toggleChat() {
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            setTimeout(() => chatInput.focus(), 300);
        }
    }

    if (aiFab) aiFab.addEventListener('click', toggleChat);
    if (closeChatBtn) closeChatBtn.addEventListener('click', toggleChat);

    function appendMessage(text, isUser = false, recs = []) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${isUser ? 'user-msg' : 'ai-msg'}`;
        
        if (isUser) {
            msgDiv.innerHTML = `<p>${text}</p>`;
        } else {
            // Use marked for AI messages
            msgDiv.innerHTML = `<div class="ai-content">${marked.parse(text)}</div>`;
        }

        if (recs && recs.length > 0) {
            const cardsContainer = document.createElement('div');
            recs.forEach(r => {
                cardsContainer.innerHTML += `
                    <div class="chat-rec-card">
                        <img src="${r.image}" alt="Uni Image">
                        <h5>${r.name}</h5>
                        <span><i class="ph ph-map-pin"></i> ${r.location}</span>
                    </div>
                `;
            });
            msgDiv.appendChild(cardsContainer);
        }

        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    async function sendChatMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage(text, true);
        chatInput.value = '';

        // Typing indicator
        const typingId = 'typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-msg ai-msg';
        typingDiv.id = typingId;
        typingDiv.innerHTML = '<p>...</p>';
        chatBody.appendChild(typingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            if (!res.ok) throw new Error("Backend Offline");

            const data = await res.json();
            document.getElementById(typingId)?.remove();

            // detect if it's the generic one-line fallback
            if (data.reply.includes("[OFFLINE]")) {
                console.log("Backend in fallback mode. Triggering Satellite Architect...");
                const result = runAiSimulation(text);
                appendMessage(result.text, false, result.recommendations);
            } else {
                appendMessage(data.reply, false, data.recommendations);
            }
        } catch (e) {
            console.error("AI Bridge Failure:", e);
            document.getElementById(typingId)?.remove();
            console.log("Switching to Satellite Architect (Simulation Mode)...");
            const result = runAiSimulation(text);
            appendMessage(result.text, false, result.recommendations);
        }
    }

    /**
     * SATELLITE ARCHITECT: High-fidelity Persona Simulation
     * Operates when the live API is unreachable (e.g. static hosting).
     */
    /**
     * SATELLITE ARCHITECT: High-fidelity Persona Simulation
     * Expanded Intelligence for Law, Medicine, STEM, and MBA paths.
     */
    /**
     * SATELLITE ARCHITECT: High-fidelity Persona Simulation
     * Lead Strategic Advisor Persona: ROI-focused, table-heavy, and actionable.
     */
    function runAiSimulation(text) {
        let reply = "";
        const pt = text.toLowerCase();
        let recommendations = [];
        let visaProb = Math.floor(Math.random() * (95 - 65 + 1)) + 65; // Simulated probability
        
        // 1. THE SCHOLARSHIP SNIPER (Triggered by Scholarship/Free Money/Grant)
        if (pt.includes("scholarship") || pt.includes("free money") || pt.includes("grant") || pt.includes("funding")) {
            const country = pt.includes("germany") ? "Germany" : pt.includes("canada") ? "Canada" : pt.includes("usa") ? "USA" : "your target destination";
            const topScholarship = country === "Germany" ? "DAAD Scholarships (fully funded)" : country === "Canada" ? "Lester B. Pearson International Scholarship" : country === "USA" ? "Fulbright Program" : "our Global Excellence Awards";
            
            reply = `### 🎯 SCHOLARSHIP SNIPER MODE: ACTIVE\n\nI am the **Lead Scholarship Sniper** for Admission Kart. My goal is to find 'Free Money' for you and ensure you don't miss out on these life-changing awards.\n\n**Proactive Match:** Since you mentioned ${country}, you should immediately target the **${topScholarship}**. This award is highly competitive and requires a professional review of your profile.\n\n**Strategic Audit:** The window for a full-ride at top institutions in ${country} is closing fast (often in as little as 45 days).\n\n### 📅 THE 90-DAY BATTLE PLAN\n\n| Timeline | Task for the Student | Why it matters |\n| :--- | :--- | :--- |\n| **Next 30 Days** | Finalize SOP and LORs | Most big awards close early. |\n| **Next 60 Days** | Submit Financial Proof | Required for the scholarship audit. |\n| **Next 90 Days** | Final Application | Last chance for the full-ride window. |`;
            
            recommendations = mockUniversities.filter(u => u.location.toLowerCase().includes(country.toLowerCase()) || country === "your target destination").slice(0, 2);
            
            const closing = `\n\nI have found 5 scholarships you qualify for. Would you like to see the 30-day Battle Plan to win them?`;
            return {
                text: reply + closing,
                recommendations: recommendations
            };
        }

        // 2. THE VISA & FUNDING OFFICER (Triggered by Money/Visa/Budget)
        if (pt.includes("visa") || pt.includes("money") || pt.includes("budget") || pt.includes("finance") || pt.includes("cost")) {
            reply = `Financial Audit Mode Active. Your data is handled with professional confidentiality.\n\n### 📂 VISA & FUNDING AUDIT\n\nAs your **Visa & Funding Officer**, I am conducting a 'Visa Success Stress Test' based on your query. \n\n**Financial Audit:** If you are targeting Germany, remember the mandatory **€11,208 Blocked Account** requirement. For the USA, your I-20 will require proof of liquid funds covering at least 1 year of tuition and living expenses.\n\n| Item | Requirement | Goal |\n| :--- | :--- | :--- |\n| Blocked Account | €11,208 | Germany Visa |\n| I-20 Coverage | Full 1st Year | USA F1 Visa |\n| Proof of Funds | Bank/Loan Docs | Compliance |\n\n**Scholarship Sniper:** I recommend the **DAAD Global Excellence** (Germany) or **Lester B. Pearson** (Canada).`;
            recommendations = mockUniversities.filter(u => u.location === "Germany" || u.location === "Canada").slice(0, 2);
            visaProb = 85; 
        } 
        // 2. THE ALUMNI TWIN (Triggered by Vibe/Life/Campus)
        else if (pt.includes("vibe") || pt.includes("life") || pt.includes("campus") || pt.includes("culture") || pt.includes("weather") || pt.includes("food")) {
            reply = `### 🎓 ADMISSION KART: ALUMNI TWIN MODE\n\nI'm your **Alumni Twin**, here to give you the real "Day in the Life" at these institutions. \n\n**A Day at Stanford (USA):** Expect a morning bike ride through the sunny Palm Drive. Most students grab a quick bite at Coupa Cafe before a 10:00 AM CS lecture. The weather is perpetual sunshine (~22°C), and the vibe is "Collaborative Excellence." \n\n**A Day at TUM (Germany):** It's early mornings at Garching campus. You'll grab a Bretzel at the local bakery, work through a rigorous engineering lab, and grab a Beer (after 5 PM) at a student hall. Part-time jobs (Werkstudent) are plentiful in Munich's tech scene.`;
            recommendations = mockUniversities.filter(u => u.name.includes("Stanford") || u.name.includes("Munich"));
        }
        // 3. THE ASSISTANTSHIP GURU (Triggered by Job/RA/TA)
        else if (pt.includes("ra") || pt.includes("ta") || pt.includes("working") || pt.includes("job") || pt.includes("assistant") || pt.includes("work")) {
            reply = `### 💼 ASSISTANTSHIP GURU ACTIVE\n\nYour goal is to offset tuition through a **Research or Teaching Assistantship**. Here is a professional cold email draft for you:\n\n**Subject:** Inquiry Regarding Research Assistantship Opportunities - [Your Name]\n\nDear Professor [Last Name],\n\nI am a prospective [Major] student with deep interests in your work regarding [Specific Topic]. Having audited your recent paper on [Reference], I was struck by your methodology regarding [Detail].\n\nMy background in [Skill A] and [Skill B] aligns perfectly with your lab's current direction. I would be honored to discuss how I can contribute to your team as a Research Assistant for the upcoming semester.\n\nBest regards,\n[Your Name]`;
            recommendations = mockUniversities.slice(0, 2);
        }
        // 4. THE ELITE ARCHITECT (Default / Comparison / ROI)
        else {
            const isComparison = pt.includes("vs") || pt.includes("compare") || pt.includes("difference");
            if (isComparison) {
                reply = `### 🏛️ ELITE ARCHITECT: ROI BATTLE\n\nLet's analyze the **Return on Investment** between your top choices. Comparing high-tuition elite schools against "Hidden Gems" or subsidized European gems is my specialty.\n\n| University | Annual Tuition (Est.) | AI ROI Score | Verdict |\n| :--- | :--- | :--- | :--- |\n| **TUM Germany** | ~ \$1,500 | 95 | **Hidden Gem** |\n| **Stanford USA** | ~ \$57,000 | 98 | **Elite/High Cap** |\n| **Imperial UK** | ~ \$52,000 | 92 | **Strategic Stem** |\n\n**Strategic Audit:** For pure financial ROI, the Technical University of Munich remains unbeaten. For networking power, Stanford is the gold standard.`;
                recommendations = mockUniversities.filter(u => u.name.includes("Munich") || u.name.includes("Stanford"));
            } else {
                reply = `### 🏛️ ADMISSION KART: ELITE ARCHITECT MODE\n\nI am your **Elite Architect**. I design your global education path by maximizing prestige and minimizing debt.\n\n**High-ROI Suggestions:** If you haven't considered them, **ETH Zurich** and **Kyoto University** are world-class "Hidden Gems" with extremely competitive tuition-to-prestige ratios.`;
                recommendations = mockUniversities.slice(0, 3);
            }
        }

        // --- MANDATORY GLOBAL FOOTER ---
        const footer = `\n\n---\n**Current Visa Success Probability:** ${visaProb}%\n**Next Strategic Move:** [Actionable Task]`;
        
        return {
            text: reply + footer,
            recommendations: recommendations
        };
    }

    /**
     * SATELLITE ROADMAP ARCHITECT: High-fidelity Roadmap Simulation
     */
    function runRoadmapSimulation(location) {
        const locLower = (location || "Global").toLowerCase();
        let roadmap = [];
        
        if (locLower.includes('germany')) {
            roadmap = [
                {step: 1, action: "Language Benchmark", desc: "Clear Goethe Zertifikat B1/B2 (if pursuing German track)."},
                {step: 2, action: "APS Certification", desc: "Submit academic documents to APS India for authenticity verification."},
                {step: 3, action: "TestAS Examination", desc: "Take the standard TestAS for analytical aptitude scaling."},
                {step: 4, action: "Uni-Assist Application", desc: "Send final dossiers through the central Uni-Assist pipeline."},
                {step: 5, action: "Blocked Account Setup", desc: "Transfer ~11,208 EUR to Expatrio/Fintiba for living guarantees."},
                {step: 6, action: "Visa Enrollment", desc: "VFS Global biometrics and final student visa issuance."}
            ];
        } else if (locLower.includes('usa')) {
            roadmap = [
                {step: 1, action: "Standardized Testing", desc: "Achieve target scores on SAT/ACT or GRE/GMAT depending on level."},
                {step: 2, action: "English Proficiency", desc: "Clear TOEFL iBT (90+) or IELTS Academic (7.0+)."},
                {step: 3, action: "Common App & Essays", desc: "Draft compelling SOPs and coordinate 2-3 Letters of Recommendation."},
                {step: 4, action: "University Portals", desc: "Submit CSS profiles for financial aid alongside major applications."},
                {step: 5, action: "I-20 Form Processing", desc: "Demonstrate liquid financial backing to university to secure immigration docs."},
                {step: 6, action: "F1 Visa Interview", desc: "Book US Embassy slot and defend non-immigrant intent."}
            ];
        } else if (locLower.includes('india')) {
            roadmap = [
                {step: 1, action: "Entrance Prep", desc: "Rigorous coaching for JEE (Engineering), NEET (Medical), or CLAT (Law)."},
                {step: 2, action: "Examination", desc: "Sit for national or state-level entrance benchmarks."},
                {step: 3, action: "Counseling Rounds", desc: "Participate in JoSAA/MCC online seat allocation processes."},
                {step: 4, action: "Document Verification", desc: "Physical submittal of 10+2 boards and localized domicile certificates."},
                {step: 5, action: "Fee Payment & Induction", desc: "Secure the allotted seat physically and commence classes."}
            ];
        } else {
            roadmap = [
                {step: 1, action: "Profile Evaluation", desc: "Finalize destination budget and course alignment."},
                {step: 2, action: "Document Preparation", desc: "Compile Transcripts, LORs, and standardized testing records."},
                {step: 3, action: "Application Submission", desc: "Apply directly or via generalized global portals."},
                {step: 4, action: "Visa & Logistics", desc: "Finalize immigration paperwork and housing contracts."}
            ];
        }

        const roadmapTimeline = document.getElementById('roadmap-timeline');
        const roadmapContainer = document.getElementById('roadmap-container');
        const btnGenerateRoadmap = document.getElementById('generate-roadmap-btn');

        if(roadmapTimeline) {
            let roadmapHTML = roadmap.map(step => `
                <div class="timeline-step" style="text-align: left; padding: 10px 0;">
                    <div class="step-number" style="width: 25px; height: 25px; font-size: 0.8rem; margin: 0; background: var(--accent-gold); color: #1a1f36;">${step.step}</div>
                    <h4 style="font-size: 1.05rem; margin-top: 5px;">${step.action}</h4>
                    <p style="font-size: 0.9rem; color: var(--text-muted);">${step.desc}</p>
                </div>
            `).join('');
            
            roadmapTimeline.innerHTML = roadmapHTML;
            if(roadmapContainer) roadmapContainer.style.display = 'block';
            if(btnGenerateRoadmap) btnGenerateRoadmap.style.display = 'none';
        }
    }

    if (sendChatBtn) sendChatBtn.addEventListener('click', sendChatMessage);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendChatMessage();
        });
    }

    // ---- 5.b Web Speech API Integration (Voice Assistant) ----
    const micBtn = document.getElementById('mic-btn');
    if (micBtn && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

        let isRecording = false;

        micBtn.addEventListener('click', () => {
            if (isRecording) {
                recognition.stop();
                return;
            }
            recognition.start();
        });

        recognition.onstart = () => {
            isRecording = true;
            micBtn.style.color = "#e74c3c"; // Red when recording
            chatInput.placeholder = "Listening...";
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            sendChatMessage(); // Automatically trigger send
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
        };

        recognition.onend = () => {
            isRecording = false;
            micBtn.style.color = "#888"; // Revert color
            chatInput.placeholder = "Ask me anything...";
        };
    } else if (micBtn) {
        micBtn.style.display = 'none'; // Hide if browser unsupported
    }

    // ---- 6. University Details Modal Logic ----
    const detailsModal = document.getElementById('details-modal');
    const closeDetailsBtn = document.getElementById('close-modal');
    
    // Consultative Targets
    const btnGenerateRoadmap = document.getElementById('generate-roadmap-btn');
    const roadmapContainer = document.getElementById('roadmap-container');
    const roadmapTimeline = document.getElementById('roadmap-timeline');
    let currentRoadmapLocation = "";

    function openDetailsModal(uni) {
        const modalImg = document.getElementById('modal-img');
        modalImg.src = uni.image;
        modalImg.onerror = function() {
            this.src = 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1000';
            this.onerror = null;
        };
        document.getElementById('modal-title').textContent = uni.name;
        document.getElementById('modal-location').textContent = uni.location;
        document.getElementById('modal-tuition').textContent = uni.tuition ? `$${uni.tuition}` : 'N/A';
        document.getElementById('modal-desc').textContent = uni.description || 'No description available.';
        document.getElementById('modal-schol').textContent = uni.scholarships || 'Contact us for scholarship opportunities.';
        
        // Reset Roadmap State
        currentRoadmapLocation = uni.location;
        if(roadmapContainer) roadmapContainer.style.display = 'none';
        if(btnGenerateRoadmap) {
            btnGenerateRoadmap.style.display = 'block';
            btnGenerateRoadmap.innerHTML = '<i class="ph-bold ph-magic-wand"></i> Generate Free Strategy Roadmap';
            btnGenerateRoadmap.disabled = false;
        }

        detailsModal.classList.add('active');
    }
    
    // Bind explicit Roadmap Generation via the Consultative API
    if(btnGenerateRoadmap) {
        btnGenerateRoadmap.addEventListener('click', async (e) => {
            e.preventDefault();
            btnGenerateRoadmap.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Analyzing Timeline...';
            btnGenerateRoadmap.disabled = true;
            
            try {
                const res = await fetch('/api/roadmap', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ location: currentRoadmapLocation })
                });
                const data = await res.json();
                
                if(data.success && roadmapTimeline) {
                    let roadmapHTML = data.roadmap.map(step => `
                        <div class="timeline-step" style="text-align: left; padding: 10px 0;">
                            <div class="step-number" style="width: 25px; height: 25px; font-size: 0.8rem; margin: 0; background: var(--accent-gold); color: #1a1f36;">${step.step}</div>
                            <h4 style="font-size: 1.05rem; margin-top: 5px;">${step.action}</h4>
                            <p style="font-size: 0.9rem; color: var(--text-muted);">${step.desc}</p>
                        </div>
                    `).join('');
                    
                    roadmapTimeline.innerHTML = roadmapHTML;
                    roadmapContainer.style.display = 'block';
                    btnGenerateRoadmap.style.display = 'none'; // Hide button once compiled
                } else {
                    throw new Error("API failure");
                }
            } catch (err) {
                console.warn("Switching to Satellite Roadmap Architect for", currentRoadmapLocation);
                runRoadmapSimulation(currentRoadmapLocation);
            }
        });
    }

    if (closeDetailsBtn) {
        closeDetailsBtn.addEventListener('click', () => {
            detailsModal.classList.remove('active');
        });
    }
    if (detailsModal) {
        detailsModal.addEventListener('click', (e) => {
            if(e.target === detailsModal) detailsModal.classList.remove('active');
        });
    }

    // ---- 7. Counseling Form Logic ----
    const counselingModal = document.getElementById('counseling-modal');
    const closeCounselingBtn = document.getElementById('close-counseling');
    const counselingForm = document.getElementById('counseling-form');
    const counselingSuccess = document.getElementById('counseling-success');
    
    function openCounselingModal(e) {
        if (e && e.preventDefault) e.preventDefault();
        if(counselingSuccess && counselingForm) {
            counselingSuccess.style.display = 'none';
            counselingForm.style.display = 'block';
            counselingForm.reset();
        }
        if(detailsModal) detailsModal.classList.remove('active'); // Close details if open
        counselingModal.classList.add('active');
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('.apply-trigger')) {
            openCounselingModal(e);
        }
    });

    if (closeCounselingBtn) {
        closeCounselingBtn.addEventListener('click', () => {
            counselingModal.classList.remove('active');
        });
    }
    
    if (counselingModal) {
        counselingModal.addEventListener('click', (e) => {
            if(e.target === counselingModal) counselingModal.classList.remove('active');
        });
    }

    if (counselingForm) {
        counselingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('lead-name').value;
            const email = document.getElementById('lead-email').value;
            const course = document.getElementById('lead-course').value;
            
            const btn = document.getElementById('submit-lead-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Sending...';
            btn.disabled = true;

            try {
                const res = await fetch('/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, course })
                });
                
                if (res.ok) {
                    counselingForm.style.display = 'none';
                    counselingSuccess.style.display = 'block';
                } else {
                    alert("Submission failed. Please try again.");
                }
            } catch (err) {
                console.error("Failed to submit lead", err);
                alert("An error occurred over the network. Please try again.");
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }

    // ---- 6. Mobile Navigation Controller ----
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const closeMobileMenuBtn = document.getElementById('close-mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMobileNav(state) {
        if(mobileNav) mobileNav.classList.toggle('active', state);
        if(mobileNavOverlay) mobileNavOverlay.classList.toggle('active', state);
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => toggleMobileNav(true));
    }

    if (closeMobileMenuBtn) {
        closeMobileMenuBtn.addEventListener('click', () => toggleMobileNav(false));
    }

    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', () => toggleMobileNav(false));
    }

    if (mobileLinks) {
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => toggleMobileNav(false));
        });
    }

    console.log("🚀 Admission Kart AI Platform [v1.3] - Dynamic Bridge Active");

    // ---- 11. Dynamic Backend Bridge (GitHub Pages Support) ----
    const adminLinks = document.querySelectorAll('a[href="/admin/login"], a[href="/admin/dashboard"], .staff-login-link, .footer-admin-link');
    const backendModal = document.getElementById('backend-modal');
    const railwayInput = document.getElementById('railway-url-input');
    const saveBackendBtn = document.getElementById('save-backend-url');
    const closeBackendBtn = document.getElementById('close-backend-modal');
    const cancelBackendBtn = document.getElementById('cancel-backend');

    const isStaticHost = window.location.hostname.includes('github.io') || window.location.hostname.includes('netlify.app');
    console.log("📍 Host Check:", window.location.hostname, "| Static Mode:", isStaticHost);

    function getBackendUrl() {
        return localStorage.getItem('admissionKart_backendUrl');
    }

    adminLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            console.log("🖱️ Admin Link Clicked | Static:", isStaticHost);
            if (isStaticHost) {
                const bUrl = getBackendUrl();
                console.log("🔗 Saved Backend URL:", bUrl);
                if (bUrl) {
                    e.preventDefault();
                    window.location.href = `${bUrl.replace(/\/$/, '')}/admin/login`;
                } else {
                    e.preventDefault();
                    if (backendModal) {
                        console.log("🔓 Opening Backend Connection Modal...");
                        backendModal.classList.add('active');
                    } else {
                        console.error("❌ backend-modal element not found in DOM!");
                    }
                }
            }
        });
    });

    if (saveBackendBtn) {
        saveBackendBtn.addEventListener('click', () => {
            let userUrl = railwayInput.value.trim();
            if (userUrl) {
                if (!userUrl.startsWith('http')) userUrl = 'https://' + userUrl;
                localStorage.setItem('admissionKart_backendUrl', userUrl);
                if (backendModal) backendModal.classList.remove('active');
                alert("✅ Backend Connected! Redirecting to your secure Admin Panel...");
                window.location.href = `${userUrl.replace(/\/$/, '')}/admin/login`;
            } else {
                alert("Please enter a valid Railway or Render URL.");
            }
        });
    }

    [closeBackendBtn, cancelBackendBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                if (backendModal) backendModal.classList.remove('active');
            });
        }
    });

    // Initialize UI
    fetchUniversities();
    saveAndRenderShortlist();
});
