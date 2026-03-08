export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  city: string;
  category: JobCategory;
  description: string;
  requirements: string[];
  applyLink: string;
  publishDate: string;
  source: string;
}

export type JobCategory = 'حكومية' | 'عسكرية' | 'شركات' | 'تدريب';

export const categories: { label: JobCategory; icon: string; count: number; colorClass: string }[] = [
  { label: 'حكومية', icon: '🏛️', count: 45, colorClass: 'category-government' },
  { label: 'عسكرية', icon: '⭐', count: 23, colorClass: 'category-military' },
  { label: 'شركات', icon: '🏢', count: 67, colorClass: 'category-corporate' },
  { label: 'تدريب', icon: '🎓', count: 31, colorClass: 'category-training' },
];

export const cities = ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة', 'أبها', 'تبوك', 'حائل', 'الطائف', 'نجران'];

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'أخصائي موارد بشرية',
    company: 'وزارة الموارد البشرية',
    city: 'الرياض',
    category: 'حكومية',
    description: 'مطلوب أخصائي موارد بشرية للعمل في وزارة الموارد البشرية والتنمية الاجتماعية. يتطلب الدور خبرة في إدارة شؤون الموظفين وتطوير السياسات والإجراءات.',
    requirements: ['بكالوريوس في إدارة الأعمال أو الموارد البشرية', 'خبرة لا تقل عن 3 سنوات', 'إجادة اللغة الإنجليزية', 'مهارات تواصل ممتازة'],
    applyLink: 'https://example.com/apply/1',
    publishDate: '2026-03-07',
    source: 'أي وظيفة',
  },
  {
    id: '2',
    title: 'مهندس برمجيات أول',
    company: 'شركة أرامكو السعودية',
    city: 'الظهران',
    category: 'شركات',
    description: 'تبحث أرامكو السعودية عن مهندس برمجيات أول للانضمام إلى فريق التحول الرقمي. العمل على تطوير حلول تقنية مبتكرة.',
    requirements: ['بكالوريوس في علوم الحاسب', 'خبرة 5+ سنوات في تطوير البرمجيات', 'إجادة Python و Java', 'خبرة في الحوسبة السحابية'],
    applyLink: 'https://example.com/apply/2',
    publishDate: '2026-03-06',
    source: 'أي وظيفة',
  },
  {
    id: '3',
    title: 'جندي أول - القوات البرية',
    company: 'وزارة الدفاع',
    city: 'الرياض',
    category: 'عسكرية',
    description: 'تعلن وزارة الدفاع عن فتح باب القبول والتسجيل في القوات البرية الملكية السعودية لحملة الثانوية العامة.',
    requirements: ['سعودي الجنسية', 'شهادة الثانوية العامة', 'العمر من 18 إلى 25 سنة', 'اللياقة البدنية', 'حسن السيرة والسلوك'],
    applyLink: 'https://example.com/apply/3',
    publishDate: '2026-03-08',
    source: 'أي وظيفة',
  },
  {
    id: '4',
    title: 'برنامج تدريب تعاوني - تقنية المعلومات',
    company: 'شركة سابك',
    city: 'جدة',
    category: 'تدريب',
    description: 'تعلن شركة سابك عن برنامج التدريب التعاوني في مجال تقنية المعلومات للطلاب والطالبات في مرحلة البكالوريوس.',
    requirements: ['طالب/ة في مرحلة البكالوريوس', 'تخصص تقنية المعلومات أو علوم الحاسب', 'معدل لا يقل عن 3.0', 'سعودي/ة الجنسية'],
    applyLink: 'https://example.com/apply/4',
    publishDate: '2026-03-05',
    source: 'أي وظيفة',
  },
  {
    id: '5',
    title: 'محاسب قانوني',
    company: 'هيئة الزكاة والضريبة والجمارك',
    city: 'الرياض',
    category: 'حكومية',
    description: 'مطلوب محاسب قانوني للعمل في هيئة الزكاة والضريبة والجمارك. المسؤوليات تشمل مراجعة الإقرارات الضريبية وتدقيق الحسابات.',
    requirements: ['بكالوريوس محاسبة', 'شهادة CPA أو SOCPA', 'خبرة 4+ سنوات', 'معرفة بالأنظمة الضريبية السعودية'],
    applyLink: 'https://example.com/apply/5',
    publishDate: '2026-03-04',
    source: 'أي وظيفة',
  },
  {
    id: '6',
    title: 'مدير مشاريع',
    company: 'شركة الاتصالات السعودية STC',
    city: 'الرياض',
    category: 'شركات',
    description: 'تبحث STC عن مدير مشاريع محترف لقيادة مشاريع التحول الرقمي وتطوير البنية التحتية للاتصالات.',
    requirements: ['بكالوريوس في الهندسة أو إدارة الأعمال', 'شهادة PMP', 'خبرة 7+ سنوات', 'مهارات قيادية متميزة'],
    applyLink: 'https://example.com/apply/6',
    publishDate: '2026-03-07',
    source: 'أي وظيفة',
  },
  {
    id: '7',
    title: 'ضابط أمن - الحرس الوطني',
    company: 'وزارة الحرس الوطني',
    city: 'جدة',
    category: 'عسكرية',
    description: 'يعلن الحرس الوطني عن وظائف شاغرة لضباط الأمن في مختلف المناطق.',
    requirements: ['سعودي الجنسية', 'بكالوريوس في العلوم الأمنية', 'خبرة عسكرية سابقة', 'اللياقة البدنية العالية'],
    applyLink: 'https://example.com/apply/7',
    publishDate: '2026-03-03',
    source: 'أي وظيفة',
  },
  {
    id: '8',
    title: 'برنامج تمهير - التسويق الرقمي',
    company: 'صندوق تنمية الموارد البشرية (هدف)',
    city: 'المدينة المنورة',
    category: 'تدريب',
    description: 'برنامج تمهير للتدريب على رأس العمل في مجال التسويق الرقمي مع مكافأة شهرية.',
    requirements: ['سعودي/ة الجنسية', 'حاصل على البكالوريوس', 'غير موظف حالياً', 'لم يسبق الاستفادة من البرنامج'],
    applyLink: 'https://example.com/apply/8',
    publishDate: '2026-03-08',
    source: 'أي وظيفة',
  },
  {
    id: '9',
    title: 'طبيب أسنان',
    company: 'وزارة الصحة',
    city: 'أبها',
    category: 'حكومية',
    description: 'مطلوب طبيب أسنان للعمل في المراكز الصحية التابعة لوزارة الصحة في منطقة عسير.',
    requirements: ['بكالوريوس طب أسنان', 'ترخيص الهيئة السعودية للتخصصات الصحية', 'خبرة سنتين', 'سعودي الجنسية'],
    applyLink: 'https://example.com/apply/9',
    publishDate: '2026-03-06',
    source: 'أي وظيفة',
  },
  {
    id: '10',
    title: 'مصمم جرافيك',
    company: 'مجموعة MBC',
    city: 'الرياض',
    category: 'شركات',
    description: 'تبحث مجموعة MBC عن مصمم جرافيك مبدع للعمل على تصميم المحتوى البصري للقنوات والمنصات الرقمية.',
    requirements: ['بكالوريوس في التصميم الجرافيكي', 'إجادة Adobe Creative Suite', 'خبرة 3+ سنوات', 'محفظة أعمال قوية'],
    applyLink: 'https://example.com/apply/10',
    publishDate: '2026-03-05',
    source: 'أي وظيفة',
  },
];
