import { TipRecord } from '../types';
import { CATEGORY_CONFIG, STATUS_LABELS } from '../data/mockData';
import { 
  MapPin, 
  Calendar, 
  FileSpreadsheet, 
  UserCheck, 
  ChevronRight,
  Shield,
  AlertTriangle
} from 'lucide-react';

interface TipCardProps {
  tip: TipRecord;
  reportCount?: number;
  onClick: () => void;
}

export function TipCard({ tip, reportCount = 1, onClick }: TipCardProps) {
  const categoryConfig = CATEGORY_CONFIG[tip.category];
  const statusInfo = STATUS_LABELS[tip.status] || STATUS_LABELS.pending;
  const isRepeatOffender = reportCount > 1;

  return (
    <div
      id={`tip-card-${tip.id}`}
      onClick={onClick}
      className={`group cursor-pointer bg-white rounded-2xl border ${
        isRepeatOffender ? 'border-amber-300 ring-1 ring-amber-200 hover:border-amber-400' : categoryConfig.cardBorder
      } p-5 transition-all duration-200 hover:shadow-md flex flex-col justify-between`}
    >
      <div>
        {/* Top Badges: Category & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${categoryConfig.badgeClass}`}>
              {categoryConfig.label}
            </span>
            {tip.source === 'google_form' ? (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                <span>Google Form</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <UserCheck className="w-3 h-3 text-slate-500" />
                <span>บันทึกรายบุคคล</span>
              </span>
            )}
          </div>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
            {statusInfo.label}
          </span>
        </div>

        {/* Person Identity Header with Photo & Repeat Count Tag */}
        <div className="flex items-start space-x-3.5 mt-2">
          {tip.photoUrl ? (
            <img
              src={tip.photoUrl}
              alt={tip.fullName}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-200 flex-shrink-0 shadow-sm"
            />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-500 flex-shrink-0">
              <Shield className="w-6 h-6 text-slate-400" />
              <span className="text-[10px] mt-0.5">ไม่มีรูป</span>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h4 className="font-bold text-slate-900 text-base leading-snug truncate group-hover:text-slate-800">
                {tip.fullName}
              </h4>
            </div>

            {/* Repeat Report Counter Badge */}
            <div className="mt-1">
              {isRepeatOffender ? (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  <span>โดนแจ้งแล้ว {reportCount} ครั้ง (แจ้งซ้ำ)</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  <span>แจ้งครั้งแรก (1 ครั้ง)</span>
                </span>
              )}
            </div>

            {tip.alias && (
              <p className="text-xs font-medium text-slate-600 truncate mt-1">
                ฉายา/ชื่อเล่น: <span className="text-slate-900 font-semibold">{tip.alias}</span>
              </p>
            )}

            <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1">
              {tip.gender && tip.gender !== 'ไม่ระบุ' && <span>เพศ{tip.gender}</span>}
              {tip.age && <span>อายุ {tip.age} ปี</span>}
              {tip.urgency === 'critical' && (
                <span className="text-rose-600 font-bold text-[10px] uppercase bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                  ด่วนที่สุด
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Address and Landmark in That Thong */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
          <div className="flex items-start space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2 leading-relaxed">
              {[
                tip.address.houseNo ? `บ้านเลขที่ ${tip.address.houseNo}` : null,
                tip.address.villageNo,
                `ต.${tip.address.subdistrict}`,
                `อ.${tip.address.district}`,
                `จ.${tip.address.province}`
              ]
                .filter(Boolean)
                .join(' ')}
              {tip.address.landmark && (
                <span className="text-slate-500 block text-[11px] mt-0.5">
                  จุดสังเกต: {tip.address.landmark}
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Drug Types Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tip.drugTypes.map((drug) => (
            <span
              key={drug}
              className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200"
            >
              {drug}
            </span>
          ))}
        </div>

        {/* Behavior snippet */}
        <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {tip.behaviorDetails}
        </p>
      </div>

      {/* Footer Details */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>
            {new Date(tip.reportedAt).toLocaleDateString('th-TH', {
              day: 'numeric',
              month: 'short',
              year: '2-digit'
            })}
          </span>
        </div>
        <div className="flex items-center space-x-1 font-semibold text-slate-800 group-hover:translate-x-0.5 transition-transform">
          <span>ดูประวัติ ({reportCount} เรื่อง)</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </div>
  );
}
