import { useState, useRef, ChangeEvent } from 'react';
import { TipRecord, TipCategory, TipStatus, UrgencyLevel } from '../types';
import { 
  X, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportBatch: (tips: TipRecord[]) => void;
  existingTips: TipRecord[];
}

export function ImportModal({
  isOpen,
  onClose,
  onImportBatch,
  existingTips
}: ImportModalProps) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'paste' | 'file'>('paste');
  const [pastedText, setPastedText] = useState('');
  const [parsedRecords, setParsedRecords] = useState<TipRecord[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Existing names set for repeat detection preview
  const existingNames = new Set(existingTips.map((t) => t.fullName.trim().toLowerCase()));

  // Download CSV sample template
  const handleDownloadTemplate = () => {
    const csvContent =
      '\uFEFF' +
      [
        'หมวดหมู่,ชื่อ-นามสกุล,ฉายา,อายุ,เพศ,สารเสพติด,บ้านเลขที่,หมู่บ้าน,ตำบล,อำเภอ,จังหวัด,จุดสังเกต,พฤติการณ์,ยานพาหนะ,ระดับความเร่งด่วน',
        'ผู้ค้า,นายวิรัช วงษ์สว่าง,โต้ง ธาตุทอง,35,ชาย,ยาบ้า; ไอซ์,12/1,หมู่ 1 บ้านธาตุทอง,ธาตุทอง,สว่างแดนดิน,สกลนคร,ข้างวัดธาตุทอง,ลักลอบนำยามาส่งให้วัยรุ่นช่วงค่ำ,เวฟ 110 สีน้ำเงิน,high',
        'ผู้เสพ,นายธีรพงษ์ สมศรี,กอล์ฟ คำสะอาด,24,ชาย,ยาบ้า,55/3,หมู่ 4 บ้านคำสะอาด,ธาตุทอง,สว่างแดนดิน,สกลนคร,กระท่อมปลายนา,เสพยาบ้าส่งเสียงดัง ขี่มอเตอร์ไซค์วนเวียน,เวฟสีดำ,medium',
        'ผู้ต้องการเลิกยา,นายอนุวัฒน์ ไชยดี,อาร์ม สร้างแก้ว,22,ชาย,ยาบ้า,89,หมู่ 3 บ้านสร้างแก้ว,ธาตุทอง,สว่างแดนดิน,สกลนคร,เยื้องศาลากลางหมู่บ้าน,สมัครใจขอรับการบำบัดรักษาฟื้นฟู (CBTx) ผ่านครอบครัว,,high'
      ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'แบบฟอร์มนำเข้าเบาะแส_ต_ธาตุทอง.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // Parse raw text (CSV or Tab-delimited copy-paste from Excel)
  const parseData = (rawText: string) => {
    setParseError(null);
    if (!rawText.trim()) {
      setParsedRecords([]);
      return;
    }

    try {
      const lines = rawText
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length === 0) {
        setParsedRecords([]);
        return;
      }

      const results: TipRecord[] = [];

      // Check if first row is header
      const firstLine = lines[0].toLowerCase();
      const hasHeader =
        firstLine.includes('หมวด') ||
        firstLine.includes('ชื่อ') ||
        firstLine.includes('category') ||
        firstLine.includes('name');

      const dataLines = hasHeader ? lines.slice(1) : lines;

      dataLines.forEach((line, idx) => {
        // Split by Tab or Comma (handling simple CSV)
        const delimiter = line.includes('\t') ? '\t' : ',';
        const cols = line.split(delimiter).map((c) => c.replace(/^["']|["']$/g, '').trim());

        if (cols.length < 2) return;

        // Parse Category
        let category: TipCategory = 'user';
        const catCol = (cols[0] || '').toLowerCase();
        if (catCol.includes('ค้า') || catCol.includes('dealer') || catCol.includes('ขาย')) {
          category = 'dealer';
        } else if (catCol.includes('เลิก') || catCol.includes('บำบัด') || catCol.includes('rehab')) {
          category = 'rehab';
        } else {
          category = 'user';
        }

        const fullName = cols[1] || `บุคคลนำเข้า #${idx + 1}`;
        const alias = cols[2] || undefined;
        const age = cols[3] && !isNaN(parseInt(cols[3], 10)) ? parseInt(cols[3], 10) : undefined;
        const gender = (cols[4] === 'ชาย' || cols[4] === 'หญิง') ? cols[4] : 'ไม่ระบุ';
        
        // Drugs
        const rawDrugs = (cols[5] || 'ยาบ้า').split(/[;/]/).map((d) => d.trim()).filter(Boolean);
        const drugTypes = rawDrugs.length > 0 ? rawDrugs : ['ยาบ้า'];

        const houseNo = cols[6] || undefined;
        const villageNo = cols[7] || 'หมู่ 1 บ้านธาตุทอง';
        const subdistrict = cols[8] || 'ธาตุทอง';
        const district = cols[9] || 'สว่างแดนดิน';
        const province = cols[10] || 'สกลนคร';
        const landmark = cols[11] || undefined;
        const behaviorDetails = cols[12] || 'ข้อมูลนำเข้าจากไฟล์/ตารางข้อมูล';
        const vehicleInfo = cols[13] || undefined;
        
        let urgency: UrgencyLevel = 'medium';
        const rawUrgency = (cols[14] || '').toLowerCase();
        if (rawUrgency.includes('crit') || rawUrgency.includes('วิกฤต')) urgency = 'critical';
        else if (rawUrgency.includes('high') || rawUrgency.includes('สูง')) urgency = 'high';
        else if (rawUrgency.includes('low') || rawUrgency.includes('ต่ำ')) urgency = 'low';

        const defaultStatus: TipStatus = category === 'rehab' ? 'rehab_referred' : 'pending';

        results.push({
          id: `import-${Date.now()}-${idx + 1}`,
          source: 'manual',
          category,
          fullName,
          alias,
          age,
          gender,
          address: {
            houseNo,
            villageNo,
            subdistrict,
            district,
            province,
            landmark
          },
          drugTypes,
          behaviorDetails,
          vehicleInfo,
          reportedAt: new Date().toISOString(),
          isAnonymous: true,
          status: defaultStatus,
          urgency,
          assignedUnit: category === 'rehab'
            ? 'รพ.สต.ธาตุทอง'
            : 'สภ.สว่างแดนดิน / ฝ่ายความมั่นคง ต.ธาตุทอง',
          actionLog: [
            {
              date: new Date().toLocaleDateString('th-TH') + ' ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
              action: 'นำเข้าข้อมูลเข้าสู่ระบบศูนย์รับแจ้ง',
              by: 'เจ้าหน้าที่นำเข้าข้อมูล'
            }
          ]
        });
      });

      if (results.length === 0) {
        setParseError('ไม่พบข้อมูลที่สามารถประมวลผลได้ กรุณาตรวจสอบรูปแบบตาราง');
      } else {
        setParsedRecords(results);
      }
    } catch (err: any) {
      setParseError('เกิดข้อผิดพลาดในการอ่านข้อมูล: ' + err.message);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        setPastedText(text);
        parseData(text);
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  // Execute Import
  const handleConfirmImport = () => {
    if (parsedRecords.length === 0) return;
    onImportBatch(parsedRecords);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
      setParsedRecords([]);
      setPastedText('');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="modal-import-data"
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                นำเข้าข้อมูล ผู้ค้า ผู้เสพ ผู้ต้องการเลิกยา
              </h2>
              <p className="text-xs text-slate-500">
                นำเข้าข้อมูลจำนวนมากจากไฟล์ CSV หรือคัดลอกวางจากตาราง Excel / Google Sheets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action / Help Banner */}
        <div className="px-6 py-3 bg-emerald-50/60 border-b border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs text-emerald-900">
            <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              รองรับทั้ง 3 หมวดหมู่ในตารางเดียว: <strong>ผู้ค้า</strong>, <strong>ผู้เสพ</strong>, <strong>ผู้ต้องการเลิกยา</strong>
            </span>
          </div>
          <button
            onClick={handleDownloadTemplate}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs hover:bg-emerald-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ดาวน์โหลดไฟล์ตัวอย่าง CSV</span>
          </button>
        </div>

        {/* Tabs & Content */}
        <div className="overflow-y-auto p-6 space-y-4">
          {/* Tab buttons */}
          <div className="flex border-b border-slate-200 space-x-4 text-xs font-bold">
            <button
              onClick={() => setActiveTab('paste')}
              className={`pb-2.5 border-b-2 transition-colors ${
                activeTab === 'paste'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              คัดลอกและวางข้อความ/ตาราง (Copy & Paste)
            </button>
            <button
              onClick={() => setActiveTab('file')}
              className={`pb-2.5 border-b-2 transition-colors ${
                activeTab === 'file'
                  ? 'border-slate-900 text-slate-900'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              อัปโหลดไฟล์ (.CSV / .TXT)
            </button>
          </div>

          {/* Paste Tab */}
          {activeTab === 'paste' && (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 block">
                วางข้อมูลตาราง (คัดลอกจาก Excel หรือวาง CSV):
              </label>
              <textarea
                rows={5}
                value={pastedText}
                onChange={(e) => {
                  setPastedText(e.target.value);
                  parseData(e.target.value);
                }}
                placeholder="หมวดหมู่,ชื่อ-นามสกุล,ฉายา,อายุ,เพศ,สารเสพติด,บ้านเลขที่,หมู่บ้าน,ตำบล,อำเภอ,จังหวัด,จุดสังเกต,พฤติการณ์,ยานพาหนะ,ความเร่งด่วน&#10;ผู้ค้า,นายสายชล แสงดี,ชล ธาตุทอง,30,ชาย,ยาบ้า,23/1,หมู่ 1 บ้านธาตุทอง,ธาตุทอง,สว่างแดนดิน,สกลนคร,ตรงข้าม รพ.สต.,มีพฤติกรรมจำหน่ายยาบ้า,มอเตอร์ไซค์แดง,high&#10;ผู้ต้องการเลิกยา,นายมานัส คำหอม,,25,ชาย,ยาบ้า,19,หมู่ 4 บ้านคำสะอาด,ธาตุทอง,สว่างแดนดิน,สกลนคร,,สมัครใจขอรับการบำบัดรักษา,,high"
                className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          )}

          {/* File Tab */}
          {activeTab === 'file' && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl p-8 text-center cursor-pointer bg-slate-50/50 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">คลิกเพื่อเลือกไฟล์ CSV หรือ TXT</p>
              <p className="text-[11px] text-slate-400 mt-1">เข้ารหัส UTF-8 แนะนำใช้รูปแบบเทมเพลตมาตรฐาน</p>
            </div>
          )}

          {/* Error Message */}
          {parseError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {/* Success Message */}
          {isSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-bold">นำเข้าข้อมูลสำเร็จแล้ว! กำลังกลับสู่หน้าหลัก...</span>
            </div>
          )}

          {/* Preview Table */}
          {parsedRecords.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">
                  รายการที่ตรวจพบ ({parsedRecords.length} รายการ)
                </span>
                <span className="text-slate-500">
                  พร้อมนำเข้าสู่ระบบตำบลธาตุทอง
                </span>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-50 sticky top-0 font-bold text-slate-700">
                    <tr>
                      <th className="px-3 py-2">หมวดหมู่</th>
                      <th className="px-3 py-2">ชื่อ-นามสกุล</th>
                      <th className="px-3 py-2">ที่อยู่/หมู่บ้าน</th>
                      <th className="px-3 py-2">สารเสพติด</th>
                      <th className="px-3 py-2">การตรวจสอบ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {parsedRecords.map((r, i) => {
                      const isRepeat = existingNames.has(r.fullName.trim().toLowerCase());
                      return (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-3 py-2 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                r.category === 'dealer'
                                  ? 'bg-rose-100 text-rose-800'
                                  : r.category === 'user'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {r.category === 'dealer' ? 'ผู้ค้า' : r.category === 'user' ? 'ผู้เสพ' : 'ผู้ต้องการเลิกยา'}
                            </span>
                          </td>
                          <td className="px-3 py-2 font-medium text-slate-900">
                            {r.fullName}
                            {r.alias && <span className="text-slate-400 block text-[10px]">({r.alias})</span>}
                          </td>
                          <td className="px-3 py-2 text-slate-600">
                            {r.address.villageNo || `ต.${r.address.subdistrict}`}
                          </td>
                          <td className="px-3 py-2 text-slate-600 truncate max-w-[120px]">
                            {r.drugTypes.join(', ')}
                          </td>
                          <td className="px-3 py-2">
                            {isRepeat ? (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                                ⚠️ มีในฐานข้อมูล (แจ้งซ้ำ)
                              </span>
                            ) : (
                              <span className="text-[10px] text-emerald-700">
                                รายใหม่
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {parsedRecords.length > 0
              ? `ตรวจพบ ${parsedRecords.length} รายการที่พร้อมนำเข้า`
              : 'กรุณากรอกหรือวางข้อมูลเพื่อเริ่มต้น'}
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              id="btn-confirm-import"
              onClick={handleConfirmImport}
              disabled={parsedRecords.length === 0 || isSuccess}
              className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl shadow-sm transition-colors flex items-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>ยืนยันนำเข้าข้อมูล ({parsedRecords.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
