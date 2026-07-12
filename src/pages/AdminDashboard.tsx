import { FormEvent, useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { categories } from '../data/mockData';
import { postToFacebook, deleteFromFacebook, getFacebookPageInsights } from '../utils/facebook';
import { uploadImage } from '../utils/cloudinary';

type AdminTab = 'articles' | 'manage' | 'analytics' | 'settings' | 'banners' | 'imageGenerator' | 'notifications';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [articlesCount, setArticlesCount] = useState(0);
  const [articles, setArticles] = useState<any[]>([]);
  const [visitorDetails, setVisitorDetails] = useState<any[]>([]);
  const [uniqueVisitors, setUniqueVisitors] = useState(0);
  const [facebookInsights, setFacebookInsights] = useState<any>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('articles');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<'en' | 'dv'>('dv');

  const translations = {
    en: {
      adminPanel: 'Admin Panel',
      adminDashboard: 'Admin Dashboard',
      news: 'News',
      visits: 'Visits',
      logout: 'Logout',
      createNews: 'Create News',
      analytics: 'Analytics',
      settings: 'Settings',
      imageGenerator: 'Image Generator',
      newsDescription: 'Create and publish news articles.',
      title: 'Title',
      titleDv: 'Title (Dhivehi)',
      category: 'Category',
      excerpt: 'Excerpt',
      excerptDv: 'Excerpt (Dhivehi)',
      photoUrl: 'Photo URL',
      readingTime: 'Reading Time',
      newsContent: 'News Content',
      paragraph1: 'Paragraph 1',
      paragraph1Dv: 'Paragraph 1 (Dhivehi)',
      paragraph2: 'Paragraph 2 (optional)',
      paragraph2Dv: 'Paragraph 2 (Dhivehi - optional)',
      paragraph3: 'Paragraph 3 (optional)',
      paragraph3Dv: 'Paragraph 3 (Dhivehi - optional)',
      paragraph1En: 'Paragraph 1 (English)',
      paragraph2En: 'Paragraph 2 (English - optional)',
      paragraph3En: 'Paragraph 3 (English - optional)',
      addParagraph: 'Add Paragraph',
      removeParagraph: 'Remove Paragraph',
      paragraph: 'Paragraph',
      paragraphDv: 'Paragraph (Dhivehi)',
      paragraphEn: 'Paragraph (English)',
      trending: 'Trending',
      breaking: 'Breaking',
      submit: 'Submit News',
      submitting: 'Submitting...',
      totalNews: 'Total News',
      totalVisits: 'Total Visits',
      uniqueVisitors: 'Unique Visitors',
      visitorLog: 'Visitor Log',
      noVisitors: 'No visitors',
      facebookPage: 'Facebook Page',
      pageViews: 'Page Views',
      pageLikes: 'Page Likes',
      pageFollowers: 'Page Followers',
      refreshInsights: 'Refresh Insights',
      loadingInsights: 'Loading...',
      device: 'Device',
      browser: 'Browser',
      os: 'OS',
      time: 'Time',
      screen: 'Screen',
      referrer: 'Referrer',
      sameDevice: 'Same Device',
      newDevice: 'New Device',
      translateTitle: 'English to Dhivehi Translation',
      translateDesc: 'Type or paste English text to translate to Dhivehi.',
      englishPlaceholder: 'Type English text here...',
      translate: 'Translate',
      translating: 'Translating...',
      dhivehi: 'Dhivehi',
      copy: 'Copy',
      loading: 'Loading...',
      notLoggedIn: 'Not logged in',
      pleaseLogin: 'Please login to access admin console.',
      typeEnglish: 'Please type English text.',
      translated: 'Translation complete.',
      translateError: 'Translation failed. Please try again.',
      copied: 'Copied to clipboard.',
      newsCreated: 'News created successfully!',
      newsError: 'Failed to create news. Please try again.',
      changePassword: 'Change Password',
      changePasswordDesc: 'Change your account password.',
      change: 'Change',
      deleteAccount: 'Delete Account',
      deleteAccountDesc: 'Delete your account and data.',
      delete: 'Delete',
      manageNews: 'Manage News',
      deleteNews: 'Delete News',
      deleteNewsDesc: 'Delete news articles from the system.',
      confirmDelete: 'Are you sure you want to delete this article?',
      newsDeleted: 'News deleted successfully!',
      newsDeleteError: 'Failed to delete news. Please try again.',
      postToFb: 'Post to FB',
      postingToFb: 'Posting...',
      postedToFb: 'Posted to Facebook!',
      postToFbError: 'Failed to post to Facebook. Please try again.',
      editNews: 'Edit News',
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
      newsUpdated: 'News updated successfully!',
      newsUpdateError: 'Failed to update news. Please try again.',
      manageBanners: 'Manage Banners',
      bannersDesc: 'Upload and manage promotional banners.',
      uploadBanner: 'Upload Banner',
      bannerTitle: 'Banner Title',
      bannerSubtitle: 'Banner Subtitle',
      bannerImage: 'Banner Image',
      selectImage: 'Select Image',
      uploading: 'Uploading...',
      bannerUploaded: 'Banner uploaded successfully!',
      bannerUploadError: 'Failed to upload banner. Please try again.',
      deleteBanner: 'Delete',
      confirmDeleteBanner: 'Are you sure you want to delete this banner?',
      bannerDeleted: 'Banner deleted successfully!',
      bannerDeleteError: 'Failed to delete banner. Please try again.',
      selectBanner: 'Select Banner',
      noBannerSelected: 'No banner selected',
      currentBanner: 'Currently Displayed Banner',
      bannerLocation: 'Banner Location',
      bannerSize: 'Banner Size',
      bannerPosition: 'Banner Position',
      positionTop: 'Top',
      positionMiddle: 'Middle',
      positionBottom: 'Bottom',
      locationHome: 'Home Page',
      locationArticle: 'Article Page',
      locationCategory: 'Category Page',
      sizeMobile: 'Mobile Only',
      sizeDesktop: 'Desktop Only',
      sizeBoth: 'Both Mobile & Desktop',
    },
    dv: {
      adminPanel: 'އެޑްމިން ޕެނަލް',
      adminDashboard: 'އެޑްމިން ޑޭޝްބޯޑް',
      news: 'ޚަބަރު',
      visits: 'ޒިޔާރަތްތައް',
      logout: 'ލޮގްއައުޓް',
      createNews: 'ޚަބަރު އުފައްދާ',
      analytics: 'ތަޙުލީލް',
      settings: 'ސެޓިންގްސް',
      imageGenerator: 'އިމޭޖް ޖެނެރޭޓަރ',
      newsDescription: 'ޚަބަރު ލިޔުމަށާއި ޝާއިޢު ކުރުމަށް',
      title: 'ސުރުޚީ',
      titleDv: 'ސުރުޚީ (ދިވެހި)',
      category: 'ބައި',
      excerpt: 'ކުރު ޚުލާސާ',
      excerptDv: 'ކުރު ޚުލާސާ (ދިވެހި)',
      photoUrl: 'ފޮޓޯ URL',
      readingTime: 'ކިޔާލުމަށް ނަގާ ވަގުތު',
      newsContent: 'ޚަބަރުގެ މައިގަނޑު',
      paragraph1: 'ޕެރެގްރާފް 1',
      paragraph1Dv: 'ޕެރެގްރާފް 1 (ދިވެހި)',
      paragraph2: 'ޕެރެގްރާފް 2 (އިޚްތިޔާރީ)',
      paragraph2Dv: 'ޕެރެގްރާފް 2 (ދިވެހި - އިޚްތިޔާރީ)',
      paragraph3: 'ޕެރެގްރާފް 3 (އިޚްތިޔާރީ)',
      paragraph3Dv: 'ޕެރެގްރާފް 3 (ދިވެހި - އިޚްތިޔާރީ)',
      paragraph1En: 'ޕެރެގްރާފް 1 (އިނގިރޭސި)',
      paragraph2En: 'ޕެރެގްރާފް 2 (އިނގިރޭސި - އިޚްތިޔާރީ)',
      paragraph3En: 'ޕެރެގްރާފް 3 (އިނގިރޭސި - އިޚްތިޔާރީ)',
      addParagraph: 'ޕެރެގްރާފް އިތުރުކުރޭ',
      removeParagraph: 'ޕެރެގްރާފް ފޮހޮލުކުރޭ',
      paragraph: 'ޕެރެގްރާފް',
      paragraphDv: 'ޕެރެގްރާފް (ދިވެހި)',
      paragraphEn: 'ޕެރެގްރާފް (އިނގިރޭސި)',
      trending: 'މަޝްހޫރު',
      breaking: 'އެންމެ ފަހުގެ',
      submit: 'ޚަބަރު ފޮނުވާ',
      submitting: 'ފޮނުވަނީ...',
      totalNews: 'ޖުމްލަ ޚަބަރު',
      totalVisits: 'ޖުމްލަ ޒިޔާރަތް',
      uniqueVisitors: 'ތަފާތު ޒިޔާރަތްތެރިން',
      visitorLog: 'ޒިޔާރަތް ލޮގް',
      noVisitors: 'ޒިޔާރަތްތެރިން ނެތް',
      facebookPage: 'ފޭސްބުކް ޕޭޖް',
      pageViews: 'ޕޭޖް ވިއުސް',
      pageLikes: 'ޕޭޖް ލައިކްސް',
      pageFollowers: 'ޕޭޖް ފޮލޯވަރސް',
      refreshInsights: 'އިންސައިޓްސް ރީފްރެޝް ކުރޭ',
      loadingInsights: 'ލޯޑް ވަނީ...',
      device: 'ޑިވައިސް',
      browser: 'ބްރައުޒަރު',
      os: 'އޯއެސް',
      time: 'ވަގުތު',
      screen: 'ސްކްރީން',
      referrer: 'ރިފަރަރު',
      sameDevice: 'އެއްވަނަސް ޑިވައިސް',
      newDevice: 'އަންނަ ޑިވައިސް',
      translateTitle: 'އިނގިރޭސިން ދިވެހިއަށް ތަރުޖަމާ',
      translateDesc: 'އިނގިރޭސި ލިޔުން ލިޔާ ނުވަތަ ޕޭސްޓް ކުރޭ',
      englishPlaceholder: 'މިތާނގައި އިނގިރޭސި ލިޔުން ލިޔާ...',
      translate: 'ތަރުޖަމާ ކުރޭ',
      translating: 'ތަރުޖަމާ ކުރަނީ...',
      dhivehi: 'ދިވެހި',
      copy: 'ކޮޕީ',
      loading: 'ލޯޑް ވަނީ...',
      notLoggedIn: 'ލޮގްއިން ނުވެފަ',
      pleaseLogin: 'އެޑްމިން ކޮންސޯލް ބެލުމަށް ލޮގްއިން ކުރޭ',
      typeEnglish: 'އިނގިރޭސި ލިޔުން ލިޔާ',
      translated: 'ތަރުޖަމާ ނިމިއްޖެ',
      translateError: 'ތަރުޖަމާ ކުރުމަށް ފެއިލް ވެއްޖެ. އަލުން މަސައްކަތް ކުރޭ',
      copied: 'ކްލިޕްބޯޑަށް ކޮޕީ ކުރެވިއްޖެ',
      newsCreated: 'ޚަބަރު ކުރެވިއްޖެ',
      newsError: 'ޚަބަރު ކުރުމަށް ފެއިލް ވެއްޖެ. އަލުން މަސައްކަތް ކުރޭ',
      changePassword: 'ޕާސްވޯޑް ބަދަލް ކުރޭ',
      changePasswordDesc: 'އަށް ޕާސްވޯޑް ބަދަލް ކުރޭ',
      change: 'ބަދަލް ކުރޭ',
      deleteAccount: 'އެކައުންޓް ޑިލީޓް ކުރޭ',
      deleteAccountDesc: 'އެކައުންޓް އަދި ޑޭޓާ ޑިލީޓް ކުރޭ',
      delete: 'ޑިލީޓް',
      manageNews: 'ޚަބަރު މެނޭޖް ކުރޭ',
      deleteNews: 'ޚަބަރު ޑިލީޓް ކުރޭ',
      deleteNewsDesc: 'ޚަބަރު ސިސްޓަމްއިން ޑިލީޓް ކުރޭ',
      confirmDelete: 'މި ޚަބަރު ޑިލީޓް ކުރާނީތަ؟',
      newsDeleted: 'ޚަބަރު ޑިލީޓް ކުރެވިއްޖެ',
      newsDeleteError: 'ޚަބަރު ޑިލީޓް ކުރުމަށް ފެއިލް ވެއްޖެ',
      postToFb: 'Facebook އަށް ޕޯސްޓް ކުރޭ',
      postingToFb: 'ޕޯސްޓް ކުރަނީ...',
      postedToFb: 'Facebook އަށް ޕޯސްޓް ކުރެވިއްޖެ',
      postToFbError: 'Facebook އަށް ޕޯސްޓް ކުރުމަށް ފެއިލް ވެއްޖެ',
      editNews: 'ޚަބަރު އެޑިޓް ކުރޭ',
      saveChanges: 'ބަދަލް ސޭވް ކުރޭ',
      cancel: 'ކެންސަލް',
      newsUpdated: 'ޚަބަރު އަޕްޑޭޓް ކުރެވިއްޖެ',
      newsUpdateError: 'ޚަބަރު އަޕްޑޭޓް ކުރުމަށް ފެއިލް ވެއްޖެ',
      manageBanners: 'ބެނަރު މެނޭޖް ކުރޭ',
      bannersDesc: 'ޕްރޮމޯޝަނަލް ބެނަރު އަޕްލޯޑް ކުރާ އަދި މެނޭޖް ކުރޭ',
      uploadBanner: 'ބެނަރު އަޕްލޯޑް ކުރޭ',
      bannerTitle: 'ބެނަރު ސުރުޚީ',
      bannerSubtitle: 'ބެނަރު ސަބްޓައިޓަލް',
      bannerImage: 'ބެނަރު ފޮޓޯ',
      selectImage: 'ފޮޓޯ ހޮވާ',
      uploading: 'އަޕްލޯޑް ކުރަނީ...',
      bannerUploaded: 'ބެނަރު އަޕްލޯޑް ކުރެވިއްޖެ',
      bannerUploadError: 'ބެނަރު އަޕްލޯޑް ކުރުމަށް ފެއިލް ވެއްޖެ. އަލުން މަސައްކަތް ކުރޭ',
      deleteBanner: 'ޑިލީޓް',
      confirmDeleteBanner: 'މި ބެނަރު ޑިލީޓް ކުރާނީތަ؟',
      bannerDeleted: 'ބެނަރު ޑިލީޓް ކުރެވިއްޖެ',
      bannerDeleteError: 'ބެނަރު ޑިލީޓް ކުރުމަށް ފެއިލް ވެއްޖެ',
      selectBanner: 'ބެނަރު ހޮވާ',
      noBannerSelected: 'ބެނަރެއް ހޮވާފައި ނެތް',
      currentBanner: 'މިހާރު ދައްކާ ބެނަރު',
      bannerLocation: 'ބެނަރު ހުސްކަން',
      bannerSize: 'ބެނަރު ސައިޒް',
      bannerPosition: 'ބެނަރު ހުސްކަން',
      positionTop: 'މައްޗު',
      positionMiddle: 'މެދު',
      positionBottom: 'ތިރީ',
      locationHome: 'މައި ޞަފްޙާ',
      locationArticle: 'ޚަބަރު ޞަފްޙާ',
      locationCategory: 'ކެޓަގަރީ ޞަފްޙާ',
      sizeMobile: 'މޮބައިލް',
      sizeDesktop: 'ޑެސްކްޓޮޕް',
      sizeBoth: 'ދެވަނަ (މޮބައިލް + ޑެސްކްޓޮޕް)',
    },
  };

  const t = translations[language];

  const [title, setTitle] = useState('');
  const [titleDv, setTitleDv] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [excerptDv, setExcerptDv] = useState('');
  const [category, setCategory] = useState(categories[0].id);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80');
  const [readingTime, setReadingTime] = useState(language === 'en' ? '5 min' : '5މިނިޓް');
  const [body, setBody] = useState('');
  const [bodyEn, setBodyEn] = useState('');
  const [trending, setTrending] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const [englishText, setEnglishText] = useState('');
  const [dhivehiText, setDhivehiText] = useState('');
  const [translating, setTranslating] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTitleDv, setEditTitleDv] = useState('');
  const [editExcerpt, setEditExcerpt] = useState('');
  const [editExcerptDv, setEditExcerptDv] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editBodyEn, setEditBodyEn] = useState('');
  const [editReadingTime, setEditReadingTime] = useState('5މިނިޓް');
  const [editTrending, setEditTrending] = useState(false);
  const [editBreaking, setEditBreaking] = useState(false);
  
  // Image Generator state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [overlayText, setOverlayText] = useState('');
  const [overlayText2, setOverlayText2] = useState('');
  const [bannerColor, setBannerColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(40);
  const [fontColor, setFontColor] = useState('#ffffff');
  const [fontStyle, setFontStyle] = useState<'normal' | 'bold' | 'italic' | 'bold italic'>('bold');
  const [logoPosition, setLogoPosition] = useState<'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'middle-center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'>('top-right');
  const [logoOpacity, setLogoOpacity] = useState(100);
  const [textPosition, setTextPosition] = useState<'bottom-center' | 'bottom-left' | 'bottom-right' | 'top-center' | 'top-left' | 'top-right' | 'middle-center' | 'middle-left' | 'middle-right'>('bottom-center');
  const [textPosition2, setTextPosition2] = useState<'bottom-center' | 'bottom-left' | 'bottom-right' | 'top-center' | 'top-left' | 'top-right' | 'middle-center' | 'middle-left' | 'middle-right'>('bottom-center');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dhivehiFontRef = useRef<FontFace | null>(null);

  // Load Dhivehi font
  useEffect(() => {
    const font = new FontFace('Dhivehi', 'url(/fonts/Dhivehi.ttf)');
    font.load().then((loadedFont) => {
      dhivehiFontRef.current = loadedFont;
      document.fonts.add(loadedFont);
    }).catch((error) => {
      console.error('Failed to load Dhivehi font:', error);
    });
  }, []);

  // Real-time preview regeneration
  useEffect(() => {
    if (!uploadedImage || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const logo = new Image();
      logo.onload = () => {
        const logoSize = Math.min(canvas.width, canvas.height) * 0.15;
        const logoPadding = 20;
        
        // Calculate logo position (3x3 grid)
        let logoX, logoY;
        const [vertical, horizontal] = logoPosition.split('-');
        
        switch (horizontal) {
          case 'left':
            logoX = logoPadding;
            break;
          case 'center':
            logoX = (canvas.width - logoSize) / 2;
            break;
          case 'right':
            logoX = canvas.width - logoSize - logoPadding;
            break;
          default:
            logoX = canvas.width - logoSize - logoPadding;
        }
        
        switch (vertical) {
          case 'top':
            logoY = logoPadding;
            break;
          case 'middle':
            logoY = (canvas.height - logoSize) / 2;
            break;
          case 'bottom':
            logoY = canvas.height - logoSize - logoPadding;
            break;
          default:
            logoY = logoPadding;
        }
        
        // Apply logo opacity
        ctx.globalAlpha = logoOpacity / 100;
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
        ctx.globalAlpha = 1;

        // Draw text lines with independent positions
        const fontName = dhivehiFontRef.current ? 'Dhivehi' : 'Arial';
        ctx.font = `${fontStyle} ${fontSize}px ${fontName}`;

        const textHeight = fontSize * 1.5;
        const bannerPadding = 20;
        const textSpacing = 10;
        
        // Calculate positions for both text lines
        let text1Y, text2Y;
        const [text1Vertical, text1Horizontal] = textPosition.split('-');
        const [text2Vertical, text2Horizontal] = textPosition2.split('-');
        
        // Calculate Y position helper
        const calculateY = (vertical: string, offset: number = 0) => {
          switch (vertical) {
            case 'top':
              return 20 + textHeight + offset;
            case 'middle':
              return canvas.height / 2 + textHeight / 2 + offset;
            case 'bottom':
              return canvas.height - 20 + offset;
            default:
              const isBottom = vertical === 'bottom';
              return isBottom ? canvas.height - 20 + offset : canvas.height - 20 + offset;
          }
        };
        
        // If both texts exist and share the same vertical position, stack them
        if (overlayText && overlayText2 && text1Vertical === text2Vertical) {
          const baseY = calculateY(text1Vertical);
          text1Y = baseY - textHeight - textSpacing;
          text2Y = baseY;
        } else {
          text1Y = overlayText ? calculateY(text1Vertical) : 0;
          text2Y = overlayText2 ? calculateY(text2Vertical) : 0;
        }
        
        // Draw first text line if exists
        if (overlayText) {
          let textX;
          
          switch (text1Horizontal) {
            case 'left':
              textX = bannerPadding + 50;
              ctx.textAlign = 'left';
              break;
            case 'center':
              textX = canvas.width / 2;
              ctx.textAlign = 'center';
              break;
            case 'right':
              textX = canvas.width - bannerPadding - 50;
              ctx.textAlign = 'right';
              break;
            default:
              textX = canvas.width / 2;
              ctx.textAlign = 'center';
          }
          
          ctx.textBaseline = 'bottom';
          const textMetrics = ctx.measureText(overlayText);
          const textWidth = textMetrics.width;

          let bannerX, bannerWidth;
          if (ctx.textAlign === 'center') {
            bannerX = textX - textWidth / 2 - bannerPadding;
            bannerWidth = textWidth + bannerPadding * 2;
          } else if (ctx.textAlign === 'left') {
            bannerX = textX - bannerPadding;
            bannerWidth = textWidth + bannerPadding * 2;
          } else {
            bannerX = textX - textWidth - bannerPadding;
            bannerWidth = textWidth + bannerPadding * 2;
          }

          ctx.fillStyle = bannerColor;
          ctx.fillRect(
            bannerX,
            text1Y - textHeight,
            bannerWidth,
            textHeight + 10
          );

          ctx.fillStyle = fontColor;
          ctx.fillText(overlayText, textX, text1Y);
        }
        
        // Draw second text line if exists with independent position
        if (overlayText2) {
          let textX;
          
          switch (text2Horizontal) {
            case 'left':
              textX = bannerPadding + 50;
              ctx.textAlign = 'left';
              break;
            case 'center':
              textX = canvas.width / 2;
              ctx.textAlign = 'center';
              break;
            case 'right':
              textX = canvas.width - bannerPadding - 50;
              ctx.textAlign = 'right';
              break;
            default:
              textX = canvas.width / 2;
              ctx.textAlign = 'center';
          }
          
          ctx.textBaseline = 'bottom';
          const textMetrics = ctx.measureText(overlayText2);
          const textWidth = textMetrics.width;

          let bannerX, bannerWidth;
          if (ctx.textAlign === 'center') {
            bannerX = textX - textWidth / 2 - bannerPadding;
            bannerWidth = textWidth + bannerPadding * 2;
          } else if (ctx.textAlign === 'left') {
            bannerX = textX - bannerPadding;
            bannerWidth = textWidth + bannerPadding * 2;
          } else {
            bannerX = textX - textWidth - bannerPadding;
            bannerWidth = textWidth + bannerPadding * 2;
          }

          ctx.fillStyle = bannerColor;
          ctx.fillRect(
            bannerX,
            text2Y - textHeight,
            bannerWidth,
            textHeight + 10
          );

          ctx.fillStyle = fontColor;
          ctx.fillText(overlayText2, textX, text2Y);
        }

        const dataUrl = canvas.toDataURL('image/png');
        setGeneratedImage(dataUrl);
      };

      logo.onerror = () => {
        // Draw text lines without logo with independent positions
        const fontName = dhivehiFontRef.current ? 'Dhivehi' : 'Arial';
        ctx.font = `${fontStyle} ${fontSize}px ${fontName}`;

        const textHeight = fontSize * 1.5;
        const bannerPadding = 20;
        const textSpacing = 10;
        
        // Calculate positions for both text lines
        let text1Y, text2Y;
        const [text1Vertical, text1Horizontal] = textPosition.split('-');
        const [text2Vertical, text2Horizontal] = textPosition2.split('-');
        
        // Calculate Y position helper
        const calculateY = (vertical: string, offset: number = 0) => {
          switch (vertical) {
            case 'top':
              return 20 + textHeight + offset;
            case 'middle':
              return canvas.height / 2 + textHeight / 2 + offset;
            case 'bottom':
              return canvas.height - 20 + offset;
            default:
              return canvas.height - 20 + offset;
          }
        };
        
        // If both texts exist and share the same vertical position, stack them
        if (overlayText && overlayText2 && text1Vertical === text2Vertical) {
          const baseY = calculateY(text1Vertical);
          text1Y = baseY - textHeight - textSpacing;
          text2Y = baseY;
        } else {
          text1Y = overlayText ? calculateY(text1Vertical) : 0;
          text2Y = overlayText2 ? calculateY(text2Vertical) : 0;
        }
        
        // Draw first text line if exists
        if (overlayText) {
          let textX;
          
          switch (text1Horizontal) {
            case 'left':
              textX = bannerPadding + 50;
              ctx.textAlign = 'left';
              break;
            case 'center':
              textX = canvas.width / 2;
              ctx.textAlign = 'center';
              break;
            case 'right':
              textX = canvas.width - bannerPadding - 50;
              ctx.textAlign = 'right';
              break;
            default:
              textX = canvas.width / 2;
              ctx.textAlign = 'center';
          }
          
          ctx.textBaseline = 'bottom';
          const textMetrics = ctx.measureText(overlayText);
          const textWidth = textMetrics.width;

          let bannerX, bannerWidth;
          if (ctx.textAlign === 'center') {
            bannerX = textX - textWidth / 2 - bannerPadding;
            bannerWidth = textWidth + bannerPadding * 2;
          } else if (ctx.textAlign === 'left') {
            bannerX = textX - bannerPadding;
            bannerWidth = textWidth + bannerPadding * 2;
          } else {
            bannerX = textX - textWidth - bannerPadding;
            bannerWidth = textWidth + bannerPadding * 2;
          }

          ctx.fillStyle = bannerColor;
          ctx.fillRect(
            bannerX,
            text1Y - textHeight,
            bannerWidth,
            textHeight + 10
          );

          ctx.fillStyle = fontColor;
          ctx.fillText(overlayText, textX, text1Y);
        }
        
        // Draw second text line if exists with independent position
        if (overlayText2) {
          let textX;
          
          switch (text2Horizontal) {
            case 'left':
              textX = bannerPadding + 50;
              ctx.textAlign = 'left';
              break;
            case 'center':
              textX = canvas.width / 2;
              ctx.textAlign = 'center';
              break;
            case 'right':
              textX = canvas.width - bannerPadding - 50;
              ctx.textAlign = 'right';
              break;
            default:
              textX = canvas.width / 2;
              ctx.textAlign = 'center';
          }
          
          ctx.textBaseline = 'bottom';
          const textMetrics = ctx.measureText(overlayText2);
          const textWidth = textMetrics.width;

          let bannerX, bannerWidth;
          if (ctx.textAlign === 'center') {
            bannerX = textX - textWidth / 2 - bannerPadding;
            bannerWidth = textWidth + bannerPadding * 2;
          } else if (ctx.textAlign === 'left') {
            bannerX = textX - bannerPadding;
            bannerWidth = textWidth + bannerPadding * 2;
          } else {
            bannerX = textX - textWidth - bannerPadding;
            bannerWidth = textWidth + bannerPadding * 2;
          }

          ctx.fillStyle = bannerColor;
          ctx.fillRect(
            bannerX,
            text2Y - textHeight,
            bannerWidth,
            textHeight + 10
          );

          ctx.fillStyle = fontColor;
          ctx.fillText(overlayText2, textX, text2Y);
        }

        const dataUrl = canvas.toDataURL('image/png');
        setGeneratedImage(dataUrl);
      };

      logo.src = '/logo.png';
    };

    img.src = uploadedImage;
  }, [uploadedImage, overlayText, overlayText2, bannerColor, fontSize, fontColor, fontStyle, logoPosition, logoOpacity, textPosition, textPosition2]);
  
  // Notifications state
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  
  // Article image upload state
  const [articleFile, setArticleFile] = useState<File | null>(null);
  const [uploadingArticle, setUploadingArticle] = useState(false);
  const [editArticleFile, setEditArticleFile] = useState<File | null>(null);
  const [uploadingEditArticle, setUploadingEditArticle] = useState(false);
  
  // Banner management state
  const [banners, setBanners] = useState<any[]>([]);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerLocation, setBannerLocation] = useState<'home' | 'article' | 'category'>('home');
  const [bannerPosition, setBannerPosition] = useState<'top' | 'middle' | 'bottom'>('top');
  const [bannerSize, setBannerSize] = useState<'mobile' | 'desktop' | 'both'>('both');
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [bannerError, setBannerError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    document.body.classList.toggle('light', theme === 'light');
  }, [theme]);

  const loadDashboard = async () => {
    try {
      const articleSnapshot = await getDocs(query(collection(db, 'articles'), orderBy('createdAt', 'desc'), limit(20)));
      const articlesData = articleSnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) }));
      setArticles(articlesData);
      setArticlesCount(articleSnapshot.size);
      
      // Load banners
      const bannerSnapshot = await getDocs(query(collection(db, 'banners'), orderBy('createdAt', 'desc')));
      const bannersData = bannerSnapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) }));
      setBanners(bannersData);
    } catch (error) {
      console.warn('Unable to load dashboard data', error);
    }
  };

  // Load visitor tracking data from Firestore (real-time)
  useEffect(() => {
    if (!user) return;

    const visitorQuery = query(collection(db, 'visitors'), orderBy('timestamp', 'desc'), limit(1000));
    const unsubscribe = onSnapshot(visitorQuery, (snapshot) => {
      const visitors = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) }));
      setVisitorDetails(visitors);

      // Calculate unique visitors based on user agent (as a proxy for unique users)
      const uniqueUserAgents = new Set(visitors.map((item: any) => item.userAgent)).size;
      setUniqueVisitors(uniqueUserAgents);
    }, (error) => {
      console.error('Error fetching visitors:', error);
    });

    return () => unsubscribe();
  }, [user]);

  // Load notifications data
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const articlesQuery = query(
          collection(db, 'articles'),
          orderBy('createdAt', 'desc'),
          limit(10)
        );
        const snapshot = await getDocs(articlesQuery);
        
        const articleNotifications = snapshot.docs.map(doc => {
          const data = doc.data();
          const title = data.title || data.titleEn || 'ޚަބަރު';
          const createdAt = data.createdAt;
          let time = 'އަވަސްޓެއް ނުވެއެވެ';
          
          if (createdAt) {
            const date = new Date(createdAt.seconds * 1000);
            const now = new Date();
            const diffMs = now.getTime() - date.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);
            
            if (diffMins < 1) {
              time = 'ހަތަރުވަނަ ހިސާބުގައި';
            } else if (diffMins < 60) {
              time = `${diffMins} މިނިޓް ކުރިން`;
            } else if (diffHours < 24) {
              time = `${diffHours} ގަޑިއަކު ކުރިން`;
            } else {
              time = `${diffDays} ދުވަސް ކުރިން`;
            }
          }
          
          return {
            id: doc.id,
            title: `އާ ޚަބަރު: ${title}`,
            time,
            articleId: doc.id
          };
        });
        
        setNotifications(articleNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, []);


  // Load Facebook insights
  const loadFacebookInsights = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    if (loadingInsights) return;
    setLoadingInsights(true);
    try {
      const result = await getFacebookPageInsights();
      if (result.success) {
        setFacebookInsights(result.insights);
      } else {
        console.error('Failed to load Facebook insights:', result.error);
      }
    } catch (error) {
      console.error('Error loading Facebook insights:', error);
    } finally {
      setLoadingInsights(false);
    }
    return false;
  };

  // Helper function to parse user agent for old records
  const parseUserAgent = (userAgent: string) => {
    if (!userAgent) return { deviceType: 'Unknown', browser: 'Unknown', os: 'Unknown' };

    const uaLower = userAgent.toLowerCase();

    // Detect device type
    let deviceType = 'desktop';
    if (/mobile|android|iphone|ipod/i.test(userAgent)) {
      deviceType = 'mobile';
    } else if (/tablet|ipad/i.test(userAgent)) {
      deviceType = 'tablet';
    }

    // Detect browser
    let browser = 'other';
    if (uaLower.includes('chrome') && !uaLower.includes('edg')) browser = 'chrome';
    else if (uaLower.includes('firefox')) browser = 'firefox';
    else if (uaLower.includes('safari') && !uaLower.includes('chrome')) browser = 'safari';
    else if (uaLower.includes('edg')) browser = 'edge';
    else if (uaLower.includes('opera') || uaLower.includes('opr')) browser = 'opera';

    // Detect OS
    let os = 'other';
    if (uaLower.includes('windows nt')) os = 'windows';
    else if (uaLower.includes('mac os x')) os = 'macos';
    else if (uaLower.includes('linux')) os = 'linux';
    else if (uaLower.includes('android')) os = 'android';
    else if (uaLower.includes('ios') || uaLower.includes('iphone') || uaLower.includes('ipad')) os = 'ios';

    return { deviceType, browser, os };
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        loadDashboard();
      }
    });

    return () => unsubscribe();
  }, []);

  const handleTranslate = async () => {
    if (!englishText.trim()) {
      setMessage(t.typeEnglish);
      return;
    }
    setTranslating(true);
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(englishText)}&langpair=en|dv`
      );
      const data = await response.json();
      if (data.responseStatus === 200) {
        setDhivehiText(data.responseData.translatedText);
        setMessage(t.translated);
      } else {
        setMessage(t.translateError);
      }
    } catch (error) {
      setMessage(t.translateError);
      console.error(error);
    } finally {
      setTranslating(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setMessage(t.logout);
    navigate('/admin');
  };

  const handleCreateArticle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      setMessage(t.notLoggedIn);
      return;
    }

    setSubmitting(true);
    try {
      // Upload image if file is selected
      let finalImageUrl = imageUrl;
      if (articleFile) {
        setUploadingArticle(true);
        try {
          finalImageUrl = await uploadImage(articleFile, 'articles');
        } catch (uploadError) {
          setMessage(t.newsError + ': Failed to upload image');
          setSubmitting(false);
          setUploadingArticle(false);
          return;
        }
        setUploadingArticle(false);
      }
      
      // Generate numeric ID starting from 1000
      const articlesSnapshot = await getDocs(query(collection(db, 'articles'), orderBy('createdAt', 'desc'), limit(1)));
      let nextId = 1000;
      if (!articlesSnapshot.empty) {
        const lastArticle = articlesSnapshot.docs[0].data();
        const lastId = parseInt(lastArticle.id || '0');
        if (!isNaN(lastId) && lastId >= 1000) {
          nextId = lastId + 1;
        }
      }
      
      const articleId = nextId.toString();
      
      await setDoc(doc(db, 'articles', articleId), {
        id: articleId,
        title: titleDv || title,
        titleEn: title,
        excerpt: excerptDv || excerpt,
        excerptEn: excerpt,
        category,
        image: finalImageUrl,
        publishedAt: new Date().toLocaleDateString('dv'),
        author: user.email || 'admin',
        views: 0,
        readingTime,
        body,
        bodyEn,
        trending,
        breaking,
        createdAt: serverTimestamp(),
      });

      setMessage(t.newsCreated);

      // Don't reload dashboard to allow viewing console logs
      // loadDashboard();

      setTitle('');
      setTitleDv('');
      setExcerpt('');
      setExcerptDv('');
      setImageUrl('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80');
      setArticleFile(null);
      setBody('');
      setBodyEn('');
      setTrending(false);
      setBreaking(false);
      // Don't reload dashboard to allow viewing console logs
      // loadDashboard();
    } catch (error) {
      setMessage(t.newsError);
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteArticle = async (articleId: string, facebookPostId?: string) => {
    if (!confirm(t.confirmDelete)) {
      return;
    }

    try {
      // Delete from Facebook if post ID exists
      if (facebookPostId) {
        const fbResult = await deleteFromFacebook(facebookPostId);
        if (!fbResult.success) {
          console.error('Failed to delete from Facebook:', fbResult.error);
        }
      }

      // Delete from Firebase
      await deleteDoc(doc(db, 'articles', articleId));
      
      setMessage(t.newsDeleted);
      loadDashboard();
    } catch (error) {
      setMessage(t.newsDeleteError);
      console.error(error);
    }
  };

  const shareArticleToFacebook = async (article: any) => {
    const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    const articleUrl = `${appUrl}/article/${article.id}`;
    const fbTitle = article.title || article.titleEn || '';
    const fbExcerpt = article.excerpt || article.excerptEn || '';
    const fbImage = article.image || '';
    const message = [fbTitle, fbExcerpt].filter(Boolean).join('\n\n').trim();

    // Use Facebook JavaScript SDK feed dialog with explicit content
    if ((window as any).FB) {
      (window as any).FB.ui({
        method: 'feed',
        link: articleUrl,
        picture: fbImage,
        name: fbTitle,
        caption: 'ހަވާއިން ޙަބަރު',
        description: fbExcerpt,
      }, (response: any) => {
        if (response && !response.error_message) {
          updateDoc(doc(db, 'articles', article.id), { facebookPostId: 'manual-share' });
        }
      });
    } else {
      // Fallback to URL-based sharing with quote parameter
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}&quote=${encodeURIComponent(message)}`;
      window.open(facebookShareUrl, '_blank', 'width=600,height=400');
    }

    // Mark as posted (user will complete the post manually)
    await updateDoc(doc(db, 'articles', article.id), { facebookPostId: 'manual-share' });
    setMessage(t.postedToFb);
  };

  const handlePostToFacebook = async (article: any, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    try {
      await shareArticleToFacebook(article);
    } catch (error) {
      setMessage(t.postToFbError);
      console.error(error);
    }
  };

  const handleEditArticle = (article: any) => {
    setEditingArticle(article);
    setEditTitle(article.titleEn || '');
    setEditTitleDv(article.title || '');
    setEditExcerpt(article.excerptEn || '');
    setEditExcerptDv(article.excerpt || '');
    setEditImageUrl(article.image || '');
    setEditCategory(article.category || '');
    setEditBody(Array.isArray(article.body) ? article.body.join(' ') : (article.body || ''));
    setEditBodyEn(Array.isArray(article.bodyEn) ? article.bodyEn.join(' ') : (article.bodyEn || ''));
    setEditReadingTime(article.readingTime || '5މިނިޓް');
    setEditTrending(article.trending || false);
    setEditBreaking(article.breaking || false);
  };

  const handleSaveEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingArticle) return;

    try {
      // Upload image if file is selected
      let finalImageUrl = editImageUrl;
      if (editArticleFile) {
        setUploadingEditArticle(true);
        try {
          finalImageUrl = await uploadImage(editArticleFile, 'articles');
        } catch (uploadError) {
          setMessage(t.newsUpdateError + ': Failed to upload image');
          setUploadingEditArticle(false);
          return;
        }
        setUploadingEditArticle(false);
      }
      
      await updateDoc(doc(db, 'articles', editingArticle.id), {
        title: editTitleDv || editTitle,
        titleEn: editTitle,
        excerpt: editExcerptDv || editExcerpt,
        excerptEn: editExcerpt,
        image: finalImageUrl,
        category: editCategory,
        body: editBody,
        bodyEn: editBodyEn,
        readingTime: editReadingTime,
        trending: editTrending,
        breaking: editBreaking,
      });

      setMessage(t.newsUpdated);
      setEditingArticle(null);
      setEditArticleFile(null);
      loadDashboard();
    } catch (error) {
      setMessage(t.newsUpdateError);
      console.error(error);
    }
  };

  const handleBannerUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!bannerFile || !user) {
      setMessage('Please select an image');
      return;
    }

    // Validate image size based on selected size option
    const img = new Image();
    const imageUrl = URL.createObjectURL(bannerFile);
    
    img.onload = async () => {
      const width = img.width;
      const height = img.height;
      URL.revokeObjectURL(imageUrl);

      // Validation rules
      const isMobile = window.innerWidth < 768;
      let isValid = true;
      let errorMessage = '';

      if (bannerSize === 'mobile') {
        // Mobile banners should be optimized for mobile (max 768px width)
        if (width > 768) {
          isValid = false;
          errorMessage = 'Mobile banners should be max 768px wide. Please resize the image or select "Both Mobile & Desktop" option.';
        }
      } else if (bannerSize === 'desktop') {
        // Desktop banners should be at least 768px wide
        if (width < 768) {
          isValid = false;
          errorMessage = 'Desktop banners should be at least 768px wide. Please use a larger image or select "Both Mobile & Desktop" option.';
        }
      }
      // 'both' option accepts any size

      if (!isValid) {
        setBannerError(errorMessage);
        setMessage(errorMessage);
        return;
      }

      // Proceed with upload if validation passes
      await uploadToCloudinary();
    };

    img.onerror = () => {
      setBannerError('Failed to load image. Please try a different file.');
      setMessage('Failed to load image. Please try a different file.');
    };

    img.src = imageUrl;
  };

  const uploadToCloudinary = async () => {
    if (!bannerFile) return;

    setUploadingBanner(true);
    setBannerError('');
    try {
      // Upload to Cloudinary
      const imageUrl = await uploadImage(bannerFile, 'banners');
      
      // Save to Firebase
      const bannerRef = await addDoc(collection(db, 'banners'), {
        title: bannerTitle,
        subtitle: bannerSubtitle,
        image: imageUrl,
        location: bannerLocation,
        position: bannerPosition,
        size: bannerSize,
        createdAt: serverTimestamp(),
      });

      setMessage(t.bannerUploaded);
      setBannerFile(null);
      setBannerTitle('');
      setBannerSubtitle('');
      setBannerLocation('home');
      setBannerPosition('top');
      setBannerSize('both');
      loadDashboard();
    } catch (error) {
      setMessage(t.bannerUploadError);
      console.error(error);
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleDeleteBanner = async (bannerId: string) => {
    if (!confirm(t.confirmDeleteBanner)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'banners', bannerId));
      setMessage(t.bannerDeleted);
      loadDashboard();
    } catch (error) {
      setMessage(t.bannerDeleteError);
      console.error(error);
    }
  };

  const visitorCount = visitorDetails?.length ?? 0;
  const topVisitors = Array.isArray(visitorDetails) ? visitorDetails.slice(0, 8) : [];

  if (user === undefined) {
    return (
      <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-8 shadow-soft text-right">
        <h2 className="text-2xl font-semibold text-white">{t.loading}</h2>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-8 shadow-soft text-right">
        <h2 className="text-2xl font-semibold text-white">{t.notLoggedIn}</h2>
        <p className="mt-4 text-slate-400">{t.pleaseLogin}</p>
      </div>
    );
  }

  return (
    <motion.div className="space-y-8 text-right" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      {/* Header */}
      <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">{t.adminPanel}</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-white">{t.adminDashboard}</h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'dv' : 'en')}
              className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-950/80 text-slate-300 transition hover:border-slate-500 hover:text-white"
              aria-label="Toggle language"
              title="Toggle language"
            >
              {language === 'en' ? '🇬🇧' : '🇲🇻'}
            </button>
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-950/80 text-slate-300 transition hover:border-slate-500 hover:text-white"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            {user && (
            <div className="rounded-3xl bg-slate-950/90 p-3 sm:p-4 text-xs sm:text-sm text-slate-300 shadow-soft">
              <p>{t.news}: {articlesCount}</p>
              <p>{t.visits}: {visitorCount}</p>
              <button
                onClick={handleLogout}
                className="mt-2 sm:mt-3 w-full rounded-2xl border border-rose-600 px-2 sm:px-3 py-2 text-rose-400 transition hover:bg-rose-600/20"
              >
                {t.logout}
              </button>
            </div>
          )}
          </div>
        </div>
        {message && (
          <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400 animate-in fade-in slide-in-from-top-2 duration-300">
            {message}
          </div>
        )}
      </div>

      {/* Admin Content */}
      <>
        {/* Tabs */}
        <div className="flex gap-1 sm:gap-2 border-b border-slate-800 pb-3 sm:pb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
          {(['articles', 'manage', 'banners', 'analytics', 'settings', 'imageGenerator', 'notifications'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-full px-1.5 sm:px-3 py-1 sm:py-2 text-[10px] sm:text-sm font-semibold transition whitespace-nowrap flex-shrink-0 ${
                activeTab === tab
                  ? 'bg-brand-500 text-slate-950'
                  : 'border border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              {tab === 'articles' && t.createNews}
              {tab === 'manage' && t.manageNews}
              {tab === 'banners' && t.manageBanners}
              {tab === 'analytics' && t.analytics}
              {tab === 'settings' && t.settings}
              {tab === 'imageGenerator' && t.imageGenerator}
              {tab === 'notifications' && 'ނޮޓިފިކޭޝަންތައް'}
            </button>
          ))}
        </div>

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
            <h3 className="text-2xl font-bold text-white">{t.createNews}</h3>
            <p className="mt-2 text-sm text-slate-400">{t.newsDescription}</p>
            <form onSubmit={handleCreateArticle} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-300">{t.titleDv}</label>
                  <input
                    value={titleDv}
                    onChange={(e) => setTitleDv(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder="ޚަބަރުގެ ހެޑްލައިން ލިޔުން..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300">{t.title}</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder="Type headline in English..."
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-300">{t.category}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300">Category (English)</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.titleEn}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300">{t.excerptDv}</label>
                <input
                  value={excerptDv}
                  onChange={(e) => setExcerptDv(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                  placeholder="ޚަބަރުގެ ކުރުތަކެއް ލިޔުން..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300">{t.excerpt}</label>
                <input
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                  placeholder="Type short description in English..."
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-300">{t.photoUrl}</label>
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setArticleFile(e.target.files?.[0] || null)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300">{t.readingTime}</label>
                <select
                  value={readingTime}
                  onChange={(e) => setReadingTime(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((min) => (
                    <option key={min} value={`${min}މިނިޓް`}>
                      {min} މިނިޓް / {min} min
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">{t.newsContent}</label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">{t.paragraphDv}</label>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      className="min-h-[200px] w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brand-400"
                      placeholder="ޚަބަރުގެ މައްޗާ ލިޔުން..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">{t.paragraphEn}</label>
                    <textarea
                      value={bodyEn}
                      onChange={(e) => setBodyEn(e.target.value)}
                      className="min-h-[200px] w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brand-400"
                      placeholder="Type article content in English..."
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <label className="inline-flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={trending}
                    onChange={(e) => setTrending(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                  />
                  {t.trending}
                </label>
                <label className="inline-flex items-center gap-2 text-slate-300">
                  <input
                    type="checkbox"
                    checked={breaking}
                    onChange={(e) => setBreaking(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                  />
                  {t.breaking}
                </label>
              </div>
              <button
                disabled={submitting}
                className="w-full rounded-3xl bg-brand-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? t.submitting : t.submit}
              </button>
            </form>
          </div>
        )}

        {/* Manage Tab */}
        {activeTab === 'manage' && (
          <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
            <h3 className="text-2xl font-bold text-white">{t.manageNews}</h3>
            <p className="mt-2 text-sm text-slate-400">{t.deleteNewsDesc}</p>
            <div className="mt-6 space-y-3">
              {articles.length > 0 ? (
                articles.map((article) => (
                  <div key={article.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{article.title}</h4>
                        <p className="mt-1 text-xs text-slate-400">{article.publishedAt}</p>
                        {article.facebookPostId ? (
                          <p className="mt-1 text-xs text-emerald-400">✓ Posted to Facebook</p>
                        ) : (
                          <p className="mt-1 text-xs text-slate-500">Not posted to Facebook</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={(e) => handlePostToFacebook(article, e)}
                          className="rounded-xl border border-blue-600 px-3 py-1.5 text-sm text-blue-400 transition hover:bg-blue-600/20"
                        >
                          {t.postToFb}
                        </button>
                        <button
                          onClick={() => handleEditArticle(article)}
                          className="rounded-xl border border-emerald-600 px-3 py-1.5 text-sm text-emerald-400 transition hover:bg-emerald-600/20"
                        >
                          {t.editNews}
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article.id, article.facebookPostId)}
                          className="rounded-xl border border-rose-600 px-3 py-1.5 text-sm text-rose-400 transition hover:bg-rose-600/20"
                        >
                          {t.delete}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400">{t.noVisitors}</p>
              )}
            </div>
          </div>
        )}

        {/* Banners Tab */}
        {activeTab === 'banners' && (
          <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
            <h3 className="text-2xl font-bold text-white">{t.manageBanners}</h3>
            <p className="mt-2 text-sm text-slate-400">{t.bannersDesc}</p>
            
            {/* Upload Form */}
            <form onSubmit={handleBannerUpload} className="mt-6 space-y-4">
              {bannerError && (
                <div className="rounded-2xl border border-rose-600 bg-rose-600/10 p-4 text-rose-400">
                  {bannerError}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-300">{t.bannerTitle}</label>
                <input
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                  placeholder={t.bannerTitle}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300">{t.bannerSubtitle}</label>
                <input
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                  placeholder={t.bannerSubtitle}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-semibold text-slate-300">{t.bannerLocation}</label>
                  <select
                    value={bannerLocation}
                    onChange={(e) => setBannerLocation(e.target.value as 'home' | 'article' | 'category')}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    required
                  >
                    <option value="home">{t.locationHome}</option>
                    <option value="article">{t.locationArticle}</option>
                    <option value="category">{t.locationCategory}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300">{t.bannerPosition}</label>
                  <select
                    value={bannerPosition}
                    onChange={(e) => setBannerPosition(e.target.value as 'top' | 'middle' | 'bottom')}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    required
                  >
                    <option value="top">{t.positionTop}</option>
                    <option value="middle">{t.positionMiddle}</option>
                    <option value="bottom">{t.positionBottom}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300">{t.bannerSize}</label>
                  <select
                    value={bannerSize}
                    onChange={(e) => setBannerSize(e.target.value as 'mobile' | 'desktop' | 'both')}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    required
                  >
                    <option value="mobile">{t.sizeMobile}</option>
                    <option value="desktop">{t.sizeDesktop}</option>
                    <option value="both">{t.sizeBoth}</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300">{t.bannerImage}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                  className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                  required
                />
              </div>
              <button
                disabled={uploadingBanner}
                className="w-full rounded-3xl bg-brand-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {uploadingBanner ? t.uploading : t.uploadBanner}
              </button>
            </form>

            {/* Banners List */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-white mb-4">{t.manageBanners}</h4>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {banners.length > 0 ? (
                  banners.map((banner) => (
                    <div key={banner.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                      <img src={banner.image} alt={banner.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                      <h4 className="font-semibold text-white text-sm">{banner.title}</h4>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs">
                        <span className="px-2 py-1 rounded-full bg-slate-800 text-slate-300">
                          {banner.location === 'home' ? t.locationHome : banner.location === 'article' ? t.locationArticle : t.locationCategory}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-slate-800 text-slate-300">
                          {banner.position === 'top' ? t.positionTop : t.positionBottom}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-slate-800 text-slate-300">
                          {banner.size === 'mobile' ? t.sizeMobile : banner.size === 'desktop' ? t.sizeDesktop : t.sizeBoth}
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2 relative z-10">
                        <button
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="w-full rounded-xl border border-rose-600 px-3 py-1.5 text-xs text-rose-400 transition hover:bg-rose-600/20 cursor-pointer"
                        >
                          {t.deleteBanner}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 col-span-full">No banners uploaded yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
              <h3 className="text-2xl font-bold text-white">{t.editNews}</h3>
              <form onSubmit={handleSaveEdit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300">{t.titleDv}</label>
                    <input
                      value={editTitleDv}
                      onChange={(e) => setEditTitleDv(e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                      placeholder="ޚަބަރުގެ ހެޑްލައިން ލިޔުން..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300">{t.title}</label>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                      placeholder="Type headline in English..."
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300">{t.category}</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300">Category (English)</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                      required
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.titleEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300">{t.excerptDv}</label>
                  <input
                    value={editExcerptDv}
                    onChange={(e) => setEditExcerptDv(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder="ޚަބަރުގެ ކުރުތަކެއް ލިޔުން..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300">{t.excerpt}</label>
                  <input
                    value={editExcerpt}
                    onChange={(e) => setEditExcerpt(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder="Type short description in English..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300">{t.photoUrl}</label>
                  <input
                    value={editImageUrl}
                    onChange={(e) => setEditImageUrl(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300">Upload Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditArticleFile(e.target.files?.[0] || null)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300">{t.readingTime}</label>
                  <select
                    value={editReadingTime}
                    onChange={(e) => setEditReadingTime(e.target.value)}
                    className="mt-2 w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((min) => (
                      <option key={min} value={`${min}މިނިޓް`}>
                        {min} މިނިޓް / {min} min
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">{t.newsContent}</label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">{t.paragraphDv}</label>
                      <textarea
                        value={editBody}
                        onChange={(e) => setEditBody(e.target.value)}
                        className="min-h-[200px] w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brand-400"
                        placeholder="ޚަބަރުގެ މައްޗާ ލިޔުން..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">{t.paragraphEn}</label>
                      <textarea
                        value={editBodyEn}
                        onChange={(e) => setEditBodyEn(e.target.value)}
                        className="min-h-[200px] w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-brand-400"
                        placeholder="Type article content in English..."
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <label className="inline-flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={editTrending}
                      onChange={(e) => setEditTrending(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                    />
                    {t.trending}
                  </label>
                  <label className="inline-flex items-center gap-2 text-slate-300">
                    <input
                      type="checkbox"
                      checked={editBreaking}
                      onChange={(e) => setEditBreaking(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-700 bg-slate-950"
                    />
                    {t.breaking}
                  </label>
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 rounded-3xl bg-brand-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-brand-400"
                  >
                    {t.saveChanges}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingArticle(null)}
                    className="flex-1 rounded-3xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800/80"
                  >
                    {t.cancel}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
              <h3 className="text-xl font-semibold text-white">{t.analytics}</h3>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-slate-950/80 p-4">
                  <p className="text-sm text-slate-400">{t.totalNews}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{articlesCount}</p>
                </div>
                <div className="rounded-2xl bg-slate-950/80 p-4">
                  <p className="text-sm text-slate-400">{t.totalVisits}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{visitorCount}</p>
                </div>
                <div className="rounded-2xl bg-slate-950/80 p-4">
                  <p className="text-sm text-slate-400">{t.uniqueVisitors}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{uniqueVisitors}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">{t.facebookPage}</h3>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                    loadFacebookInsights();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      loadFacebookInsights();
                    }
                  }}
                  className={`rounded-2xl border border-slate-700 bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-800/80 cursor-pointer select-none ${loadingInsights ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loadingInsights ? t.loadingInsights : t.refreshInsights}
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {facebookInsights ? (
                  <>
                    <div className="rounded-2xl bg-slate-950/80 p-4">
                      <p className="text-sm text-slate-400">{t.pageViews}</p>
                      <p className="mt-2 text-3xl font-bold text-white">{facebookInsights.page_views || 'N/A'}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-950/80 p-4">
                      <p className="text-sm text-slate-400">{t.pageLikes}</p>
                      <p className="mt-2 text-3xl font-bold text-white">{facebookInsights.page_likes || 'N/A'}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-950/80 p-4">
                      <p className="text-sm text-slate-400">{t.pageFollowers}</p>
                      <p className="mt-2 text-3xl font-bold text-white">{facebookInsights.page_followers || 'N/A'}</p>
                    </div>
                  </>
                ) : (
                  <div className="rounded-2xl bg-slate-950/80 p-4">
                    <p className="text-sm text-slate-400">{loadingInsights ? t.loadingInsights : 'Click refresh to load insights'}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
              <h3 className="text-xl font-semibold text-white">{t.visitorLog}</h3>
              <div className="mt-4 space-y-3 text-sm max-h-96 overflow-y-auto">
                {topVisitors.length > 0 ? (
                  topVisitors.map((visitor) => {
                    const parsed = parseUserAgent(visitor.userAgent);
                    return (
                      <div key={visitor.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-semibold text-white">{visitor.path || 'Home'}</p>
                            <div className="mt-2 space-y-1 text-xs text-slate-400">
                              <p><span className="text-slate-500">{t.device}:</span> {visitor.deviceType || parsed.deviceType}</p>
                              <p><span className="text-slate-500">{t.browser}:</span> {visitor.browser || parsed.browser}</p>
                              <p><span className="text-slate-500">{t.os}:</span> {visitor.os || parsed.os}</p>
                              <p><span className="text-slate-500">{t.screen}:</span> {visitor.screenResolution || visitor.viewport || 'Not available'}</p>
                              <p><span className="text-slate-500">{t.referrer}:</span> {visitor.referrer || 'Direct'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">
                              {visitor.timestamp ? new Date(visitor.timestamp.seconds * 1000).toLocaleString() : visitor.visitTime || 'Unknown'}
                            </p>
                            <p className="text-xs text-slate-500">{visitor.timezone || 'Unknown'}</p>
                            <p className="mt-1 text-xs text-slate-400">
                              {visitor.isNewVisitor ? '🆕 New' : '↩️ Return'}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {visitor.isSameDevice !== undefined ? (visitor.isSameDevice ? `📱 ${t.sameDevice}` : `🆕 ${t.newDevice}`) : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-slate-400">{t.noVisitors}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
            <h3 className="text-2xl font-bold text-white">{t.settings}</h3>
            <div className="mt-6 space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h4 className="font-semibold text-white">{t.translateTitle}</h4>
                <p className="mt-2 text-sm text-slate-400">{t.translateDesc}</p>
                <div className="mt-4 space-y-3">
                  <textarea
                    value={englishText}
                    onChange={(e) => setEnglishText(e.target.value)}
                    className="min-h-[80px] w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                    placeholder={t.englishPlaceholder}
                  />
                  <button
                    onClick={handleTranslate}
                    disabled={translating || !englishText.trim()}
                    className="w-full rounded-2xl bg-brand-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {translating ? t.translating : t.translate}
                  </button>
                  {dhivehiText && (
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                      <p className="text-sm font-semibold text-emerald-400 mb-2">{t.dhivehi}:</p>
                      <p className="text-slate-100">{dhivehiText}</p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(dhivehiText);
                          setMessage(t.copied);
                        }}
                        className="mt-3 rounded-xl border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-800/80"
                      >
                        {t.copy}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h4 className="font-semibold text-white">{t.changePassword}</h4>
                <p className="mt-2 text-sm text-slate-400">{t.changePasswordDesc}</p>
                <button className="mt-4 rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-800/80">
                  {t.change}
                </button>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h4 className="font-semibold text-white">{t.deleteAccount}</h4>
                <p className="mt-2 text-sm text-slate-400">{t.deleteAccountDesc}</p>
                <button className="mt-4 rounded-2xl border border-rose-600 px-4 py-2 text-sm text-rose-400 transition hover:bg-rose-600/20">
                  {t.delete}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Generator Tab */}
        {activeTab === 'imageGenerator' && (
          <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
            <h3 className="text-2xl font-bold text-white">{t.imageGenerator}</h3>
            <div className="mt-6 space-y-6">
              {/* Upload Section */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h4 className="font-semibold text-white mb-3">އިމޭޖް އަޕްލޯޑް ކުރުން</h4>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setUploadedImage(event.target?.result as string);
                        setGeneratedImage(null);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                />
              </div>

              {/* Text Input Section */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h4 className="font-semibold text-white mb-3">ޓެކްސްޓް އިންޕުޓް</h4>
                <input
                  type="text"
                  value={overlayText}
                  onChange={(e) => setOverlayText(e.target.value)}
                  placeholder="އެއްވެސް ޓެކްސްޓެއް ލިޔުން..."
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400 mb-2"
                />
                <input
                  type="text"
                  value={overlayText2}
                  onChange={(e) => setOverlayText2(e.target.value)}
                  placeholder="ދެވަނަ ރޯގަލް (އޮޕްޝަނަލް)"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-400"
                />
              </div>

              {/* Logo Position Section */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h4 className="font-semibold text-white mb-3">ލޮގޯ ޕޮޒިޝަން</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setLogoPosition('top-left')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      logoPosition === 'top-left'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Top Left
                  </button>
                  <button
                    onClick={() => setLogoPosition('top-center')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      logoPosition === 'top-center'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Top Center
                  </button>
                  <button
                    onClick={() => setLogoPosition('top-right')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      logoPosition === 'top-right'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Top Right
                  </button>
                  <button
                    onClick={() => setLogoPosition('middle-left')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      logoPosition === 'middle-left'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Middle Left
                  </button>
                  <button
                    onClick={() => setLogoPosition('middle-center')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      logoPosition === 'middle-center'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Center
                  </button>
                  <button
                    onClick={() => setLogoPosition('middle-right')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      logoPosition === 'middle-right'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Middle Right
                  </button>
                  <button
                    onClick={() => setLogoPosition('bottom-left')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      logoPosition === 'bottom-left'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Bottom Left
                  </button>
                  <button
                    onClick={() => setLogoPosition('bottom-center')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      logoPosition === 'bottom-center'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Bottom Center
                  </button>
                  <button
                    onClick={() => setLogoPosition('bottom-right')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      logoPosition === 'bottom-right'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Bottom Right
                  </button>
                </div>
              </div>

              {/* Logo Opacity Section */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h4 className="font-semibold text-white mb-3">ލޮގޯ އޮޕެސިޓީ</h4>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={logoOpacity}
                    onChange={(e) => setLogoOpacity(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-slate-700 appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-slate-400 w-16 text-right">{logoOpacity}%</span>
                </div>
              </div>

              {/* Text Position Section */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h4 className="font-semibold text-white mb-3">ޓެކްސްޓް ޕޮޒިޝަން (ފުރަތަމަ ރޯގަލް)</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setTextPosition('top-left')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      textPosition === 'top-left'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Top Left
                  </button>
                  <button
                    onClick={() => setTextPosition('top-center')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      textPosition === 'top-center'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Top Center
                  </button>
                  <button
                    onClick={() => setTextPosition('top-right')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      textPosition === 'top-right'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Top Right
                  </button>
                  <button
                    onClick={() => setTextPosition('middle-left')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      textPosition === 'middle-left'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Middle Left
                  </button>
                  <button
                    onClick={() => setTextPosition('middle-center')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      textPosition === 'middle-center'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Center
                  </button>
                  <button
                    onClick={() => setTextPosition('middle-right')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      textPosition === 'middle-right'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Middle Right
                  </button>
                  <button
                    onClick={() => setTextPosition('bottom-left')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      textPosition === 'bottom-left'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Bottom Left
                  </button>
                  <button
                    onClick={() => setTextPosition('bottom-center')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      textPosition === 'bottom-center'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Bottom Center
                  </button>
                  <button
                    onClick={() => setTextPosition('bottom-right')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      textPosition === 'bottom-right'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Bottom Right
                  </button>
                </div>
              </div>

              {/* Text Position 2 Section */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h4 className="font-semibold text-white mb-3">ޓެކްސްޓް ޕޮޒިޝަން (ދެވަނަ ރޯގަލް)</h4>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setTextPosition2('top-left')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      textPosition2 === 'top-left'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Top Left
                  </button>
                  <button
                    onClick={() => setTextPosition2('top-center')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      textPosition2 === 'top-center'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Top Center
                  </button>
                  <button
                    onClick={() => setTextPosition2('top-right')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      textPosition2 === 'top-right'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Top Right
                  </button>
                  <button
                    onClick={() => setTextPosition2('middle-left')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      textPosition2 === 'middle-left'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Middle Left
                  </button>
                  <button
                    onClick={() => setTextPosition2('middle-center')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      textPosition2 === 'middle-center'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Center
                  </button>
                  <button
                    onClick={() => setTextPosition2('middle-right')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      textPosition2 === 'middle-right'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Middle Right
                  </button>
                  <button
                    onClick={() => setTextPosition2('bottom-left')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      textPosition2 === 'bottom-left'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Bottom Left
                  </button>
                  <button
                    onClick={() => setTextPosition2('bottom-center')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      textPosition2 === 'bottom-center'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Bottom Center
                  </button>
                  <button
                    onClick={() => setTextPosition2('bottom-right')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      textPosition2 === 'bottom-right'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Bottom Right
                  </button>
                </div>
              </div>

              {/* Color Picker Section */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h4 className="font-semibold text-white mb-3">ބެނަރ ކަލަރ</h4>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={bannerColor}
                    onChange={(e) => setBannerColor(e.target.value)}
                    className="h-12 w-20 rounded-lg border border-slate-700 bg-slate-950/80 cursor-pointer"
                  />
                  <span className="text-sm text-slate-400">{bannerColor}</span>
                </div>
              </div>

              {/* Font Size Section */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h4 className="font-semibold text-white mb-3">ފޮންޓް ސައިޒް</h4>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="flex-1 h-2 rounded-lg bg-slate-700 appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-slate-400 w-16 text-right">{fontSize}px</span>
                </div>
              </div>

              {/* Font Color Section */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h4 className="font-semibold text-white mb-3">ފޮންޓް ކަލަރ</h4>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    className="h-12 w-20 rounded-lg border border-slate-700 bg-slate-950/80 cursor-pointer"
                  />
                  <span className="text-sm text-slate-400">{fontColor}</span>
                </div>
              </div>

              {/* Font Style Section */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h4 className="font-semibold text-white mb-3">ފޮންޓް ސްޓައިލް</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFontStyle('normal')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      fontStyle === 'normal'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setFontStyle('bold')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      fontStyle === 'bold'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Bold
                  </button>
                  <button
                    onClick={() => setFontStyle('italic')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      fontStyle === 'italic'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Italic
                  </button>
                  <button
                    onClick={() => setFontStyle('bold italic')}
                    className={`rounded-lg px-3 py-2 text-sm transition ${
                      fontStyle === 'bold italic'
                        ? 'bg-brand-500 text-slate-950'
                        : 'border border-slate-700 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Bold Italic
                  </button>
                </div>
              </div>

              {/* Real-time Preview Section */}
              {uploadedImage && (
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                  <h4 className="font-semibold text-white mb-3">ޕްރިވިއު</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h5 className="mb-2 text-sm font-medium text-slate-400">އޮރިޖިނަލް އިމޭޖް</h5>
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="h-auto w-full rounded-lg border border-slate-700"
                      />
                    </div>
                    {generatedImage && (
                      <div>
                        <h5 className="mb-2 text-sm font-medium text-slate-400">ޖެނެރޭޓް ކުރެވުނު އިމޭޖް</h5>
                        <img
                          src={generatedImage}
                          alt="Generated"
                          className="h-auto w-full rounded-lg border border-slate-700"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Download Button */}
              {generatedImage && (
                <button
                  onClick={() => {
                    if (!generatedImage) return;
                    const link = document.createElement('a');
                    link.href = generatedImage;
                    link.download = `generated-image-${Date.now()}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="w-full rounded-2xl bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-400"
                >
                  އިމޭޖް ޑައުންލޯޑް ކުރުން
                </button>
              )}

              {/* Hidden Canvas */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="rounded-[32px] border border-white/5 bg-slate-900/90 p-6 shadow-soft">
            <h3 className="text-2xl font-bold text-white">ނޮޓިފިކޭޝަންތައް</h3>
            <div className="mt-6 space-y-4">
              {loadingNotifications ? (
                <p className="text-center text-slate-400">ލޯޑް ކުރަމުން...</p>
              ) : notifications.length === 0 ? (
                <p className="text-center text-slate-400">ނޮޓިފިކޭޝަންތައް ނެތް</p>
              ) : (
                notifications.map((notification: any) => (
                  <div key={notification.id} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
                    <div className="flex items-center justify-between gap-4 text-sm text-slate-300">
                      <p>{notification.title}</p>
                      <span className="text-xs text-slate-500">{notification.time}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </>
    </motion.div>
  );
}
