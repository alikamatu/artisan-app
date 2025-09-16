import { ApplicationStatus } from '@/lib/types/applications';
import { 
  JobCategory, 
  GhanaRegion, 
  CategoryInfo, 
  RegionInfo,
  JobUrgency, 
  JobStatus
} from '@/lib/types/jobs';

export const JOB_CATEGORIES: Record<JobCategory, CategoryInfo> = {
  [JobCategory.PLUMBING]: {
    id: JobCategory.PLUMBING,
    name: 'Plumbing',
    description: 'Water systems, pipes, drainage, and bathroom/kitchen installations',
    icon: 'wrench',
    commonSkills: ['Pipe installation', 'Leak repair', 'Drain cleaning', 'Fixture installation', 'Water heater repair']
  },
  [JobCategory.ELECTRICAL]: {
    id: JobCategory.ELECTRICAL,
    name: 'Electrical',
    description: 'Wiring, installations, repairs, and electrical maintenance',
    icon: 'zap',
    commonSkills: ['Wiring installation', 'Circuit repair', 'Socket installation', 'Lighting installation', 'Electrical troubleshooting']
  },
  [JobCategory.TUTORING]: {
    id: JobCategory.TUTORING,
    name: 'Tutoring & Education',
    description: 'Academic support, language lessons, and skill development',
    icon: 'book-open',
    commonSkills: ['Mathematics', 'English', 'Science', 'Computer skills', 'Exam preparation']
  },
  [JobCategory.CLEANING]: {
    id: JobCategory.CLEANING,
    name: 'Cleaning Services',
    description: 'House cleaning, office cleaning, and specialized cleaning',
    icon: 'sparkles',
    commonSkills: ['Deep cleaning', 'Regular maintenance', 'Carpet cleaning', 'Window cleaning', 'Sanitization']
  },
  [JobCategory.CARPENTRY]: {
    id: JobCategory.CARPENTRY,
    name: 'Carpentry & Woodwork',
    description: 'Furniture making, repairs, and custom woodwork',
    icon: 'hammer',
    commonSkills: ['Furniture repair', 'Custom furniture', 'Door installation', 'Shelving', 'Wood finishing']
  },
  [JobCategory.PAINTING]: {
    id: JobCategory.PAINTING,
    name: 'Painting & Decoration',
    description: 'Interior and exterior painting, decorating services',
    icon: 'palette',
    commonSkills: ['Interior painting', 'Exterior painting', 'Wall preparation', 'Color consultation', 'Decorative finishes']
  },
  [JobCategory.GARDENING]: {
    id: JobCategory.GARDENING,
    name: 'Gardening & Landscaping',
    description: 'Garden maintenance, landscaping, and plant care',
    icon: 'leaf',
    commonSkills: ['Lawn mowing', 'Garden design', 'Plant care', 'Tree pruning', 'Landscape installation']
  },
  [JobCategory.REPAIRS]: {
    id: JobCategory.REPAIRS,
    name: 'General Repairs',
    description: 'Household repairs, maintenance, and handyman services',
    icon: 'tools',
    commonSkills: ['Appliance repair', 'Furniture repair', 'General maintenance', 'Installation services', 'Troubleshooting']
  },
  [JobCategory.DELIVERY]: {
    id: JobCategory.DELIVERY,
    name: 'Delivery & Transport',
    description: 'Package delivery, moving services, and transportation',
    icon: 'truck',
    commonSkills: ['Package delivery', 'Moving services', 'Courier services', 'Logistics', 'Transportation']
  },
  [JobCategory.TECH_SUPPORT]: {
    id: JobCategory.TECH_SUPPORT,
    name: 'Tech Support',
    description: 'Computer repair, software help, and technical assistance',
    icon: 'monitor',
    commonSkills: ['Computer repair', 'Software installation', 'Network setup', 'Data recovery', 'Tech troubleshooting']
  },
  [JobCategory.PERSONAL_CARE]: {
    id: JobCategory.PERSONAL_CARE,
    name: 'Personal Care',
    description: 'Elderly care, childcare, and personal assistance',
    icon: 'heart',
    commonSkills: ['Elderly care', 'Childcare', 'Personal assistance', 'Companionship', 'Basic medical care']
  },
  [JobCategory.AUTOMOTIVE]: {
    id: JobCategory.AUTOMOTIVE,
    name: 'Automotive Services',
    description: 'Car repair, maintenance, and automotive services',
    icon: 'car',
    commonSkills: ['Car maintenance', 'Engine repair', 'Oil change', 'Tire service', 'Auto diagnostics']
  },
  [JobCategory.BEAUTY]: {
    id: JobCategory.BEAUTY,
    name: 'Beauty & Wellness',
    description: 'Hair styling, makeup, skincare, and beauty treatments',
    icon: 'scissors',
    commonSkills: ['Hair styling', 'Makeup application', 'Skincare treatment', 'Nail care', 'Beauty consultation']
  },
  [JobCategory.FITNESS]: {
    id: JobCategory.FITNESS,
    name: 'Fitness & Training',
    description: 'Personal training, fitness coaching, and wellness programs',
    icon: 'dumbbell',
    commonSkills: ['Personal training', 'Fitness coaching', 'Nutrition advice', 'Workout planning', 'Wellness programs']
  },
  [JobCategory.EVENT_PLANNING]: {
    id: JobCategory.EVENT_PLANNING,
    name: 'Event Planning',
    description: 'Event organization, party planning, and coordination',
    icon: 'calendar',
    commonSkills: ['Event coordination', 'Party planning', 'Vendor management', 'Decoration', 'Timeline management']
  },
  [JobCategory.PHOTOGRAPHY]: {
    id: JobCategory.PHOTOGRAPHY,
    name: 'Photography & Video',
    description: 'Photography services, video production, and editing',
    icon: 'camera',
    commonSkills: ['Portrait photography', 'Event photography', 'Video recording', 'Photo editing', 'Equipment setup']
  },
  [JobCategory.WRITING]: {
    id: JobCategory.WRITING,
    name: 'Writing & Content',
    description: 'Content writing, copywriting, and editorial services',
    icon: 'pen-tool',
    commonSkills: ['Content writing', 'Copywriting', 'Editing', 'Proofreading', 'SEO writing']
  },
  [JobCategory.TRANSLATION]: {
    id: JobCategory.TRANSLATION,
    name: 'Translation & Languages',
    description: 'Translation services and language support',
    icon: 'globe',
    commonSkills: ['Document translation', 'Interpretation', 'Language tutoring', 'Localization', 'Proofreading']
  },
  [JobCategory.LEGAL]: {
    id: JobCategory.LEGAL,
    name: 'Legal Services',
    description: 'Legal advice, document preparation, and consultation',
    icon: 'scale',
    commonSkills: ['Legal consultation', 'Document preparation', 'Contract review', 'Legal research', 'Court representation']
  },
  [JobCategory.ACCOUNTING]: {
    id: JobCategory.ACCOUNTING,
    name: 'Accounting & Finance',
    description: 'Bookkeeping, tax preparation, and financial services',
    icon: 'calculator',
    commonSkills: ['Bookkeeping', 'Tax preparation', 'Financial planning', 'Payroll services', 'Accounting software']
  },
  [JobCategory.OTHER]: {
    id: JobCategory.OTHER,
    name: 'Other Services',
    description: 'Specialized or unique services not listed above',
    icon: 'more-horizontal',
    commonSkills: ['Custom services', 'Specialized skills', 'Unique requirements', 'Consultation', 'Project-based work']
  }
};

export const GHANA_REGIONS: Record<GhanaRegion, RegionInfo> = {
  [GhanaRegion.GREATER_ACCRA]: {
    id: GhanaRegion.GREATER_ACCRA,
    name: 'Greater Accra',
    cities: ['Accra', 'Tema', 'Kasoa', 'Madina', 'Adenta', 'Ashiaman', 'Ga East', 'Ledzokuku'],
    popularAreas: [
      'East Legon', 'Airport Residential', 'Cantonments', 'Labone', 'Osu', 'Dzorwulu',
      'Roman Ridge', 'North Ridge', 'Dansoman', 'Achimota', 'Tesano', 'Nungua',
      'Teshie', 'La', 'Spintex', 'Madina', 'Adenta', 'Dome', 'Kasoa', 'Weija'
    ]
  },
  [GhanaRegion.ASHANTI]: {
    id: GhanaRegion.ASHANTI,
    name: 'Ashanti',
    cities: ['Kumasi', 'Obuasi', 'Ejisu', 'Bekwai', 'Konongo', 'Mampong', 'Offinso', 'Agogo'],
    popularAreas: [
      'Adum', 'Asokwa', 'Bantama', 'Manhyia', 'Suame', 'Tafo', 'Nhyiaeso',
      'Airport Roundabout', 'Tech', 'Ayeduase', 'Bomso', 'Ahinsan', 'Santasi'
    ]
  },
  [GhanaRegion.WESTERN]: {
    id: GhanaRegion.WESTERN,
    name: 'Western',
    cities: ['Sekondi-Takoradi', 'Tarkwa', 'Axim', 'Half Assini', 'Prestea', 'Bogoso'],
    popularAreas: [
      'Sekondi', 'Takoradi', 'New Takoradi', 'Anaji', 'Kojokrom', 'Ketan',
      'Beach Road', 'Windy Ridge', 'Fijai', 'Effia-Kuma'
    ]
  },
  [GhanaRegion.CENTRAL]: {
    id: GhanaRegion.CENTRAL,
    name: 'Central',
    cities: ['Cape Coast', 'Elmina', 'Winneba', 'Kasoa', 'Swedru', 'Saltpond', 'Agona Swedru'],
    popularAreas: [
      'Cape Coast Castle', 'University of Cape Coast', 'Pedu', 'Adisadel',
      'Elmina Castle', 'Winneba Junction', 'Kasoa Market', 'Nyanyano'
    ]
  },
  [GhanaRegion.VOLTA]: {
    id: GhanaRegion.VOLTA,
    name: 'Volta',
    cities: ['Ho', 'Hohoe', 'Keta', 'Aflao', 'Denu', 'Dzodze', 'Sogakope'],
    popularAreas: [
      'Ho Market', 'Bankoe', 'Ahoe', 'Hohoe Township', 'Keta Lagoon',
      'Aflao Border', 'Sogakope Junction', 'Dzodze Market'
    ]
  },
  [GhanaRegion.EASTERN]: {
    id: GhanaRegion.EASTERN,
    name: 'Eastern',
    cities: ['Koforidua', 'Akropong', 'Nkawkaw', 'Mpraeso', 'Begoro', 'Akim Oda'],
    popularAreas: [
      'Koforidua New Juaben', 'Galloway', 'Akropong Akuapem', 'Abetifi',
      'Nkawkaw Township', 'Mpraeso Market', 'Akim Oda Junction'
    ]
  },
  [GhanaRegion.NORTHERN]: {
    id: GhanaRegion.NORTHERN,
    name: 'Northern',
    cities: ['Tamale', 'Yendi', 'Savelugu', 'Gushegu', 'Karaga', 'Tolon'],
    popularAreas: [
      'Tamale Central Market', 'Vittin', 'Kalpohin', 'Dungu', 'Choggu',
      'Yendi Township', 'Savelugu Market', 'Gushegu Junction'
    ]
  },
  [GhanaRegion.UPPER_EAST]: {
    id: GhanaRegion.UPPER_EAST,
    name: 'Upper East',
    cities: ['Bolgatanga', 'Navrongo', 'Bawku', 'Paga', 'Zebilla'],
    popularAreas: [
      'Bolgatanga Central', 'Zaare', 'Navrongo Township', 'Bawku Central',
      'Paga Border', 'Zebilla Market'
    ]
  },
  [GhanaRegion.UPPER_WEST]: {
    id: GhanaRegion.UPPER_WEST,
    name: 'Upper West',
    cities: ['Wa', 'Lawra', 'Jirapa', 'Nadowli', 'Hamile'],
    popularAreas: [
      'Wa Central', 'Kpongu', 'Lawra Township', 'Jirapa Market',
      'Nadowli Junction', 'Hamile Border'
    ]
  },
  [GhanaRegion.BRONG_AHAFO]: {
    id: GhanaRegion.BRONG_AHAFO,
    name: 'Bono (Brong Ahafo)',
    cities: ['Sunyani', 'Techiman', 'Berekum', 'Dormaa Ahenkro', 'Wenchi'],
    popularAreas: [
      'Sunyani Township', 'Pineapple', 'Techiman Market', 'Berekum Township',
      'Dormaa Ahenkro', 'Wenchi Junction'
    ]
  },
  [GhanaRegion.WESTERN_NORTH]: {
    id: GhanaRegion.WESTERN_NORTH,
    name: 'Western North',
    cities: ['Wiawso', 'Bibiani', 'Akontombra', 'Juaboso'],
    popularAreas: ['Wiawso Township', 'Bibiani Market', 'Akontombra Junction', 'Juaboso']
  },
  [GhanaRegion.AHAFO]: {
    id: GhanaRegion.AHAFO,
    name: 'Ahafo',
    cities: ['Goaso', 'Bechem', 'Hwidiem', 'Kenyasi'],
    popularAreas: ['Goaso Township', 'Bechem Market', 'Hwidiem Junction', 'Kenyasi']
  },
  [GhanaRegion.BONO]: {
    id: GhanaRegion.BONO,
    name: 'Bono',
    cities: ['Sunyani', 'Berekum', 'Dormaa Ahenkro', 'Wenchi'],
    popularAreas: ['Sunyani Central', 'Berekum Township', 'Dormaa Market', 'Wenchi Junction']
  },
  [GhanaRegion.BONO_EAST]: {
    id: GhanaRegion.BONO_EAST,
    name: 'Bono East',
    cities: ['Techiman', 'Nkoranza', 'Atebubu', 'Yeji'],
    popularAreas: ['Techiman Market', 'Nkoranza Township', 'Atebubu Junction', 'Yeji']
  },
  [GhanaRegion.OTI]: {
    id: GhanaRegion.OTI,
    name: 'Oti',
    cities: ['Dambai', 'Nkwanta', 'Kadjebi', 'Jasikan'],
    popularAreas: ['Dambai Township', 'Nkwanta Market', 'Kadjebi Junction', 'Jasikan']
  },
  [GhanaRegion.SAVANNAH]: {
    id: GhanaRegion.SAVANNAH,
    name: 'Savannah',
    cities: ['Damongo', 'Bole', 'Salaga', 'Sawla'],
    popularAreas: ['Damongo Township', 'Bole Market', 'Salaga Junction', 'Sawla']
  },
  [GhanaRegion.NORTH_EAST]: {
    id: GhanaRegion.NORTH_EAST,
    name: 'North East',
    cities: ['Nalerigu', 'Gambaga', 'Walewale', 'Chereponi'],
    popularAreas: ['Nalerigu Township', 'Gambaga Market', 'Walewale Junction', 'Chereponi']
  }
};

export const URGENCY_OPTIONS = [
  { 
    value: JobUrgency.LOW, 
    label: 'Low Priority', 
    description: 'Can wait a few weeks',
    color: 'text-green-600 bg-green-50 border-green-200',
    icon: 'clock'
  },
  { 
    value: JobUrgency.MEDIUM, 
    label: 'Medium Priority', 
    description: 'Needed within a week',
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    icon: 'clock'
  },
  { 
    value: JobUrgency.HIGH, 
    label: 'High Priority', 
    description: 'Needed within 2-3 days',
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    icon: 'alert-circle'
  },
  { 
    value: JobUrgency.URGENT, 
    label: 'Urgent', 
    description: 'Needed today or tomorrow',
    color: 'text-red-600 bg-red-50 border-red-200',
    icon: 'alert-triangle'
  }
];

export const DURATION_OPTIONS = [
  '1-3 hours',
  'Half day (4 hours)',
  '1 day',
  '2-3 days',
  '1 week',
  '2-3 weeks',
  '1 month',
  '2-3 months',
  '3-6 months',
  '6+ months',
  'Ongoing/Contract'
];

export const AVAILABILITY_FILTERS = [
  { value: 'immediate', label: 'Available Immediately', description: 'Can start today or tomorrow' },
  { value: 'scheduled', label: 'Scheduled Availability', description: 'Available on specific dates' },
  { value: 'flexible', label: 'Flexible Timing', description: 'Can work around your schedule' }
];

export const RATING_THRESHOLDS = [
  { value: 4.5, label: '4.5+ stars', description: 'Excellent rated professionals' },
  { value: 4.0, label: '4.0+ stars', description: 'Highly rated professionals' },
  { value: 3.5, label: '3.5+ stars', description: 'Well rated professionals' },
  { value: 3.0, label: '3.0+ stars', description: 'Good rated professionals' }
];

export const DISTANCE_OPTIONS = [
  { value: 5, label: 'Within 5km', description: 'Very close to your location' },
  { value: 10, label: 'Within 10km', description: 'Close to your location' },
  { value: 25, label: 'Within 25km', description: 'Reasonable distance' },
  { value: 50, label: 'Within 50km', description: 'Extended area' },
  { value: 100, label: 'Within 100km', description: 'Wide coverage area' }
];

// Helper functions
export const getCategoryInfo = (category: JobCategory): CategoryInfo => {
  return JOB_CATEGORIES[category];
};

export const getRegionInfo = (region: GhanaRegion): RegionInfo => {
  return GHANA_REGIONS[region];
};

export const getCategoriesBySearch = (searchTerm: string): CategoryInfo[] => {
  const term = searchTerm.toLowerCase();
  return Object.values(JOB_CATEGORIES).filter(category => 
    category.name.toLowerCase().includes(term) ||
    category.description.toLowerCase().includes(term) ||
    category.commonSkills.some(skill => skill.toLowerCase().includes(term))
  );
};

export const getRegionsBySearch = (searchTerm: string): RegionInfo[] => {
  const term = searchTerm.toLowerCase();
  return Object.values(GHANA_REGIONS).filter(region =>
    region.name.toLowerCase().includes(term) ||
    region.cities.some(city => city.toLowerCase().includes(term)) ||
    region.popularAreas.some(area => area.toLowerCase().includes(term))
  );
};


export const urgencyColors = {
  [JobUrgency.LOW]: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  [JobUrgency.MEDIUM]: 'text-amber-600 bg-amber-50 border-amber-200',
  [JobUrgency.HIGH]: 'text-orange-600 bg-orange-50 border-orange-200',
  [JobUrgency.URGENT]: 'text-red-600 bg-red-50 border-red-200 shadow-red-100'
};

export const urgencyLabels = {
  [JobUrgency.LOW]: 'Low',
  [JobUrgency.MEDIUM]: 'Medium',
  [JobUrgency.HIGH]: 'High',
  [JobUrgency.URGENT]: 'Urgent'
};

export const statusColors = {
  [JobStatus.OPEN]: 'text-green-600 bg-green-50 border-green-200',
  [JobStatus.IN_PROGRESS]: 'text-blue-600 bg-blue-50 border-blue-200',
  [JobStatus.COMPLETED]: 'text-gray-600 bg-gray-50 border-gray-200',
  [JobStatus.CANCELLED]: 'text-red-600 bg-red-50 border-red-200'
};

export const categoryIcons = {
  [JobCategory.PLUMBING]: '🔧',
  [JobCategory.ELECTRICAL]: '⚡',
  [JobCategory.TUTORING]: '📚',
  [JobCategory.CLEANING]: '🧹',
  [JobCategory.CARPENTRY]: '🪚',
  [JobCategory.PAINTING]: '🎨',
  [JobCategory.GARDENING]: '🌿',
  [JobCategory.REPAIRS]: '🛠️',
  [JobCategory.DELIVERY]: '📦',
  [JobCategory.TECH_SUPPORT]: '💻',
  [JobCategory.PERSONAL_CARE]: '💇',
  [JobCategory.AUTOMOTIVE]: '🚗',
  [JobCategory.BEAUTY]: '💄',
  [JobCategory.FITNESS]: '💪',
  [JobCategory.EVENT_PLANNING]: '🎉',
  [JobCategory.PHOTOGRAPHY]: '📷',
  [JobCategory.WRITING]: '✏️',
  [JobCategory.TRANSLATION]: '🌍',
  [JobCategory.LEGAL]: '⚖️',
  [JobCategory.ACCOUNTING]: '📊',
  [JobCategory.OTHER]: '📌'
};

export const regionNames = {
  [GhanaRegion.GREATER_ACCRA]: 'Greater Accra',
  [GhanaRegion.ASHANTI]: 'Ashanti',
  [GhanaRegion.WESTERN]: 'Western',
  [GhanaRegion.CENTRAL]: 'Central',
  [GhanaRegion.VOLTA]: 'Volta',
  [GhanaRegion.EASTERN]: 'Eastern',
  [GhanaRegion.NORTHERN]: 'Northern',
  [GhanaRegion.UPPER_EAST]: 'Upper East',
  [GhanaRegion.UPPER_WEST]: 'Upper West',
  [GhanaRegion.BRONG_AHAFO]: 'Brong Ahafo',
  [GhanaRegion.WESTERN_NORTH]: 'Western North',
  [GhanaRegion.AHAFO]: 'Ahafo',
  [GhanaRegion.BONO]: 'Bono',
  [GhanaRegion.BONO_EAST]: 'Bono East',
  [GhanaRegion.OTI]: 'Oti',
  [GhanaRegion.SAVANNAH]: 'Savannah',
  [GhanaRegion.NORTH_EAST]: 'North East'
};

export const applicationStatusColors = {
  [ApplicationStatus.PENDING]: 'text-yellow-700 bg-yellow-100',
  [ApplicationStatus.ACCEPTED]: 'text-green-700 bg-green-100',
  [ApplicationStatus.REJECTED]: 'text-red-700 bg-red-100',
  [ApplicationStatus.WITHDRAWN]: 'text-gray-700 bg-gray-100'
};

export const applicationStatusLabels = {
  [ApplicationStatus.PENDING]: 'Application Pending',
  [ApplicationStatus.ACCEPTED]: 'Application Accepted',
  [ApplicationStatus.REJECTED]: 'Application Rejected',
  [ApplicationStatus.WITHDRAWN]: 'Application Withdrawn'
};