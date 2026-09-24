import { useState, useMemo } from 'react';
import { TipRecord, TipCategory, TipStatus } from '../types';
import { TipCard } from './TipCard';
import { CATEGORY_CONFIG, STATUS_LABELS, DRUG_OPTIONS, THAT_THONG_VILLAGES } from '../data/mockData';
import { 
  Search, 
  Filter, 
  AlertCircle, 
  Layers, 
  Flame, 
  HeartHandshake, 
  ShieldAlert,
  ArrowUpDown,
  AlertTriangle,
  MapPin
} from 'lucide-react';

interface TipListProps {
  tips: TipRecord[];
  activeCategory: TipCategory | 'all';
  onSelectCategory: (category: TipCategory | 'all') => void;
  onSelectTip: (tip: TipRecord) => void;
}

export function TipList({
  tips,
  activeCategory,
  onSelectCategory,
  onSelectTip
}: TipListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [drugFilter, setDrugFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [villageFilter, setVillageFilter] = useState<string>('all');
  const [onlyRepeatOffenders, setOnlyRepeatOffenders] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'urgency' | 'repeat_count'>('newest');

  // Compute report count for every person across all tips
  const reportCountMap = useMemo(() => {
    const map = new Map<string, number>();
    tips.forEach((t) => {
      const key = t.fullName.trim().toLowerCase();
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }, [tips]);

  // Total repeat offenders count
  const repeatOffendersCount = useMemo(() => {
    let count = 0;
    tips.forEach((t) => {
      const key = t.fullName.trim().toLowerCase();
      if ((reportCountMap.get(key) || 0) > 1) {
        count++;
      }
    });
    return count;
  }, [tips, reportCountMap]);

  // Counts for tabs
  const categoryCounts = useMemo(() => {
    return {
      all: tips.length,
      dealer: tips.filter((t) => t.category === 'dealer').length,
      user: tips.filter((t) => t.category === 'user').length,
      rehab: tips.filter((t) => t.category === 'rehab').length,
    };
  }, [tips]);

  // Filtered and sorted tips
  const filteredTips = useMemo(() => {
    return tips
      .filter((tip) => {
        const key = tip.fullName.trim().toLowerCase();
        const tipReportCount = reportCountMap.get(key) || 1;

        // Repeat offenders filter
        if (onlyRepeatOffenders && tipReportCount <= 1) {
          return false;
        }

        // Category filter
        if (activeCategory !== 'all' && tip.category !== activeCategory) {
          return false;
        }

        // Status filter
        if (statusFilter !== 'all' && tip.status !== statusFilter) {
          return false;
        }

        // Drug filter
        if (drugFilter !== 'all') {
          const hasDrug = tip.drugTypes.some((d) => d.toLowerCase().includes(drugFilter.toLowerCase()));
          if (!hasDrug) return false;
        }

        // Village filter
        if (villageFilter !== 'all') {
          if (!tip.address.villageNo?.includes(villageFilter)) return false;
        }

        // Source filter
        if (sourceFilter !== 'all' && tip.source !== sourceFilter) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = tip.fullName.toLowerCase().includes(q);
          const matchAlias = tip.alias?.toLowerCase().includes(q);
          const matchDetails = tip.behaviorDetails.toLowerCase().includes(q);
          const matchDrug = tip.drugTypes.some((d) => d.toLowerCase().includes(q));
          const matchAddress = [
            tip.address.houseNo,
            tip.address.villageNo,
            tip.address.subdistrict,
            tip.address.district,
            tip.address.province,
            tip.address.landmark
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(q);

          if (!matchName && !matchAlias && !matchDetails && !matchDrug && !matchAddress) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const countA = reportCountMap.get(a.fullName.trim().toLowerCase()) || 1;
        const countB = reportCountMap.get(b.fullName.trim().toLowerCase()) || 1;

        if (sortBy === 'repeat_count') {
          return countB - countA;
        }
        if (sortBy === 'newest') {
          return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime();
        }
        if (sortBy === 'urgency') {
          const order: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
          return (order[b.urgency] || 0) - (order[a.urgency] || 0);
        }
        return 0;
      });
  }, [tips, activeCategory, statusFilter, drugFilter, villageFilter, sourceFilter, searchQuery, sortBy, onlyRepeatOffenders, reportCountMap]);

  return (
    <div className="space-y-5">
      {/* 3 Main Distinct Category Tabs (แยกหัวข้อชัดเจน: ผู้ค้า ผู้เสพ ผู้ต้องการเลิกยา) */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap gap-1.5">
        {/* All Tab */}
        <button
          id="tab-category-all"
          onClick={() => onSelectCategory('all')}
          className={`flex-1 min-w-[120px] inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
            activeCategory === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>ทั้งหมด</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            activeCategory === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'
          }`}>
            {categoryCounts.all}
          </span>
        </button>

        {/* ผู้ค้ายาเสพติด Tab */}
        <button
          id="tab-category-dealer"
          onClick={() => onSelectCategory('dealer')}
          className={`flex-1 min-w-[150px] inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
            activeCategory === 'dealer'
              ? 'bg-rose-600 text-white shadow-xs ring-2 ring-rose-300'
              : 'text-rose-700 hover:text-rose-800 hover:bg-rose-50'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>ผู้ค้ายาเสพติด</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            activeCategory === 'dealer' ? 'bg-rose-700 text-white' : 'bg-rose-100 text-rose-800'
          }`}>
            {categoryCounts.dealer}
          </span>
        </button>

        {/* ผู้เสพยาเสพติด Tab */}
        <button
          id="tab-category-user"
          onClick={() => onSelectCategory('user')}
          className={`flex-1 min-w-[150px] inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
            activeCategory === 'user'
              ? 'bg-amber-600 text-white shadow-xs ring-2 ring-amber-300'
              : 'text-amber-700 hover:text-amber-800 hover:bg-amber-50'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>ผู้เสพยาเสพติด</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            activeCategory === 'user' ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800'
          }`}>
            {categoryCounts.user}
          </span>
        </button>

        {/* ผู้ต้องการเลิกยา Tab */}
        <button
          id="tab-category-rehab"
          onClick={() => onSelectCategory('rehab')}
          className={`flex-1 min-w-[150px] inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all ${
            activeCategory === 'rehab'
              ? 'bg-emerald-600 text-white shadow-xs ring-2 ring-emerald-300'
              : 'text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>ผู้ต้องการเลิกยา</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            activeCategory === 'rehab' ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
          }`}>
            {categoryCounts.rehab}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-2xs">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              id="input-search-tips"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อ, ฉายา, หมู่บ้านใน ต.ธาตุทอง, ยาเสพติด หรือพฤติการณ์..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ล้าง
              </button>
            )}
          </div>

          {/* Repeat Report Quick Filter Toggle (คนโดนแจ้งซ้ำ) */}
          <button
            id="btn-filter-repeat-offenders"
            onClick={() => setOnlyRepeatOffenders(!onlyRepeatOffenders)}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors border ${
              onlyRepeatOffenders
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
            }`}
            title="กรองเฉพาะบุคคลที่มีประวัติถูกแจ้งเบาะแสมากกว่า 1 ครั้ง"
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${onlyRepeatOffenders ? 'text-white' : 'text-rose-600'}`} />
            <span>ดูเฉพาะคนโดนแจ้งซ้ำ (&gt;1 ครั้ง)</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              onlyRepeatOffenders ? 'bg-rose-700 text-white' : 'bg-rose-200 text-rose-900'
            }`}>
              {repeatOffendersCount}
            </span>
          </button>
        </div>

        {/* Second row of filters */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          {/* Village in That Thong filter */}
          <div className="flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={villageFilter}
              onChange={(e) => setVillageFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">ทุกหมู่บ้านใน ต.ธาตุทอง</option>
              {THAT_THONG_VILLAGES.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">ทุกสถานะการดำเนินงาน</option>
            {Object.entries(STATUS_LABELS).map(([key, info]) => (
              <option key={key} value={key}>{info.label}</option>
            ))}
          </select>

          {/* Drug Filter */}
          <select
            value={drugFilter}
            onChange={(e) => setDrugFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">สารเสพติดทุกชนิด</option>
            <option value="ยาบ้า">ยาบ้า</option>
            <option value="ไอซ์">ยาไอซ์</option>
            <option value="เคตามีน">เคตามีน</option>
            <option value="เฮโรอีน">เฮโรอีน</option>
            <option value="กัญชา">กัญชา/น้ำกระท่อม</option>
            <option value="สารระเหย">สารระเหย</option>
          </select>

          {/* Sort By */}
          <div className="ml-auto flex items-center space-x-1.5">
            <span className="text-[11px] text-slate-400 hidden sm:inline">เรียงลำดับ:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="newest">แจ้งล่าสุด</option>
              <option value="repeat_count">โดนแจ้งซ้ำมากที่สุด</option>
              <option value="urgency">ความเร่งด่วน</option>
              <option value="oldest">แจ้งก่อนหน้า</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tip Cards Grid */}
      {filteredTips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTips.map((tip) => {
            const count = reportCountMap.get(tip.fullName.trim().toLowerCase()) || 1;
            return (
              <TipCard
                key={tip.id}
                tip={tip}
                reportCount={count}
                onClick={() => onSelectTip(tip)}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              ไม่พบข้อมูลเบาะแสที่ตรงกับเงื่อนไข
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              ลองเปลี่ยนคำค้นหา ปรับตัวกรอง หรือคลิก "ล้างตัวกรอง" เพื่อแสดงรายการทั้งหมด
            </p>
          </div>
          {(searchQuery || statusFilter !== 'all' || drugFilter !== 'all' || villageFilter !== 'all' || onlyRepeatOffenders) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setDrugFilter('all');
                setVillageFilter('all');
                setOnlyRepeatOffenders(false);
              }}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          )}
        </div>
      )}
    </div>
  );
}
