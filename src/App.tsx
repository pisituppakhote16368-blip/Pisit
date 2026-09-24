import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { TipRecord, TipCategory, TipStatus } from './types';
import { INITIAL_TIPS } from './data/mockData';
import { initAuth, googleSignIn, logout } from './lib/firebase';
import { Navbar } from './components/Navbar';
import { StatsDashboard } from './components/StatsDashboard';
import { TipList } from './components/TipList';
import { TipDetailModal } from './components/TipDetailModal';
import { AddTipModal } from './components/AddTipModal';
import { ImportModal } from './components/ImportModal';
import { GoogleFormsSyncModal } from './components/GoogleFormsSyncModal';
import { 
  FileSpreadsheet, 
  Download, 
  RotateCcw,
  Sparkles,
  ShieldCheck,
  UploadCloud,
  MapPin
} from 'lucide-react';

const STORAGE_KEY = 'narcotics_tips_db_thatthong_v2';
const FORM_STORAGE_KEY = 'narcotics_connected_form_v1';

export default function App() {
  // Tips state with localStorage persistence
  const [tips, setTips] = useState<TipRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved tips:', e);
    }
    return INITIAL_TIPS;
  });

  // Category filter: 'all' | 'dealer' | 'user' | 'rehab'
  const [activeCategory, setActiveCategory] = useState<TipCategory | 'all'>('all');

  // Modals state
  const [selectedTip, setSelectedTip] = useState<TipRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Auth & Token State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Google Form connection state
  const [connectedFormId, setConnectedFormId] = useState<string | null>(() => {
    return localStorage.getItem(FORM_STORAGE_KEY) || null;
  });
  const [connectedFormTitle, setConnectedFormTitle] = useState<string | null>(() => {
    return localStorage.getItem(`${FORM_STORAGE_KEY}_title`) || null;
  });
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Sync tips state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tips));
    } catch (e) {
      console.error('Failed to save tips to storage:', e);
    }
  }, [tips]);

  // Sync connected form to localStorage
  useEffect(() => {
    if (connectedFormId) {
      localStorage.setItem(FORM_STORAGE_KEY, connectedFormId);
    } else {
      localStorage.removeItem(FORM_STORAGE_KEY);
    }
    if (connectedFormTitle) {
      localStorage.setItem(`${FORM_STORAGE_KEY}_title`, connectedFormTitle);
    } else {
      localStorage.removeItem(`${FORM_STORAGE_KEY}_title`);
    }
  }, [connectedFormId, connectedFormTitle]);

  // Initialize Firebase Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Handle Google Login
  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setAccessToken(result.accessToken);
      }
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Google Logout
  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
    setAccessToken(null);
  };

  // Add new individual tip record
  const handleAddTip = (newTip: TipRecord) => {
    setTips((prev) => [newTip, ...prev]);
  };

  // Batch import tips (ผู้เสพ ผู้ค้า ผู้ต้องการเลิก)
  const handleImportBatch = (importedTips: TipRecord[]) => {
    setTips((prev) => [...importedTips, ...prev]);
  };

  // Update tip status and append action log
  const handleUpdateStatus = (id: string, newStatus: TipStatus, note?: string) => {
    setTips((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;

        const updatedLogs = [...(t.actionLog || [])];
        if (note) {
          const now = new Date();
          updatedLogs.push({
            date: `${now.toLocaleDateString('th-TH')} ${now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}`,
            action: note,
            by: currentUser?.displayName || 'เจ้าหน้าที่ปฏิบัติการ ต.ธาตุทอง'
          });
        }

        return {
          ...t,
          status: newStatus,
          actionLog: updatedLogs
        };
      })
    );

    // Keep selectedTip in sync
    setSelectedTip((prev) => (prev && prev.id === id ? { ...prev, status: newStatus } : prev));
  };

  // Delete tip record
  const handleDeleteTip = (id: string) => {
    setTips((prev) => prev.filter((t) => t.id !== id));
  };

  // Import tips parsed from Google Form
  const handleImportTips = (importedTips: TipRecord[], formTitle: string) => {
    setConnectedFormTitle(formTitle);
    setLastSyncTime(new Date().toLocaleTimeString('th-TH'));

    setTips((prev) => {
      // Merge by responseId or ID to avoid duplicates
      const existingIds = new Set(prev.map((t) => t.formResponseId || t.id));
      const newItems = importedTips.filter((t) => !existingIds.has(t.formResponseId || t.id));
      return [...newItems, ...prev];
    });
  };

  // Reset to initial sample dataset
  const handleResetData = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นชุดข้อมูลเริ่มต้นของตำบลธาตุทอง อำเภอสว่างแดนดิน จังหวัดสกลนคร ใช่หรือไม่?')) {
      setTips(INITIAL_TIPS);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Export dataset to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'หมวดหมู่', 'ชื่อ-นามสกุล', 'ฉายา', 'เพศ', 'อายุ', 'ยาเสพติด', 'หมู่บ้าน', 'ตำบล', 'อำเภอ', 'จังหวัด', 'สถานะ', 'แหล่งที่มา'];
    const rows = tips.map((t) => [
      t.id,
      t.category === 'dealer' ? 'ผู้ค้า' : t.category === 'user' ? 'ผู้เสพ' : 'ผู้ต้องการเลิกยา',
      t.fullName,
      t.alias || '-',
      t.gender || '-',
      t.age || '-',
      `"${t.drugTypes.join(', ')}"`,
      t.address.villageNo || '-',
      t.address.subdistrict,
      t.address.district,
      t.address.province,
      t.status,
      t.source === 'google_form' ? 'Google Form' : 'บันทึกรายบุคคล'
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `รายงานเบาะแสยาเสพติด_ตำบลธาตุทอง_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Top Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        hasToken={Boolean(accessToken)}
        isLoggingIn={isLoggingIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        lastSyncTime={lastSyncTime}
        isSyncing={false}
        connectedFormTitle={connectedFormTitle || undefined}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7">
        {/* Hero Section & Quick Status Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ระบบรักษาความปลอดภัยข้อมูลเบาะแส</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900 text-white">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>ต.ธาตุทอง อ.สว่างแดนดิน จ.สกลนคร</span>
              </span>
              {connectedFormTitle && (
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                  <span>แบบฟอร์ม: {connectedFormTitle}</span>
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              ศูนย์รับแจ้งเบาะแสยาเสพติดและฟื้นฟูผู้เสพ ตำบลธาตุทอง
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              อำเภอสว่างแดนดิน จังหวัดสกลนคร • แยกหมวดหมู่ผู้ค้า ผู้เสพ ผู้ต้องการเลิกยา • ตรวจนับสถิติการถูกแจ้งซ้ำรายบุคคล
            </p>
          </div>

          {/* Quick Utility Tools */}
          <div className="flex items-center space-x-2 flex-shrink-0 flex-wrap gap-y-2">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
              title="นำเข้าข้อมูลจากไฟล์ CSV หรือ Excel"
            >
              <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
              <span>นำเข้าข้อมูลเอง</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              title="ส่งออกข้อมูลเป็น CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ส่งออก CSV</span>
            </button>
            <button
              onClick={handleResetData}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="รีเซ็ตเป็นข้อมูลตัวอย่างเริ่มต้น ต.ธาตุทอง"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">รีเซ็ตข้อมูล</span>
            </button>
          </div>
        </div>

        {/* 1. Statistics Dashboard */}
        <section aria-label="สถิติข้อมูลเบาะแส">
          <StatsDashboard
            tips={tips}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onSelectTipByName={(name) => {
              const matched = tips.find((t) => t.fullName.trim().toLowerCase() === name.trim().toLowerCase());
              if (matched) setSelectedTip(matched);
            }}
          />
        </section>

        {/* 2. Tip List & Categorized Records */}
        <section aria-label="รายการแจ้งเบาะแส">
          <TipList
            tips={tips}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onSelectTip={(tip) => setSelectedTip(tip)}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ระบบสารสนเทศแจ้งเบาะแสยาเสพติดและบำบัดฟื้นฟู ตำบลธาตุทอง อำเภอสว่างแดนดิน จังหวัดสกลนคร</span>
          <span className="text-[11px] text-slate-400">
            สภ.สว่างแดนดิน • รพ.สต.ธาตุทอง • รพ.สมเด็จพระยุพราชสว่างแดนดิน • ฝ่ายปกครองอำเภอสว่างแดนดิน
          </span>
        </div>
      </footer>

      {/* Modals */}
      {/* 1. Individual Tip Detail Modal with Full Repeat Reports Dossier */}
      <TipDetailModal
        tip={selectedTip}
        allTips={tips}
        onClose={() => setSelectedTip(null)}
        onUpdateStatus={handleUpdateStatus}
        onDeleteTip={handleDeleteTip}
        onSelectTip={(tip) => setSelectedTip(tip)}
      />

      {/* 2. Add New Tip Modal (Manual Entry) */}
      <AddTipModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTip={handleAddTip}
      />

      {/* 3. Batch Import Modal (CSV / Excel copy-paste) */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportBatch={handleImportBatch}
        existingTips={tips}
      />

      {/* 4. Google Forms Sync Modal */}
      <GoogleFormsSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        currentUser={currentUser}
        accessToken={accessToken}
        onLogin={handleLogin}
        onImportTips={handleImportTips}
        connectedFormId={connectedFormId}
        setConnectedFormId={setConnectedFormId}
        connectedFormTitle={connectedFormTitle}
      />
    </div>
  );
}
