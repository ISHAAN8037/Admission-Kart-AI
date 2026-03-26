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
        { id: "u1", name: "Technical University of Munich", location: "Germany", image: "https://picsum.photos/seed/u1/800/600", value_score: 95, tags: "engineering europe germany", scholarships: "DAAD" },
        { id: "u2", name: "MIT Manipal", location: "India", image: "https://picsum.photos/seed/u2/800/600", value_score: 82, tags: "engineering india technology" },
        { id: "u3", name: "University of Toronto", location: "Canada", image: "https://picsum.photos/seed/u3/800/600", value_score: 88, tags: "canada research global" },
        { id: "u6", name: "Harvard University", location: "USA", image: "https://picsum.photos/seed/u6/800/600", value_score: 91, tags: "usa ivy league prestigious" },
        { id: "u11", name: "IIT Bombay", location: "India", image: "https://picsum.photos/seed/u11/800/600", value_score: 98, tags: "engineering india mumbai top" }
    ];

    async function fetchUniversities() {
        try {
            const res = await fetch('https://shy-vans-press.loca.lt/api/universities');
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
                const res = await fetch('https://shy-vans-press.loca.lt/api/search', {
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
        msgDiv.innerHTML = `<p>${text}</p>`;

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
            const res = await fetch('https://shy-vans-press.loca.lt/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await res.json();
            
            document.getElementById(typingId)?.remove();
            appendMessage(data.reply, false, data.recommendations);
        } catch (e) {
            console.error(e);
            document.getElementById(typingId)?.remove();
            appendMessage("Sorry, I experienced a network error.", false);
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
                }
            } catch (err) {
                console.error("Failed to fetch roadmap:", err);
                btnGenerateRoadmap.innerHTML = 'Error Generating Roadmap';
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
                const res = await fetch('https://shy-vans-press.loca.lt/api/leads', {
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
