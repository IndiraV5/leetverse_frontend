import React, { useState, useEffect } from 'react';
import { Users, Crown, Star, Instagram, Linkedin, Github, Loader2, AlertCircle, GraduationCap, Palette, Megaphone, Film, Code, X } from 'lucide-react';
import { getMembers } from '../services/api';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

const DOMAINS = [
    { id: 'web-dev', name: 'WEB DEV', icon: Code },
    { id: 'mentoring', name: 'MENTORING', icon: GraduationCap },
    { id: 'marketing-pr', name: 'MARKETING & PR', icon: Megaphone },
    { id: 'design', name: 'DESIGN', icon: Palette },
    { id: 'video-editing', name: 'VIDEO EDITING', icon: Film }
];

const MemberCard = ({ person, index }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    // Subtle image movement for depth
    const imgX = useTransform(mouseXSpring, [-0.5, 0.5], ["-5px", "5px"]);
    const imgY = useTransform(mouseYSpring, [-0.5, 0.5], ["-5px", "5px"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);

        e.currentTarget.style.setProperty('--mouse-x', `${(mouseX / width) * 100}%`);
        e.currentTarget.style.setProperty('--mouse-y', `${(mouseY / height) * 100}%`);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-accent/30 transition-all group/card flex flex-col items-center text-center relative overflow-hidden"
        >
            <motion.div
                style={{
                    x: imgX,
                    y: imgY,
                    transformZ: "50px"
                }}
                className="w-28 h-28 rounded-full overflow-hidden border-2 border-accent/20 group-hover/card:border-accent transition-all mb-6 relative z-10"
            >
                {/* Image with Google Drive direct link handling */}
                {(() => {
                    const placeholderUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=placeholder";
                    const getDirectImageUrl = (url) => {
                        if (!url) return "";
                        const driveRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/;
                        const match = url.match(driveRegex);
                        if (match && match[1]) {
                            return `https://drive.google.com/uc?export=download&id=${match[1]}`;
                        }
                        return url;
                    };
                    const photoSrc = person.photoUrl ? getDirectImageUrl(person.photoUrl) : placeholderUrl;
                    return (
                        <img
                            src={photoSrc}
                            alt={person.name}
                            className="w-full h-full object-cover transition-all duration-500"
                        />
                    );
                })()}
            </motion.div>

            <motion.h4
                style={{ transformZ: "30px" }}
                className="text-xl font-display font-bold text-white mb-2 tracking-tight z-10"
            >
                {person.name}
            </motion.h4>

            <motion.div
                style={{ transformZ: "20px" }}
                className="flex items-center gap-4 mt-4 z-10"
            >
                {person.instagram && (
                    <a href={person.instagram} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-accent transition-colors">
                        <Instagram size={18} />
                    </a>
                )}
                {person.linkedin && (
                    <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-accent transition-colors">
                        <Linkedin size={18} />
                    </a>
                )}
                {person.github && (
                    <a href={person.github} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-accent transition-colors">
                        <Github size={18} />
                    </a>
                )}
            </motion.div>

            {/* Background Glow that follows mouse */}
            <motion.div
                className="absolute inset-0 bg-accent/5 opacity-0 group-hover/card:opacity-100 transition-opacity"
                style={{
                    background: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0, 255, 157, 0.1) 0%, transparent 80%)`,
                }}
            />
        </motion.div>
    );
};

const FALLBACK_MEMBERS_DATA = {
  "Design": [
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706847/file_00000000a5ac7207a9162319887c8652_-_SOUMYA_MOHAPATRA_1287_azwhl9.png",
      "linkedin": "https://www.linkedin.com/in/soumya-ranjan-mohapatra-856492322?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      "position": "Lead",
      "instagram": "https://www.instagram.com/soumya_mohapatra1704?igsh=cm50YzljNnlkYXpy",
      "name": "SOUMYA RANJAN MOHAPATRA",
      "github": "",
      "rollNo": "24051287",
      "id": "24051287"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706847/PHOTO_-_Swagat_Prusty_mr0jk8.jpg",
      "linkedin": "https://www.linkedin.com/in/swagat-prusty-3ba565314/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BSS1yTAtuRR6w3LJ3tc562Q%3D%3D",
      "position": "Lead",
      "instagram": "https://www.instagram.com/_.swag._.at?igsh=MWR2c21leW44eHN5cg==",
      "name": "SWAGAT PRUSTY",
      "github": "https://github.com/Swagat770?tab=overview&from=2026-05-01&to=2026-05-24",
      "rollNo": "2405770",
      "id": "2405770"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706844/profile_photo_-_5078_Aindrila_Mustafi_arcpza.jpg",
      "linkedin": "https://www.linkedin.com/in/aindrila-mustafi-0aba13394/",
      "position": "Member",
      "instagram": "https://www.instagram.com/itz_aindrilaaa._?igsh=am00MHdiMDN3aGJv",
      "name": "AINDRILA MUSTAFI",
      "github": "https://github.com/aindrilamustafi-coder",
      "rollNo": "24155078",
      "id": "24155078"
    }
  ],
  "Marketing and PR": [
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706849/IMG-20260117-WA0058_-_1617_AYUSHI_PODDAR_uo8aug.jpg",
      "linkedin": "https://www.linkedin.com/in/ayushi-poddar-091487379?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      "position": "Member",
      "instagram": "https://www.instagram.com/ayushiiiii_1612?igsh=MTZ2a3BueTE5M3E1cw==",
      "rollNo": "24051617",
      "github": "https://share.google/M6vzGyE8BDn1uHdb6",
      "name": "AYUSHI PODDAR",
      "id": "24051617"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706852/me_-_ANWESHA_BOSE_k1pzjx.jpg",
      "linkedin": "https://www.linkedin.com/in/anweshabose-?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      "position": "Lead",
      "instagram": "https://www.instagram.com/anweshabose_?igsh=NXZzdmNoeGx3eGdh",
      "rollNo": "24051913",
      "github": "https://github.com/anwesha-bose",
      "name": "ANWESHA BOSE",
      "id": "24051913"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706845/IMG_20260415_182642499_-_2136_ANWESHA_SARKAR_plrq7m.jpg",
      "linkedin": "https://www.linkedin.com/in/anwesha-sarkar-b936a7326?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      "position": "Member",
      "instagram": "https://www.instagram.com/_._aanweshaa_._?igsh=MXdlNGJ3YXRxM3ZpaA==",
      "rollNo": "24052136",
      "github": "",
      "name": "ANWESHA SARKAR",
      "id": "24052136"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706846/IMG_20250921_200036_-_5176_Hitarth_Jain_zr1bmw.jpg",
      "linkedin": "https://www.linkedin.com/in/hitarth-jain-a23737316?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      "position": "Member",
      "instagram": "https://www.instagram.com/_.hithx4508._?igsh=d2NkczdhcTQ4bzBy",
      "name": "HITARTH JAIN",
      "github": "",
      "rollNo": "24155176",
      "id": "24155176"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706860/IMG_20260304_080655_972_-_RUDRA_PRATAP_SAHOO_acmxrt.webp",
      "linkedin": "https://www.linkedin.com/in/rudra-pratap-sahoo-aba483291?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      "position": "Member",
      "instagram": "https://www.instagram.com/rudrapratapsahoo_?igsh=MWd5Zm5nbXY5cDNwYw==",
      "name": "RUDRA PRATAP SAHOO",
      "github": "https://github.com/Rudrapratapsahoo",
      "rollNo": "24155648",
      "id": "24155648"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706848/IMG_4137_-_0257_SHREYANSH_RAY_s5vdqo.jpg",
      "linkedin": "https://www.linkedin.com/in/shreyansh-ray-ab17a82bb?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
      "position": "Lead",
      "instagram": "https://www.instagram.com/sreyansray",
      "rollNo": "2430257",
      "github": "",
      "name": "SHREYANSH RAY",
      "id": "2430257"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706853/IMG_20260222_151843273_HDR_-_1116_SIDDHARTH_KESHRI_mx6vqy.jpg",
      "linkedin": "https://www.linkedin.com/in/siddharth-keshri-19b812346?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      "position": "Member",
      "instagram": "https://www.instagram.com/siddharth._.keshri_?igsh=Y2duZXhxMDB5Mmh1",
      "rollNo": "25051116",
      "github": "",
      "name": "SIDDHARTH KESHRI",
      "id": "25051116"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779707149/Screenshot_2026-05-25_163533_ym5pjs.png",
      "linkedin": "https://www.linkedin.com/in/ayantika-mukhopadhyay-688061411?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      "position": "Member",
      "instagram": "https://www.instagram.com/ayantikasona_?igsh=MXJ5Y3cyeDk5bXJzeQ==",
      "name": "AYANTIKA MUKHOPADHYAY",
      "github": "",
      "rollNo": "2505867",
      "id": "2505867"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706851/B612_20250720_200145_975_-_ANINDITA_MUKHOPADHYAY_oc1sll.jpg",
      "linkedin": "https://www.linkedin.com/in/anindita-mukhopadhyay-42711b3a5?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      "position": "Member",
      "instagram": "https://www.instagram.com/mukhopadhyay8942?igsh=anJjcmdnajduajJw",
      "rollNo": "2505930",
      "github": "",
      "name": "ANINDITA MUKHOPADHYAY",
      "id": "2505930"
    }
  ],
  "Mentoring": [
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706844/20250727_234219_-_Anshu_Kumar_pevo0k.jpg",
      "linkedin": "https://www.linkedin.com/in/anshukr404/",
      "position": "Ass. Lead",
      "instagram": "https://www.instagram.com/anshuuu_k07",
      "rollNo": "24051085",
      "github": "https://github.com/anshucodes404",
      "name": "ANSHU KUMAR",
      "id": "24051085"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1773073969/SAMRIDDHI_KAPOOR_-_SAMRIDDHI_KAPOOR_xgdqgg.jpg",
      "linkedin": "https://www.linkedin.com/in/samriddhi-kapoor-69b5a0300/",
      "position": "Ass. Lead",
      "instagram": "",
      "rollNo": "24051733",
      "github": "https://github.com/samriddhiiii-i",
      "name": "SAMRIDDHI KAPOOR",
      "id": "24051733"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706854/20260123_151207_2_1_-_0554_ADARSH_SRIVASTAVA_bd0nva.jpg",
      "linkedin": "https://www.linkedin.com/in/adarsh-srivastava-08947631a?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      "position": "Member",
      "instagram": "https://www.instagram.com/adarshh.23_?igsh=MWpmbGxkYmtvaDM2dg==",
      "rollNo": "2405554",
      "github": "https://github.com/IconicN1nja",
      "name": "ADARSH SRIVASTAVA",
      "id": "2405554"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706853/Rishi_image_-_5600_Rishikesh_Kumar_fhbinm.png",
      "linkedin": "",
      "position": "Member",
      "instagram": "https://www.instagram.com/rishikesh_2298?igsh=N3p1MGs3NGdiaWxp",
      "rollNo": "2405600",
      "github": "https://github.com/Rishikesh2298",
      "name": "RISHIKESH KUMAR",
      "id": "2405600"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706844/IMG_20260306_204319880_HDR_2_-_5648_AVINANDAN_SIL_lwxgfi.jpg",
      "linkedin": "https://www.linkedin.com/in/avinandan-sil-108263326/",
      "position": "Member",
      "instagram": "https://www.instagram.com/__avinandan____?igsh=MTh3cWMxMWVwd2YyYg==",
      "rollNo": "2405648",
      "github": "https://github.com/silAvinandan",
      "name": "AVINANDAN SIL",
      "id": "2405648"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706844/IMG_20260525_122813_-_5321_BHIMARAJU_KOUNDINYA_y5d2eh.jpg",
      "linkedin": "https://in.linkedin.com/in/bhimaraju-koundinya-590246326",
      "position": "Member",
      "instagram": "",
      "rollNo": "24155321",
      "github": "https://github.com/BuildWithBheem",
      "name": "BHIMARAJU SAI KOUNDINYA",
      "id": "24155321"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706850/IMG-20260524-WA0003_1_-_5754_AROOSA_HODA_knainl.jpg",
      "linkedin": "https://www.linkedin.com/in/aroosa-hoda/",
      "position": "Member",
      "instagram": "https://www.instagram.com/aroosa.hoda?igsh=dGZocjBsbWpmczhw",
      "name": "AROOSA HODA",
      "github": "https://github.com/aroosahoda",
      "rollNo": "24155754",
      "id": "24155754"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706851/photo_-_5778_LOVELY_CHOURASIA_secur6.jpg",
      "linkedin": "",
      "position": "Lead",
      "instagram": "https://www.instagram.com/im_just_a_girl.09/",
      "rollNo": "24155778",
      "github": "https://github.com/chourasialovely9-a09y",
      "name": "LOVELY CHOURASIA",
      "id": "24155778"
    }
  ],
  "Video Editing": [
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706844/WhatsApp_Image_2026-05-24_at_8.27.41_PM_-_4111_Piyush_Raj_ETC_zj0cc7.jpg",
      "linkedin": "https://www.linkedin.com/in/piyushraj15/",
      "position": "Lead",
      "instagram": "https://www.instagram.com/piyushhhh.r/",
      "rollNo": "2404111",
      "github": "https://github.com/piyushhhr",
      "name": "PIYUSH RAJ",
      "id": "2404111"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706853/Rishi_image_-_5600_Rishikesh_Kumar_fhbinm.png",
      "linkedin": "",
      "position": "Member",
      "instagram": "https://www.instagram.com/rishikesh_2298?igsh=N3p1MGs3NGdiaWxp",
      "rollNo": "2405600",
      "github": "https://github.com/Rishikesh2298",
      "name": "RISHIKESH KUMAR",
      "id": "2405600"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706850/IMG_20260219_225119_-_Tanuj_bsgior.jpg",
      "linkedin": "https://www.linkedin.com/in/tanuj-751848366?utm_source=share_via&utm_content=profile&utm_medium=member_android",
      "position": "Member",
      "instagram": "https://www.instagram.com/tanuj__7557?igsh=dGd6eHA5aHVkbWRx",
      "name": "TANUJ",
      "github": "https://github.com/Tanuj-012",
      "rollNo": "24156105",
      "id": "24156105"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706846/selfpic_-_0122_SHOVEET_BEHERA_ECS_buyufw.jpg",
      "linkedin": "https://www.linkedin.com/in/shoveet-behera-075173301/",
      "position": "Lead",
      "instagram": "https://www.instagram.com/shoveet_kumar.0/",
      "name": "SHOVEET KUMAR BEHERA",
      "github": "https://github.com/ShoveetBehera",
      "rollNo": "2430122",
      "id": "2430122"
    }
  ],
  "Web Dev": [
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706852/WhatsApp_Image_2026-05-23_at_8.18.31_AM_1_-_INDIRA_VERMA_qic9rq.jpg",
      "linkedin": "https://www.linkedin.com/in/indira-verma/",
      "position": "Member",
      "instagram": "https://www.instagram.com/indira.vrma/",
      "name": "INDIRA VERMA",
      "github": "https://github.com/IndiraV5",
      "rollNo": "2405581",
      "id": "2405581"
    },
    {
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/v1779706851/1718277580564_-_8130_Ujjwal_pwkvlz.jpg",
      "linkedin": "https://www.linkedin.com/in/ujjwal-singh-3b1305259",
      "position": "Lead",
      "instagram": "https://www.instagram.com/ujjwalsingh2088/",
      "rollNo": "24158130",
      "github": "https://github.com/Ujjwal-Singh-20",
      "name": "UJJWAL SINGH",
      "id": "24158130"
    }
  ],
  "president": [
    {
      "linkedin": "https://www.linkedin.com/in/chetan-kedia-ba054228b",
      "instagram": "https://www.instagram.com/chetan_kedia10?igsh=dXdoazlidnE5Y2c3",
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/ar_1:1,c_auto/IMG_20260309_015303.jpg_djwwkq.jpg",
      "github": "https://github.com/Chetan-Kedia",
      "name": "CHETAN KEDIA",
      "id": "3J8XRJarfJ2OhxyoArck"
    },
    {
      "linkedin": "https://www.linkedin.com/in/asom13082004/",
      "instagram": "",
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/ar_1:1,c_auto,g_face/B612_20241130_185219_105.jpg_jpxmsb.jpg",
      "github": "https://github.com/Coder130804",
      "name": "ARPITA SOM",
      "id": "sIIrV9abZBr68difg2rS"
    }
  ],
  "vice-president": [
    {
      "linkedin": "https://www.linkedin.com/in/vanshgupta1512/",
      "instagram": "https://www.instagram.com/itz.vansh.gupta/",
      "name": "VANSH GUPTA",
      "github": "https://github.com/vanshgupta15",
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/ar_1:1,c_auto,g_face/WhatsApp_Image_2026-02-20_at_1.28.01_AM_-_Vansh_Gupta_luisjf.jpg",
      "id": "GTwTfzOgASMnmeHYslNl"
    },
    {
      "linkedin": "https://www.linkedin.com/in/samriddhi-kapoor-69b5a0300/",
      "instagram": "https://www.instagram.com/__.samriddhi_/",
      "name": "SAMRIDDHI KAPOOR",
      "github": "https://github.com/samriddhiiii-i/",
      "photoUrl": "https://res.cloudinary.com/da5j1pl8g/image/upload/ar_1:1,c_auto,g_face/SAMRIDDHI_KAPOOR_-_SAMRIDDHI_KAPOOR_xgdqgg.jpg",
      "id": "Grh1I1j4ALiOiON05Tj4"
    }
  ]
};

const Members = () => {
    const [members, setMembers] = useState({
        president: [],
        'vice-president': [],
        mentoring: [],
        design: [],
        'marketing-pr': [],
        'video-editing': [],
        'web-dev': []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDomain, setSelectedDomain] = useState(null);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await getMembers();
                let fetchedData = response.data;

                if (!fetchedData) {
                    throw new Error("No data returned from members cache.");
                }

                // If response is a string URL, fetch the actual JSON from the Vercel Blob URL
                if (typeof fetchedData === 'string' && fetchedData.startsWith('http')) {
                    const blobResponse = await fetch(fetchedData);
                    if (!blobResponse.ok) {
                        throw new Error(`Failed to fetch from blob URL: ${blobResponse.statusText}`);
                    }
                    fetchedData = await blobResponse.json();
                }

                const normalizedData = {
                    president: fetchedData.president || [],
                    'vice-president': fetchedData['vice-president'] || [],
                    mentoring: fetchedData['Mentoring'] || [],
                    design: fetchedData['Design'] || [],
                    'marketing-pr': fetchedData['Marketing and PR'] || [],
                    'video-editing': fetchedData['Video Editing'] || [],
                    'web-dev': fetchedData['Web Dev'] || []
                };

                setMembers(normalizedData);
            } catch (err) {
                console.error("Error fetching members, falling back to local database:", err);
                
                // Graceful fallback to static members data
                const normalizedData = {
                    president: FALLBACK_MEMBERS_DATA.president || [],
                    'vice-president': FALLBACK_MEMBERS_DATA['vice-president'] || [],
                    mentoring: FALLBACK_MEMBERS_DATA['Mentoring'] || [],
                    design: FALLBACK_MEMBERS_DATA['Design'] || [],
                    'marketing-pr': FALLBACK_MEMBERS_DATA['Marketing and PR'] || [],
                    'video-editing': FALLBACK_MEMBERS_DATA['Video Editing'] || [],
                    'web-dev': FALLBACK_MEMBERS_DATA['Web Dev'] || []
                };
                setMembers(normalizedData);
                setError(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4"
                >
                    <Loader2 className="text-accent animate-spin" size={48} />
                    <p className="text-accent/40 font-mono text-xs uppercase tracking-widest">Loading...</p>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-6">
                <div className="text-center p-8 border border-red-500/20 bg-red-500/5 rounded-2xl max-w-md">
                    <AlertCircle className="text-red-400 mx-auto mb-4" size={48} />
                    <h3 className="text-white font-display text-xl mb-2">Sync Error</h3>
                    <p className="text-white/40 text-sm mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all rounded-lg font-mono text-xs uppercase"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-40 px-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-[160px] animate-pulse" />
            <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/[0.03] rounded-full blur-[160px] animate-pulse delay-700" />

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    className="text-center mb-24"
                >
                    <h2 className="text-accent font-mono text-sm tracking-[0.5em] uppercase mb-4">Core Team</h2>
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-bold tracking-tighter mb-6 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                        MEMBERS
                    </h1>
                    <div className="h-1 w-24 bg-accent mx-auto mb-8" />
                </motion.div>

                {/* President Section */}
                <section className="mb-24">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <h3 className="flex items-center gap-3 text-accent font-mono text-sm tracking-[0.3em] uppercase">
                            <Crown size={20} className="text-accent" /> President
                        </h3>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    {members.president.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {members.president.map((person, i) => (
                                <MemberCard key={person.id || person.rollNo || i} person={person} index={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 border border-white/5 bg-white/[0.02] rounded-3xl">
                            <p className="text-white/20 font-mono text-xs uppercase tracking-widest">Roster currently empty</p>
                        </div>
                    )}
                </section>

                {/* Vice President Section */}
                <section className="mb-32">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <h3 className="flex items-center gap-3 text-accent font-mono text-sm tracking-[0.3em] uppercase">
                            <Star size={20} className="text-accent" /> Vice President
                        </h3>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    {members['vice-president'].length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {members['vice-president'].map((person, i) => (
                                <MemberCard key={person.id || person.rollNo || i} person={person} index={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 border border-white/5 bg-white/[0.02] rounded-3xl">
                            <p className="text-white/20 font-mono text-xs uppercase tracking-widest">Roster currently empty</p>
                        </div>
                    )}
                </section>

                {/* Domains Section */}
                <section className="mb-32">
                    <div className="flex items-center gap-4 mb-12">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <h3 className="flex items-center gap-3 text-accent font-mono text-sm tracking-[0.3em] uppercase">
                            <Users size={20} className="text-accent" /> Domains
                        </h3>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {DOMAINS.map((domain, i) => {
                            const Icon = domain.icon;
                            const count = members[domain.id]?.length || 0;
                            return (
                                <motion.div
                                    key={domain.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: i * 0.05 }}
                                    whileHover={{ scale: 1.03, translateY: -5 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSelectedDomain(domain)}
                                    className="p-8 bg-black/40 border border-accent/30 rounded-2xl hover:border-accent/80 hover:shadow-[0_0_30px_rgba(0,255,157,0.15)] transition-all cursor-pointer flex flex-col items-center justify-center text-center aspect-[4/3] group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 group-hover:bg-accent/20 group-hover:border-accent/50 transition-all shadow-[0_0_15px_rgba(0,255,157,0.05)]">
                                        <Icon className="text-accent group-hover:scale-110 transition-transform" size={28} />
                                    </div>

                                    <h4 className="text-lg font-display font-black text-white uppercase tracking-wider mb-2">
                                        {domain.name}
                                    </h4>

                                    <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full">
                                        <span className="text-[9px] font-mono font-bold text-accent tracking-widest uppercase">
                                            {count} {count === 1 ? 'MEMBER' : 'MEMBERS'}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Domain Members Popup Modal */}
                <AnimatePresence>
                    {selectedDomain && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-background/95">
                            {/* Backdrop Click */}
                            <div
                                className="absolute inset-0 cursor-default"
                                onClick={() => setSelectedDomain(null)}
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-5xl bg-[#0a0a0a]/90 backdrop-blur-md p-8 md:p-12 border border-accent/20 rounded-2xl overflow-y-auto max-h-[85vh] z-10 shadow-[0_0_50px_rgba(0,255,157,0.15)] scrollbar-thin"
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedDomain(null)}
                                    className="absolute top-6 right-6 text-white/40 hover:text-accent hover:rotate-90 transition-all duration-300 p-2 hover:bg-white/5 rounded-full"
                                >
                                    <X size={20} />
                                </button>

                                {/* Header */}
                                <div className="flex flex-col items-center text-center mb-12">
                                    <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                                        {React.createElement(selectedDomain.icon, { className: "text-accent", size: 28 })}
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-tight">
                                        {selectedDomain.name} DOMAIN
                                    </h2>
                                    <p className="text-[10px] font-mono text-accent uppercase tracking-widest mt-2 font-bold">
                                        Active Roster
                                    </p>
                                    <div className="h-[1px] w-20 bg-accent/30 mt-4" />
                                </div>

                                {/* Members list */}
                                {members[selectedDomain.id]?.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                                        {[...members[selectedDomain.id]]
                                            .sort((a, b) => {
                                                // Sort by position: Leads first, then Ass. Lead, then Members
                                                const posA = (a.position || '').toLowerCase();
                                                const posB = (b.position || '').toLowerCase();
                                                if (posA.includes('lead') && !posB.includes('lead')) return -1;
                                                if (!posA.includes('lead') && posB.includes('lead')) return 1;
                                                return 0;
                                            })
                                            .map((person, i) => (
                                                <MemberCard key={person.id || person.rollNo || i} person={person} index={i} />
                                            ))}
                                    </div>
                                ) : (
                                    <div className="text-center p-16 border border-white/5 bg-white/[0.01] rounded-2xl flex flex-col items-center">
                                        <Users size={40} className="text-white/10 mb-4 animate-pulse" />
                                        <h4 className="text-white/80 font-display text-lg font-bold mb-1 uppercase tracking-tight">Roster Empty</h4>
                                        <p className="text-white/40 text-xs font-mono max-w-xs uppercase tracking-wider leading-relaxed">
                                            No team members assigned to {selectedDomain.name} yet.
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Footer Note */}
                <div className="mt-40 text-center">
                    <p className="text-white/10 font-mono text-[10px] uppercase tracking-[0.6em]">
                        Synced
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Members;
