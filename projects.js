// ==========================================
// PLACEHOLDER CONFIGURATION
// Customize the default thumbnail appearance
// ==========================================
const placeholderBg = "EEEEEE";
const placeholderText = "000000";
const placeholderFontSize = "50";

// Helper function to generate placeholder URLs
function getPlaceholder(title) {
    return `https://placeholdit.com/600x400/${placeholderBg}/${placeholderText}?text=${encodeURIComponent(title)}&font_size=${placeholderFontSize}`;
}

const projectsList = [
    {
        "id": "mad3wo",
        "title": "MAD3WO",
        "category": "Cross-platform App",
        "filterTags": "flutter mobile web",
        "startDate": "10/2024",
        "endDate": "06/2026",
        "shortDesc": "Cross-platform Flutter app with 70+ responsive screens and complex backend integration.",
        "desc": "Developed a large-scale cross-platform Flutter application with over 70 responsive screens. The app features a highly polished UI using GetX for efficient state management. Integrated complex REST APIs and Firebase services (Realtime DB, Storage, Push Notifications) to ensure seamless dynamic content delivery and real-time updates.",
        "tech": ["Flutter", "GetX", "Firebase"],
        "allTech": ["Flutter", "GetX", "Firebase", "REST API", "Android", "iOS"],
        "thumbnail": "./images/mad3wo/mad3wo.png",
        "images": ["./images/mad3wo/mad3wo.png", "./images/mad3wo/mad3wo2.png", "./images/mad3wo/3.png"]
    },
    {
        "id": "qadem",
        "title": "QADEM",
        "category": "Service App",
        "filterTags": "flutter mobile",
        "startDate": "10/2025",
        "endDate": "04/2026",
        "shortDesc": "Service app with real-time chat, maps, and Stripe payment integration.",
        "desc": "Built a scalable service-based Flutter application focusing on real-time chat functionality, interactive maps, and a modern, intuitive UI/UX. Integrated secure payment gateways (Stripe & Futura) for smooth transactions. Utilized GetX for state management and Firebase for robust backend services.",
        "tech": ["Flutter", "Maps", "Stripe"],
        "allTech": ["Flutter", "GetX", "Firebase", "Stripe", "Google Maps"],
        "thumbnail": getPlaceholder("QADEM"),
        "images": []
    },
    {
        "id": "anexee",
        "title": "Anexee",
        "category": "Enterprise App",
        "filterTags": "flutter mobile",
        "startDate": "11/2024",
        "endDate": "Present",
        "shortDesc": "Dynamic Android app with MQTT and data-driven layouts for enterprise use.",
        "desc": "Developed a dynamic Android application for Anaxee using Flutter. Key features include real-time data processing with MQTT, encrypted secure login systems, and dynamic data-driven layouts (menus, grids) fetched from REST APIs.",
        "tech": ["MQTT", "Security", "Enterprise"],
        "allTech": ["Flutter", "MQTT", "REST API", "Security"],
        "thumbnail": getPlaceholder("Anexee"),
        "images": []
    },
    {
        "id": "acchhu",
        "title": "AccHHU",
        "category": "Hardware Integration",
        "filterTags": "flutter mobile",
        "startDate": "01/2023",
        "endDate": "07/2026",
        "shortDesc": "Specialized Flutter app with RS232 communication and Bluetooth thermal printing.",
        "desc": "A specialized Flutter application involving hardware integration. Implemented RS232 communication protocols and Bluetooth thermal printing capabilities. Features dynamic form generation to handle variable data input requirements.",
        "tech": ["RS232", "Hardware", "Bluetooth"],
        "allTech": ["Flutter", "RS232", "Bluetooth", "Hardware"],
        "thumbnail": getPlaceholder("AccHHU"),
        "images": []
    },
    {
        "id": "line-monitoring",
        "title": "Line Monitoring",
        "category": "Auditing Tool",
        "filterTags": "flutter",
        "startDate": "09/2024",
        "endDate": "02/2025",
        "shortDesc": "Comprehensive auditing app with fully dynamic JSON-based UI form rendering.",
        "desc": "Developed a comprehensive auditing application. The core feature is a fully functional dynamic form system that renders UI components based on JSON configurations, allowing for highly flexible audit checklists.",
        "tech": ["Dynamic UI", "JSON", "Audit"],
        "allTech": ["Flutter", "JSON Forms", "REST API", "Auditing"],
        "thumbnail": getPlaceholder("Line Monitoring"),
        "images": []
    },
    {
        "id": "Line Audit",
        "title": "Line Audit",
        "category": "Auditing Tool",
        "filterTags": "flutter",
        "startDate": "05/2024",
        "endDate": "07/2024",
        "shortDesc": "Comprehensive auditing app with fully dynamic JSON-based UI form rendering.",
        "desc": "Developed a comprehensive auditing application. The core feature is a fully functional dynamic form system that renders UI components based on JSON configurations, allowing for highly flexible audit checklists.",
        "tech": ["Dynamic UI", "JSON", "Audit"],
        "allTech": ["Flutter", "JSON Forms", "REST API", "Auditing"],
        "thumbnail": getPlaceholder("Line Audit"),
        "images": []
    },
    {
        "id": "alphatnd",
        "title": "AlphaTND",
        "category": "Field Work App",
        "filterTags": "flutter mobile",
        "startDate": "10/2023",
        "endDate": "04/2024",
        "shortDesc": "Advanced field operations app with camera API and geolocation evidence capture.",
        "desc": "Played a key role in developing AlphaTND, an advanced mobile app for field operations. Features include sophisticated camera API integrations for evidence capture and location services for geo-tagging activities.",
        "tech": ["Camera API", "Geo-tag", "Field"],
        "allTech": ["Flutter", "Camera API", "Geolocation", "REST API"],
        "thumbnail": getPlaceholder("AlphaTND"),
        "images": ["./images/alphatnd/3.png", "./images/alphatnd/4.png", "./images/alphatnd/5.png"]
    },
    {
        "id": "smarttiffin",
        "title": "Smart Tiffin",
        "category": "Web & Android App",
        "filterTags": "web android mobile",
        "startDate": "01/2026",
        "endDate": "06/2026",
        "shortDesc": "Food subscription platform delivering homemade tiffins with live tracking.",
        "desc": "A comprehensive food subscription platform delivering \"Ghar Jaisa Khana\". Users can subscribe to daily homemade tiffin meals (Normal, Premium, or Diet thalis) with flexible plans and doorstep delivery. Features include a smart app for leave management, live tracking, and bulk ordering.",
        "tech": ["Web", "Android", "Tracking"],
        "allTech": ["Web", "Android", "Subscription Management", "Live Tracking"],
        "thumbnail": getPlaceholder("Smart Tiffin"),
        "images": []
    },
    {
        "id": "zaydsa",
        "title": "Zaydsa",
        "category": "Web, Android & iOS App",
        "filterTags": "web mobile",
        "startDate": "07/2026",
        "endDate": "Present",
        "shortDesc": "Multi-platform application encompassing Web, Android, and iOS for seamless UX.",
        "desc": "A robust multi-platform application encompassing Web, Android, and iOS to deliver a seamless user experience across all devices.",
        "tech": ["Web", "Android", "iOS"],
        "allTech": ["Web", "Android", "iOS"],
        "thumbnail": getPlaceholder("Zaydsa"),
        "images": []
    }
];
