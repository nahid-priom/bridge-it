import { Seller, CategoryType } from '../types';

const COVERS = [
  'https://images.pexels.com/photos/8833485/pexels-photo-8833485.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=1200',
  'https://images.pexels.com/photos/13420510/pexels-photo-13420510.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=1200',
  'https://images.pexels.com/photos/7988745/pexels-photo-7988745.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=1200',
  'https://images.pexels.com/photos/270694/pexels-photo-270694.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=1200',
  'https://images.pexels.com/photos/1350461/pexels-photo-1350461.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=1200',
  'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=1200',
];

const AVATARS = [
  'https://images.pexels.com/photos/6804068/pexels-photo-6804068.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200',
  'https://images.pexels.com/photos/6804071/pexels-photo-6804071.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200',
  'https://images.pexels.com/photos/7988747/pexels-photo-7988747.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200',
  'https://images.pexels.com/photos/291777/pexels-photo-291777.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200',
  'https://images.pexels.com/photos/20313664/pexels-photo-20313664.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200',
  'https://images.pexels.com/photos/11412585/pexels-photo-11412585.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200',
  'https://images.pexels.com/photos/13107929/pexels-photo-13107929.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=200&w=200',
];

const LOCATIONS = ['Dhaka, Bangladesh', 'Chittagong, Bangladesh', 'Sylhet, Bangladesh', 'Rajshahi, Bangladesh', 'Khulna, Bangladesh'];

const SELLER_DATA: { name: string; tagline: string; category: CategoryType }[] = [
  { name: 'TechNova BD', tagline: 'Enterprise software that scales', category: 'software' },
  { name: 'PixelWave Studio', tagline: 'Pixels with purpose', category: 'ui-ux-design' },
  { name: 'CloudStack IT', tagline: 'Cloud-native solutions', category: 'web-development' },
  { name: 'MotionHive', tagline: 'Motion that moves markets', category: '2d-animation' },
  { name: 'RenderPro 3D', tagline: 'Photoreal 3D experiences', category: '3d-animation' },
  { name: 'AdSpark Media', tagline: 'Spark your ad ROI', category: 'video-ads' },
  { name: 'DigitalVault BD', tagline: 'Premium digital assets', category: 'digital-products' },
  { name: 'SkillForge Academy', tagline: 'Learn. Build. Earn.', category: 'courses' },
  { name: 'GrowthPulse', tagline: 'Organic growth specialists', category: 'boosting-agency' },
  { name: 'EditLab Pro', tagline: 'Edit like cinema', category: 'editing' },
  { name: 'DesignSphere', tagline: 'Design systems that ship', category: 'ui-ux-design' },
  { name: 'BrandCraft Agency', tagline: 'Brands people remember', category: 'digital-marketing' },
  { name: 'MarketEdge BD', tagline: 'Edge in every campaign', category: 'digital-marketing' },
  { name: 'CodeNest Labs', tagline: 'Nest your product in code', category: 'software' },
  { name: 'AnimateHub', tagline: 'Hub of animation talent', category: '2d-animation' },
  { name: 'WebCraft Solutions', tagline: 'Crafted for conversion', category: 'web-development' },
  { name: 'AppForge BD', tagline: 'Forge mobile excellence', category: 'mobile-apps' },
  { name: 'CreativePulse', tagline: 'Pulse of creative ads', category: 'video-ads' },
  { name: 'MediaBoost Pro', tagline: 'Boost without bots', category: 'boosting-agency' },
  { name: 'LearnPath BD', tagline: 'Path to digital skills', category: 'courses' },
  { name: 'TemplateHub BD', tagline: 'Templates that convert', category: 'digital-products' },
  { name: 'ScriptWorks', tagline: 'Scripts & automation', category: 'software' },
  { name: 'UI Kit Bazaar', tagline: 'Figma-first UI kits', category: 'ui-ux-design' },
  { name: 'Marketing Assets Co', tagline: 'Assets for growth teams', category: 'digital-marketing' },
  { name: 'Bengal Creatives', tagline: 'বাংলা ক্রিয়েটিভ সলিউশন', category: '2d-animation' },
  { name: 'Chittagong Dev House', tagline: 'Port city dev excellence', category: 'web-development' },
  { name: 'Sylhet Digital', tagline: 'Tea city tech talent', category: 'mobile-apps' },
  { name: 'Rajshahi Design Lab', tagline: 'Design from the north', category: 'ui-ux-design' },
  { name: 'Khulna Video Co', tagline: 'Southern video pros', category: 'video-ads' },
  { name: 'Dhaka Edit House', tagline: 'Fast edits, fair price', category: 'editing' },
  { name: 'ProCourse BD', tagline: 'Professional upskilling', category: 'courses' },
  { name: 'AssetFlow Digital', tagline: 'Flow of premium assets', category: 'digital-products' },
  { name: 'BoostBangla', tagline: 'বাংলাদেশের গ্রোথ পার্টনার', category: 'boosting-agency' },
  { name: 'SoftBridge IT', tagline: 'Bridge your business gap', category: 'software' },
  { name: 'MotionBangla', tagline: '২ডি/৩ডি মোশন এক্সপার্ট', category: '3d-animation' },
];

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export const additionalSellers: Seller[] = SELLER_DATA.map((data, i) => {
  const id = `seller${i + 9}`;
  const slug = slugify(data.name);
  const rating = 4.4 + (i % 6) * 0.1;
  return {
    id,
    name: data.name,
    slug,
    avatar: AVATARS[i % AVATARS.length],
    coverImage: COVERS[i % COVERS.length],
    category: data.category,
    rating: Math.min(5, Math.round(rating * 10) / 10),
    reviewCount: 28 + (i * 13) % 520,
    verified: i % 4 !== 3,
    description: `${data.name} is a trusted Bridge seller delivering ${data.category.replace(/-/g, ' ')} services across Bangladesh with escrow protection and verified delivery.`,
    tagline: data.tagline,
    location: LOCATIONS[i % LOCATIONS.length],
    joinedDate: `202${2 + (i % 3)}-${String((i % 12) + 1).padStart(2, '0')}-15`,
    completedProjects: 45 + (i * 23) % 890,
    responseTime: i % 3 === 0 ? '< 30 min' : i % 3 === 1 ? '< 1 hour' : '< 2 hours',
    services: [],
    gallery: [],
    customUrl: `bridge.app/s/${slug}`,
  };
});
