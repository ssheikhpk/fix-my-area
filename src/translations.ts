import { Language, IssueCategory } from './types';

export const translations = {
  en: {
    appName: 'FixMyArea',
    appTagline: 'Civic Accountability & SLA Engine',
    karachiOrganization: 'Karachi Civic Command & Public Service',
    home: 'Home',
    directReport: 'Direct Report (Written & Photo)',
    directReportShort: 'Direct Report',
    emergency10Min: '10-Min Emergency Alert',
    emergencyBadge: '10 Min SLA',
    submit: 'Submit Report',
    profile: 'Profile',
    feedback: 'Feedback',
    search: 'Search',
    searchPlaceholder: 'Search Karachi area or issue...',
    logout: 'Logout',
    citizenSignIn: 'Citizen Sign In',
    authoritySignIn: 'City Authority Sign In',
    citizen: 'Citizen',
    authority: 'Authority',
    enterHomePage: 'Enter FixMyArea Home Page',
    backToHome: 'Back to Home Page',
    
    // Categories
    roads: 'Roads & Potholes',
    garbage: 'Garbage & Waste',
    water: 'Water Pipeline & Sewerage',
    electricity: 'Electricity & Loose Wire',
    
    // Statuses
    status: 'Status',
    submitted: 'Submitted',
    inProgress: 'In Progress',
    resolved: 'Resolved',
    slaBreached: 'SLA Breached',
    slaRemaining: 'Time Left',
    workDone: 'Work Done (Resolved)',
    workPending: 'Work Pending / Active',
    workEmergency: '10-Min Emergency',
    allPins: 'View All Karachi Pins',
    
    // Towns
    townClifton: 'Clifton & DHA',
    townSaddar: 'Saddar',
    townGulshan: 'Gulshan-e-Iqbal',
    townNazimabad: 'North Nazimabad',
    townKorangi: 'Korangi',
    townMalir: 'Malir',
    townLyari: 'Keamari & Lyari',
    townJamshed: 'Jamshed Town',
    allTowns: 'All Karachi Towns',

    // Actions & Form
    writeDetails: '1. Write Issue Details',
    proofsAndTimes: '2. Attach Proofs & Resolution Time',
    selectCategory: 'Select Issue',
    enterTitle: 'Issue Title (e.g. Water leak near 2nd Chowrangi)',
    enterDetails: 'Write what happened clearly...',
    selectTown: 'Select Karachi Area / Town',
    locationDetail: 'Exact Street / Landmark Address',
    uploadPhotoProof: 'Upload Photo Proof',
    cameraSnap: 'Take / Choose Photo',
    getGps: 'Pin Karachi GPS',
    resolutionTimeHeading: 'Expected Resolution Time',
    normalResolution: 'Standard Priority SLA',
    emergencyActive: 'EMERGENCY MODE ACTIVATED (10-MIN SLA)',
    cancel: 'Cancel',
    writtenTab: 'Written Report Details',
    photoTab: 'Picture & Photo Evidence',
    snapPhoto: 'Snap / Upload Photo',
    useSamplePhoto: 'Use Category Sample Photo',
    aiVisualScan: 'AI Visual Damage Scan',
    aiTriage: 'AI Triage From Text',
    submitReport: 'Submit Formal Report',
    
    // Popups
    reportSubmittedTitle: 'Report Successfully Registered!',
    reportSubmittedDesc: 'Your complaint has been dispatched to Karachi Municipal Command. A live countdown clock is running.',
    viewOnMap: 'View on Karachi Map',
    returnHome: 'Return to Home',

    // Heatmap & Satellite
    karachiHeatmap: 'Karachi Realistic Satellite GIS Map',
    satelliteMode: 'Satellite Aerial View',
    darkGisMode: 'Dark GIS Map View',
    heatDensity: 'Heat Density',
    allIncidents: 'All Incidents',
    slaBreachesFilter: 'SLA Breaches',
    highHazardFilter: 'High Hazard',
    resolvedFilter: 'Resolved',
    streetViewMode: 'Street View (18x)',
    satelliteHdMode: 'Satellite HD',
    streetsMode: 'Streets',
    nightDarkMode: 'Night Dark',
    colorSimulator: 'REAL-TIME COLOR SIMULATOR:',
    liveSpeed: 'Live (1x)',
    plus2h: '+2h (Caution)',
    plus8h: '+8h (Trigger Red)',
    resetSimulation: 'Reset',
    daylight: 'Daylight',
    goldenHour: 'Golden Hour',
    night: 'Night',
    problemInspectorTitle: 'Location & Problem Inspector',
    selectLocationToFly: 'Click any problem or pin to fly directly to that Karachi location',
    assignedCrew: 'Assigned Crew',
    timeRemaining: 'Time Remaining',
    overdueAlert: 'OVERDUE - Escalated to KMC Leadership',
    
    // Chatbot
    chatAssistant: 'AI Civic Chatbot Assistant',
    chatTone: 'Response Tone',
    friendly: 'Friendly',
    formal: 'Formal',
    urgent: 'Urgent',
    quickQuestions: 'Built-In Question Suggestions',
    chatPlaceholder: 'Ask about water leaks, road damage, live wires in Karachi...',
    send: 'Send',
    thinking: 'Thinking...',
    
    // Authority & Table
    authorityPortalTitle: 'City Authority Command Center',
    assignCrew: 'Assign Crew',
    uploadProof: 'Upload Proof of Work',
    markResolved: 'Mark Resolved',
    selectCrewPrompt: 'Select Official Karachi Crew Unit',
    onlyAuthorityNotice: 'Internal Municipal Dispatch Terminal for Karachi',
    issueType: 'Issue Type',
    location: 'Location',
    action: 'Action',
    reportIssue: 'Direct Report',
    activeIncidentsMap: 'Karachi Live Map',
    myReports: 'Karachi Live SLA Clocks',
    noReportsYet: 'No complaints recorded yet.',
    assignedCrewLabel: 'Assigned Crew',
    smartQueueTitle: 'Karachi Municipal Smart Queue',
    filterCategoryLabel: 'Department / Category',
    filterTownLabel: 'Karachi Town',
    filterStatusLabel: 'SLA Status',
    allStatuses: 'All Statuses',
    onlyBreached: '🚨 Breached Only',
    onlyEmergency: '⚡ Emergency Only',
    uploadWorkProofModalTitle: 'Upload Municipal Proof of Work',
    proofDescriptionPlaceholder: 'Describe completed repair actions and municipal standards complied with...',
    confirmAndResolve: 'Confirm Repair & Mark Resolved',
    close: 'Close',
    
    // Feedback
    feedbackTitle: 'Karachi Civic Feedback',
    feedbackDesc: 'Share suggestions to improve municipal response in your town.',
    feedbackPlaceholder: 'Tell us your suggestions for Karachi civic services...',
    feedbackSuccess: 'Thank you! Your feedback has been forwarded to KMC management.',
    submitFeedback: 'Send Feedback',

    // Sla Clocks Page
    slaClocksTitle: 'Karachi SLA Clocks & Auto-Escalation',
    slaClocksSubtitle: 'Live countdown clocks for all municipal complaints with senior official auto-escalation',
    immutableTimersBadge: 'Immutable Timers',
    activeComplaintsMetric: 'Active Complaints',
    emergenciesMetric: '10-Min Emergencies',
    escalatedBreachesMetric: 'Auto-Escalated Breaches',
    verifiedClosedMetric: 'Verified Repaired',
    filterByIssue: 'Filter by Issue:',
    fastForwardBreach: '⚡ Fast-Forward Breach (Test)',
    autoEscalatedNotice: 'Auto-escalation memo transmitted to Karachi Municipal Commissioner',
    verifiedResolvedNotice: 'Verified resolved & proof uploaded',
  },
  ur: {
    appName: 'فکس مائی ایریا',
    appTagline: 'کراچی کے مسائل کے حل کا فوری نظام',
    karachiOrganization: 'کراچی عوامی خدمات اور شکایات سیل',
    home: 'ہوم',
    directReport: 'مسئلہ درج کریں (تحریر اور تصویر)',
    directReportShort: 'مسئلہ درج کریں',
    emergency10Min: '۱۰ منٹ ہنگامی الرٹ',
    emergencyBadge: '۱۰ منٹ میں حل',
    submit: 'رپورٹ جمع کریں',
    profile: 'پروفائل',
    feedback: 'رائے',
    search: 'تلاش',
    searchPlaceholder: 'علاقہ یا مسئلہ تلاش کریں...',
    logout: 'لاگ آؤٹ',
    citizenSignIn: 'شہری لاگ ان',
    authoritySignIn: 'انتظامیہ لاگ ان',
    citizen: 'شہری',
    authority: 'انتظامیہ',
    enterHomePage: 'فکس مائی ایریا ہوم پیج میں داخل ہوں',
    backToHome: 'ہوم پیج پر واپس جائیں',
    
    // Categories (Simple Urdu for easy reading)
    roads: 'سڑک اور گڑھے',
    garbage: 'کوڑا کرکٹ',
    water: 'پانی اور سیوریج',
    electricity: 'بجلی اور کھلی تاریں',
    
    // Statuses
    status: 'حالت',
    submitted: 'جمع ہو گیا',
    inProgress: 'کام جاری ہے',
    resolved: 'حل ہو گیا',
    slaBreached: 'وقت ختم (تاخیر)',
    slaRemaining: 'باقی وقت',
    workDone: '🟢 کام مکمل (حل شدہ)',
    workPending: '🟡 کام جاری ہے',
    workEmergency: '🔴 ۱۰ منٹ ہنگامی الرٹ',
    allPins: 'تمام کراچی کے مقامات',

    // Towns in Urdu
    townClifton: 'کلفٹن اور ڈی ایچ اے',
    townSaddar: 'صدر',
    townGulshan: 'گلشن اقبال',
    townNazimabad: 'نارتھ ناظم آباد',
    townKorangi: 'کورنگی',
    townMalir: 'ملیر',
    townLyari: 'کیماڑی اور لیاری',
    townJamshed: 'جمشید ٹاؤن',
    allTowns: 'تمام کراچی کے علاقے',
    
    // Actions & Form
    writeDetails: '۱۔ مسئلے کی تفصیل لکھیں',
    proofsAndTimes: '۲۔ تصویر اور حل کا وقت',
    selectCategory: 'مسئلہ منتخب کریں',
    enterTitle: 'عنوان (مثال: ۲ تلوار پر پانی کا پائپ پھٹ گیا ہے)',
    enterDetails: 'مسئلہ آسان الفاظ میں یہاں بیان کریں...',
    selectTown: 'کراچی کا علاقہ منتخب کریں',
    locationDetail: 'گلی نمبر، محلہ یا قریبی مشہور نشانی',
    uploadPhotoProof: 'مسئلے کی تصویر لگائیں',
    cameraSnap: 'کیمرا کھولیں / تصویر منتخب کریں',
    getGps: 'مقام (GPS) تلاش کریں',
    resolutionTimeHeading: 'حل ہونے کا مقررہ وقت',
    normalResolution: 'عام ترجیحی وقت',
    emergencyActive: 'ایمرجنسی فعال (۱۰ منٹ میں ٹیم جائے گی)',
    cancel: 'منسوخ کریں',
    writtenTab: 'تحریری تفصیلات',
    photoTab: 'تصویری ثبوت',
    snapPhoto: 'تصویر لیں / اپلوڈ کریں',
    useSamplePhoto: 'نمونہ تصویر استعمال کریں',
    aiVisualScan: 'تصویر کا خودکار معائنہ (AI)',
    aiTriage: 'تحریر کا خودکار معائنہ',
    submitReport: 'باضابطہ شکایت درج کریں',
    
    // Popups
    reportSubmittedTitle: 'آپ کی شکایت درج ہو گئی ہے!',
    reportSubmittedDesc: 'شکایت کراچی بلدیاتی کنٹرول کو بھیج دی گئی ہے اور الٹی گنتی کا ٹائمر شروع ہو گیا ہے۔',
    viewOnMap: 'کراچی نقشے پر دیکھیں',
    returnHome: 'ہوم پر جائیں',

    // Heatmap & Satellite
    karachiHeatmap: 'کراچی سیٹلائٹ نقشہ',
    satelliteMode: 'اصلی سیٹلائٹ منظر',
    darkGisMode: 'ڈارک میپ منظر',
    heatDensity: 'ہیٹ ڈینسٹی (مسائل کا گھیراؤ)',
    allIncidents: 'تمام شکایات',
    slaBreachesFilter: 'وقت ختم (تاخیر)',
    highHazardFilter: 'ہنگامی خطرات',
    resolvedFilter: 'حل شدہ',
    streetViewMode: 'اسٹریٹ ویو (18x)',
    satelliteHdMode: 'سیٹلائٹ ایچ ڈی',
    streetsMode: 'عام سڑکیں',
    nightDarkMode: 'نائٹ ڈارک',
    colorSimulator: 'رنگوں کا لائیو جائزہ (سمولیشن):',
    liveSpeed: 'لائیو (1x)',
    plus2h: '+۲ گھنٹے (انتباہ)',
    plus8h: '+۸ گھنٹے (وقت ختم - سرخ)',
    resetSimulation: 'دوبارہ ترتیب دیں',
    daylight: 'دن کی روشنی',
    goldenHour: 'شام کا وقت',
    night: 'رات کا وقت',
    problemInspectorTitle: 'مقام اور مسئلے کی تفصیل',
    selectLocationToFly: 'کسی بھی مسئلے یا پن پر کلک کریں تاکہ نقشہ فوری طور پر اس مقام پر پہنچ جائے',
    assignedCrew: 'مقرر کردہ عملہ',
    timeRemaining: 'باقی وقت',
    overdueAlert: 'وقت ختم - اعلیٰ افسران و کمشنر کو نوٹس ارسال',

    // Chatbot
    chatAssistant: 'مصنوعی ذہانت بلدیاتی معاون',
    chatTone: 'جواب کا لہجہ',
    friendly: 'دوستانہ',
    formal: 'دفتری',
    urgent: 'ہنگامی',
    quickQuestions: 'تیار سوالات (فوری جواب کے لیے کلک کریں):',
    chatPlaceholder: 'پانی، سڑک، کچرا یا بجلی کے مسائل کے بارے میں پوچھیں...',
    send: 'ارسال کریں',
    thinking: 'سوچ رہا ہے...',
    
    // Authority
    authorityPortalTitle: 'کراچی میونسپل اتھارٹی کمانڈ سینٹر',
    assignCrew: 'عملہ مقرر کریں',
    uploadProof: 'مرمت کا ثبوت لگائیں',
    markResolved: 'حل شدہ نشان زد کریں',
    selectCrewPrompt: 'کراچی کی متعلقہ سرکاری ٹیم منتخب کریں',
    onlyAuthorityNotice: 'محفوظ: یہ صفحہ صرف بلدیاتی افسران اور کمانڈ سینٹر کے لیے ہے',
    issueType: 'مسئلے کی قسم',
    location: 'مقام',
    action: 'کارروائی',
    reportIssue: 'مسئلہ درج کریں',
    activeIncidentsMap: 'کراچی لائیو نقشہ',
    myReports: 'کراچی شکایات و الٹی گنتی',
    noReportsYet: 'ابھی تک کوئی شکایت درج نہیں ہوئی۔',
    assignedCrewLabel: 'مقرر کردہ عملہ',
    smartQueueTitle: 'کراچی میونسپل اسمارٹ قطار',
    filterCategoryLabel: 'محکمہ / شعبہ',
    filterTownLabel: 'کراچی کا ٹاؤن / علاقہ',
    filterStatusLabel: 'صورتحال',
    allStatuses: 'تمام صورتحال',
    onlyBreached: '🚨 صرف وقت ختم والے',
    onlyEmergency: '⚡ صرف ۱۰ منٹ ایمرجنسی',
    uploadWorkProofModalTitle: 'مرمت کا سرکاری تصویری ثبوت اپلوڈ کریں',
    proofDescriptionPlaceholder: 'کیے گئے کام کی تفصیل اور سرکاری معیار کی تصدیق لکھیں...',
    confirmAndResolve: 'مرمت کی تصدیق اور حل شدہ نشان زد کریں',
    close: 'بند کریں',
    
    // Feedback
    feedbackTitle: 'کراچی شہری رائے باکس',
    feedbackDesc: 'شہر کے مسائل اور بلدیاتی خدمات کو بہتر بنانے کے لیے رائے دیں۔',
    feedbackPlaceholder: 'اپنی مفید رائے یہاں درج کریں...',
    feedbackSuccess: 'آپ کے تاثرات کا شکریہ! بلدیاتی دفتر کو موصول ہو گئے ہیں۔',
    submitFeedback: 'رائے جمع کرائیں',

    // Sla Clocks Page
    slaClocksTitle: 'کراچی شکایات کی الٹی گنتی اور مقررہ وقت',
    slaClocksSubtitle: 'ہر مسئلے کے لیے چلتی ہوئی الٹی گنتی اور وقت ختم ہونے پر اعلیٰ افسران کو خودکار نوٹس',
    immutableTimersBadge: 'ناقابل تغیر ٹائمرز',
    activeComplaintsMetric: 'فعال شکایات',
    emergenciesMetric: '۱۰ منٹ ایمرجنسی',
    escalatedBreachesMetric: 'وقت ختم (کمشنر کو ارسال)',
    verifiedClosedMetric: 'تصدیق شدہ حل',
    filterByIssue: 'مسئلے کے لحاظ سے فلٹر کریں:',
    fastForwardBreach: '⚡ وقت ختم کا ٹیسٹ (سمولیشن)',
    autoEscalatedNotice: 'وقت ختم ہونے کی وارننگ کراچی میونسپل کمشنر اور صوبائی سیکریٹری کو ارسال کر دی گئی ہے۔',
    verifiedResolvedNotice: 'مرمت کا کام مکمل اور تصویری تصدیق جمع ہو چکی ہے۔',
  }
};

export function t(key: keyof typeof translations['en'], lang: Language): string {
  return translations[lang]?.[key] || translations['en'][key] || key;
}

export const TOWN_URDU_MAP: Record<string, string> = {
  'Clifton & DHA': 'کلفٹن اور ڈی ایچ اے',
  'Saddar': 'صدر',
  'Gulshan-e-Iqbal': 'گلشن اقبال',
  'North Nazimabad': 'نارتھ ناظم آباد',
  'Korangi': 'کورنگی',
  'Malir': 'ملیر',
  'Keamari & Lyari': 'کیماڑی اور لیاری',
  'Jamshed Town': 'جمشید ٹاؤن',
  'All': 'تمام علاقے',
};

export function getTownName(town: string, lang: Language): string {
  if (lang === 'ur') {
    return TOWN_URDU_MAP[town] || town;
  }
  return town;
}

export const CATEGORY_URDU_MAP: Record<string, string> = {
  'Roads': 'سڑک اور گڑھے',
  'Garbage': 'کوڑا کرکٹ',
  'Water': 'پانی اور سیوریج',
  'Electricity': 'بجلی اور کھلی تاریں',
  'All': 'تمام مسائل',
};

export function getCategoryName(cat: string, lang: Language): string {
  if (lang === 'ur') {
    return CATEGORY_URDU_MAP[cat] || cat;
  }
  return cat;
}

export const CREW_URDU_MAP: Record<string, string> = {
  'KMC Asphalt Crew #04': 'کے ایم سی اسفالٹ ٹیم #04',
  'KW&SB Hydro Squad #09': 'کراچی واٹر بورڈ ہائیڈرو اسکواڈ #09',
  'SSWMB Compactor Unit #12': 'سندھ سالڈ ویسٹ کمپیکٹر یونٹ #12',
  'K-Electric Rapid Line Team #101': 'کے الیکٹرک ریپڈ لائن ٹیم #101',
  'KMC Forestry & Tree Clearing': 'کے ایم سی شجرکاری و صفائی اسکواڈ',
  'KMC Urban Electrification': 'کے ایم سی اسٹریٹ لائٹ عملہ',
};

export function getCrewName(crew: string, lang: Language): string {
  if (lang === 'ur') {
    return CREW_URDU_MAP[crew] || crew;
  }
  return crew;
}

export const REPORT_TITLE_URDU_MAP: Record<string, string> = {
  'Deep Pothole at 2 Talwar Clifton': '۲ تلوار کلفٹن پر سڑک میں گہرا گڑھا',
  'Main Water Pipe Rupture near Preedy St': 'پریڈی اسٹریٹ صدر کے قریب مین واٹر پائپ پھٹ گیا',
  'Fallen Tree Blocking Road after Rain': 'بارش کے بعد سڑک پر گرا ہوا درخت',
  'Overflowing SSWMB Dumpster': 'گلشن بلاک ۱۳ میں کچرے کے ڈرم سے گندگی کا پھیلاؤ',
  'Broken Traffic Light causing Gridlock': 'ٹریفک سگنل خراب ہونے سے شدید رش',
  'Live Snapped 11KV Electrical Wire': 'شاہراہ فیصل پر بجلی کی ۱۱ کے وی ننگی تار گری ہوئی ہے',
  'Damaged Sidewalk with Open Rebar': 'کورنگی انڈسٹریل ایریا میں فٹ پاتھ ٹوٹا ہوا',
  'Malir Town Streetlight Grid Blackout': 'ملیر ٹاؤن میں اسٹریٹ لائٹس مکمل بند',
};

export function getReportTitle(title: string, lang: Language): string {
  if (lang === 'ur') {
    return REPORT_TITLE_URDU_MAP[title] || title;
  }
  return title;
}

export const REPORT_DESC_URDU_MAP: Record<string, string> = {
  'Major crater formed near the 2 Talwar roundabout. Causing heavy damage to motorcycles and vehicles.': '۲ تلوار چورنگی کے قریب سڑک پر گہرا گڑھا بن گیا ہے جس سے موٹر سائیکل اور گاڑیوں کو شدید نقصان پہنچ رہا ہے۔',
  'Pressurized clean drinking water spewing onto main road. Over 500 gallons leaking per minute.': 'پینے کے صاف پانی کی مین لائن پھٹ گئی ہے اور فی منٹ ۵۰۰ گیلن پانی سڑک پر ضائع ہو رہا ہے۔',
  'Old Neem tree trunk snapped and blocking both lanes. Emergency clearance squad required immediately.': 'پرانا نیم کا درخت گر کر دونوں سڑکوں کو بند کر چکا ہے۔ ایمرجنسی ٹیم کی فوری ضرورت ہے۔',
  'SSWMB community bin overflowing for 4 days. Strong odor and stray animals scattering refuse.': 'سندھ سالڈ ویسٹ بورڈ کا کچرا دان ۴ دن سے بھرا ہوا ہے، سخت بدبو اور جانوروں کا ہجوم ہے۔',
  'Signal is completely dark during peak rush hour. Traffic wardens overwhelmed.': 'رش کے وقت سگنل کی تمام بتیاں بند ہیں جس کی وجہ سے ٹریفک مکمل جام ہے۔',
  'Snapped high voltage cable sparking on pavement near bus stop. Extreme electrocution risk to pedestrians.': 'بس اسٹاپ کے قریب ہائی وولٹیج بجلی کی تار چمک رہی ہے۔ راہگیروں کے لیے شدید جان لیوا خطرہ ہے۔',
  'Pedestrian pathway caved in with exposed rusted rebar. Threat of tripping injury to elderly residents.': 'پیدل چلنے کا راستہ بیٹھ گیا ہے اور لوہے کے سریے باہر نکلے ہوئے ہیں۔ بزرگوں کے گرنے کا خطرہ ہے۔',
  'Entire 1km stretch along residential avenue without functioning street illumination for 3 nights.': 'پورے ۱ کلومیٹر کے رہائشی علاقے میں ۳ راتوں سے تمام اسٹریٹ لائٹس بند ہیں، شدید اندھیرا ہے۔',
};

export function getReportDescription(desc: string, lang: Language): string {
  if (lang === 'ur') {
    return REPORT_DESC_URDU_MAP[desc] || desc;
  }
  return desc;
}
