import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { GoogleDriveFormItem, TipRecord } from '../types';
import { listGoogleForms, getFormDetails, getFormResponses, parseResponsesToTips, extractFormId } from '../lib/formsApi';
import { 
  X, 
  FileSpreadsheet, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  LogIn, 
  Download,
  Info
} from 'lucide-react';

interface GoogleFormsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  accessToken: string | null;
  onLogin: () => void;
  onImportTips: (tips: TipRecord[], formTitle: string) => void;
  connectedFormId: string | null;
  setConnectedFormId: (id: string | null) => void;
  connectedFormTitle: string | null;
}

export function GoogleFormsSyncModal({
  isOpen,
  onClose,
  currentUser,
  accessToken,
  onLogin,
  onImportTips,
  connectedFormId,
  setConnectedFormId,
  connectedFormTitle
}: GoogleFormsSyncModalProps) {
  if (!isOpen) return null;

  const [driveForms, setDriveForms] = useState<GoogleDriveFormItem[]>([]);
  const [isLoadingForms, setIsLoadingForms] = useState(false);
  const [manualFormInput, setManualFormInput] = useState(connectedFormId || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'drive' | 'manual' | 'guide'>('drive');

  // Load forms from Google Drive when authenticated
  useEffect(() => {
    if (accessToken) {
      loadDriveForms();
    }
  }, [accessToken]);

  const loadDriveForms = async () => {
    if (!accessToken) return;
    setIsLoadingForms(true);
    setErrorMsg(null);
    try {
      const forms = await listGoogleForms(accessToken);
      setDriveForms(forms);
    } catch (err: any) {
      console.error('Error fetching forms from Drive:', err);
      setErrorMsg(err.message || 'ไม่สามารถดึงรายชื่อฟอร์มจาก Google Drive ได้');
    } finally {
      setIsLoadingForms(false);
    }
  };

  const handleSyncForm = async (formIdToUse: string, formTitleHint?: string) => {
    if (!accessToken) {
      setErrorMsg('กรุณาเข้าสู่ระบบด้วย Google ก่อนเพื่อดึงข้อมูลฟอร์ม');
      return;
    }

    const cleanId = extractFormId(formIdToUse);
    if (!cleanId) {
      setErrorMsg('กรุณาระบุ Google Form ID หรือ URL ของฟอร์ม');
      return;
    }

    setIsSyncing(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      // 1. Fetch form questions schema
      const formData = await getFormDetails(accessToken, cleanId);
      const title = formTitleHint || formData.info?.title || 'แบบฟอร์มแจ้งเบาะแสยาเสพติด';

      // 2. Fetch responses
      const responsesData = await getFormResponses(accessToken, cleanId);

      // 3. Parse responses to TipRecords
      const importedTips = parseResponsesToTips(formData, responsesData);

      setConnectedFormId(cleanId);
      onImportTips(importedTips, title);

      setSuccessMsg(
        `ซิงค์ข้อมูลสำเร็จ! ดึงการตอบกลับจากฟอร์ม "${title}" จำนวน ${importedTips.length} รายการ เข้าระบบและอัปเดตสถิติเรียบร้อยแล้ว`
      );
    } catch (err: any) {
      console.error('Sync error:', err);
      setErrorMsg(
        err.message || 'เกิดข้อผิดพลาดในการดึงข้อมูลจาก Google Forms กรุณาตรวจสอบสิทธิ์ของฟอร์มหรือ Form ID'
      );
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="modal-google-forms-sync"
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                เชื่อมต่อและซิงค์ข้อมูล Google Forms
              </h2>
              <p className="text-xs text-slate-500">
                ดึงข้อมูลการแจ้งเบาะแสจาก Google Forms แยกผู้ค้า ผู้เสพ ผู้ต้องการเลิกยาอัตโนมัติ
              </p>
            </div>
          </div>
          <button
            id="btn-close-sync-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Auth Gate: If user not logged in */}
        {!accessToken ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
              <LogIn className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-800">
                เข้าสู่ระบบ Google เพื่อเชื่อมต่อฟอร์มของคุณ
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                ระบบต้องได้รับสิทธิ์อ่านข้อมูลแบบฟอร์มและการตอบกลับ (Google Forms & Drive API) เพื่อนำเข้าข้อมูลการแจ้งเบาะแสโดยอัตโนมัติ
              </p>
            </div>
            <div className="pt-2">
              <button
                id="btn-login-in-sync-modal"
                onClick={onLogin}
                className="gsi-material-button text-xs mx-auto"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  border: '1px solid #dadce0',
                  borderRadius: '8px',
                  boxSizing: 'border-box',
                  color: '#3c4043',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  height: '42px',
                  padding: '0 16px',
                  userSelect: 'none'
                }}
              >
                <div className="gsi-material-button-icon" style={{ height: '20px', width: '20px', marginRight: '10px' }}>
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block', width: '100%', height: '100%' }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="gsi-material-button-contents font-sans">
                  เข้าสู่ระบบด้วย Google
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-y-auto p-6 space-y-5">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 space-x-4 text-xs font-bold">
              <button
                onClick={() => setActiveTab('drive')}
                className={`pb-2.5 border-b-2 transition-colors ${
                  activeTab === 'drive'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                เลือกฟอร์มจาก Google Drive
              </button>
              <button
                onClick={() => setActiveTab('manual')}
                className={`pb-2.5 border-b-2 transition-colors ${
                  activeTab === 'manual'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                ใส่ Form ID / ลิงก์ฟอร์มโดยตรง
              </button>
              <button
                onClick={() => setActiveTab('guide')}
                className={`pb-2.5 border-b-2 transition-colors ${
                  activeTab === 'guide'
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                คู่มือโครงสร้างฟอร์มแนะนำ
              </button>
            </div>

            {/* Notifications */}
            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p>{successMsg}</p>
              </div>
            )}

            {/* Tab 1: Google Drive Forms List */}
            {activeTab === 'drive' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">
                    แบบฟอร์มที่พบบน Google Drive ของคุณ ({driveForms.length} ฟอร์ม)
                  </span>
                  <button
                    onClick={loadDriveForms}
                    disabled={isLoadingForms}
                    className="inline-flex items-center space-x-1 text-slate-500 hover:text-slate-800"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingForms ? 'animate-spin' : ''}`} />
                    <span>รีเฟรชรายการ</span>
                  </button>
                </div>

                {isLoadingForms ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
                    กำลังโหลดแบบฟอร์มจาก Google Drive...
                  </div>
                ) : driveForms.length > 0 ? (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {driveForms.map((form) => {
                      const isConnected = connectedFormId === form.id;
                      return (
                        <div
                          key={form.id}
                          className={`p-3.5 rounded-xl border flex items-center justify-between transition-colors ${
                            isConnected
                              ? 'border-emerald-500 bg-emerald-50/50'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="min-w-0 pr-3">
                            <h4 className="font-bold text-xs text-slate-800 truncate">
                              {form.name}
                            </h4>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ID: {form.id}
                            </span>
                          </div>

                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {form.webViewLink && (
                              <a
                                href={form.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                                title="เปิดดูฟอร์ม"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => handleSyncForm(form.id, form.name)}
                              disabled={isSyncing}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors ${
                                isConnected
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  : 'bg-slate-900 text-white hover:bg-slate-800'
                              }`}
                            >
                              {isSyncing ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Download className="w-3.5 h-3.5" />
                              )}
                              <span>{isConnected ? 'ซิงค์ข้อมูลใหม่' : 'เชื่อมต่อและดึงข้อมูล'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-slate-50 p-6 rounded-2xl text-center text-xs text-slate-500 space-y-2">
                    <p>ไม่พบไฟล์ Google Forms ใน Drive บัญชีนี้ หรือฟอร์มอยู่ในบัญชีอื่น</p>
                    <button
                      onClick={() => setActiveTab('manual')}
                      className="text-xs font-semibold text-slate-800 underline"
                    >
                      ลองวาง URL หรือ Form ID ของฟอร์มโดยตรง
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Manual Form ID Input */}
            {activeTab === 'manual' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    ระบุ Google Form ID หรือ URL ฟอร์ม
                  </label>
                  <input
                    type="text"
                    value={manualFormInput}
                    onChange={(e) => setManualFormInput(e.target.value)}
                    placeholder="เช่น 1FAIpQLSc... หรือ https://docs.google.com/forms/d/..."
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                  <p className="text-[11px] text-slate-400">
                    คัดลอกลิงก์แก้ไขของแบบฟอร์ม หรือรหัส ID ยาวๆ จาก URL ของ Google Forms มาวางได้โดยตรง
                  </p>
                </div>

                <button
                  id="btn-sync-manual-form"
                  onClick={() => handleSyncForm(manualFormInput)}
                  disabled={isSyncing || !manualFormInput.trim()}
                  className="w-full py-2.5 px-4 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center space-x-1.5 transition-colors"
                >
                  {isSyncing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>กำลังดึงข้อมูลการตอบกลับจากแบบฟอร์ม...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>ซิงค์ข้อมูลเบาะแสจากฟอร์มนี้</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Tab 3: Form Structure Guide (โครงสร้างฟอร์มแนะนำ) */}
            {activeTab === 'guide' && (
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-2">
                  <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                  <p>
                    ระบบใช้อัลกอริทึมตรวจจับคำอัตโนมัติ (Intelligent Header Matching) เพื่อแยกประเภทผู้ค้า ผู้เสพ และผู้ต้องการเลิกยา แนะนำให้ตั้งชื่อคำถามใน Google Form ตามนี้:
                  </p>
                </div>

                <div className="space-y-2 border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                  <div className="p-3 bg-white">
                    <span className="font-bold text-slate-800 block">1. ประเภทการแจ้งเบาะแส (ปรนัย/ตัวเลือก)</span>
                    <span className="text-[11px] text-slate-500">
                      ตัวเลือก: "ผู้ค้ายาเสพติด", "ผู้เสพยาเสพติด", "ผู้ต้องการเลิกยาเสพติด/สมัครใจบำบัด"
                    </span>
                  </div>
                  <div className="p-3 bg-white">
                    <span className="font-bold text-slate-800 block">2. ชื่อ-นามสกุล หรือ ฉายาของผู้ถูกแจ้ง (ข้อความสั้น)</span>
                    <span className="text-[11px] text-slate-500">
                      เช่น "นายสมชาย (เอก ซอย 8)"
                    </span>
                  </div>
                  <div className="p-3 bg-white">
                    <span className="font-bold text-slate-800 block">3. ประเภทสารเสพติดที่เกี่ยวข้อง (กล่องกาเครื่องหมาย)</span>
                    <span className="text-[11px] text-slate-500">
                      เช่น ยาบ้า, ไอซ์, เคตามีน, เฮโรอีน, กัญชา/กระท่อม
                    </span>
                  </div>
                  <div className="p-3 bg-white">
                    <span className="font-bold text-slate-800 block">4. ที่อยู่และสถานที่พบเห็น (ย่อหน้า/ข้อความยาว)</span>
                    <span className="text-[11px] text-slate-500">
                      ระบุตำบล, อำเภอ, จังหวัด และจุดสังเกตเด่นชัด
                    </span>
                  </div>
                  <div className="p-3 bg-white">
                    <span className="font-bold text-slate-800 block">5. รายละเอียดพฤติการณ์ (ย่อหน้า)</span>
                    <span className="text-[11px] text-slate-500">
                      พฤติกรรมการค้า การเสพ หรือความประสงค์เข้ารับการบำบัด
                    </span>
                  </div>
                </div>
              </div>
            )}

            {connectedFormTitle && (
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">ฟอร์มที่เชื่อมโยงในปัจจุบัน:</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  {connectedFormTitle}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
