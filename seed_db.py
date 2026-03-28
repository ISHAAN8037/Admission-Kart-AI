from app import app
from models import db, UniversityModel

universities = [
    # ---- ORIGINAL 10 ----
    {
        "id": "u1",
        "name": "Technical University of Munich",
        "location": "Germany",
        "image": "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjEx.../giphy.gif",
        "tuition": 2000,
        "tags": "engineering europe germany technical cheap affordable",
        "description": "TUM is one of Europe's top universities, renowned for its excellent programs in engineering, technology, medicine, and the applied sciences. It boasts a thriving entrepreneurial ecosystem and strong industry ties, making it a hub for future innovators.",
        "scholarships": "• DAAD Scholarships: Fully funded for international students.\n• Deutschlandstipendium: €300/month merit-based support.\n• TUM International Support: Need-based grants."
    },
    {
        "id": "u2",
        "name": "MIT Manipal",
        "location": "India",
        "image": "https://media.giphy.com/media/l0HlIDZ02wX1dIu8U/giphy.gif",
        "tuition": 5000,
        "tags": "engineering india technology btech private",
        "description": "Manipal Institute of Technology (MIT) offers premier B.Tech programs spanning various disciplines. With state-of-the-art infrastructure and a legacy of producing top-tier engineers, MIT Manipal is highly sought after by domestic and international tech aspirants.",
        "scholarships": "• Freeship & Merit-cum-Means: For students securing high ranks in MET.\n• AICTE Tuition Fee Waiver: Financial aid for economically weaker sections.\n• Alumni Sponsored Scholarships."
    },
    {
        "id": "u3",
        "name": "University of Toronto",
        "location": "Canada",
        "image": "https://media.giphy.com/media/3o7TKPXvWdKym8p5K0/giphy.gif",
        "tuition": 45000,
        "tags": "canada toronto research global top medicine arts science",
        "description": "U of T is Canada's leading institution of learning, discovery, and knowledge creation. Located in one of the world's most diverse cities, it offers world-class programs in medicine, business, and arts.",
        "scholarships": "• Lester B. Pearson International Scholarship: Covers tuition, books, incidental fees, and full residence support.\n• University of Toronto Scholars Program: Merit-based automatic entry awards."
    },
    {
        "id": "u4",
        "name": "Imperial College London",
        "location": "UK",
        "image": "https://media.giphy.com/media/l0HlIDZ02wX1dIu8U/giphy.gif",
        "tuition": 50000,
        "tags": "uk london engineering science prestigious top medical",
        "description": "Imperial College London is a world-class public research university specializing exclusively in science, engineering, medicine, and business. It is consistently ranked among the top 10 universities globally.",
        "scholarships": "• President's Undergraduate Scholarships: Recognition of academic excellence.\n• Imperial Bursary: Sliding scale support for UK/EU students.\n• GREAT Scholarships: Target grants for international students from specific countries."
    },
    {
        "id": "u6",
        "name": "Harvard University",
        "location": "USA",
        "image": "https://media.giphy.com/media/3o7TKubA2G681f9yDe/giphy.gif",
        "tuition": 55000,
        "tags": "usa america ivy league top prestigious law business medicine arts",
        "description": "Established in 1636, Harvard offers unparalleled prestige and academic rigor across law, medicine, engineering, and the arts. Its alumni network includes numerous world leaders and Nobel laureates.",
        "scholarships": "• Need-Blind Admission: 100% of demonstrated financial need is met.\n• Elite Fellowships: Fully funded PhD and MS tracks across graduate levels."
    },
    {
        "id": "u7",
        "name": "ETH Zurich",
        "location": "Switzerland",
        "image": "https://media.giphy.com/media/l0HlIDZ02wX1dIu8U/giphy.gif",
        "tuition": 1500,
        "tags": "europe switzerland engineering science cheap affordable top",
        "description": "Consistently ranked as the top university in continental Europe, ETH Zurich is famous for its rigorous STEM programs and its most famous alumnus, Albert Einstein. Tuition is heavily subsidized by the Swiss state.",
        "scholarships": "• Excellence Scholarship & Opportunity Programme (ESOP): Covers full study and living costs for outstanding Master's students.\n• Master Scholarship Programme (MSP): Partial stipend payout."
    },
    {
        "id": "u9",
        "name": "University of Melbourne",
        "location": "Australia",
        "image": "https://media.giphy.com/media/l0HlIDZ02wX1dIu8U/giphy.gif",
        "tuition": 32000,
        "tags": "australia melbourne arts science research global",
        "description": "Australia's leading comprehensive research-intensive university. Located in the cultural heart of Melbourne, it pioneers the 'Melbourne Model', giving students a brilliant, globally aligned structural education.",
        "scholarships": "• Melbourne International Undergraduate Scholarship: Significant fee remissions based on merit.\n• Graduate Research Scholarships: Comprehensive living allowance and fee offset."
    },
    {
        "id": "u10",
        "name": "Sorbonne University",
        "location": "France",
        "image": "https://picsum.photos/seed/u10/800/600",
        "tuition": 3000,
        "tags": "europe france paris arts humanities cheap science",
        "description": "A world-class research university in the heart of Paris, Sorbonne University combines humanities, science, and medicine. It is highly sought by international students seeking rich culture and prestigious academics.",
        "scholarships": "• Eiffel Excellence Scholarship: French Ministry grants for high-achieving international postgraduates.\n• Sorbonne Regional Excellence Foundation Grants."
    },

    # ---- 15 NEW FAMOUS COLLEGES ----
    {
        "id": "u11",
        "name": "Indian Institute of Technology (IIT) Bombay",
        "location": "India",
        "image": "https://picsum.photos/seed/u11/800/600",
        "tuition": 3000,
        "tags": "engineering india mumbai technology top best btech public",
        "description": "Consistently recognized as India's top engineering institution, IIT Bombay is the ultimate destination for B.Tech aspirants. Located in the heart of Powai, Mumbai, it boasts illustrious alumni driving Silicon Valley's innovation.",
        "scholarships": "• Merit-cum-Means (MCM): Covers full tuition + monthly stipend.\n• Institute Free Messing Facility: For SC/ST category students.\n• Named Scholarships: Alumni funded grants targeted at high performers."
    },
    {
        "id": "u12",
        "name": "Indian Institute of Technology (IIT) Delhi",
        "location": "India",
        "image": "https://picsum.photos/seed/u12/800/600",
        "tuition": 3000,
        "tags": "engineering india delhi top best btech public research",
        "description": "Located in the national capital, IIT Delhi excels in advanced technical research and massive campus infrastructure, producing some of the sharpest analytical minds in global tech and finance.",
        "scholarships": "• MCM Scholarships for 25% of undergraduate students.\n• Alumni Association Grants.\n• Reliance Foundation Undergraduate Scholarships."
    },
    {
        "id": "u13",
        "name": "Indian Institute of Management (IIM) Ahmedabad",
        "location": "India",
        "image": "https://picsum.photos/seed/u13/800/600",
        "tuition": 35000,
        "tags": "india mba business management top elite ahmedabad postgrad",
        "description": "IIMA is India's most prestigious business school. Known for its rigorous case-study method and phenomenal global placements, it remains the pinnacle of management education in Asia.",
        "scholarships": "• IIMA Special Need-Based Scholarships.\n• Aditya Birla Group Scholarships.\n• OP Jindal Engineering & Management Scholarships."
    },
    {
        "id": "u14",
        "name": "BITS Pilani",
        "location": "India",
        "image": "https://picsum.photos/seed/u14/800/600",
        "tuition": 7000,
        "tags": "india engineering technology private top best btech pilani",
        "description": "Birla Institute of Technology and Science (BITS) Pilani is India's most reputed private tech institution. It pioneered the dual-degree system and operates with 0% attendance requirement, fostering massive startup culture.",
        "scholarships": "• Institute Merit Awards.\n• Merit-cum-Need Scholarships (up to 80% tuition waiver).\n• Inspire Fellowships for Science programs."
    },
    {
        "id": "u15",
        "name": "Vellore Institute of Technology (VIT)",
        "location": "India",
        "image": "https://picsum.photos/seed/u15/800/600",
        "tuition": 4500,
        "tags": "india engineering technology private btech vellore popular",
        "description": "VIT is one of the most highly sought-after private universities in India. Known for its culturally diverse campus and magnificent infrastructure, its computer science placements rival many elite state schools.",
        "scholarships": "• VITEEE Scholarship (STARS): Massive waivers for top rankers.\n• Sports Scholarships.\n• Chancellor's Fellowships."
    },
    {
        "id": "u16",
        "name": "Delhi University (DU)",
        "location": "India",
        "image": "https://picsum.photos/seed/u16/800/600",
        "tuition": 200,
        "tags": "india cheap public arts commerce science new delhi central",
        "description": "As one of India's largest central universities, DU comprises legendary colleges like SRCC, St. Stephen's, and Hindu College. It is the gold standard for humanities, science, and commerce degrees in India.",
        "scholarships": "• Vice Chancellor's Student Fund.\n• Delhi University Women Association Grants.\n• State Government Merit Fellowships."
    },
    {
        "id": "u17",
        "name": "University of Oxford",
        "location": "UK",
        "image": "https://picsum.photos/seed/u17/800/600",
        "tuition": 45000,
        "tags": "uk europe elite top best humanities science law medicine",
        "description": "The oldest university in the English-speaking world, Oxford stands as the pinnacle of global academic prestige. Its unique collegiate system and tutorial-based learning produce unrivaled global thinkers.",
        "scholarships": "• Rhodes Scholarships: Legendary fully-funded global award.\n• Clarendon Fund: Massive postgraduate grants.\n• Reach Oxford Scholarships for developing nations."
    },
    {
        "id": "u18",
        "name": "University of Cambridge",
        "location": "UK",
        "image": "https://picsum.photos/seed/u18/800/600",
        "tuition": 48000,
        "tags": "uk europe elite top science maths engineering best",
        "description": "Rivaling Oxford in prestige, Cambridge is particularly legendary for its scientific breakthroughs and mathematical excellence, counting Newton and Darwin among its historical ranks.",
        "scholarships": "• Gates Cambridge Scholarships: Fully funded across all subjects.\n• Cambridge Trust Grants.\n• Trinity College Specific Bursaries."
    },
    {
        "id": "u19",
        "name": "Massachusetts Institute of Technology (MIT)",
        "location": "USA",
        "image": "https://picsum.photos/seed/u19/800/600",
        "tuition": 58000,
        "tags": "usa engineering technology science elite top best coding",
        "description": "MIT is universally recognized as the best technology and engineering school on Earth. Located in Cambridge, Massachusetts, its rigorous academics set the baseline for global STEM progress.",
        "scholarships": "• 100% Need-Blind Admissions for Global Students.\n• Substantial Undergraduate Financial Aid (averaging $50k+/yr for need).\n• Paid UROP (Undergraduate Research Opportunities)."
    },
    {
        "id": "u20",
        "name": "Stanford University",
        "location": "USA",
        "image": "https://media.giphy.com/media/l0HlIDZ02wX1dIu8U/giphy.gif",
        "tuition": 57000,
        "tags": "usa california elite business engineering top silicon valley",
        "description": "Situated in the heart of Silicon Valley, Stanford is the ultimate driver of global startup culture. It offers elite programs spanning CS, Business, and Law with a laid-back, beautiful Californian aesthetic.",
        "scholarships": "• Need-Blind Financial Aid.\n• Knight-Hennessy Scholars: Fully funded graduate fellowships.\n• Specific Athletic Scholarships."
    },
    {
        "id": "u21",
        "name": "Yale University",
        "location": "USA",
        "image": "https://media.giphy.com/media/l0HlIDZ02wX1dIu8U/giphy.gif",
        "tuition": 60000,
        "tags": "usa ivy league arts law humanities top elite",
        "description": "Yale is highly renowned for its incredible drama, humanities, and law programs. Its Gothic architecture and residential college system form one of the most culturally rich campus experiences globally.",
        "scholarships": "• Zero-Parent-Contribution for families earning below strict thresholds.\n• Comprehensive Yale Financial Aid Packages.\n• Yale World Fellows Program."
    },
    {
        "id": "u22",
        "name": "California Institute of Technology (Caltech)",
        "location": "USA",
        "image": "https://picsum.photos/seed/u22/800/600",
        "tuition": 56000,
        "tags": "usa california science engineering physics elite tiny",
        "description": "Caltech is a tiny, outrageously elite university in Pasadena running NASA's JPL. It admits a very small number of prodigious students focused almost entirely on pure science and engineering.",
        "scholarships": "• Generous Need-Based Aid.\n• SURF (Summer Undergraduate Research Fellowships).\n• Lingle Scholarships."
    },
    {
        "id": "u23",
        "name": "University of British Columbia (UBC)",
        "location": "Canada",
        "image": "https://picsum.photos/seed/u23/800/600",
        "tuition": 32000,
        "tags": "canada vancouver science arts beautiful research popular",
        "description": "Located on a breathtaking peninsula in Vancouver, UBC is a global center for research and teaching. It balances incredible outdoor living with elite academics and strong international diverse integration.",
        "scholarships": "• International Major Entrance Scholarships (IMES).\n• Outstanding International Student Award (OIS).\n• Vantage One Excellence Award."
    },
    {
        "id": "u24",
        "name": "University of Sydney",
        "location": "Australia",
        "image": "https://picsum.photos/seed/u24/800/600",
        "tuition": 34000,
        "tags": "australia sydney arts medicine law global popular",
        "description": "Australia's oldest university commands a majestic campus in the heart of Sydney. It is renowned for medicine, law, and arts, producing leaders who shape the Pacific infrastructure.",
        "scholarships": "• Vice-Chancellor's International Scholarships.\n• Sydney Scholars India Scholarship.\n• Faculty-specific Merit Grants."
    },
    {
        "id": "u25",
        "name": "Kyoto University",
        "location": "Japan",
        "image": "https://picsum.photos/seed/u25/800/600",
        "tuition": 5000,
        "tags": "japan asia science engineering cheap public research",
        "description": "The crown jewel of Japanese research and higher learning, Kyoto University holds the highest amount of Nobel laureates in Asia. It promises intense academic freedom within Japan's cultural capital.",
        "scholarships": "• MEXT Scholarships (Japanese Government full funding).\n• JASSO Student Exchange Support Programs.\n• Kyoto University International Education Grants."
    },
    
    # ---- 10 NON-STEM / SPECIALTY ELITE COLLEGES ----
    {
        "id": "u26",
        "name": "London School of Economics (LSE)",
        "location": "UK",
        "image": "https://picsum.photos/seed/u26/800/600",
        "tuition": 32000,
        "tags": "uk london economics finance politics law business elite",
        "description": "LSE is the global leader in social sciences, economics, and political science. Located deep in central London, its alumni network features unprecedented numbers of billionaires and heads of state.",
        "scholarships": "• LSE Undergraduate Support Scheme.\n• Uggla Family Scholars Programme.\n• Various Departmental Bursaries for master's programs."
    },
    {
        "id": "u27",
        "name": "The Juilliard School",
        "location": "USA",
        "image": "https://picsum.photos/seed/u27/800/600",
        "tuition": 53000,
        "tags": "usa new york arts music dance drama prestigious performing",
        "description": "The absolute pinnacle of performing arts education. Located in New York City's Lincoln Center, Juilliard admits only the world's most prodigious musical, theatrical, and dance talents.",
        "scholarships": "• Kovner Fellowships (Full ride + living expenses).\n• Robust Need-Based Aid distributed to 90% of students.\n• Artistic Merit Awards."
    },
    {
        "id": "u28",
        "name": "INSEAD",
        "location": "France",
        "image": "https://picsum.photos/seed/u28/800/600",
        "tuition": 100000,
        "tags": "france singapore mba business management elite postgrad consulting",
        "description": "Billed as 'The Business School for the World', INSEAD is famous for its intensive 10-month MBA program, splitting students across Fontainebleau and Singapore, heavily recruiting directly into MBB consultancies.",
        "scholarships": "• INSEAD Diversity Scholarships.\n• Alumni Fund Scholarships.\n• Spot Need-based Bursaries awarded upon admission."
    },
    {
        "id": "u29",
        "name": "National Law School of India University (NLSIU)",
        "location": "India",
        "image": "https://picsum.photos/seed/u29/800/600",
        "tuition": 4000,
        "tags": "india law bangalore clat elite best public",
        "description": "NLSIU, located in Bangalore, is India's most prestigious law school. Demanding incredibly high scores on the CLAT exam, it produces the nation's top corporate lawyers and legal scholars.",
        "scholarships": "• Need-based Fee Waivers covering up to 100%.\n• State Government Backward Classes and Minority Scholarships.\n• Alumni-Endowed Merit Grants."
    },
    {
        "id": "u30",
        "name": "Parsons School of Design",
        "location": "USA",
        "image": "https://picsum.photos/seed/u30/800/600",
        "tuition": 57000,
        "tags": "usa new york arts design fashion architecture elite creative",
        "description": "Located in Greenwich Village, Parsons is the premier destination for Fashion Design, Fine Arts, and Architecture. It acts as the backbone of the NYC fashion industry with phenomenal industry interconnectivity.",
        "scholarships": "• Merit Scholarships evaluated at admission.\n• BFA/BBA Departmental Fellowships.\n• Federal Student Aid & Need-based Grants."
    },
    {
        "id": "u31",
        "name": "Sciences Po",
        "location": "France",
        "image": "https://picsum.photos/seed/u31/800/600",
        "tuition": 15000,
        "tags": "france paris politics international relations law humanities",
        "description": "The French political and diplomatic powerhouse. Sciences Po is primarily focused on the social sciences, boasting incredible dual degrees with institutions like Columbia University.",
        "scholarships": "• Emile Boutmy Scholarship for non-EU international applicants.\n• Eiffel Scholarships (provided by French Ministry).\n• Mastercard Foundation Scholars Program."
    },
    {
        "id": "u32",
        "name": "National Institute of Design (NID)",
        "location": "India",
        "image": "https://picsum.photos/seed/u32/800/600",
        "tuition": 6000,
        "tags": "india design arts ahmedabad creative elite best public",
        "description": "NID Ahmedabad is internationally acclaimed as one of the foremost multi-disciplinary institutions in the field of design education and research in Asia.",
        "scholarships": "• Ford Foundation Endowed Scholarships.\n• Government of India Subsidies.\n• NID Student Aid Fund (Need-based)."
    },
    {
        "id": "u33",
        "name": "Culinary Institute of America (CIA)",
        "location": "USA",
        "image": "https://picsum.photos/seed/u33/800/600",
        "tuition": 40000,
        "tags": "usa new york culinary food hospitality elite chefs",
        "description": "Often called the 'Harvard of Culinary Arts,' the CIA in Hyde Park, NY provides unparalleled education for aspiring executive chefs and hospitality moguls.",
        "scholarships": "• CIA Global Scholar Award.\n• Alumni Referral Grants.\n• Need-based Institutional Grants."
    },
    {
        "id": "u34",
        "name": "Bocconi University",
        "location": "Italy",
        "image": "https://picsum.photos/seed/u34/800/600",
        "tuition": 16000,
        "tags": "italy milan europe business economics finance management",
        "description": "Based in Milan, Bocconi is continental Europe's strongest brand in Finance and Economics. It acts as a massive pipeline into investment banking and consulting powerhouses across London and the EU.",
        "scholarships": "• Bocconi International Award (50% tuition waiver).\n• Bocconi Merit Award (100% full tuition waiver).\n• ISU Bocconi Scholarship for low-income brackets."
    },
    {
        "id": "u35",
        "name": "Berklee College of Music",
        "location": "USA",
        "image": "https://picsum.photos/seed/u35/800/600",
        "tuition": 49000,
        "tags": "usa boston music arts production creative elite jazz",
        "description": "Berklee dominates the contemporary music and production industry. Specializing in jazz, contemporary music, and scoring, its alumni hold a staggering number of Grammy Awards.",
        "scholarships": "• Presidential Scholarship (Covers full tuition, housing, and laptop).\n• World Tour Scholarships (Audition-based).\n• Thrive Scholarship for continuing students."
    },

    # ---- BANGALORE, INDIA ----
    {
        "id": "u36",
        "name": "Indian Institute of Science (IISc)",
        "location": "India",
        "image": "https://picsum.photos/seed/u36/800/600",
        "tuition": 500,
        "tags": "india bangalore science research elite top best public phd",
        "description": "IISc is India's premier institution for advanced scientific and technological research. Located in Bangalore, it is world-renowned for its contributions to physics, aerospace, and biological sciences.",
        "scholarships": "• KVPY Fellowships.\n• Institute Scholarships for M.Tech and Ph.D. students.\n• Prime Minister's Research Fellowship (PMRF)."
    },
    {
        "id": "u37",
        "name": "Indian Institute of Management Bangalore (IIMB)",
        "location": "India",
        "image": "https://picsum.photos/seed/u37/800/600",
        "tuition": 32000,
        "tags": "india bangalore mba business management top elite postgrad",
        "description": "IIM Bangalore is a leading graduate school of management in Asia. Known for its innovative curriculum and strong focus on entrepreneurship, it is consistently ranked among the top business schools globally.",
        "scholarships": "• Aditya Birla Scholarship.\n• OPJEMS Scholarship.\n• IIMB Financial Aid for needy students."
    },
    {
        "id": "u38",
        "name": "RV College of Engineering (RVCE)",
        "location": "India",
        "image": "https://picsum.photos/seed/u38/800/600",
        "tuition": 4000,
        "tags": "india bangalore engineering technology private popular btech",
        "description": "RVCE is one of the most prestigious private engineering colleges in Bangalore. It is known for its strong placement records and focus on technical excellence across various engineering disciplines.",
        "scholarships": "• Government of Karnataka SC/ST Scholarships.\n• RVCE Merit Scholarships.\n• Corporate Sponsored Scholarships."
    },
    {
        "id": "u39",
        "name": "PES University",
        "location": "India",
        "image": "https://picsum.photos/seed/u39/800/600",
        "tuition": 5000,
        "tags": "india bangalore engineering technology private popular btech",
        "description": "PES University is a prominent private university in Bangalore, offering a wide range of programs in engineering, management, and medicine. It is highly regarded for its industry-aligned curriculum.",
        "scholarships": "• MRD Scholarships (Top 20% of students).\n• Research Assistantships.\n• Corporate Scholarships."
    },

    # ---- DELHI, INDIA ----
    {
        "id": "u40",
        "name": "Jawaharlal Nehru University (JNU)",
        "location": "India",
        "image": "https://picsum.photos/seed/u40/800/600",
        "tuition": 50,
        "tags": "india delhi arts social science research public cheap best",
        "description": "JNU is a world-renowned destination for social sciences, international relations, and humanities. Located in New Delhi, it is known for its vibrant intellectual culture and political activism.",
        "scholarships": "• Merit-cum-Means Scholarships.\n• Junior Research Fellowship (JRF).\n• International Student Grants."
    },
    {
        "id": "u41",
        "name": "Jamia Millia Islamia",
        "location": "India",
        "image": "https://picsum.photos/seed/u41/800/600",
        "tuition": 300,
        "tags": "india delhi central public architecture engineering law arts",
        "description": "Jamia Millia Islamia is a historic central university in New Delhi. It offers a diverse range of programs and is particularly known for its architecture, mass communication, and engineering faculties.",
        "scholarships": "• Jamia Merit Scholarships.\n• Minority Student Scholarships.\n• Dr. A.P.J. Abdul Kalam Scholarships."
    },
    {
        "id": "u42",
        "name": "Netaji Subhas University of Technology (NSUT)",
        "location": "India",
        "image": "https://picsum.photos/seed/u42/800/600",
        "tuition": 3500,
        "tags": "india delhi engineering technology public top btech",
        "description": "NSUT (formerly NSIT) is a premier engineering institution in Delhi. It is highly competitive and known for producing top-tier engineers who excel in global tech giants.",
        "scholarships": "• Merit-cum-Means Scholarships (Delhi Govt).\n• Post-Metric Scholarships.\n• AICTE Tuition Fee Waiver."
    },
    {
        "id": "u43",
        "name": "Delhi Technological University (DTU)",
        "location": "India",
        "image": "https://picsum.photos/seed/u43/800/600",
        "tuition": 3500,
        "tags": "india delhi engineering technology public top btech",
        "description": "DTU (formerly Delhi College of Engineering) is one of India's oldest and most respected technical universities. It has a massive campus and a legacy of excellence in research and innovation.",
        "scholarships": "• DTU Merit Scholarships.\n• Financial Assistance for Needy Students.\n• Reliance Foundation Scholarships."
    },

    # ---- INTERNATIONAL (GLOBAL) ----
    {
        "id": "u44",
        "name": "National University of Singapore (NUS)",
        "location": "Singapore",
        "image": "https://picsum.photos/seed/u44/800/600",
        "tuition": 30000,
        "tags": "singapore asia top global best engineering business science",
        "description": "NUS is consistently ranked as the top university in Asia. It offers a global approach to education and research, with a strong focus on innovation and entrepreneurship.",
        "scholarships": "• ASEAN Undergraduate Scholarship.\n• NUS Global Merit Scholarship.\n• Science & Technology Undergraduate Scholarship."
    },
    {
        "id": "u45",
        "name": "Tsinghua University",
        "location": "China",
        "image": "https://picsum.photos/seed/u45/800/600",
        "tuition": 5000,
        "tags": "china asia engineering technology science top global best",
        "description": "Tsinghua is widely regarded as 'China's MIT'. Located in Beijing, it is the leading institution for engineering and computer science in the country and a global powerhouse in research.",
        "scholarships": "• Chinese Government Scholarship.\n• Tsinghua University Freshman Scholarship.\n• Schwarzman Scholars Program."
    },
    {
        "id": "u46",
        "name": "Princeton University",
        "location": "USA",
        "image": "https://picsum.photos/seed/u46/800/600",
        "tuition": 58000,
        "tags": "usa ivy league top elite research science humanities",
        "description": "Princeton is world-renowned for its focus on undergraduate education and high-level research. It consistently ranks among the top universities in the USA and the world.",
        "scholarships": "• 100% Need-Blind Admission for all students.\n• Princeton Financial Aid covers full tuition for most families earning below $100k.\n• No-Loan Policy."
    },
    {
        "id": "u47",
        "name": "Columbia University",
        "location": "USA",
        "image": "https://picsum.photos/seed/u47/800/600",
        "tuition": 62000,
        "tags": "usa new york ivy league top elite journalism business law",
        "description": "Located in the heart of New York City, Columbia is famous for its 'Core Curriculum' and its elite programs in journalism, law, and business.",
        "scholarships": "• Need-Blind Admission for domestic students (Need-aware for international).\n• Full-need met for all admitted students.\n• Kluge Scholars Program."
    },
    {
        "id": "u48",
        "name": "University of Chicago",
        "location": "USA",
        "image": "https://picsum.photos/seed/u48/800/600",
        "tuition": 60000,
        "tags": "usa chicago elite economics social science law research",
        "description": "The University of Chicago is legendary for its focus on rigorous inquiry and its influential schools of thought in economics and sociology.",
        "scholarships": "• Odyssey Scholarship Program for lower-income students.\n• Merit Scholarships evaluated at admission.\n• Neubauer Family Adelante Programs."
    },
    {
        "id": "u49",
        "name": "University of Tokyo",
        "location": "Japan",
        "image": "https://picsum.photos/seed/u49/800/600",
        "tuition": 5000,
        "tags": "japan asia top public research engineering science",
        "description": "The 'University of Tokyo' (Todai) is Japan's most prestigious university. It is a research powerhouse with a long history of educating the nation's leaders.",
        "scholarships": "• MEXT Scholarship.\n• University of Tokyo Fellowship for international graduate students.\n• JASSO Scholarships."
    },
    {
        "id": "u50",
        "name": "McGill University",
        "location": "Canada",
        "image": "https://picsum.photos/seed/u50/800/600",
        "tuition": 25000,
        "tags": "canada montreal research medicine law science top best",
        "description": "McGill is one of Canada's most international universities, located in the vibrant city of Montreal. It is especially famous for its medical school and research output.",
        "scholarships": "• McGill Entrance Bursaries.\n• Prestige Scholarships.\n• McCall MacBain Scholarships for postgraduates."
    }
]

def seed():
    with app.app_context():
        db.create_all()
        
        # Clear existing to prevent duplicates
        UniversityModel.query.delete()
        
        for u_data in universities:
            u = UniversityModel(**u_data)
            db.session.add(u)
            
        db.session.commit()
        print(f"Database seeded successfully with {len(universities)} globally renowned universities!")

if __name__ == '__main__':
    seed()
