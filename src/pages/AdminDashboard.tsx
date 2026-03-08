import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Plus, Pencil, Trash2, LogOut, LayoutDashboard, Briefcase, Tag, MapPin, Download, Loader2, BarChart3, MessageSquare, Eye, EyeOff } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type Tab = 'stats' | 'jobs' | 'categories' | 'cities' | 'import' | 'messages';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface JobRow {
  id: string;
  title: string;
  company_name: string;
  city: string;
  category: string;
  is_active: boolean;
  publish_date: string;
}

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('stats');
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; icon: string | null }[]>([]);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobRow | null>(null);

  // Job form state
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobCity, setJobCity] = useState('');
  const [jobCategory, setJobCategory] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobRequirements, setJobRequirements] = useState('');
  const [jobApplyLink, setJobApplyLink] = useState('');

  // Category/City form
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCityName, setNewCityName] = useState('');
  const [scraping, setScraping] = useState(false);
  const [scrapeResult, setScrapeResult] = useState<{ message: string; imported?: number; skipped?: number } | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [expandedMessage, setExpandedMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchJobs();
      fetchCategories();
      fetchCities();
      fetchMessages();
    }
  }, [isAdmin]);

  const fetchJobs = async () => {
    const { data } = await supabase
      .from('jobs')
      .select('id, title, company_name, city, category, is_active, publish_date')
      .order('publish_date', { ascending: false });
    setJobs(data || []);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name, icon').order('name');
    setCategories(data || []);
  };

  const fetchCities = async () => {
    const { data } = await supabase.from('cities').select('id, name').order('name');
    setCities(data || []);
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    setMessages((data as ContactMessage[]) || []);
  };

  const handleToggleRead = async (id: string, isRead: boolean) => {
    await supabase.from('contact_messages').update({ is_read: !isRead }).eq('id', id);
    fetchMessages();
  };

  const handleDeleteMessage = async (id: string) => {
    await supabase.from('contact_messages').delete().eq('id', id);
    fetchMessages();
  };

  const resetJobForm = () => {
    setJobTitle(''); setJobCompany(''); setJobCity(''); setJobCategory('');
    setJobDescription(''); setJobRequirements(''); setJobApplyLink('');
    setEditingJob(null); setShowJobForm(false);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const jobData = {
      title: jobTitle,
      company_name: jobCompany,
      city: jobCity,
      category: jobCategory,
      description: jobDescription,
      requirements: jobRequirements.split('\n').filter(Boolean),
      apply_link: jobApplyLink,
    };

    if (editingJob) {
      await supabase.from('jobs').update(jobData).eq('id', editingJob.id);
    } else {
      await supabase.from('jobs').insert(jobData);
    }
    resetJobForm();
    fetchJobs();
  };

  const handleEditJob = async (job: JobRow) => {
    const { data } = await supabase.from('jobs').select('*').eq('id', job.id).single();
    if (data) {
      setJobTitle(data.title);
      setJobCompany(data.company_name);
      setJobCity(data.city);
      setJobCategory(data.category);
      setJobDescription(data.description || '');
      setJobRequirements((data.requirements || []).join('\n'));
      setJobApplyLink(data.apply_link || '');
      setEditingJob(job);
      setShowJobForm(true);
    }
  };

  const handleDeleteJob = async (id: string) => {
    await supabase.from('jobs').delete().eq('id', id);
    fetchJobs();
  };

  const handleToggleJob = async (id: string, isActive: boolean) => {
    await supabase.from('jobs').update({ is_active: !isActive }).eq('id', id);
    fetchJobs();
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    await supabase.from('categories').insert({ name: newCategoryName.trim() });
    setNewCategoryName('');
    fetchCategories();
  };

  const handleDeleteCategory = async (id: string) => {
    await supabase.from('categories').delete().eq('id', id);
    fetchCategories();
  };

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;
    await supabase.from('cities').insert({ name: newCityName.trim() });
    setNewCityName('');
    fetchCities();
  };

  const handleDeleteCity = async (id: string) => {
    await supabase.from('cities').delete().eq('id', id);
    fetchCities();
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(210, 70%, 55%)', 'hsl(150, 60%, 45%)', 'hsl(30, 80%, 55%)', 'hsl(340, 70%, 55%)', 'hsl(270, 60%, 55%)', 'hsl(190, 70%, 45%)'];

  const statsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach(j => { counts[j.category] = (counts[j.category] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [jobs]);

  const statsByCity = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach(j => { counts[j.city] = (counts[j.city] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [jobs]);

  const activeJobs = jobs.filter(j => j.is_active).length;
  const inactiveJobs = jobs.length - activeJobs;

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted-foreground">جاري التحميل...</div>;
  if (!isAdmin) return null;

  const handleScrapeJobs = async () => {
    setScraping(true);
    setScrapeResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('scrape-jobs');
      if (error) {
        setScrapeResult({ message: `خطأ: ${error.message}` });
      } else {
        setScrapeResult(data);
        fetchJobs();
      }
    } catch (e) {
      setScrapeResult({ message: 'حدث خطأ أثناء جلب الوظائف' });
    }
    setScraping(false);
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'stats', label: 'الإحصائيات', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'jobs', label: 'الوظائف', icon: <Briefcase className="w-4 h-4" /> },
    { key: 'categories', label: 'التصنيفات', icon: <Tag className="w-4 h-4" /> },
    { key: 'cities', label: 'المدن', icon: <MapPin className="w-4 h-4" /> },
    { key: 'import', label: 'جلب تلقائي', icon: <Download className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <span className="font-bold text-foreground">لوحة التحكم</span>
          </div>
          <button onClick={() => { signOut(); navigate('/'); }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-4 h-4" /> خروج
          </button>
        </div>
      </header>

      <div className="container py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.key ? 'hero-gradient text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-card rounded-xl border border-border p-5 card-shadow text-center">
                <p className="text-3xl font-bold text-primary">{jobs.length}</p>
                <p className="text-sm text-muted-foreground mt-1">إجمالي الوظائف</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-5 card-shadow text-center">
                <p className="text-3xl font-bold text-accent-foreground">{activeJobs}</p>
                <p className="text-sm text-muted-foreground mt-1">وظائف نشطة</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-5 card-shadow text-center">
                <p className="text-3xl font-bold text-muted-foreground">{inactiveJobs}</p>
                <p className="text-sm text-muted-foreground mt-1">وظائف متوقفة</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-5 card-shadow text-center">
                <p className="text-3xl font-bold text-foreground">{statsByCity.length}</p>
                <p className="text-sm text-muted-foreground mt-1">مدن</p>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Pie Chart */}
              <div className="bg-card rounded-xl border border-border p-6 card-shadow">
                <h3 className="font-bold text-foreground mb-4">الوظائف حسب التصنيف</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statsByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, value }) => `${name} (${value})`}
                        labelLine={false}
                      >
                        {statsByCategory.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* City Bar Chart */}
              <div className="bg-card rounded-xl border border-border p-6 card-shadow">
                <h3 className="font-bold text-foreground mb-4">الوظائف حسب المدينة</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statsByCity} layout="vertical" margin={{ right: 20, left: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                      <YAxis type="category" dataKey="name" tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }} width={80} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} />
                      <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">إدارة الوظائف ({jobs.length})</h2>
              <button
                onClick={() => { resetJobForm(); setShowJobForm(true); }}
                className="flex items-center gap-1 px-4 py-2 rounded-lg hero-gradient text-primary-foreground text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> إضافة وظيفة
              </button>
            </div>

            {showJobForm && (
              <div className="bg-card rounded-xl border border-border p-6 card-shadow mb-6">
                <h3 className="font-bold text-foreground mb-4">{editingJob ? 'تعديل وظيفة' : 'إضافة وظيفة جديدة'}</h3>
                <form onSubmit={handleSaveJob} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="عنوان الوظيفة" required className="h-10 rounded-lg border border-border bg-background text-foreground px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  <input value={jobCompany} onChange={(e) => setJobCompany(e.target.value)} placeholder="اسم الجهة" required className="h-10 rounded-lg border border-border bg-background text-foreground px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  <select value={jobCity} onChange={(e) => setJobCity(e.target.value)} required className="h-10 rounded-lg border border-border bg-background text-foreground px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">اختر المدينة</option>
                    {cities.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                  <select value={jobCategory} onChange={(e) => setJobCategory(e.target.value)} required className="h-10 rounded-lg border border-border bg-background text-foreground px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">اختر التصنيف</option>
                    {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                  <input value={jobApplyLink} onChange={(e) => setJobApplyLink(e.target.value)} placeholder="رابط التقديم" className="h-10 rounded-lg border border-border bg-background text-foreground px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring md:col-span-2" />
                  <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="وصف الوظيفة" rows={3} className="rounded-lg border border-border bg-background text-foreground p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring md:col-span-2" />
                  <textarea value={jobRequirements} onChange={(e) => setJobRequirements(e.target.value)} placeholder="الشروط (كل شرط في سطر)" rows={3} className="rounded-lg border border-border bg-background text-foreground p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring md:col-span-2" />
                  <div className="md:col-span-2 flex gap-2">
                    <button type="submit" className="px-6 py-2 rounded-lg hero-gradient text-primary-foreground text-sm font-medium">حفظ</button>
                    <button type="button" onClick={resetJobForm} className="px-6 py-2 rounded-lg border border-border text-muted-foreground text-sm hover:text-foreground transition-colors">إلغاء</button>
                  </div>
                </form>
              </div>
            )}

            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job.id} className="bg-card rounded-lg border border-border p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-medium text-foreground text-sm truncate">{job.title}</h3>
                    <p className="text-xs text-muted-foreground">{job.company_name} • {job.city} • {job.category}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleToggleJob(job.id, job.is_active)} className={`px-2 py-1 rounded text-xs font-medium ${job.is_active ? 'bg-accent/20 text-accent-foreground' : 'bg-muted text-muted-foreground'}`}>
                      {job.is_active ? 'نشط' : 'متوقف'}
                    </button>
                    <button onClick={() => handleEditJob(job)} className="p-1.5 rounded hover:bg-muted transition-colors"><Pencil className="w-4 h-4 text-muted-foreground" /></button>
                    <button onClick={() => handleDeleteJob(job.id)} className="p-1.5 rounded hover:bg-destructive/10 transition-colors"><Trash2 className="w-4 h-4 text-destructive" /></button>
                  </div>
                </div>
              ))}
              {jobs.length === 0 && <p className="text-center text-muted-foreground py-8">لا توجد وظائف بعد</p>}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">إدارة التصنيفات</h2>
            <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
              <input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="اسم التصنيف الجديد" className="flex-1 h-10 rounded-lg border border-border bg-background text-foreground px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <button type="submit" className="px-4 h-10 rounded-lg hero-gradient text-primary-foreground text-sm font-medium"><Plus className="w-4 h-4" /></button>
            </form>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-card rounded-lg border border-border p-3 flex items-center justify-between">
                  <span className="text-sm text-foreground">{cat.icon} {cat.name}</span>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 rounded hover:bg-destructive/10 transition-colors"><Trash2 className="w-4 h-4 text-destructive" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cities Tab */}
        {activeTab === 'cities' && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">إدارة المدن</h2>
            <form onSubmit={handleAddCity} className="flex gap-2 mb-6">
              <input value={newCityName} onChange={(e) => setNewCityName(e.target.value)} placeholder="اسم المدينة الجديدة" className="flex-1 h-10 rounded-lg border border-border bg-background text-foreground px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <button type="submit" className="px-4 h-10 rounded-lg hero-gradient text-primary-foreground text-sm font-medium"><Plus className="w-4 h-4" /></button>
            </form>
            <div className="space-y-2">
              {cities.map((city) => (
                <div key={city.id} className="bg-card rounded-lg border border-border p-3 flex items-center justify-between">
                  <span className="text-sm text-foreground">{city.name}</span>
                  <button onClick={() => handleDeleteCity(city.id)} className="p-1.5 rounded hover:bg-destructive/10 transition-colors"><Trash2 className="w-4 h-4 text-destructive" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Import Tab */}
        {activeTab === 'import' && (
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">جلب الوظائف تلقائياً</h2>
            <div className="bg-card rounded-xl border border-border p-6 card-shadow">
              <p className="text-sm text-muted-foreground mb-4">
                جلب أحدث الوظائف من موقع "أي وظيفة" (ewdifh.com) تلقائياً. النظام يتحقق من عدم تكرار الوظائف قبل الإضافة.
              </p>
              <button
                onClick={handleScrapeJobs}
                disabled={scraping}
                className="flex items-center gap-2 px-6 py-3 rounded-lg hero-gradient text-primary-foreground font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {scraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                {scraping ? 'جاري الجلب...' : 'جلب الوظائف الآن'}
              </button>

              {scrapeResult && (
                <div className="mt-4 p-4 rounded-lg bg-muted">
                  <p className="text-sm font-medium text-foreground">{scrapeResult.message}</p>
                  {scrapeResult.imported !== undefined && (
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>✅ تم جلب: {scrapeResult.imported}</span>
                      <span>⏭️ مكررة: {scrapeResult.skipped}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
