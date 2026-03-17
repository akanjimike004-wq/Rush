import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Wallet, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Instagram, 
  Twitter, 
  Youtube, 
  Facebook,
  MessageSquare,
  ThumbsUp,
  UserPlus,
  Share2,
  Search,
  Plus,
  Bell,
  LogOut,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
  Home,
  Info,
  Mail,
  ShieldCheck,
  ArrowRight,
  ShieldAlert,
  Lock,
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Task, User } from './types';

const MOCK_TASKS: Task[] = [
  { id: '1', platform: 'Instagram', type: 'Like', reward: 50, description: 'Like the latest post on @tech_trends', url: 'https://instagram.com', status: 'available' },
  { id: '2', platform: 'Twitter', type: 'Follow', reward: 150, description: 'Follow @SocialPayOfficial for updates', url: 'https://twitter.com', status: 'available' },
  { id: '3', platform: 'YouTube', type: 'Subscribe', reward: 250, description: 'Subscribe to "Digital Marketing Mastery"', url: 'https://youtube.com', status: 'available' },
  { id: '4', platform: 'TikTok', type: 'Comment', reward: 100, description: 'Comment "Great content!" on the pinned video', url: 'https://tiktok.com', status: 'available' },
  { id: '5', platform: 'Facebook', type: 'Share', reward: 200, description: 'Share the "SocialPay Launch" event', url: 'https://facebook.com', status: 'available' },
  { id: '6', platform: 'Instagram', type: 'Follow', reward: 120, description: 'Follow @fitness_guru for daily tips', url: 'https://instagram.com', status: 'available' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'marketplace' | 'wallet' | 'about' | 'contact' | 'privacy' | 'admin'>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Handle scrolling when tab changes to home with a hash-like intent
    if (activeTab === 'home') {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setTimeout(() => scrollToSection(hash), 100);
      }
    }
  }, [activeTab]);

  const handleNavClick = (tab: typeof activeTab, sectionId?: string) => {
    if (sectionId) {
      if (activeTab !== 'home') {
        setActiveTab('home');
        // The useEffect will handle the scroll
        window.location.hash = sectionId;
      } else {
        scrollToSection(sectionId);
      }
    } else {
      setActiveTab(tab);
      window.location.hash = '';
    }
    setIsMobileMenuOpen(false);
  };
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('socialpay_auth') === 'true';
  });
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Initialize state from localStorage or defaults
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('socialpay_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        id: '1',
        role: 'admin',
        status: 'active',
        ...parsed,
        recentActivity: parsed.recentActivity || []
      };
    }
    return {
      id: '1',
      name: 'Mike Akanji',
      email: 'akanjimike004@gmail.com',
      balance: 12450,
      completedTasks: 48,
      isPaid: false,
      role: 'admin',
      status: 'active',
      recentActivity: []
    };
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('socialpay_users');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'Mike Akanji',
        email: 'akanjimike004@gmail.com',
        balance: 12450,
        completedTasks: 48,
        isPaid: true,
        role: 'admin',
        status: 'active',
        recentActivity: []
      },
      {
        id: '2',
        name: 'Jane Doe',
        email: 'jane@example.com',
        balance: 500,
        completedTasks: 5,
        isPaid: false,
        role: 'user',
        status: 'active',
        recentActivity: []
      },
      {
        id: '3',
        name: 'John Smith',
        email: 'john@example.com',
        balance: 0,
        completedTasks: 0,
        isPaid: false,
        role: 'user',
        status: 'pending',
        recentActivity: []
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('socialpay_users', JSON.stringify(users));
  }, [users]);

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('socialpay_tasks');
    return saved ? JSON.parse(saved) : MOCK_TASKS;
  });

  // Auto-complete tasks after 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      let balanceToAdd = 0;
      let tasksCompleted = 0;
      const newActivities: any[] = [];

      setTasks(prev => {
        const updated = prev.map(task => {
          if (task.status === 'pending' && task.submittedAt) {
            const submittedAt = new Date(task.submittedAt);
            const diffMinutes = (now.getTime() - submittedAt.getTime()) / (1000 * 60);
            
            if (diffMinutes >= 30) {
              balanceToAdd += task.reward;
              tasksCompleted += 1;
              newActivities.push({
                id: Math.random().toString(36).substr(2, 9),
                type: `${task.type} on ${task.platform}`,
                amount: task.reward,
                timestamp: now.toISOString()
              });
              return { ...task, status: 'completed' as const };
            }
          }
          return task;
        });
        return updated;
      });

      if (balanceToAdd > 0) {
        setUser(prev => ({
          ...prev,
          balance: prev.balance + balanceToAdd,
          completedTasks: prev.completedTasks + tasksCompleted,
          recentActivity: [...newActivities, ...(prev.recentActivity || [])].slice(0, 10)
        }));
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleLogin = (email: string, name: string) => {
    setUser(prev => ({ ...prev, email, name }));
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdminAuthenticated(false);
    setActiveTab('home');
  };

  const submitTaskProof = (taskId: string, proofUrl: string, proofUsername: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { 
      ...t, 
      status: 'pending' as const,
      proofUrl,
      proofUsername,
      submittedAt: new Date().toISOString()
    } : t));
  };

  const handleAddTask = (task: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      status: 'available'
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
  };

  const renderContent = () => {
    // Protected routes check
    const protectedTabs = ['dashboard', 'marketplace', 'wallet'];
    if (protectedTabs.includes(activeTab) && !isAuthenticated) {
      return <LoginView onLogin={handleLogin} />;
    }

    switch (activeTab) {
      case 'home':
        return (
          <HomeView 
            onStart={() => isAuthenticated ? setActiveTab('dashboard') : setActiveTab('marketplace')} 
            onScrollTo={scrollToSection}
          />
        );
      case 'dashboard':
        return <DashboardView user={user} tasks={tasks} />;
      case 'marketplace':
        return <MarketplaceView tasks={tasks} onComplete={submitTaskProof} />;
      case 'wallet':
        return <WalletView user={user} />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'privacy':
        return <PrivacyPolicyView />;
      case 'admin':
        if (user.role !== 'admin') return <DashboardView user={user} tasks={tasks} />;
        if (!isAdminAuthenticated) return <AdminLoginView onLogin={() => setIsAdminAuthenticated(true)} />;
        return (
          <AdminView 
            users={users} 
            tasks={tasks} 
            onUpdateUserStatus={(userId, status) => {
              setUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
            }}
            onDeleteUser={(userId) => {
              setUsers(prev => prev.filter(u => u.id !== userId));
            }}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTask={handleUpdateTask}
          />
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Top Navbar */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 text-emerald-600 font-bold text-2xl cursor-pointer shrink-0"
              onClick={() => setActiveTab('home')}
            >
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                <TrendingUp size={24} />
              </div>
              <span className="hidden sm:inline tracking-tight">SocialPay</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
              <NavItem icon={<Home size={18} />} label="Home" active={activeTab === 'home'} onClick={() => handleNavClick('home')} />
              <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => handleNavClick('dashboard')} />
              <NavItem icon={<ShoppingBag size={18} />} label="Marketplace" active={activeTab === 'marketplace'} onClick={() => handleNavClick('marketplace')} />
              <NavItem icon={<Wallet size={18} />} label="Wallet" active={activeTab === 'wallet'} onClick={() => handleNavClick('wallet')} />
              
              <div className="w-px h-6 bg-slate-200 mx-2"></div>
              
              <NavItem icon={<Info size={18} />} label="About" active={false} onClick={() => handleNavClick('home', 'about')} />
              <NavItem icon={<Mail size={18} />} label="Contact" active={false} onClick={() => handleNavClick('home', 'contact')} />
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden xl:flex items-center gap-4">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search tasks..." 
                    className="pl-9 pr-4 py-2 bg-slate-100 border border-transparent rounded-xl text-sm focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 w-48 transition-all outline-none"
                  />
                </div>
              </div>

              {isAuthenticated ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="hidden sm:flex flex-col items-end mr-1">
                    <p className="text-xs font-bold text-slate-900 leading-none">{user.name}</p>
                    <p className="text-[10px] font-medium text-emerald-600 leading-none mt-1">₦{user.balance.toLocaleString()}</p>
                  </div>
                  
                  <div className="relative group/profile">
                    <button className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-sm hover:bg-emerald-200 transition-colors">
                      {user.name.charAt(0)}
                    </button>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>

                    {/* Profile Dropdown */}
                    <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-200 z-[60]">
                      <div className="w-64 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-200">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Recent Earnings</p>
                          <div className="space-y-2">
                            {(user.recentActivity || []).length > 0 ? (user.recentActivity || []).slice(0, 3).map(activity => (
                              <div key={activity.id} className="flex justify-between items-center">
                                <span className="text-xs text-slate-600 truncate mr-2">{activity.type}</span>
                                <span className="text-xs font-bold text-emerald-600">+₦{activity.amount}</span>
                              </div>
                            )) : (
                              <p className="text-xs text-slate-400 italic">No recent earnings</p>
                            )}
                          </div>
                        </div>
                        <div className="p-2">
                          <button 
                            onClick={() => setActiveTab('dashboard')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                          >
                            <LayoutDashboard size={16} />
                            Dashboard
                          </button>
                          <button 
                            onClick={() => setActiveTab('wallet')}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                          >
                            <Wallet size={16} />
                            Wallet
                          </button>
                          <div className="h-px bg-slate-100 my-1"></div>
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <LogOut size={16} />
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-200 active:scale-95"
                >
                  Sign In
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-72 bg-white z-50 shadow-2xl lg:hidden flex flex-col"
              >
                <div className="p-6 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
                    <TrendingUp size={24} />
                    <span>SocialPay</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg hover:bg-slate-100">
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  <MobileNavItem icon={<Home size={20} />} label="Home" active={activeTab === 'home'} onClick={() => handleNavClick('home')} />
                  <MobileNavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => handleNavClick('dashboard')} />
                  <MobileNavItem icon={<ShoppingBag size={20} />} label="Marketplace" active={activeTab === 'marketplace'} onClick={() => handleNavClick('marketplace')} />
                  <MobileNavItem icon={<Wallet size={20} />} label="Wallet" active={activeTab === 'wallet'} onClick={() => handleNavClick('wallet')} />
                  
                  <div className="pt-4 pb-2">
                    <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Support & Info</p>
                    <MobileNavItem icon={<Info size={20} />} label="About Us" active={false} onClick={() => handleNavClick('home', 'about')} />
                    <MobileNavItem icon={<Mail size={20} />} label="Contact" active={false} onClick={() => handleNavClick('home', 'contact')} />
                    <MobileNavItem icon={<ShieldCheck size={20} />} label="Privacy Policy" active={activeTab === 'privacy'} onClick={() => handleNavClick('privacy')} />
                  </div>
                </div>

                {isAuthenticated ? (
                  <div className="p-4 border-t border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-emerald-600 font-medium">₦{user.balance.toLocaleString()}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                      className="w-full py-3 flex items-center justify-center gap-2 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="p-4 border-t border-slate-100">
                    <button 
                      onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                      className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100"
                    >
                      Sign In to Account
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer for Top Nav Layout */}
        <footer className="bg-white border-t border-slate-200 py-12 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2 space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
                  <TrendingUp size={24} />
                  <span>SocialPay</span>
                </div>
                <p className="text-slate-500 max-w-sm">
                  The most trusted social media marketing platform in Abuja, Nigeria. Earn daily by engaging with content you love.
                </p>
                <p className="text-xs font-bold text-slate-400">Developed by Brainiac Tech</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="hover:text-emerald-600 cursor-pointer" onClick={() => handleNavClick('home')}>Home</li>
                  <li className="hover:text-emerald-600 cursor-pointer" onClick={() => handleNavClick('home', 'about')}>About Us</li>
                  <li className="hover:text-emerald-600 cursor-pointer" onClick={() => handleNavClick('home', 'contact')}>Contact</li>
                  <li className="hover:text-emerald-600 cursor-pointer" onClick={() => handleNavClick('marketplace')}>Marketplace</li>
                  <li className="hover:text-emerald-600 cursor-pointer" onClick={() => handleNavClick('wallet')}>Wallet</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-slate-500">
                  <li className="hover:text-emerald-600 cursor-pointer" onClick={() => handleNavClick('privacy')}>Privacy Policy</li>
                  <li className="hover:text-emerald-600 cursor-pointer" onClick={() => handleNavClick('home', 'about')}>Terms of Service</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-slate-400">© 2026 SocialPay. All rights reserved.</p>
                {user.role === 'admin' && (
                  <button 
                    onClick={() => setActiveTab('admin')}
                    className="text-[10px] text-slate-300 hover:text-emerald-500 transition-all text-left uppercase tracking-widest font-bold"
                  >
                    Admin Access
                  </button>
                )}
              </div>
              <div className="flex gap-4">
                <Instagram size={18} className="text-slate-400 hover:text-emerald-600 cursor-pointer" />
                <Twitter size={18} className="text-slate-400 hover:text-emerald-600 cursor-pointer" />
                <Facebook size={18} className="text-slate-400 hover:text-emerald-600 cursor-pointer" />
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
        active 
          ? 'bg-white text-emerald-600 shadow-sm' 
          : 'text-slate-500 hover:text-slate-900 hover:bg-white/50'
      }`}
    >
      <span className={active ? 'text-emerald-600' : 'text-slate-400'}>{icon}</span>
      {label}
    </button>
  );
}

function MobileNavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 ${
        active 
          ? 'bg-emerald-50 text-emerald-600' 
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      <span className={active ? 'text-emerald-600' : 'text-slate-400'}>{icon}</span>
      {label}
    </button>
  );
}

function DashboardView({ user, tasks }: { user: User, tasks: Task[] }) {
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const availableTasks = tasks.filter(t => t.status === 'available').length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Balance" 
          value={`₦${user.balance.toLocaleString()}`} 
          icon={<Wallet className="text-blue-600" />} 
          trend="+12% this week"
          color="blue"
        />
        <StatCard 
          title="Tasks Completed" 
          value={user.completedTasks.toString()} 
          icon={<CheckCircle2 className="text-emerald-600" />} 
          trend="+5 today"
          color="emerald"
        />
        <StatCard 
          title="Available Tasks" 
          value={availableTasks.toString()} 
          icon={<ShoppingBag className="text-orange-600" />} 
          trend={`${pendingTasks} pending verification`}
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg">Recent Activity</h3>
            <button className="text-emerald-600 text-sm font-medium hover:underline">View all</button>
          </div>
          <div className="space-y-4">
            {tasks.filter(t => t.status !== 'available').slice(0, 4).map(task => (
              <div key={task.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  task.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  {task.status === 'completed' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{task.type} on {task.platform}</p>
                  <p className="text-xs text-slate-500">{task.status === 'completed' ? 'Verified' : 'Pending verification'}</p>
                </div>
                <div className="text-sm font-bold text-emerald-600">+₦{task.reward.toLocaleString()}</div>
              </div>
            ))}
            {tasks.filter(t => t.status !== 'available').length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <p>No recent activity. Start earning now!</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-emerald-600 p-8 rounded-2xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">Invite Friends & Earn</h3>
            <p className="text-emerald-100 mb-6 max-w-xs">Get 10% of your friends' earnings for life when they join using your link.</p>
            <button className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors flex items-center gap-2">
              <Share2 size={18} />
              Copy Referral Link
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-20">
            <UserPlus size={200} />
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketplaceView({ tasks, onComplete }: { tasks: Task[], onComplete: (id: string, proofUrl: string, proofUsername: string) => void }) {
  const availableTasks = tasks.filter(t => t.status === 'available');

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Task Marketplace</h2>
          <p className="text-slate-500">Pick a task and start earning rewards instantly.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
          {['All', 'Instagram', 'Twitter', 'YouTube', 'TikTok'].map(filter => (
            <button key={filter} className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-medium hover:border-emerald-500 hover:text-emerald-600 transition-all whitespace-nowrap">
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {availableTasks.map(task => (
          <TaskCard key={task.id} task={task} onComplete={onComplete} />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, onComplete }: { task: Task, onComplete: (id: string, proofUrl: string, proofUsername: string) => void }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [proofUrl, setProofUrl] = useState('');
  const [proofUsername, setProofUsername] = useState('');

  const getIcon = () => {
    switch (task.platform) {
      case 'Instagram': return <Instagram size={20} />;
      case 'Twitter': return <Twitter size={20} />;
      case 'YouTube': return <Youtube size={20} />;
      case 'Facebook': return <Facebook size={20} />;
      default: return <Share2 size={20} />;
    }
  };

  const getTypeIcon = () => {
    switch (task.type) {
      case 'Like': return <ThumbsUp size={16} />;
      case 'Follow': return <UserPlus size={16} />;
      case 'Comment': return <MessageSquare size={16} />;
      case 'Subscribe': return <Youtube size={16} />;
      default: return <Share2 size={16} />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofUrl || !proofUsername) return;
    onComplete(task.id, proofUrl, proofUsername);
    setShowConfirm(false);
  };

  if (task.status === 'completed') {
    return (
      <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 size={24} />
        </div>
        <h3 className="font-bold text-emerald-900">Task Completed</h3>
        <p className="text-sm text-emerald-700">Earnings reflected in your wallet.</p>
      </div>
    );
  }

  if (task.status === 'pending') {
    return (
      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center animate-pulse">
          <Clock size={24} />
        </div>
        <h3 className="font-bold text-orange-900">Pending Verification</h3>
        <p className="text-sm text-orange-700">Earnings will be added in 30 minutes.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-all group">
      {!showConfirm ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${
              task.platform === 'Instagram' ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500' :
              task.platform === 'Twitter' ? 'bg-sky-500' :
              task.platform === 'YouTube' ? 'bg-red-600' :
              task.platform === 'Facebook' ? 'bg-blue-600' : 'bg-slate-800'
            }`}>
              {getIcon()}
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Reward</p>
              <p className="text-xl font-bold text-emerald-600">₦{task.reward.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-1 font-medium">
              {getTypeIcon()}
              <span>{task.type}</span>
            </div>
            <p className="text-slate-800 font-semibold leading-snug">{task.description}</p>
          </div>

          <button 
            onClick={() => {
              window.open(task.url, '_blank');
              setShowConfirm(true);
            }}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
          >
            Perform Task
            <ChevronRight size={18} />
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-900">Confirm Completion</h3>
            <button type="button" onClick={() => setShowConfirm(false)} className="text-slate-400 hover:text-slate-600">
              <X size={18} />
            </button>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Task URL / Proof Link</label>
              <input 
                type="url" 
                required
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="Paste link to your post/profile"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Your {task.platform} Username</label>
              <input 
                type="text" 
                required
                value={proofUsername}
                onChange={(e) => setProofUsername(e.target.value)}
                placeholder="@username"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-colors"
          >
            Submit for Verification
          </button>
        </form>
      )}
    </div>
  );
}

function WalletView({ user }: { user: User }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-slate-400 font-medium mb-1">Available Balance</p>
            <h2 className="text-5xl font-bold mb-6">₦{user.balance.toLocaleString()}</h2>
            <div className="flex gap-4">
              <button className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-colors">
                Withdraw Funds
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors">
                History
              </button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <p className="text-sm text-slate-400 mb-4">Payout Methods</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-xs font-bold">PP</div>
                    <span className="text-sm font-medium">PayPal</span>
                  </div>
                  <div className="text-xs text-emerald-400">Connected</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5 opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-xs font-bold">BT</div>
                    <span className="text-sm font-medium">Bank Transfer</span>
                  </div>
                  <div className="text-xs text-slate-400">Not Set</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/20 blur-[100px] rounded-full"></div>
      </div>

      <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl flex items-start gap-4">
        <Clock className="text-orange-600 shrink-0 mt-1" size={24} />
        <div>
          <h4 className="font-bold text-orange-900">Payment Processing Notice</h4>
          <p className="text-orange-800 text-sm">Please note that all withdrawal requests are processed manually for security verification. The maximum delay time for payment processing is <strong>50 hours</strong> from the time of request.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold">Transaction History</h3>
          <button className="text-sm text-slate-500 flex items-center gap-1">
            Filter <ChevronRight size={14} />
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Task Reward: YouTube Subscribe</p>
                  <p className="text-xs text-slate-500">Mar 16, 2026 • 10:45 AM</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600">+₦250</p>
                <p className="text-xs text-slate-400">Completed</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoginView({ onLogin }: { onLogin: (email: string, name: string) => void }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      onLogin(email, name);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500">Login to your SocialPay account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name" 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email" 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-100 mt-4"
          >
            Access Dashboard
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            By logging in, you agree to our <span className="text-emerald-600 font-bold cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, color }: { title: string, value: string, icon: React.ReactNode, trend: string, color: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between min-h-[140px]">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${color}-50 shrink-0`}>
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate ml-2">{title}</span>
      </div>
      <div className="flex items-end justify-between gap-2 overflow-hidden">
        <h3 className="text-2xl xl:text-3xl font-bold truncate">{value}</h3>
        <p className={`text-xs font-medium shrink-0 mb-1 ${color === 'emerald' ? 'text-emerald-600' : color === 'blue' ? 'text-blue-600' : 'text-orange-600'}`}>
          {trend}
        </p>
      </div>
    </div>
  );
}

function HomeView({ onStart, onScrollTo }: { onStart: () => void, onScrollTo: (id: string) => void }) {
  return (
    <div className="max-w-5xl mx-auto space-y-24 py-8">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <TrendingUp size={14} />
            #1 Social Marketing Platform
          </div>
          <h1 className="text-5xl xl:text-6xl font-black text-slate-900 leading-tight">
            Turn Your Social <span className="text-emerald-600">Engagement</span> Into Real Cash.
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
            Join thousands of Nigerians earning daily by performing simple social media tasks. Like, follow, comment, and get paid instantly in Naira.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={onStart}
              className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-200 flex items-center gap-2 group"
            >
              Start Earning Now
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => onScrollTo('about')}
              className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all"
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="bg-emerald-600 rounded-[40px] aspect-square relative overflow-hidden shadow-2xl">
            <img 
              src="https://picsum.photos/seed/marketing/800/800" 
              alt="Social Marketing" 
              className="w-full h-full object-cover opacity-80 mix-blend-overlay"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xl">₦</div>
                <div>
                  <p className="text-white font-bold">Recent Payout</p>
                  <p className="text-emerald-200 text-xs">Verified 2 mins ago</p>
                </div>
                <div className="ml-auto text-white font-black text-xl">₦5,000</div>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-emerald-400 h-full"
                />
              </div>
            </div>
          </div>
          <div className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce">
            <div className="flex items-center gap-2 text-emerald-600 font-bold">
              <CheckCircle2 size={20} />
              <span>100% Secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<ShoppingBag className="text-emerald-600" />}
          title="Unlimited Tasks"
          description="Access hundreds of new tasks daily across all major social platforms."
        />
        <FeatureCard 
          icon={<Wallet className="text-blue-600" />}
          title="Instant Payouts"
          description="Withdraw your earnings directly to your Nigerian bank account in Naira."
        />
        <FeatureCard 
          icon={<TrendingUp className="text-purple-600" />}
          title="Growth Tools"
          description="Use our AI insights to grow your own social media presence effectively."
        />
      </section>

      {/* About Section */}
      <section id="about" className="pt-16 border-t border-slate-100">
        <AboutView />
      </section>

      {/* Contact Section */}
      <section id="contact" className="pt-16 border-t border-slate-100">
        <ContactView />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

function AboutView() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <h2 className="text-4xl font-black text-slate-900">About SocialPay</h2>
      <div className="prose prose-slate prose-lg max-w-none">
        <p className="text-slate-600 leading-relaxed">
          SocialPay is Abuja's leading social media marketing and micro-task platform. We bridge the gap between businesses looking for authentic engagement and individuals looking to monetize their social media presence.
        </p>
        <h3 className="text-2xl font-bold text-slate-800 mt-8 mb-4">Our Mission</h3>
        <p className="text-slate-600 leading-relaxed">
          Our mission is to empower Nigerians with a sustainable way to earn extra income while helping brands build genuine connections with their audience. We believe that every like, share, and comment has value, and we're here to ensure you get paid for it.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <h4 className="font-bold text-emerald-900 mb-2">For Earners</h4>
            <p className="text-sm text-emerald-800">Turn your free time into money. No special skills required, just your social media accounts and a few minutes a day.</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
            <h4 className="font-bold text-blue-900 mb-2">For Advertisers</h4>
            <p className="text-sm text-blue-800">Get real engagement from real people. Boost your visibility and social proof with our targeted marketing services.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactView() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-black text-slate-900 mb-4">Get in Touch</h2>
            <p className="text-slate-600">Have questions or need assistance? Our support team is here to help you 24/7.</p>
          </div>
          
          <div className="space-y-6">
            <ContactInfoItem 
              icon={<Mail className="text-emerald-600" />}
              title="Email Us"
              value="support@socialpay.com"
            />
            <ContactInfoItem 
              icon={<MessageSquare className="text-blue-600" />}
              title="Phone Number"
              value="07052578022"
            />
            <ContactInfoItem 
              icon={<TrendingUp className="text-purple-600" />}
              title="Office Address"
              value="Abuja, Nigeria"
            />
            <div className="flex gap-4 pt-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"><Instagram size={20} /></div>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"><Twitter size={20} /></div>
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"><Facebook size={20} /></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">First Name</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Mike" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Last Name</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Akanji" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Email Address</label>
              <input type="email" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="mike@example.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Message</label>
              <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none h-32 resize-none" placeholder="How can we help you?"></textarea>
            </div>
            <button className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ContactInfoItem({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-slate-900 font-bold">{value}</p>
      </div>
    </div>
  );
}

function PrivacyPolicyView() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="bg-white p-10 rounded-[32px] border border-slate-200 shadow-sm space-y-8">
        <div className="flex items-center gap-4 text-emerald-600">
          <ShieldCheck size={40} />
          <h2 className="text-4xl font-black text-slate-900">Privacy Policy</h2>
        </div>
        
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-start gap-4">
          <ShieldAlert className="text-red-600 shrink-0 mt-1" size={24} />
          <div>
            <h4 className="font-bold text-red-900">Important: No Refund Policy</h4>
            <p className="text-red-800 text-sm leading-relaxed">
              By using SocialPay, you explicitly agree that <strong>no refunds will be issued after any payment is made</strong> for advertising services or account upgrades. Once a transaction is completed, the funds are immediately allocated to the task marketplace and cannot be reversed.
            </p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h3 className="text-xl font-bold text-slate-800 mb-3">1. Information We Collect</h3>
            <p className="text-slate-600">We collect information you provide directly to us, such as when you create an account, update your profile, or perform tasks. This includes your name, email, and social media handles.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-800 mb-3">2. How We Use Your Information</h3>
            <p className="text-slate-600">We use the information we collect to operate and maintain our services, facilitate task verification, and process your earnings payouts.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-800 mb-3">3. Payment & Withdrawals</h3>
            <p className="text-slate-600">Withdrawal requests are subject to manual verification. We aim to process all valid requests within a maximum delay time of <strong>50 hours</strong>. Please ensure your bank details are accurate to avoid further delays.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-slate-800 mb-3">4. Security</h3>
            <p className="text-slate-600">We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.</p>
          </section>
        </div>

        <div className="pt-8 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">Last Updated: March 16, 2026</p>
        </div>
      </div>
    </div>
  );
}

function AdminLoginView({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be a server-side check
    if (password === 'admin123') {
      onLogin();
    } else {
      setError('Invalid administrator password.');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[32px] border border-slate-200 shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-6">
            <Lock size={32} />
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900">Admin Authentication</h2>
            <p className="text-slate-500 mt-2">Please enter your secure administrator password to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Admin Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-mono"
                  required
                />
              </div>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-red-600 mt-2 ml-1"
                >
                  <ShieldAlert size={14} />
                  <span className="text-xs font-bold">{error}</span>
                </motion.div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 group"
            >
              Verify Identity
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-medium">
              This area is restricted to authorized personnel only. 
              Unauthorized access attempts are logged.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AdminView({ 
  users, 
  tasks, 
  onUpdateUserStatus, 
  onDeleteUser,
  onAddTask,
  onDeleteTask,
  onUpdateTask
}: { 
  users: User[], 
  tasks: Task[], 
  onUpdateUserStatus: (userId: string, status: User['status']) => void,
  onDeleteUser: (userId: string) => void,
  onAddTask: (task: Omit<Task, 'id' | 'status'>) => void,
  onDeleteTask: (taskId: string) => void,
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void
}) {
  const [activeAdminTab, setActiveAdminTab] = useState<'users' | 'tasks'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTasks = tasks.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBalance = users.reduce((sum, u) => sum + u.balance, 0);
  const pendingTasksCount = tasks.filter(t => t.status === 'pending').length;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Admin Dashboard</h2>
          <p className="text-slate-500">Manage users, tasks, and monitor platform activity.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Total User Funds</p>
            <p className="text-lg font-bold text-emerald-600">₦{totalBalance.toLocaleString()}</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Pending Tasks</p>
            <p className="text-lg font-bold text-orange-600">{pendingTasksCount}</p>
          </div>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-2 bg-slate-100 p-1 rounded-2xl w-fit">
        <button 
          onClick={() => { setActiveAdminTab('users'); setSearchTerm(''); }}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeAdminTab === 'users' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Users
        </button>
        <button 
          onClick={() => { setActiveAdminTab('tasks'); setSearchTerm(''); }}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeAdminTab === 'tasks' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Tasks
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-lg text-slate-900">
            {activeAdminTab === 'users' ? 'User Management' : 'Task Management'}
          </h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={activeAdminTab === 'users' ? "Search users..." : "Search tasks..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-64"
              />
            </div>
            {activeAdminTab === 'tasks' && (
              <button 
                onClick={() => setIsAddTaskModalOpen(true)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-500 transition-all flex items-center gap-2"
              >
                <Plus size={18} />
                Add Task
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          {activeAdminTab === 'users' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Balance</th>
                  <th className="px-6 py-4">Tasks</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        u.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-900">₦{u.balance.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-600">{u.completedTasks}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-slate-400 uppercase">{u.role}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.status !== 'pending' && (
                          <button 
                            onClick={() => onUpdateUserStatus(u.id, 'pending')}
                            className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Set to Pending"
                          >
                            <Clock size={18} />
                          </button>
                        )}
                        {u.status !== 'active' && (
                          <button 
                            onClick={() => onUpdateUserStatus(u.id, 'active')}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Activate User"
                          >
                            <CheckCircle2 size={18} />
                          </button>
                        )}
                        {u.role !== 'admin' && (
                          <button 
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to delete ${u.name}?`)) {
                                onDeleteUser(u.id);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete User"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Platform</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Reward</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-slate-100 rounded-lg">
                          {t.platform === 'Instagram' && <Instagram size={14} className="text-pink-600" />}
                          {t.platform === 'Twitter' && <Twitter size={14} className="text-blue-400" />}
                          {t.platform === 'YouTube' && <Youtube size={14} className="text-red-600" />}
                          {t.platform === 'TikTok' && <MessageSquare size={14} className="text-black" />}
                          {t.platform === 'Facebook' && <Facebook size={14} className="text-blue-600" />}
                        </div>
                        <span className="text-sm font-bold text-slate-900">{t.platform}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600">{t.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600 max-w-xs truncate">{t.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-emerald-600">₦{t.reward}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        t.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                        t.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            if (window.confirm('Delete this task?')) {
                              onDeleteTask(t.id);
                            }
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Task Modal */}
      <AnimatePresence>
        {isAddTaskModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddTaskModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-900">Create New Task</h3>
                  <button onClick={() => setIsAddTaskModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  onAddTask({
                    platform: formData.get('platform') as any,
                    type: formData.get('type') as any,
                    reward: Number(formData.get('reward')),
                    description: formData.get('description') as string,
                    url: formData.get('url') as string
                  });
                  setIsAddTaskModalOpen(false);
                }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase ml-1">Platform</label>
                      <select name="platform" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                        <option>Instagram</option>
                        <option>Twitter</option>
                        <option>YouTube</option>
                        <option>TikTok</option>
                        <option>Facebook</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-400 uppercase ml-1">Type</label>
                      <select name="type" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                        <option>Like</option>
                        <option>Follow</option>
                        <option>Comment</option>
                        <option>Subscribe</option>
                        <option>Share</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Reward (₦)</label>
                    <input name="reward" type="number" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="e.g. 100" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Description</label>
                    <input name="description" type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="e.g. Follow @username on Instagram" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Target URL</label>
                    <input name="url" type="url" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="https://..." />
                  </div>

                  <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-100 mt-4">
                    Create Task
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
