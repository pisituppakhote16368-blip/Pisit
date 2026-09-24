import { useMemo } from 'react';
import { TipRecord, TipCategory } from '../types';
import { 
  Users, 
  Flame, 
  HeartHandshake, 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  TrendingUp,
  Repeat
} from 'lucide-react';

interface StatsDashboardProps {
  tips: TipRecord[];
  activeCategory: TipCategory | 'all';
  onSelectCategory: (category: TipCategory | 'all') => void;
  onSelectTipByName?: (name: string) => void;
}

export function StatsDashboard({ tips, activeCategory, onSelectCategory, onSelectTipByName }: StatsDashboardProps) {
  const stats = useMemo(() => {
    const total = tips.length;
    const dealers = tips.filter((t) => t.category === 'dealer').length;
    const users = tips.filter((t) => t.category === 'user').length;
    const rehab = tips.filter((t) => t.category === 'rehab').length;

    // Status counts
    const pending = tips.filter((t) => t.status === 'pending').length;
    const investigating = tips.filter((t) => t.status === 'investigating').length;
    const actionTaken = tips.filter((t) => t.status === 'action_taken').length;
    const rehabReferred = tips.filter((t) => t.status === 'rehab_referred' || t.status === 'rehab_completed').length;
    const rehabCompleted = tips.filter((t) => t.status === 'rehab_completed').length;

    // Repeat report calculation
    const personMap = new Map<string, { count: number; category: TipCategory; alias?: string; latestVillage?: string }>();
    tips.forEach((t) => {
      const key = t.fullName.trim();
      const existing = personMap.get(key);
      if (existing) {
        existing.count += 1;
        if (!existing.alias && t.alias) existing.alias = t.alias;
      } else {
        personMap.set(key, {
          count: 1,
          category: t.category,
          alias: t.alias,
          latestVillage: t.address.villageNo
        });
      }
    });

    const uniquePersonsCount = personMap.size;
    const repeatOffenders = Array.from(personMap.entries())
      .filter(([_, data]) => data.count > 1)
      .sort((a, b) => b[1].count - a[1].count);

    // Drug breakdown
    const drugMap: Record<string, number> = {};
    tips.forEach((t) => {
      t.drugTypes.forEach((d) => {
        const key = d.trim();
        drugMap[key] = (drugMap[key] || 0) + 1;
      });
    });
    const topDrugs = Object.entries(drugMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Village breakdown in Tambon That Thong
    const villageMap: Record<string, number> = {};
    tips.forEach((t) => {
      const v = t.address.villageNo || 'ชุมชนอื่นใน ต.ธาตุทอง';
      villageMap[v] = (villageMap[v] || 0) + 1;
    });
    const topVillages = Object.entries(villageMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return {
      total,
      dealers,
      users,
      rehab,
      pending,
      investigating,
      actionTaken,
      rehabReferred,
      rehabCompleted,
      uniquePersonsCount,
      repeatOffenders,
      repeatCountTotal: repeatOffenders.length,
      topDrugs,
      topVillages,
      dealerPct: total ? Math.round((dealers / total) * 100) : 0,
      userPct: total ? Math.round((users / total) * 100) : 0,
      rehabPct: total ? Math.round((rehab / total) * 100) : 0,
    };
  }, [tips]);

  return (
    <div className="space-y-6">
      {/* Subheader Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900 text-white p-4 rounded-2xl shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 border border-slate-700">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-300 block">
              พื้นที่ปฏิบัติการหลัก
            </span>
            <h2 className="text-base font-bold text-white tracking-tight">
              ตำบลธาตุทอง อำเภอสว่างแดนดิน จังหวัดสกลนคร
            </h2>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
            บุคคลในฐานข้อมูล: <span className="text-white font-bold">{stats.uniquePersonsCount} ราย</span>
          </div>
          <div className="bg-rose-950/80 px-3 py-1.5 rounded-xl border border-rose-800 text-rose-300 font-bold">
            แจ้งซ้ำ: {stats.repeatCountTotal} ราย
          </div>
        </div>
      </div>

      {/* 4 Core Category Action / Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tips Card */}
        <div
          id="stat-card-total"
          onClick={() => onSelectCategory('all')}
          className={`cursor-pointer p-5 rounded-2xl bg-white border transition-all duration-150 ${
            activeCategory === 'all'
              ? 'ring-2 ring-slate-900 border-slate-900 shadow-md'
              : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              เบาะแสทั้งหมด
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-slate-900">
              {stats.total}
            </span>
            <span className="text-xs font-medium text-slate-500">
              เรื่องที่ได้รับแจ้ง
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>รอตรวจสอบ {stats.pending} เรื่อง</span>
          </div>
        </div>

        {/* 1. ผู้ค้ายาเสพติด (Dealers) */}
        <div
          id="stat-card-dealers"
          onClick={() => onSelectCategory('dealer')}
          className={`cursor-pointer p-5 rounded-2xl bg-white border transition-all duration-150 relative overflow-hidden ${
            activeCategory === 'dealer'
              ? 'ring-2 ring-rose-600 border-rose-600 shadow-md'
              : 'border-slate-200 hover:border-rose-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
              <span>ผู้ค้ายาเสพติด</span>
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-rose-600">
              {stats.dealers}
            </span>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
              {stats.dealerPct}%
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-600 flex items-center justify-between">
            <span>ดำเนินการจับกุมแล้ว: {stats.actionTaken} คดี</span>
          </div>
        </div>

        {/* 2. ผู้เสพยาเสพติด (Users) */}
        <div
          id="stat-card-users"
          onClick={() => onSelectCategory('user')}
          className={`cursor-pointer p-5 rounded-2xl bg-white border transition-all duration-150 ${
            activeCategory === 'user'
              ? 'ring-2 ring-amber-600 border-amber-600 shadow-md'
              : 'border-slate-200 hover:border-amber-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>ผู้เสพยาเสพติด</span>
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-amber-600">
              {stats.users}
            </span>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              {stats.userPct}%
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-600 flex items-center justify-between">
            <span>กำลังลงพื้นที่: {stats.investigating} ราย</span>
          </div>
        </div>

        {/* 3. ผู้ต้องการเลิกยาเสพติด (Rehab Seekers) */}
        <div
          id="stat-card-rehab"
          onClick={() => onSelectCategory('rehab')}
          className={`cursor-pointer p-5 rounded-2xl bg-white border transition-all duration-150 ${
            activeCategory === 'rehab'
              ? 'ring-2 ring-emerald-600 border-emerald-600 shadow-md'
              : 'border-slate-200 hover:border-emerald-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>ผู้ต้องการเลิกยา</span>
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold tracking-tight text-emerald-600">
              {stats.rehab}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              {stats.rehabPct}%
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-600 flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 inline" />
              <span>สำเร็จแล้ว {stats.rehabCompleted} ราย</span>
            </span>
          </div>
        </div>
      </div>

      {/* Repeat Report Spotlight & Top Offender Tracker (การดูว่าคนโดนแจ้งมากี่ครั้งแล้ว) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
              <Repeat className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                สถิติตรวจจับบุคคลที่ถูกแจ้งเบาะแสซ้ำ (Repeat Report Tracker)
              </h3>
              <p className="text-xs text-slate-500">
                ตรวจพบ {stats.repeatCountTotal} บุคคลที่มีประวัติการถูกแจ้งซ้ำในระบบตำบลธาตุทอง
              </p>
            </div>
          </div>
        </div>

        {stats.repeatOffenders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.repeatOffenders.map(([name, data]) => (
              <div
                key={name}
                onClick={() => onSelectTipByName && onSelectTipByName(name)}
                className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40 hover:bg-rose-50 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-bold text-xs text-slate-900">{name}</span>
                    {data.alias && (
                      <span className="text-[11px] text-slate-500 font-medium">({data.alias})</span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {data.latestVillage || 'ต.ธาตุทอง อ.สว่างแดนดิน'}
                  </span>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-2xs">
                  แจ้ง {data.count} ครั้ง
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">ยังไม่พบบุคคลที่ถูกแจ้งเบาะแสซ้ำในขณะนี้</p>
        )}
      </div>

      {/* Analytical Breakdown: Drugs & Villages in Tambon That Thong */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Drug Types Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-slate-600" />
              <span>สถิติประเภทสารเสพติดที่พบมากที่สุด</span>
            </h3>
            <span className="text-xs text-slate-500">รายงานตามข้อเท็จจริง</span>
          </div>
          <div className="space-y-3">
            {stats.topDrugs.map(([drug, count]) => {
              const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={drug} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span className="truncate">{drug}</span>
                    <span className="font-semibold text-slate-900">{count} เรื่อง ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full bg-slate-800 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Villages Breakdown in Tambon That Thong */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>สถิติรายหมู่บ้านในตำบลธาตุทอง (สกลนคร)</span>
            </h3>
            <span className="text-xs text-slate-500">จำแนกตามหมู่บ้าน</span>
          </div>
          <div className="space-y-3">
            {stats.topVillages.map(([village, count]) => {
              const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={village} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span className="truncate">{village}</span>
                    <span className="font-semibold text-slate-900">{count} เรื่อง</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
