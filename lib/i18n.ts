"use client"

export type Language = "en" | "hi" | "ta"

export interface Translation {
  // Common
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    save: string
    delete: string
    edit: string
    back: string
    next: string
    previous: string
    submit: string
    close: string
    search: string
    filter: string
    sort: string
    download: string
    upload: string
    settings: string
    help: string
    logout: string
    login: string
    register: string
    welcome: string
    dashboard: string
    profile: string
    notifications: string
  }

  // Authentication
  auth: {
    signIn: string
    signUp: string
    email: string
    password: string
    confirmPassword: string
    firstName: string
    lastName: string
    role: string
    student: string
    teacher: string
    admin: string
    forgotPassword: string
    resetPassword: string
    rememberMe: string
    alreadyHaveAccount: string
    dontHaveAccount: string
    createAccount: string
    signInWithGoogle: string
    signInWithFacebook: string
    passwordStrength: string
    weak: string
    medium: string
    strong: string
    veryStrong: string
  }

  // Learning
  learning: {
    subjects: string
    lessons: string
    quizzes: string
    progress: string
    achievements: string
    badges: string
    leaderboard: string
    physics: string
    chemistry: string
    biology: string
    mathematics: string
    startLesson: string
    completeLesson: string
    takeQuiz: string
    viewResults: string
    score: string
    timeSpent: string
    streak: string
    level: string
    points: string
    xp: string
    rank: string
    difficulty: string
    beginner: string
    intermediate: string
    advanced: string
    expert: string
    easy: string
    medium: string
    hard: string
    communityQuest: string
    collaborativeChallenge: string
    teamScore: string
    globalRanking: string
  }

  // Gamification
  gamification: {
    congratulations: string
    levelUp: string
    badgeEarned: string
    streakMaintained: string
    newAchievement: string
    pointsEarned: string
    keepGoing: string
    almostThere: string
    wellDone: string
    excellent: string
    perfect: string
    tryAgain: string
    goodJob: string
    amazing: string
    outstanding: string
    incredible: string
  }

  // Analytics
  analytics: {
    analytics: string
    reports: string
    performance: string
    engagement: string
    completion: string
    averageScore: string
    totalTime: string
    lessonsCompleted: string
    quizzesCompleted: string
    activeStudents: string
    topPerformers: string
    needsSupport: string
    subjectPerformance: string
    weeklyActivity: string
    monthlyProgress: string
    generateReport: string
    exportData: string
    viewDetails: string
  }

  // Accessibility
  accessibility: {
    skipToContent: string
    openMenu: string
    closeMenu: string
    toggleTheme: string
    increaseTextSize: string
    decreaseTextSize: string
    highContrast: string
    screenReader: string
    keyboardNavigation: string
    altText: string
    ariaLabel: string
    expandSection: string
    collapseSection: string
    currentPage: string
    pageOf: string
    sortBy: string
    filterBy: string
  }

  // Offline
  offline: {
    offline: string
    online: string
    syncPending: string
    syncComplete: string
    downloadContent: string
    offlineMode: string
    connectionLost: string
    connectionRestored: string
    dataWillSync: string
    workingOffline: string
    downloadForOffline: string
    offlineContentReady: string
  }

  // Errors
  errors: {
    somethingWentWrong: string
    pageNotFound: string
    accessDenied: string
    networkError: string
    validationError: string
    serverError: string
    tryAgainLater: string
    contactSupport: string
    invalidCredentials: string
    accountLocked: string
    sessionExpired: string
    fileUploadError: string
    fileTooLarge: string
    unsupportedFileType: string
  }
}

const translations: Record<Language, Translation> = {
  en: {
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      back: "Back",
      next: "Next",
      previous: "Previous",
      submit: "Submit",
      close: "Close",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      download: "Download",
      upload: "Upload",
      settings: "Settings",
      help: "Help",
      logout: "Logout",
      login: "Login",
      register: "Register",
      welcome: "Welcome",
      dashboard: "Dashboard",
      profile: "Profile",
      notifications: "Notifications",
    },
    auth: {
      signIn: "Sign In",
      signUp: "Sign Up",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      firstName: "First Name",
      lastName: "Last Name",
      role: "Role",
      student: "Student",
      teacher: "Teacher",
      admin: "Administrator",
      forgotPassword: "Forgot Password?",
      resetPassword: "Reset Password",
      rememberMe: "Remember Me",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      createAccount: "Create Account",
      signInWithGoogle: "Sign in with Google",
      signInWithFacebook: "Sign in with Facebook",
      passwordStrength: "Password Strength",
      weak: "Weak",
      medium: "Medium",
      strong: "Strong",
      veryStrong: "Very Strong",
    },
    learning: {
      subjects: "Subjects",
      lessons: "Lessons",
      quizzes: "Quizzes",
      progress: "Progress",
      achievements: "Achievements",
      badges: "Badges",
      leaderboard: "Community Quest Mode",
      physics: "Physics",
      chemistry: "Chemistry",
      biology: "Biology",
      mathematics: "Mathematics",
      startLesson: "Start Lesson",
      completeLesson: "Complete Lesson",
      takeQuiz: "Take Quiz",
      viewResults: "View Results",
      score: "Score",
      timeSpent: "Time Spent",
      streak: "Streak",
      level: "Level",
      points: "Points",
      xp: "XP",
      rank: "Rank",
      difficulty: "Difficulty",
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
      expert: "Expert",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      communityQuest: "Community Quest Mode",
      collaborativeChallenge: "Collaborative Challenge",
      teamScore: "Team Score",
      globalRanking: "Global Ranking",
    },
    gamification: {
      congratulations: "Congratulations!",
      levelUp: "Level Up!",
      badgeEarned: "Badge Earned!",
      streakMaintained: "Streak Maintained!",
      newAchievement: "New Achievement!",
      pointsEarned: "Points Earned!",
      keepGoing: "Keep Going!",
      almostThere: "Almost There!",
      wellDone: "Well Done!",
      excellent: "Excellent!",
      perfect: "Perfect!",
      tryAgain: "Try Again!",
      goodJob: "Good Job!",
      amazing: "Amazing!",
      outstanding: "Outstanding!",
      incredible: "Incredible!",
    },
    analytics: {
      analytics: "Analytics",
      reports: "Reports",
      performance: "Performance",
      engagement: "Engagement",
      completion: "Completion",
      averageScore: "Average Score",
      totalTime: "Total Time",
      lessonsCompleted: "Lessons Completed",
      quizzesCompleted: "Quizzes Completed",
      activeStudents: "Active Students",
      topPerformers: "Top Performers",
      needsSupport: "Needs Support",
      subjectPerformance: "Subject Performance",
      weeklyActivity: "Weekly Activity",
      monthlyProgress: "Monthly Progress",
      generateReport: "Generate Report",
      exportData: "Export Data",
      viewDetails: "View Details",
    },
    accessibility: {
      skipToContent: "Skip to main content",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      toggleTheme: "Toggle theme",
      increaseTextSize: "Increase text size",
      decreaseTextSize: "Decrease text size",
      highContrast: "High contrast mode",
      screenReader: "Screen reader mode",
      keyboardNavigation: "Keyboard navigation",
      altText: "Alternative text",
      ariaLabel: "Accessible label",
      expandSection: "Expand section",
      collapseSection: "Collapse section",
      currentPage: "Current page",
      pageOf: "Page {current} of {total}",
      sortBy: "Sort by",
      filterBy: "Filter by",
    },
    offline: {
      offline: "Offline",
      online: "Online",
      syncPending: "Sync Pending",
      syncComplete: "Sync Complete",
      downloadContent: "Download Content",
      offlineMode: "Offline Mode",
      connectionLost: "Connection Lost",
      connectionRestored: "Connection Restored",
      dataWillSync: "Data will sync when online",
      workingOffline: "Working Offline",
      downloadForOffline: "Download for Offline Use",
      offlineContentReady: "Offline Content Ready",
    },
    errors: {
      somethingWentWrong: "Something went wrong",
      pageNotFound: "Page not found",
      accessDenied: "Access denied",
      networkError: "Network error",
      validationError: "Validation error",
      serverError: "Server error",
      tryAgainLater: "Please try again later",
      contactSupport: "Contact support",
      invalidCredentials: "Invalid credentials",
      accountLocked: "Account locked",
      sessionExpired: "Session expired",
      fileUploadError: "File upload error",
      fileTooLarge: "File too large",
      unsupportedFileType: "Unsupported file type",
    },
  },
  hi: {
    common: {
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफलता",
      cancel: "रद्द करें",
      save: "सहेजें",
      delete: "हटाएं",
      edit: "संपादित करें",
      back: "वापस",
      next: "अगला",
      previous: "पिछला",
      submit: "जमा करें",
      close: "बंद करें",
      search: "खोजें",
      filter: "फ़िल्टर",
      sort: "क्रमबद्ध करें",
      download: "डाउनलोड",
      upload: "अपलोड",
      settings: "सेटिंग्स",
      help: "सहायता",
      logout: "लॉग आउट",
      login: "लॉग इन",
      register: "पंजीकरण",
      welcome: "स्वागत",
      dashboard: "डैशबोर्ड",
      profile: "प्रोफ़ाइल",
      notifications: "सूचनाएं",
    },
    auth: {
      signIn: "साइन इन",
      signUp: "साइन अप",
      email: "ईमेल",
      password: "पासवर्ड",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      firstName: "पहला नाम",
      lastName: "अंतिम नाम",
      role: "भूमिका",
      student: "छात्र",
      teacher: "शिक्षक",
      admin: "प्रशासक",
      forgotPassword: "पासवर्ड भूल गए?",
      resetPassword: "पासवर्ड रीसेट करें",
      rememberMe: "मुझे याद रखें",
      alreadyHaveAccount: "पहले से खाता है?",
      dontHaveAccount: "खाता नहीं है?",
      createAccount: "खाता बनाएं",
      signInWithGoogle: "Google से साइन इन करें",
      signInWithFacebook: "Facebook से साइन इन करें",
      passwordStrength: "पासवर्ड की मजबूती",
      weak: "कमजोर",
      medium: "मध्यम",
      strong: "मजबूत",
      veryStrong: "बहुत मजबूत",
    },
    learning: {
      subjects: "विषय",
      lessons: "पाठ",
      quizzes: "प्रश्नोत्तरी",
      progress: "प्रगति",
      achievements: "उपलब्धियां",
      badges: "बैज",
      leaderboard: "सामुदायिक खोज मोड",
      physics: "भौतिकी",
      chemistry: "रसायन विज्ञान",
      biology: "जीव विज्ञान",
      mathematics: "गणित",
      startLesson: "पाठ शुरू करें",
      completeLesson: "पाठ पूरा करें",
      takeQuiz: "प्रश्नोत्तरी लें",
      viewResults: "परिणाम देखें",
      score: "स्कोर",
      timeSpent: "समय व्यतीत",
      streak: "लगातार",
      level: "स्तर",
      points: "अंक",
      xp: "XP",
      rank: "रैंक",
      difficulty: "कठिनाई",
      beginner: "शुरुआती",
      intermediate: "मध्यम",
      advanced: "उन्नत",
      expert: "विशेषज्ञ",
      easy: "आसान",
      medium: "मध्यम",
      hard: "कठिन",
      communityQuest: "सामुदायिक खोज मोड",
      collaborativeChallenge: "सहयोगी चुनौती",
      teamScore: "टीम स्कोर",
      globalRanking: "वैश्विक रैंकिंग",
    },
    gamification: {
      congratulations: "बधाई हो!",
      levelUp: "स्तर बढ़ा!",
      badgeEarned: "बैज अर्जित!",
      streakMaintained: "लगातार बनाए रखा!",
      newAchievement: "पுதிய उपलब्धि!",
      pointsEarned: "अंक अर्जित!",
      keepGoing: "जारी रखें!",
      almostThere: "लगभग पहुंच गए!",
      wellDone: "बहुत बढ़िया!",
      excellent: "उत्कृष्ट!",
      perfect: "परफेक्ट!",
      tryAgain: "फिर कोशिश करें!",
      goodJob: "अच्छा काम!",
      amazing: "अद्भुत!",
      outstanding: "उत्कृष्ट!",
      incredible: "अविश्वसनीय!",
    },
    analytics: {
      analytics: "विश्लेषण",
      reports: "रिपोर्ट",
      performance: "प्रदर्शन",
      engagement: "सहभागिता",
      completion: "पूर्णता",
      averageScore: "औसत स्कोर",
      totalTime: "कुल समय",
      lessonsCompleted: "मுடிக்கப்பட்ட பாடங்கள்",
      quizzesCompleted: "முடிக்கப்பட்ட வினாடி வினாக்கள்",
      activeStudents: "செயலில் உள்ள மாணவர்கள்",
      topPerformers: "சிறந்த செயல்பாட்டாளர்கள்",
      needsSupport: "ஆதரவு தேவை",
      subjectPerformance: "பாட செயல்திறன்",
      weeklyActivity: "வாராந்திர செயல்பாடு",
      monthlyProgress: "மாதாந்திர முன்னேற்றம்",
      generateReport: "அறிக்கையை உருவாக்கு",
      exportData: "தரவை ஏற்றுமதி செய்",
      viewDetails: "விவரங்களைப் பார்",
    },
    accessibility: {
      skipToContent: "முக்கிய உள்ளடக்கத்திற்கு செல்",
      openMenu: "மெனுவைத் திற",
      closeMenu: "மெனுவை மூடு",
      toggleTheme: "தீமை மாற்று",
      increaseTextSize: "உரை அளவை அதிகரி",
      decreaseTextSize: "உரை அளவைக் குறை",
      highContrast: "உயர் மாறுபாடு பயன்முறை",
      screenReader: "திரை வாசகர் பயன்முறை",
      keyboardNavigation: "விசைப்பலகை வழிசெலுத்தல்",
      altText: "மாற்று உரை",
      ariaLabel: "அணுகக்கூடிய லேபிள்",
      expandSection: "பிரிவை விரிவாக்கு",
      collapseSection: "பிரிவைச் சுருக்கு",
      currentPage: "தற்போதைய பக்கம்",
      pageOf: "பக்கம் {current} இன் {total}",
      sortBy: "இதன் மூலம் வரிசைப்படுத்து",
      filterBy: "இதன் மூலம் வடிகட்டு",
    },
    offline: {
      offline: "ஆஃப்லைன்",
      online: "ஆன்லைன்",
      syncPending: "ஒத்திசைவு நிலுவையில்",
      syncComplete: "ஒத்திசைவு முடிந்தது",
      downloadContent: "உள்ளடக்கத்தைப் பதிவிறக்கு",
      offlineMode: "ஆஃப்லைன் பயன்முறை",
      connectionLost: "இணைப்பு இழந்தது",
      connectionRestored: "இணைப்பு மீட்டமைக்கப்பட்டது",
      dataWillSync: "ஆன்லைனில் இருக்கும்போது தரவு ஒத்திசைக்கும்",
      workingOffline: "ஆஃப்லைனில் வேலை செய்கிறது",
      downloadForOffline: "ஆஃப்லைன் பயன்பாட்டிற்காக பதிவிறக்கு",
      offlineContentReady: "ஆஃப்லைன் உள்ளடக்கம் தயார்",
    },
    errors: {
      somethingWentWrong: "ஏதோ தவறு நடந்தது",
      pageNotFound: "பக்கம் கிடைக்கவில்லை",
      accessDenied: "அணுகல் மறுக்கப்பட்டது",
      networkError: "நெட்வொர்க் பிழை",
      validationError: "சரிபார்ப்பு பிழை",
      serverError: "சர்வர் பிழை",
      tryAgainLater: "தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்",
      contactSupport: "ஆதரவைத் தொடர்பு கொள்ளவும்",
      invalidCredentials: "தவறான சான்றுகள்",
      accountLocked: "கணக்கு பூட்டப்பட்டது",
      sessionExpired: "அமர்வு காலாவதியானது",
      fileUploadError: "கோப்பு பதிவேற்ற பிழை",
      fileTooLarge: "கோப்பு மிகப் பெரியது",
      unsupportedFileType: "ஆதரிக்கப்படாத கோப்பு வகை",
    },
  },
  ta: {
    common: {
      loading: "ஏற்றுகிறது...",
      error: "பிழை",
      success: "வெற்றி",
      cancel: "ரத்து செய்",
      save: "சேமி",
      delete: "நீக்கு",
      edit: "திருத்து",
      back: "பின்",
      next: "அடுத்து",
      previous: "முந்தைய",
      submit: "சமர்ப்பி",
      close: "மூடு",
      search: "தேடு",
      filter: "வடிகட்டு",
      sort: "வரிசைப்படுத்து",
      download: "பதிவிறக்கு",
      upload: "பதிவேற்று",
      settings: "அமைப்புகள்",
      help: "உதவி",
      logout: "வெளியேறு",
      login: "உள்நுழை",
      register: "பதிவு செய்",
      welcome: "வரவேற்கிறோம்",
      dashboard: "டாஷ்போர்டு",
      profile: "சுயவிவரம்",
      notifications: "அறிவிப்புகள்",
    },
    auth: {
      signIn: "உள்நுழை",
      signUp: "பதிவு செய்",
      email: "மின்னஞ்சல்",
      password: "கடவுச்சொல்",
      confirmPassword: "கடவுச்சொல்லை உறுதிப்படுத்து",
      firstName: "முதல் பெயர்",
      lastName: "கடைசி பெயர்",
      role: "பங்கு",
      student: "மாணவர்",
      teacher: "ஆசிரியர்",
      admin: "நிர்வாகி",
      forgotPassword: "கடவுச்சொல் மறந்துவிட்டதா?",
      resetPassword: "கடவுச்சொல்லை மீட்டமை",
      rememberMe: "என்னை நினைவில் வைத்துக்கொள்",
      alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
      dontHaveAccount: "கணக்கு இல்லையா?",
      createAccount: "கணக்கை உருவாக்கு",
      signInWithGoogle: "Google மூலம் உள்நுழை",
      signInWithFacebook: "Facebook மூலம் உள்நுழை",
      passwordStrength: "கடவுச்சொல் வலிமை",
      weak: "பலவீனமான",
      medium: "நடுத்தர",
      strong: "வலுவான",
      veryStrong: "மிகவும் வலுவான",
    },
    learning: {
      subjects: "பாடங்கள்",
      lessons: "பாடங்கள்",
      quizzes: "வினாடி வினா",
      progress: "முன்னேற்றம்",
      achievements: "சாதனைகள்",
      badges: "பேட்ஜ்கள்",
      leaderboard: "சமூக தேடல் பயன்முறை",
      physics: "இயற்பியல்",
      chemistry: "வேதியியல்",
      biology: "உயிரியல்",
      mathematics: "கணிதம்",
      startLesson: "பாடத்தைத் தொடங்கு",
      completeLesson: "பாடத்தை முடி",
      takeQuiz: "வினாடி வினா எடு",
      viewResults: "முடிவுகளைப் பார்",
      score: "மதிப்பெண்",
      timeSpent: "செலவழித்த நேரம்",
      streak: "தொடர்ச்சி",
      level: "நிலை",
      points: "புள்ளிகள்",
      xp: "XP",
      rank: "தரம்",
      difficulty: "சிரமம்",
      beginner: "தொடக்கநிலை",
      intermediate: "இடைநிலை",
      advanced: "மேம்பட்ட",
      expert: "நிபுணர்",
      easy: "எளிதான",
      medium: "நடுத்தர",
      hard: "கடினமான",
      communityQuest: "சமூக தேடல் பயன்முறை",
      collaborativeChallenge: "ஒத்துழைப்பு சவால்",
      teamScore: "அணி மதிப்பெண்",
      globalRanking: "உலகளாவிய தரவரிசை",
    },
    gamification: {
      congratulations: "வாழ்த்துக்கள்!",
      levelUp: "நிலை உயர்வு!",
      badgeEarned: "பேட்ஜ் பெற்றது!",
      streakMaintained: "தொடர்ச்சி பராமரிக்கப்பட்டது!",
      newAchievement: "புதிய சாதனை!",
      pointsEarned: "புள்ளிகள் பெற்றது!",
      keepGoing: "தொடர்ந்து செல்!",
      almostThere: "கிட்டத்தட்ட அங்கே!",
      wellDone: "நன்றாக செய்தீர்கள்!",
      excellent: "சிறப்பானது!",
      perfect: "சரியானது!",
      tryAgain: "மீண்டும் முயற்சி செய்!",
      goodJob: "நல்ல வேலை!",
      amazing: "அற்புதமான!",
      outstanding: "சிறந்த!",
      incredible: "நம்பமுடியாத!",
    },
    analytics: {
      analytics: "பகுப்பாய்வு",
      reports: "அறிக்கைகள்",
      performance: "செயல்திறன்",
      engagement: "ஈடுபாடு",
      completion: "நிறைவு",
      averageScore: "சராசரி மதிப்பெண்",
      totalTime: "மொத்த நேரம்",
      lessonsCompleted: "முடிக்கப்பட்ட பாடங்கள்",
      quizzesCompleted: "முடிக்கப்பட்ட வினாடி வினாக்கள்",
      activeStudents: "செயலில் உள்ள மாணவர்கள்",
      topPerformers: "சிறந்த செயல்பாட்டாளர்கள்",
      needsSupport: "ஆதரவு தேவை",
      subjectPerformance: "பாட செயல்திறன்",
      weeklyActivity: "வாராந்திர செயல்பாடு",
      monthlyProgress: "மாதாந்திர முன்னேற்றம்",
      generateReport: "அறிக்கையை உருவாக்கு",
      exportData: "தரவை ஏற்றுமதி செய்",
      viewDetails: "விவரங்களைப் பார்",
    },
    accessibility: {
      skipToContent: "முக்கிய உள்ளடக்கத்திற்கு செல்",
      openMenu: "மெனுவைத் திற",
      closeMenu: "மெனுவை மூடு",
      toggleTheme: "தீமை மாற்று",
      increaseTextSize: "உரை அளவை அதிகரி",
      decreaseTextSize: "உரை அளவைக் குறை",
      highContrast: "உயர் மாறுபாடு பயன்முறை",
      screenReader: "திரை வாசகர் பயன்முறை",
      keyboardNavigation: "விசைப்பலகை வழிசெலுத்தல்",
      altText: "மாற்று உரை",
      ariaLabel: "அணுகக்கூடிய லேபிள்",
      expandSection: "பிரிவை விரிவாக்கு",
      collapseSection: "பிரிவைச் சுருக்கு",
      currentPage: "தற்போதைய பக்கம்",
      pageOf: "பக்கம் {current} இன் {total}",
      sortBy: "இதன் மூலம் வரிசைப்படுத்து",
      filterBy: "இதன் மூலம் வடிகட்டு",
    },
    offline: {
      offline: "ஆஃப்லைன்",
      online: "ஆன்லைன்",
      syncPending: "ஒத்திசைவு நிலுவையில்",
      syncComplete: "ஒத்திசைவு முடிந்தது",
      downloadContent: "உள்ளடக்கத்தைப் பதிவிறக்கு",
      offlineMode: "ஆஃப்லைன் பயன்முறை",
      connectionLost: "இணைப்பு இழந்தது",
      connectionRestored: "இணைப்பு மீட்டமைக்கப்பட்டது",
      dataWillSync: "ஆன்லைனில் இருக்கும்போது தரவு ஒத்திசைக்கும்",
      workingOffline: "ஆஃப்லைனில் வேலை செய்கிறது",
      downloadForOffline: "ஆஃப்லைன் பயன்பாட்டிற்காக பதிவிறக்கு",
      offlineContentReady: "ஆஃப்லைன் உள்ளடக்கம் தயார்",
    },
    errors: {
      somethingWentWrong: "ஏதோ தவறு நடந்தது",
      pageNotFound: "பக்கம் கிடைக்கவில்லை",
      accessDenied: "அணுகல் மறுக்கப்பட்டது",
      networkError: "நெட்வொர்க் பிழை",
      validationError: "சரிபார்ப்பு பிழை",
      serverError: "சர்வர் பிழை",
      tryAgainLater: "தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்",
      contactSupport: "ஆதரவைத் தொடர்பு கொள்ளவும்",
      invalidCredentials: "தவறான சான்றுகள்",
      accountLocked: "கணக்கு பூட்டப்பட்டது",
      sessionExpired: "அமர்வு காலாவதியானது",
      fileUploadError: "கோப்பு பதிவேற்ற பிழை",
      fileTooLarge: "கோப்பு மிகப் பெரியது",
      unsupportedFileType: "ஆதரிக்கப்படாத கோப்பு வகை",
    },
  },
}

import { useState, useEffect } from "react"

class I18nService {
  private static instance: I18nService
  private currentLanguage: Language = "en"
  private translations = translations
  private listeners: Array<(language: Language) => void> = []

  static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService()
    }
    return I18nService.instance
  }

  addListener(listener: (language: Language) => void): void {
    this.listeners.push(listener)
  }

  removeListener(listener: (language: Language) => void): void {
    this.listeners = this.listeners.filter((l) => l !== listener)
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.currentLanguage))
  }

  setLanguage(language: Language): void {
    this.currentLanguage = language
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-language", language)
      document.documentElement.lang = language

      const rtlLanguages: Language[] = [] // Add RTL languages if needed
      document.documentElement.dir = rtlLanguages.includes(language) ? "rtl" : "ltr"
    }
    this.notifyListeners()
  }

  getLanguage(): Language {
    return this.currentLanguage
  }

  getAvailableLanguages(): Array<{ code: Language; name: string; nativeName: string }> {
    return [
      { code: "en", name: "English", nativeName: "English" },
      { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
      { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    ]
  }

  t(key: string, params?: Record<string, string | number>): string {
    const keys = key.split(".")
    let value: any = this.translations[this.currentLanguage]

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k]
      } else {
        value = this.translations.en
        for (const fallbackKey of keys) {
          if (value && typeof value === "object" && fallbackKey in value) {
            value = value[fallbackKey]
          } else {
            return key
          }
        }
        break
      }
    }

    if (typeof value !== "string") {
      return key
    }

    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match
      })
    }

    return value
  }

  initialize(): void {
    if (typeof window === "undefined") return

    const savedLanguage = localStorage.getItem("preferred-language") as Language
    if (savedLanguage && this.translations[savedLanguage]) {
      this.setLanguage(savedLanguage)
      return
    }

    const browserLanguage = navigator.language.split("-")[0] as Language
    if (this.translations[browserLanguage]) {
      this.setLanguage(browserLanguage)
    }
  }
}

export const i18n = I18nService.getInstance()

export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(i18n.getLanguage())

  useEffect(() => {
    const handleLanguageChange = (language: Language) => {
      setCurrentLanguage(language)
    }

    i18n.addListener(handleLanguageChange)
    return () => i18n.removeListener(handleLanguageChange)
  }, [])

  return {
    t: (key: string, params?: Record<string, string | number>) => i18n.t(key, params),
    language: currentLanguage,
    setLanguage: (language: Language) => i18n.setLanguage(language),
    availableLanguages: i18n.getAvailableLanguages(),
  }
}
