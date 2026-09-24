import { useState } from 'react';
import { TipRecord, TipStatus } from '../types';
import { CATEGORY_CONFIG, STATUS_LABELS } from '../data/mockData';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  FileSpreadsheet, 
  CheckCircle, 
  Trash2, 
  Car, 
  User, 
  AlertTriangle,
  History,
  Send,
  Printer,
  ChevronDown,
  ExternalLink
} from 'lucide-react';

interface TipDetailModalProps {
  tip: TipRecord | null;
  allTips?: TipRecord[];
  onClose: () => void;
  onUpdateStatus: (id: string, newStatus: TipStatus, note?: string) => void;
  onDeleteTip: (id: string) => void;
  onSelectTip?: (tip: TipRecord) => void;
}

export function TipDetailModal({
  tip,
  allTips = [],
  onClose,
  onUpdateStatus,
  onDeleteTip,
  onSelectTip
}: TipDetailModalProps) {
  if (!tip) return null;

  const [currentStatus, setCurrentStatus] = useState<TipStatus>(tip.status);
  const [newLogNote, setNewLogNote] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const categoryConfig = CATEGORY_CONFIG[tip.category];
  const statusInfo = STATUS_LABELS[tip.status] || STATUS_LABELS.pending;

  // Find all reports involving this person across all tips
  const relatedReports = allTips.filter((t) => {
    const tipName = tip.fullName.trim().toLowerCase();
    const otherName = t.fullName.trim().toLowerCase();
    return tipName === otherName;
  });

  const reportCount = relatedReports.length;
  const isRepeatOffender = reportCount > 1;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as TipStatus;
    setCurrentStatus(val);
    onUpdateStatus(tip.id, val);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogNote.trim()) return;
    onUpdateStatus(tip.id, currentStatus, newLogNote.trim());
    setNewLogNote('');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="modal-tip-detail"
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200"
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${categoryConfig.badgeClass}`}>
              {categoryConfig.label}
            </span>
            <span className="text-xs text-slate-500 font-mono">ID: {tip.id}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
              title="พิมพ์เอกสารแฟ้มประวัติ"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              id="btn-close-detail-modal"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-5">
          {/* Repeat Report Alert Banner (ดูว่าคนโดนแจ้งมากี่ครั้งแล้ว) */}
          <div className={`p-4 rounded-2xl border flex items-start space-x-3 ${
            isRepeatOffender
              ? 'bg-rose-50 border-rose-200 text-rose-950'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}>
            <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
              isRepeatOffender ? 'text-rose-600' : 'text-slate-500'
            }`} />
            <div className="flex-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">
                  {isRepeatOffender
                    ? `⚠️ ตรวจพบประวัติการถูกแจ้งเบาะแสซ้ำ (${reportCount} ครั้ง)`
                    : 'ประวัติการแจ้งเบาะแส: ถูกแจ้งครั้งแรก (1 ครั้ง)'}
                </span>
                <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                  isRepeatOffender ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {reportCount} เรื่องในระบบ
                </span>
              </div>
              <p className="mt-1 leading-relaxed text-slate-600">
                {isRepeatOffender
                  ? `บุคคลนี้ (${tip.fullName}) ถูกแจ้งเบาะแสซ้ำในพื้นที่ตำบลธาตุทอง อำเภอสว่างแดนดิน จังหวัดสกลนคร จำนวน ${reportCount} ครั้ง แนะนำให้ประสานข้อมูลร่วมระหว่างฝ่ายปกครองและเจ้าหน้าที่ตำรวจ`
                  : 'ยังไม่พบประวัติการถูกแจ้งเบาะแสซ้ำในระบบศูนย์รับแจ้งตำบลธาตุทอง'}
              </p>
            </div>
          </div>

          {/* Identity & Photo Hero */}
          <div className="flex flex-col sm:flex-row gap-5 items-start bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
            {tip.photoUrl ? (
              <img
                src={tip.photoUrl}
                alt={tip.fullName}
                referrerPolicy="no-referrer"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover ring-2 ring-white shadow-md flex-shrink-0"
              />
            ) : (
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-slate-200 flex flex-col items-center justify-center text-slate-400 flex-shrink-0">
                <User className="w-10 h-10 text-slate-400" />
                <span className="text-xs mt-1">ไม่มีรูปถ่าย</span>
              </div>
            )}

            <div className="flex-1 space-y-2">
              <div>
                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                  {tip.fullName}
                </h2>
                {tip.alias && (
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">
                    ฉายา/ชื่อในวงการ: <span className="text-rose-600 font-bold">{tip.alias}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                <div>
                  <span className="text-slate-400">เพศ: </span>
                  <span className="font-medium text-slate-800">{tip.gender || 'ไม่ระบุ'}</span>
                </div>
                <div>
                  <span className="text-slate-400">อายุ: </span>
                  <span className="font-medium text-slate-800">{tip.age ? `${tip.age} ปี` : 'ไม่ระบุ'}</span>
                </div>
                <div>
                  <span className="text-slate-400">ระดับความเร่งด่วน: </span>
                  <span className={`font-semibold ${
                    tip.urgency === 'critical' ? 'text-rose-600' : tip.urgency === 'high' ? 'text-amber-600' : 'text-slate-800'
                  }`}>
                    {tip.urgency === 'critical' ? 'วิกฤต (เร่งด่วนที่สุด)' : tip.urgency === 'high' ? 'สูง' : 'ปกติ'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">หน่วยงานรับผิดชอบ: </span>
                  <span className="font-medium text-slate-800 truncate block">
                    {tip.assignedUnit || 'ศูนย์ปฏิบัติการร่วม ต.ธาตุทอง'}
                  </span>
                </div>
              </div>

              {/* Status Update Control */}
              <div className="pt-2 flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-700">สถานะคดี:</span>
                <select
                  id="select-detail-status"
                  value={currentStatus}
                  onChange={handleStatusChange}
                  className="text-xs bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-800 font-medium focus:ring-2 focus:ring-slate-900 focus:outline-none"
                >
                  {Object.entries(STATUS_LABELS).map(([key, info]) => (
                    <option key={key} value={key}>{info.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Past Reports History (ประวัติการโดนแจ้งทั้งหมดของคนนี้) */}
          {relatedReports.length > 0 && (
            <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                  <History className="w-4 h-4 text-slate-600" />
                  <span>ประวัติการถูกแจ้งเบาะแสของบุคคลนี้ (ทั้งหมด {relatedReports.length} ครั้ง)</span>
                </h3>
                <span className="text-[11px] text-slate-500">
                  สืบค้นในฐานข้อมูล ต.ธาตุทอง
                </span>
              </div>

              <div className="space-y-2">
                {relatedReports.map((r, idx) => {
                  const isCurrent = r.id === tip.id;
                  const catCfg = CATEGORY_CONFIG[r.category];
                  const stInfo = STATUS_LABELS[r.status] || STATUS_LABELS.pending;

                  return (
                    <div
                      key={r.id}
                      onClick={() => onSelectTip && onSelectTip(r)}
                      className={`p-3 rounded-xl border text-xs transition-colors ${
                        isCurrent
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <span className={`font-bold ${isCurrent ? 'text-amber-300' : 'text-slate-900'}`}>
                            ครั้งที่ {relatedReports.length - idx}:
                          </span>
                          <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                            isCurrent ? 'bg-slate-800 text-white' : catCfg.badgeClass
                          }`}>
                            {catCfg.label}
                          </span>
                          <span className="text-[11px] opacity-75">
                            {new Date(r.reportedAt).toLocaleDateString('th-TH')}
                          </span>
                        </div>
                        <span className={`px-2 py-0.2 rounded text-[10px] font-medium ${
                          isCurrent ? 'bg-slate-800 text-emerald-300' : `${stInfo.bg} ${stInfo.color}`
                        }`}>
                          {stInfo.label}
                        </span>
                      </div>
                      <p className={`line-clamp-2 leading-relaxed ${isCurrent ? 'text-slate-200' : 'text-slate-600'}`}>
                        {r.behaviorDetails}
                      </p>
                      <div className="mt-1 text-[11px] opacity-70 flex items-center justify-between">
                        <span>ที่อยู่: {r.address.villageNo || `ต.${r.address.subdistrict}`}</span>
                        <span>สาร: {r.drugTypes.join(', ')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Address & Location in Tambon That Thong */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Address */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-rose-500" />
                <span>ที่อยู่และพิกัดในพื้นที่</span>
              </h3>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">
                {[
                  tip.address.houseNo ? `บ้านเลขที่ ${tip.address.houseNo}` : null,
                  tip.address.villageNo,
                  `ตำบล${tip.address.subdistrict}`,
                  `อำเภอ${tip.address.district}`,
                  `จังหวัด${tip.address.province}`
                ]
                  .filter(Boolean)
                  .join(' ')}
              </p>
              {tip.address.landmark && (
                <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-700">
                  <span className="font-semibold text-slate-800">จุดสังเกตเด่นชัด: </span>
                  <span>{tip.address.landmark}</span>
                </div>
              )}
              {tip.address.coordinates && (
                <div className="text-[11px] text-slate-500 font-mono">
                  พิกัด GPS: {tip.address.coordinates.lat.toFixed(4)}, {tip.address.coordinates.lng.toFixed(4)}
                </div>
              )}
            </div>

            {/* Drugs & Vehicles */}
            <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>ประเภทสารเสพติดที่เกี่ยวข้อง</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {tip.drugTypes.map((drug) => (
                    <span
                      key={drug}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200"
                    >
                      {drug}
                    </span>
                  ))}
                </div>
              </div>

              {tip.vehicleInfo && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-700 flex items-center space-x-1">
                    <Car className="w-3.5 h-3.5 text-slate-500" />
                    <span>ยานพาหนะ:</span>
                  </span>
                  <p className="text-xs text-slate-600 mt-0.5">{tip.vehicleInfo}</p>
                </div>
              )}

              {tip.frequency && (
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">ช่วงเวลา/ความถี่: </span>
                  <span>{tip.frequency}</span>
                </div>
              )}
            </div>
          </div>

          {/* Behavior / Tip Details Description */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              พฤติการณ์ที่ได้รับแจ้งโดยละเอียด (ต.ธาตุทอง อ.สว่างแดนดิน)
            </h3>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {tip.behaviorDetails}
            </p>
          </div>

          {/* Action Log / Progress History */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
              <History className="w-4 h-4 text-slate-500" />
              <span>บันทึกประวัติการดำเนินการ (Action Log)</span>
            </h3>

            {tip.actionLog && tip.actionLog.length > 0 ? (
              <div className="space-y-2.5">
                {tip.actionLog.map((log, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span>{log.date}</span>
                        <span className="font-semibold text-slate-700">โดย: {log.by}</span>
                      </div>
                      <p className="text-slate-800 font-medium mt-0.5">{log.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">ยังไม่มีบันทึกการดำเนินการเพิ่มเติม</p>
            )}

            {/* Add Action Note Form */}
            <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
              <input
                id="input-action-note"
                type="text"
                value={newLogNote}
                onChange={(e) => setNewLogNote(e.target.value)}
                placeholder="เพิ่มบันทึกความคืบหน้า เช่น ประสาน ชรบ. ตรวจสอบ, ส่งต่อ รพ.สต.ธาตุทอง..."
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <button
                type="submit"
                className="inline-flex items-center space-x-1 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                <Send className="w-3.5 h-3.5" />
                <span>บันทึก</span>
              </button>
            </form>
          </div>

          {/* Delete Action with Mandatory Confirmation Dialog */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              แจ้งเมื่อ: {new Date(tip.reportedAt).toLocaleString('th-TH')}
            </span>

            {showDeleteConfirm ? (
              <div className="flex items-center space-x-2 bg-rose-50 p-2 rounded-xl border border-rose-200">
                <span className="text-xs text-rose-700 font-semibold">ยืนยันการลบรายการนี้?</span>
                <button
                  id="btn-confirm-delete-tip"
                  onClick={() => {
                    onDeleteTip(tip.id);
                    onClose();
                  }}
                  className="px-2.5 py-1 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700"
                >
                  ลบข้อมูล
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2.5 py-1 bg-white text-slate-700 text-xs font-medium rounded-lg border border-slate-300 hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
              </div>
            ) : (
              <button
                id="btn-init-delete-tip"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center space-x-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบรายการเบาะแส</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
