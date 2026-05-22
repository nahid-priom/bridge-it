import { Service, CategoryType, SearchResultType } from '../types';

const IMAGES = [
  'https://images.pexels.com/photos/8833485/pexels-photo-8833485.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/13420510/pexels-photo-13420510.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/7988745/pexels-photo-7988745.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/270694/pexels-photo-270694.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/1350461/pexels-photo-1350461.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/67112/pexels-photo-67112.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/8833486/pexels-photo-8833486.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/291777/pexels-photo-291777.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/20043053/pexels-photo-20043053.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/8728284/pexels-photo-8728284.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/29506609/pexels-photo-29506609.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
  'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
];

const AVATARS = [
  'https://images.pexels.com/photos/6804068/pexels-photo-6804068.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=100&w=100',
  'https://images.pexels.com/photos/6804071/pexels-photo-6804071.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=100&w=100',
  'https://images.pexels.com/photos/7988747/pexels-photo-7988747.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=100&w=100',
  'https://images.pexels.com/photos/291777/pexels-photo-291777.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=100&w=100',
  'https://images.pexels.com/photos/20313664/pexels-photo-20313664.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=100&w=100',
  'https://images.pexels.com/photos/11412585/pexels-photo-11412585.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=100&w=100',
  'https://images.pexels.com/photos/13107929/pexels-photo-13107929.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=100&w=100',
];

const LOCATIONS = ['Dhaka, Bangladesh', 'Chittagong, Bangladesh', 'Sylhet, Bangladesh', 'Rajshahi, Bangladesh', 'Remote, Bangladesh'];
const LANGUAGES = ['English', 'Bengali', 'English & Bengali'];

interface ServiceTemplate {
  category: CategoryType;
  subcategory: string;
  resultType: SearchResultType;
  titles: { en: string; bn: string }[];
  basePrice: number;
  deliveryOptions: string[];
  tags: string[];
}

const TEMPLATES: ServiceTemplate[] = [
  {
    category: 'software',
    subcategory: 'Enterprise Software',
    resultType: 'service',
    titles: [
      { en: 'Custom ERP System for SMEs', bn: 'এসএমই-র জন্য কাস্টম ইআরপি সিস্টেম' },
      { en: 'Inventory Management SaaS', bn: 'ইনভেন্টরি ম্যানেজমেন্ট সাস' },
      { en: 'POS Software for Retail Shops', bn: 'রিটেইল দোকানের জন্য পিওএস সফটওয়্যার' },
      { en: 'School Management System', bn: 'স্কুল ম্যানেজমেন্ট সিস্টেম' },
      { en: 'Hospital Patient Management App', bn: 'হাসপাতাল পেশেন্ট ম্যানেজমেন্ট অ্যাপ' },
    ],
    basePrice: 45000,
    deliveryOptions: ['30 days', '45 days', '60 days'],
    tags: ['software', 'erp', 'saas', 'enterprise'],
  },
  {
    category: 'web-development',
    subcategory: 'Website Development',
    resultType: 'service',
    titles: [
      { en: 'E-commerce Website with bKash', bn: 'বিকাশসহ ই-কমার্স ওয়েবসাইট' },
      { en: 'Corporate Business Website', bn: 'কর্পোরেট বিজনেস ওয়েবসাইট' },
      { en: 'WordPress Premium Theme Setup', bn: 'ওয়ার্ডপ্রেস প্রিমিয়াম থিম সেটআপ' },
      { en: 'Landing Page for Startup', bn: 'স্টার্টআপ ল্যান্ডিং পেজ' },
      { en: 'Portfolio Website for Creatives', bn: 'ক্রিয়েটিভ পোর্টফোলিও ওয়েবসাইট' },
    ],
    basePrice: 18000,
    deliveryOptions: ['7 days', '14 days', '21 days'],
    tags: ['website', 'wordpress', 'ecommerce', 'landing'],
  },
  {
    category: 'mobile-apps',
    subcategory: 'App Development',
    resultType: 'service',
    titles: [
      { en: 'Flutter Cross-Platform Mobile App', bn: 'ফ্লাটার ক্রস-প্ল্যাটফর্ম মোবাইল অ্যাপ' },
      { en: 'Food Delivery App Clone', bn: 'ফুড ডেলিভারি অ্যাপ ক্লোন' },
      { en: 'Ride Sharing App MVP', bn: 'রাইড শেয়ারিং অ্যাপ এমভিপি' },
      { en: 'Fitness Tracking Mobile App', bn: 'ফিটনেস ট্র্যাকিং মোবাইল অ্যাপ' },
    ],
    basePrice: 65000,
    deliveryOptions: ['30 days', '45 days', '60 days'],
    tags: ['mobile', 'flutter', 'android', 'ios'],
  },
  {
    category: '2d-animation',
    subcategory: 'Motion Graphics',
    resultType: 'service',
    titles: [
      { en: 'Explainer Video 2D Animation', bn: '২ডি এক্সপ্লেইনার ভিডিও এনিমেশন' },
      { en: 'Logo Animation for Brand', bn: 'ব্র্যান্ড লোগো এনিমেশন' },
      { en: 'Social Media Reel Animation Pack', bn: 'সোশ্যাল মিডিয়া রিল এনিমেশন প্যাক' },
      { en: 'Whiteboard Animation Video', bn: 'হোয়াইটবোর্ড এনিমেশন ভিডিও' },
      { en: 'Kids Cartoon Episode Animation', bn: 'কিডস কার্টুন এপিসোড এনিমেশন' },
    ],
    basePrice: 12000,
    deliveryOptions: ['5 days', '7 days', '10 days'],
    tags: ['2d', 'animation', 'explainer', 'motion'],
  },
  {
    category: '3d-animation',
    subcategory: '3D Modeling',
    resultType: 'service',
    titles: [
      { en: 'Architectural 3D Walkthrough', bn: 'আর্কিটেকচারাল ৩ডি ওয়াকথ্রু' },
      { en: 'Game Character 3D Modeling', bn: 'গেম ক্যারেক্টার ৩ডি মডেলিং' },
      { en: '3D Logo Animation Intro', bn: '৩ডি লোগো অ্যানিমেশন ইন্ট্রো' },
      { en: 'Medical 3D Visualization', bn: 'মেডিকেল ৩ডি ভিজ্যুয়ালাইজেশন' },
      { en: 'Furniture 3D Product Render', bn: 'ফার্নিচার ৩ডি প্রোডাক্ট রেন্ডার' },
    ],
    basePrice: 22000,
    deliveryOptions: ['10 days', '14 days', '21 days'],
    tags: ['3d', 'modeling', 'render', 'animation'],
  },
  {
    category: 'video-ads',
    subcategory: 'Commercial Ads',
    resultType: 'service',
    titles: [
      { en: 'TikTok Shop Product Video Ad', bn: 'টিকটক শপ প্রোডাক্ট ভিডিও অ্যাড' },
      { en: 'TV Commercial Style Ad 30s', bn: 'টিভি কমার্শিয়াল স্টাইল ৩০ সেকেন্ড অ্যাড' },
      { en: 'Real Estate Property Tour Video', bn: 'রিয়েল এস্টেট প্রপার্টি ট্যুর ভিডিও' },
      { en: 'Restaurant Menu Promo Video', bn: 'রেস্টুরেন্ট মেনু প্রোমো ভিডিও' },
      { en: 'Fashion Brand Lookbook Video', bn: 'ফ্যাশন ব্র্যান্ড লুকবুক ভিডিও' },
    ],
    basePrice: 9000,
    deliveryOptions: ['3 days', '5 days', '7 days'],
    tags: ['video', 'ads', 'commercial', 'promo'],
  },
  {
    category: 'digital-products',
    subcategory: 'Digital Assets',
    resultType: 'digital-product',
    titles: [
      { en: 'Canva Social Media Template Bundle', bn: 'ক্যানভা সোশ্যাল মিডিয়া টেমপ্লেট বান্ডেল' },
      { en: 'Notion Business Dashboard Pack', bn: 'নোশন বিজনেস ড্যাশবোর্ড প্যাক' },
      { en: 'Premiere Pro LUTs Collection', bn: 'প্রিমিয়ার প্রো LUT কালেকশন' },
      { en: 'Figma UI Kit - SaaS Dashboard', bn: 'ফিগমা UI কিট - SaaS ড্যাশবোর্ড' },
      { en: 'Lightroom Presets for Photographers', bn: 'ফটোগ্রাফারদের জন্য লাইটরুম প্রিসেট' },
      { en: 'Excel Financial Model Templates', bn: 'এক্সেল ফাইন্যান্সিয়াল মডেল টেমপ্লেট' },
    ],
    basePrice: 1500,
    deliveryOptions: ['Instant', '1 day', '2 days'],
    tags: ['digital', 'template', 'download', 'assets'],
  },
  {
    category: 'courses',
    subcategory: 'Online Learning',
    resultType: 'course',
    titles: [
      { en: 'Full Stack Web Dev Bootcamp BD', bn: 'ফুল স্ট্যাক ওয়েব ডেভ বুটক্যাম্প' },
      { en: 'Graphic Design Masterclass', bn: 'গ্রাফিক ডিজাইন মাস্টারক্লাস' },
      { en: 'Facebook Ads Mastery Course', bn: 'ফেসবুক অ্যাডস মাস্টারি কোর্স' },
      { en: 'Video Editing with Premiere Pro', bn: 'প্রিমিয়ার প্রো দিয়ে ভিডিও এডিটিং' },
      { en: 'Freelancing on Fiverr & Upwork', bn: 'ফাইভার ও আপওয়ার্কে ফ্রিল্যান্সিং' },
    ],
    basePrice: 2500,
    deliveryOptions: ['Instant', 'Instant', 'Instant'],
    tags: ['course', 'learning', 'training', 'online'],
  },
  {
    category: 'boosting-agency',
    subcategory: 'Growth Services',
    resultType: 'service',
    titles: [
      { en: 'Instagram Organic Growth 30 Days', bn: 'ইনস্টাগ্রাম অর্গানিক গ্রোথ ৩০ দিন' },
      { en: 'YouTube Channel SEO & Growth', bn: 'ইউটিউব চ্যানেল SEO ও গ্রোথ' },
      { en: 'Google Business Profile Optimization', bn: 'গুগল বিজনেস প্রোফাইল অপ্টিমাইজেশন' },
      { en: 'LinkedIn B2B Lead Generation', bn: 'লিংকডইন B2B লিড জেনারেশন' },
    ],
    basePrice: 8000,
    deliveryOptions: ['14 days', '21 days', '30 days'],
    tags: ['boosting', 'seo', 'growth', 'social'],
  },
  {
    category: 'editing',
    subcategory: 'Post Production',
    resultType: 'service',
    titles: [
      { en: 'Wedding Cinematography Edit', bn: 'ওয়েডিং সিনেমাটোগ্রাফি এডিট' },
      { en: 'Podcast Audio Cleanup & Mix', bn: 'পডকাস্ট অডিও ক্লিনআপ ও মিক্স' },
      { en: 'Product Photo Retouching Pack', bn: 'প্রোডাক্ট ফটো রিটাচিং প্যাক' },
      { en: 'Documentary Film Color Grade', bn: 'ডকুমেন্টারি ফিল্ম কালার গ্রেড' },
    ],
    basePrice: 4000,
    deliveryOptions: ['2 days', '3 days', '5 days'],
    tags: ['editing', 'video', 'photo', 'retouch'],
  },
  {
    category: 'ui-ux-design',
    subcategory: 'Product Design',
    resultType: 'service',
    titles: [
      { en: 'SaaS Dashboard UI Design', bn: 'SaaS ড্যাশবোর্ড UI ডিজাইন' },
      { en: 'Mobile Banking App UX Research', bn: 'মোবাইল ব্যাংকিং অ্যাপ UX রিসার্চ' },
      { en: 'Design System for Startup', bn: 'স্টার্টআপ ডিজাইন সিস্টেম' },
      { en: 'E-learning Platform UI Kit', bn: 'ই-লার্নিং প্ল্যাটফর্ম UI কিট' },
    ],
    basePrice: 16000,
    deliveryOptions: ['10 days', '14 days', '21 days'],
    tags: ['ui', 'ux', 'figma', 'design'],
  },
  {
    category: 'digital-marketing',
    subcategory: 'Branding Agency',
    resultType: 'service',
    titles: [
      { en: 'Complete Brand Identity Package', bn: 'সম্পূর্ণ ব্র্যান্ড আইডেন্টিটি প্যাকেজ' },
      { en: 'Logo + Brand Guidelines Design', bn: 'লোগো ও ব্র্যান্ড গাইডলাইন ডিজাইন' },
      { en: 'Packaging Design for FMCG', bn: 'FMCG প্যাকেজিং ডিজাইন' },
      { en: 'Rebranding Strategy Consultation', bn: 'রিব্র্যান্ডিং স্ট্র্যাটেজি কনসালটেশন' },
    ],
    basePrice: 14000,
    deliveryOptions: ['7 days', '14 days', '21 days'],
    tags: ['branding', 'logo', 'identity', 'design'],
  },
  {
    category: 'digital-marketing',
    subcategory: 'Marketing Agency',
    resultType: 'service',
    titles: [
      { en: 'Monthly Social Media Management', bn: 'মাসিক সোশ্যাল মিডিয়া ম্যানেজমেন্ট' },
      { en: 'Google Ads Campaign Setup', bn: 'গুগল অ্যাডস ক্যাম্পেইন সেটআপ' },
      { en: 'Content Marketing Strategy 90 Days', bn: '৯০ দিন কনটেন্ট মার্কেটিং স্ট্র্যাটেজি' },
      { en: 'Influencer Marketing Campaign BD', bn: 'ইনফ্লুয়েন্সার মার্কেটিং ক্যাম্পেইন' },
      { en: 'Email Marketing Automation Setup', bn: 'ইমেইল মার্কেটিং অটোমেশন সেটআপ' },
    ],
    basePrice: 10000,
    deliveryOptions: ['7 days', '14 days', '30 days'],
    tags: ['marketing', 'ads', 'social', 'seo'],
  },
];

const SELLER_NAMES = [
  'TechNova BD', 'PixelWave Studio', 'CloudStack IT', 'MotionHive', 'RenderPro 3D',
  'AdSpark Media', 'DigitalVault BD', 'SkillForge Academy', 'GrowthPulse', 'EditLab Pro',
  'DesignSphere', 'BrandCraft Agency', 'MarketEdge BD', 'CodeNest Labs', 'AnimateHub',
  'WebCraft Solutions', 'AppForge BD', 'CreativePulse', 'MediaBoost Pro', 'LearnPath BD',
];

function buildService(index: number, template: ServiceTemplate, titleIdx: number): Service {
  const title = template.titles[titleIdx];
  const sellerIdx = index % SELLER_NAMES.length;
  const priceVariance = (index % 5) * 1200 + (titleIdx % 3) * 800;
  const price = template.basePrice + priceVariance;
  const delivery = template.deliveryOptions[titleIdx % template.deliveryOptions.length];
  const instant = delivery.toLowerCase() === 'instant';
  const rating = 4.3 + (index % 8) * 0.1;
  const reviews = 24 + (index * 17) % 400;

  return {
    id: `s${index + 9}`,
    title: title.en,
    titleBn: title.bn,
    description: `Premium ${template.subcategory.toLowerCase()} service tailored for Bangladesh businesses. ${title.en} includes professional delivery, revisions, and Bridge escrow protection.`,
    price,
    currency: 'BDT',
    deliveryTime: delivery,
    thumbnail: IMAGES[index % IMAGES.length],
    category: template.category,
    subcategory: template.subcategory,
    rating: Math.min(5, Math.round(rating * 10) / 10),
    reviewCount: reviews,
    sellerId: `seller${sellerIdx + 9}`,
    sellerName: SELLER_NAMES[sellerIdx],
    sellerAvatar: AVATARS[sellerIdx % AVATARS.length],
    features: ['Professional Quality', 'Revisions Included', 'Fast Communication', 'Source Files'],
    demoItems: [],
    tags: [...template.tags, template.category.replace(/-/g, ' ')],
    popular: index % 7 === 0,
    isVerified: index % 3 !== 2,
    isFeatured: index % 5 === 0 || index % 11 === 0,
    hasProtectedDemo: index % 4 === 0,
    location: LOCATIONS[index % LOCATIONS.length],
    language: LANGUAGES[index % LANGUAGES.length],
    escrowAvailable: index % 6 !== 1,
    instantDelivery: instant,
    resultType: template.resultType,
  };
}

export const additionalServices: Service[] = (() => {
  const items: Service[] = [];
  let globalIndex = 0;
  TEMPLATES.forEach((template) => {
    template.titles.forEach((_, titleIdx) => {
      items.push(buildService(globalIndex, template, titleIdx));
      globalIndex += 1;
    });
  });
  return items;
})();
