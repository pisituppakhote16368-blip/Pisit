import { User } from 'firebase/auth';
import { 
  ShieldAlert, 
  FileSpreadsheet, 
  PlusCircle, 
  LogOut, 
  RefreshCw,
  FileText,
  UploadCloud,
  MapPin
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  hasToken: boolean;
  isLoggingIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onOpenSyncModal: () => void;
  onOpenAddModal: () => void;
  onOpenImportModal: () => void;
  lastSyncTime: string | null;
  isSyncing: boolean;
  connectedFormTitle?: string;
}

export function Navbar({
  currentUser,
  hasToken,
  isLoggingIn,
  onLogin,
  onLogout,
  onOpenSyncModal,
  onOpenAddModal,
  onOpenImportModal,
  lastSyncTime,
  isSyncing,
  connectedFormTitle
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & System Brand */}
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm ring-1 ring-slate-800">
              <ShieldAlert className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">
                  ระบบแจ้งเบาะแสยาเสพติด
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ต.ธาตุทอง อ.สว่างแดนดิน จ.สกลนคร
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                แยกประเภทผู้ค้า ผู้เสพ ผู้ต้องการเลิกยา • ตรวจจับคนโดนแจ้งซ้ำ • เชื่อมต่อ Google Forms
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Google Form Connection Status & Sync Button */}
            <button
              id="btn-sync-google-forms"
              onClick={onOpenSyncModal}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              title="จัดการการเชื่อมโยง Google Forms"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="hidden md:inline">
                {connectedFormTitle ? `ฟอร์ม: ${connectedFormTitle}` : 'Google Forms'}
              </span>
              <span className="md:hidden">Google Forms</span>
              {isSyncing && <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-500 ml-1" />}
            </button>

            {/* Batch Import Button (นำเข้าข้อมูล ผู้เสพ ผู้ค้า ผู้ต้องการเลิก เองได้) */}
            <button
              id="btn-open-import"
              onClick={onOpenImportModal}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
              title="นำเข้าข้อมูลจากไฟล์ CSV หรือตาราง Excel"
            >
              <UploadCloud className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">นำเข้าข้อมูล (ไฟล์/ตาราง)</span>
              <span className="sm:hidden">นำเข้า</span>
            </button>

            {/* Add Individual Record Button */}
            <button
              id="btn-add-record"
              onClick={onOpenAddModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl text-white bg-slate-900 hover:bg-slate-800 shadow-2xs transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>ลงข้อมูลรายบุคคล</span>
            </button>

            {/* Google Sign-in / User State */}
            {currentUser && hasToken ? (
              <div className="flex items-center space-x-2 pl-1 border-l border-slate-200">
                <div className="flex items-center space-x-2">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full ring-1 ring-slate-300 object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-700">
                      {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                    </div>
                  )}
                  <div className="hidden lg:block text-left text-xs">
                    <p className="font-medium text-slate-800 truncate max-w-[120px]">
                      {currentUser.displayName || currentUser.email?.split('@')[0]}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-medium">เข้าสู่ระบบแล้ว</p>
                  </div>
                </div>
                <button
                  id="btn-logout"
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition-colors"
                  title="ออกจากระบบ Google"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="btn-google-signin"
                onClick={onLogin}
                disabled={isLoggingIn}
                className="gsi-material-button text-xs"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  border: '1px solid #dadce0',
                  borderRadius: '12px',
                  boxSizing: 'border-box',
                  color: '#3c4043',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontSize: '12px',
                  fontWeight: 500,
                  height: '36px',
                  letterSpacing: '0.25px',
                  outline: 'none',
                  overflow: 'hidden',
                  padding: '0 12px',
                  position: 'relative',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  whiteSpace: 'nowrap',
                }}
              >
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="gsi-material-button-icon" style={{ marginRight: '6px', height: '18px', width: '18px' }}>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents" style={{ fontWeight: 600 }}>
                    {isLoggingIn ? 'กำลังเชื่อมต่อ...' : 'เข้าสู่ระบบ Google'}
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
