document.addEventListener('DOMContentLoaded', () => {
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
            image: "static/images/tum_munich.png", 
            value_score: 95, 
            tags: "engineering europe germany", 
            tuition: "0 - 1,500",
            description: "TUM is a leading research university in Europe, known for its excellence in engineering, natural sciences, and technology. It maintains a strong ROI due to Germany's low-to-zero tuition model.",
            scholarships: "DAAD Global Excellence Scholarship, Deutschlandstipendium."
        },
        { 
            id: "u2", 
            name: "Stanford University", 
            location: "USA", 
            image: "static/images/stanford_university.png", 
            value_score: 98, 
            tags: "usa ivy elite technology", 
            tuition: "57,000",
            description: "Situated in the heart of Silicon Valley, Stanford is the ultimate driver of global startup culture. It offers elite programs spanning CS, Business, and Law with a laid-back, beautiful Californian aesthetic.",
            scholarships: "Knight-Hennessy Scholars, Stanford Financial Aid (Need-Based)."
        },
        { 
            id: "u3", 
            name: "University of Toronto", 
            location: "Canada", 
            image: "static/images/toronto_university.png", 
            value_score: 88, 
            tags: "canada research global", 
            tuition: "45,000",
            description: "Canada's #1 research university, UofT offers a diverse academic environment and is consistently ranked among the world's best for graduate employability.",
            scholarships: "Lester B. Pearson International Scholarship, Ontario Graduate Scholarship."
        },
        { 
            id: "u4", 
            name: "Imperial College London", 
            location: "UK", 
            image: "static/images/imperial_college.png", 
            value_score: 92, 
            tags: "uk engineering science prestigious", 
            tuition: "52,000",
            description: "Imperial College London is a world-class university with a mission to benefit society through excellence in science, engineering, medicine, and business.",
            scholarships: "Presidents Undergraduate Scholarship, Imperial Bursary."
        },
        { 
            id: "u6", 
            name: "Harvard University", 
            location: "USA", 
            image: "static/images/harvard_university.png", 
            value_score: 91, 
            tags: "usa ivy prestigious", 
            tuition: "58,000",
            description: "As the oldest institution of higher learning in the United States, Harvard is synonymous with prestige, academic rigor, and a powerful global alumni network.",
            scholarships: "Harvard University Financial Aid (100% Need-Blind for International)."
        },
        { 
            id: "u11", 
            name: "IIT Bombay", 
            location: "India", 
            image: "static/images/iit_bombay.png", 
            value_score: 98, 
            tags: "engineering india mumbai top", 
            tuition: "2,500",
            description: "Indian Institute of Technology Bombay is the premier institution for engineering in India, attracting the highest rankers in the JEE Advanced every year.",
            scholarships: "MHRD Merit Scholarships, IIT Bombay Alumni Association Awards."
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
        
        dataToRender.forEach(uni => {
            const isShortlisted = shortlist.some(item => item.id === uni.id);
            const btnClass = isShortlisted ? 'add-shortlist added' : 'add-shortlist';
            const btnText = isShortlisted ? '<i class="ph-fill ph-check-circle"></i> Saved' : '<i class="ph ph-bookmark-simple"></i> Save to List';
            
            const roiBadgeHtml = uni.value_score 
                ? `<span class="badge tooltip-anim" style="background:var(--accent-gold); color:#1a1f36; position:absolute; top:15px; left:15px; z-index:10;"><i class="ph-fill ph-lightning"></i> AI ROI Score: ${uni.value_score}</span>`
                : '';

            const html = `
                <div class="uni-card">
                    <div style="position:relative;">
                        ${roiBadgeHtml}
                        <img src="${uni.image}" alt="${uni.name}" class="uni-img">
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
            if (data.reply.includes("optimizing my Strategic Alignment")) {
                console.log("Backend in fallback mode. Triggering Satellite Architect...");
                runAiSimulation(text);
            } else {
                appendMessage(data.reply, false, data.recommendations);
            }
        } catch (e) {
            console.error("AI Bridge Failure:", e);
            document.getElementById(typingId)?.remove();
            console.log("Switching to Satellite Architect (Simulation Mode)...");
            runAiSimulation(text);
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
        const promptText = text.toLowerCase();
        let recommendations = [];
        
        // 1. LEGAL MODULE (Law, JD, LLB)
        if (promptText.includes("law") || promptText.includes("llb") || promptText.includes("jd") || promptText.includes("legal")) {
            reply = `### ⚖️ LEGAL STRATEGY AUDIT\n\nYour focus on **Legal Studies** is a high-stakes investment. As your Lead Strategic Advisor, my goal is to secure a top-tier placement while maximizing your ROI. \n\n**ROI Analysis:** Entry into Stanford or Harvard Law provides a lifetime social capital multiplier, but requires an elite LSAT/LNAT benchmark.\n\n| Metric | Benchmark | Expert Verdict |\n| :--- | :--- | :--- |\n| Academic LNAT | 27+ | **Critical** |\n| Jurisprudence Fit | High | **Required** |\n| Annual ROI | 15% | **Exceptional** |\n\n**30-Day Plan:**\n1. Register for the LSAT/LNAT immediately to secure your preferred window.\n2. Draft your "Statement of Purpose" focusing on one specific legal case that defines your ambition.\n\n**Next Strategic Move:** Research the "Socratic Method" used in North American law schools to align your SOP narrative.`;
            recommendations = mockUniversities.filter(u => u.name.includes("Stanford") || u.name.includes("Harvard"));
        } 
        // 2. MEDICAL MODULE (Medicine, MBBS, MD)
        else if (promptText.includes("medicine") || promptText.includes("mbbs") || promptText.includes("md") || promptText.includes("doctor") || promptText.includes("healthcare")) {
            reply = `### 🏥 CLINICAL ADMISSION AUDIT\n\n**Medical Admissions** require surgical precision in your academic profile. As your Lead Strategic Advisor, I evaluate your path based on clinical exposure and residency ROI.\n\n**ROI Analysis:** European medical degrees (like in the UK or Germany) offer significantly higher ROI due to subsidized tuition compared to private US tiers.\n\n| Metric | Benchmark | Expert Verdict |\n| :--- | :--- | :--- |\n| MCAT/UKCAT | 515+/2800+ | **Target** |\n| Clinical Hours | 50+ | **Competitive** |\n| Tuition-to-Salary ROI | High | **Optimal** |\n\n**30-Day Plan:**\n1. Secure a hospital shadowing slot for at least 10 hours per week.\n2. For Germany, begin your Goethe Zertifikat B1/B2 preparation to unlock zero-tuition slots.\n\n**Next Strategic Move:** Mention the **DAAD Global Excellence Scholarship** if targeting Germany to offset all living costs.`;
            recommendations = mockUniversities.filter(u => u.name.includes("Imperial"));
        }
        // 3. STEM MODULE (Engineering, CS, Tech)
        else if (promptText.includes("engineering") || promptText.includes("tech") || promptText.includes("cs") || promptText.includes("computer") || promptText.includes("btech") || promptText.includes("mtech") || promptText.includes("science")) {
            reply = `### 💻 STEM & TECHNOLOGY ROI AUDIT\n\nYour focus on **STEM** aligns with high-growth global sectors. My role as your Lead Strategic Advisor is to identify the most cost-effective path to a world-class degree.\n\n**ROI Analysis:** **TUM (Germany)** is the highest ROI engineering school in our database due to its near-zero tuition and global prestige.\n\n| Metric | Benchmark | Expert Verdict |\n| :--- | :--- | :--- |\n| GPA (Technical) | 3.8+ | **Strong** |\n| Quantitative SAT/GRE | 780+/165+ | **Competitive** |\n| Local Job Market ROI | Peak | **Target** |\n\n**30-Day Plan:**\n1. Quantify every technical project in your portfolio using "Impact Metrics".\n2. If applying to Canada, check the **Lester B. Pearson International Scholarship** deadlines immediately.\n\n**Next Strategic Move:** Focus on "Full-Stack" versatility in your projects to appeal to global recruiters.`;
            recommendations = mockUniversities.filter(u => u.tags.includes("engineering") || u.tags.includes("technology"));
        }
        // 4. EXECUTIVE MODULE (MBA, Business)
        else if (promptText.includes("mba") || promptText.includes("business") || promptText.includes("management") || promptText.includes("finance") || promptText.includes("economics")) {
            reply = `### 💼 EXECUTIVE LEADERSHIP AUDIT\n\nAn **MBA/Business degree** is an investment in social capital. As your Lead Strategic Advisor, I prioritize "Career Acceleration" over simple degree acquisition.\n\n**ROI Analysis:** Top-tier programs (M7) command high tuition but offer a 10-year ROI that far exceeds generic management degrees.\n\n| Metric | Benchmark | Expert Verdict |\n| :--- | :--- | :--- |\n| Work Exp | 3-5 Years | **Target** |\n| GMAT / GRE | 710+ / 325+ | **Strong** |\n| Networking ROI | Elite | **Critical** |\n\n**30-Day Plan:**\n1. Update your LinkedIn profile to reflect "Strategic Leadership" rather than just "Operations".\n2. If targeting the USA, research "Fulbright" or "Knight-Hennessy" funding to save ~\$100k.\n\n**Next Strategic Move:** Define your "Post-MBA Pivot" immediately to focus your SOP on tangible ROI goals.`;
            recommendations = mockUniversities.filter(u => u.description.includes("Business") || u.name.includes("Harvard"));
        }
        // 5. SCHOLARSHIP & FUNDING MODULE
        else if (promptText.includes("scholarship") || promptText.includes("funding") || promptText.includes("money") || promptText.includes("free") || promptText.includes("cost")) {
            reply = `### 💰 STRATEGIC FUNDING AUDIT\n\nMaximizing your **Scholarship Acquisition** is my primary financial goal for you. \n\n**ROI Analysis:** Fully-funded paths in Germany (DAAD) or Canada (Pearson) provide the absolute peak ROI in international education.\n\n| Region | Preferred Scholarship | Strategic Benefit |\n| :--- | :--- | :--- |\n| Germany | **DAAD Global Excellence** | Zero Tuition + Stipend |\n| Canada | **Lester B. Pearson** | Full-Ride Coverage |\n| USA | **Knight-Hennessy** | Ivy-Tier Excellence |\n\n**30-Day Plan:**\n1. Identify 5 scholarships with deadlines in the next 90 days. \n2. Draft your "Financial Need" essay if applying for need-based aid at Harvard or Stanford.\n\n**Next Strategic Move:** Check the 'Scholarships' section of each university card on this platform to sync with their deadlines.`;
            recommendations = mockUniversities.filter(u => u.scholarships && u.scholarships.length > 5).slice(0, 2);
        }
        // 6. PREDICTOR/MATCH SCORE SIMULATION
        else if (promptText.includes("match") || promptText.includes("score") || (promptText.includes("gpa") && (promptText.includes("sat") || promptText.includes("high")))) {
            const gpaMatch = promptText.match(/\d\.\d/) || ["3.8"];
            const satMatch = promptText.match(/\d{4}/) || ["1500"];
            const uni = promptText.includes("stanford") ? "Stanford University" : "your target institution";
            const gpaVal = parseFloat(gpaMatch[0]);
            
            let status = "Target";
            if (gpaVal < 3.5 && promptText.includes("stanford")) status = "Reach (Unlikely)";
            else if (gpaVal > 3.8) status = "Strong Target";

            reply = `### 🎯 LEAD STRATEGIC ALIGNMENT: ${uni.toUpperCase()}\n\nAs your Lead Strategic Advisor, my honest assessment of your alignment with ${uni} is as follows:\n\n| Metric | Input | Status / Honest Verdict |\n| :--- | :--- | :--- |\n| Academic GPA | ${gpaMatch[0]} | **${status}** |\n| Test Score | ${satMatch[0]} | **Competitive** |\n| Institutional Fit | High | **Target** |\n\n**30-Day Plan:**\n1. If this is a "Reach", begin identifying 3 "Safe" schools with 90% match scores.\n2. Focus 100% of your energy on an "Intellectual Spike" in your SOP.\n\n**Next Strategic Move:** If your GPA is < 3.5, I recommend the **Technical University of Munich** as a high-ROI, realistic alternative.`;
            recommendations = mockUniversities.filter(u => u.name.includes(uni) || u.value_score > 95).slice(0, 1);
        }
        // DEFAULT: GENERAL ARCHITECT MODE
        else {
            reply = `### 🏛️ LEAD STRATEGIC ADVISOR: STANDBY\n\nI have received your inquiry regarding **"${text}"**. \n\nAs the Lead Strategic Advisor, I am here to optimize your international path. To give you an honest ROI audit, please specify your **Major**, **GPA**, or **Target Country**.\n\n**Next Strategic Move:** Ask me about "**Scholarships in Germany**" or "**MBA Match Score at Stanford**" for a professional data audit.`;
            recommendations = [];
        }

        appendMessage(reply, false, recommendations);
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
        document.getElementById('modal-img').src = uni.image;
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

    // Initialize UI
    fetchUniversities();
    saveAndRenderShortlist();
});
