import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { TipRecord, TipCategory, UrgencyLevel, TipStatus } from '../types';
import { DRUG_OPTIONS, CATEGORY_CONFIG, THAT_THONG_VILLAGES } from '../data/mockData';
import { 
  X, 
  Upload, 
  MapPin, 
  User, 
  ShieldAlert, 
  Flame, 
  HeartHandshake, 
  Image as ImageIcon,
  Check
} from 'lucide-react';

interface AddTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTip: (tip: TipRecord) => void;
}

export function AddTipModal({ isOpen, onClose, onAddTip }: AddTipModalProps) {
  if (!isOpen) return null;

  const [category, setCategory] = useState<TipCategory>('dealer');
  const [fullName, setFullName] = useState('');
  const [alias, setAlias] = useState('');
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'ชาย' | 'หญิง' | 'ไม่ระบุ'>('ไม่ระบุ');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Address - Default to ตำบลธาตุทอง อำเภอสว่างแดนดิน จังหวัดสกลนคร
  const [houseNo, setHouseNo] = useState('');
  const [villageNo, setVillageNo] = useState('หมู่ 1 บ้านธาตุทอง');
  const [customVillage, setCustomVillage] = useState('');
  const [subdistrict, setSubdistrict] = useState('ธาตุทอง');
  const [district, setDistrict] = useState('สว่างแดนดิน');
  const [province, setProvince] = useState('สกลนคร');
  const [landmark, setLandmark] = useState('');

  // Drugs & Details
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>(['ยาบ้า']);
  const [customDrug, setCustomDrug] = useState('');
  const [behaviorDetails, setBehaviorDetails] = useState('');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('medium');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [informantContact, setInformantContact] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Upload Handlers (Drag & Drop + Click)
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพเท่านั้น');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleDrug = (drugName: string) => {
    setSelectedDrugs((prev) =>
      prev.includes(drugName) ? prev.filter((d) => d !== drugName) : [...prev, drugName]
    );
  };

  const handleAddCustomDrug = () => {
    if (customDrug.trim() && !selectedDrugs.includes(customDrug.trim())) {
      setSelectedDrugs((prev) => [...prev, customDrug.trim()]);
      setCustomDrug('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      alert('กรุณากรอกชื่อ-นามสกุล หรือชื่อเรียกของผู้ถูกแจ้ง');
      return;
    }

    if (!subdistrict.trim() || !district.trim() || !province.trim()) {
      alert('กรุณาระบุตำบล อำเภอ และจังหวัดอย่างครบถ้วน');
      return;
    }

    if (selectedDrugs.length === 0) {
      alert('กรุณาเลือกประเภทสารเสพติดที่เกี่ยวข้องอย่างน้อย 1 ชนิด');
      return;
    }

    const defaultStatus: TipStatus = category === 'rehab' ? 'rehab_referred' : 'pending';
    const finalVillage = villageNo === 'other' ? customVillage.trim() : villageNo;

    const newRecord: TipRecord = {
      id: `manual-${Date.now()}`,
      source: 'manual',
      category,
      fullName: fullName.trim(),
      alias: alias.trim() || undefined,
      age: age ? parseInt(age, 10) : undefined,
      gender,
      photoUrl: photoUrl || undefined,
      address: {
        houseNo: houseNo.trim() || undefined,
        villageNo: finalVillage || undefined,
        subdistrict: subdistrict.trim(),
        district: district.trim(),
        province: province.trim(),
        landmark: landmark.trim() || undefined,
      },
      drugTypes: selectedDrugs,
      behaviorDetails: behaviorDetails.trim() || 'บันทึกข้อมูลรายบุคคลผ่านระบบศูนย์รับเรื่อง ต.ธาตุทอง',
      vehicleInfo: vehicleInfo.trim() || undefined,
      reportedAt: new Date().toISOString(),
      isAnonymous,
      informantContact: isAnonymous ? undefined : informantContact.trim(),
      status: defaultStatus,
      urgency,
      assignedUnit: category === 'rehab' 
        ? 'ศูนย์คัดกรองผู้ป่วยยาเสพติด รพ.สต.ธาตุทอง'
        : 'ชุดปฏิบัติการปราบปรามยาเสพติด สภ.สว่างแดนดิน และฝ่ายความมั่นคง ต.ธาตุทอง',
      actionLog: [
        {
          date: new Date().toLocaleDateString('th-TH') + ' ' + new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
          action: 'บันทึกข้อมูลรายบุคคลเข้าระบบศูนย์รับแจ้ง ต.ธาตุทอง',
          by: 'เจ้าหน้าที่บันทึกข้อมูล'
        }
      ]
    };

    onAddTip(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="modal-add-tip"
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                ลงข้อมูลแจ้งเบาะแสรายบุคคล
              </h2>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                ต.ธาตุทอง อ.สว่างแดนดิน จ.สกลนคร
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              กรอกข้อมูลบุคคล รูปถ่าย ที่อยู่ และพฤติการณ์เพื่อบันทึก ตรวจจับการแจ้งซ้ำ และประมวลผลสถิติ
            </p>
          </div>
          <button
            id="btn-close-add-modal"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          {/* Step 1: Select Category (แยกหัวข้อชัดเจน) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              1. เลือกประเภทการแจ้งเบาะแส (แยก 3 หมวดหมู่ชัดเจน) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Dealer Option */}
              <div
                id="opt-category-dealer"
                onClick={() => setCategory('dealer')}
                className={`cursor-pointer p-3.5 rounded-2xl border text-center transition-all ${
                  category === 'dealer'
                    ? 'border-rose-600 bg-rose-50/60 ring-2 ring-rose-500 text-rose-900'
                    : 'border-slate-200 hover:border-rose-300 text-slate-700 bg-white'
                }`}
              >
                <ShieldAlert className={`w-5 h-5 mx-auto mb-1.5 ${category === 'dealer' ? 'text-rose-600' : 'text-slate-400'}`} />
                <span className="font-bold text-sm block">ผู้ค้ายาเสพติด</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">จำหน่าย/กระจายของ</span>
              </div>

              {/* User Option */}
              <div
                id="opt-category-user"
                onClick={() => setCategory('user')}
                className={`cursor-pointer p-3.5 rounded-2xl border text-center transition-all ${
                  category === 'user'
                    ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-500 text-amber-900'
                    : 'border-slate-200 hover:border-amber-300 text-slate-700 bg-white'
                }`}
              >
                <Flame className={`w-5 h-5 mx-auto mb-1.5 ${category === 'user' ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className="font-bold text-sm block">ผู้เสพยาเสพติด</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">เสพ/มั่วสุมในพื้นที่</span>
              </div>

              {/* Rehab Option */}
              <div
                id="opt-category-rehab"
                onClick={() => setCategory('rehab')}
                className={`cursor-pointer p-3.5 rounded-2xl border text-center transition-all ${
                  category === 'rehab'
                    ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500 text-emerald-900'
                    : 'border-slate-200 hover:border-emerald-300 text-slate-700 bg-white'
                }`}
              >
                <HeartHandshake className={`w-5 h-5 mx-auto mb-1.5 ${category === 'rehab' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="font-bold text-sm block">ผู้ต้องการเลิกยา</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">สมัครใจบำบัดรักษา (CBTx)</span>
              </div>
            </div>
          </div>

          {/* Step 2: Photo Upload (Drag and Drop + Click) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              2. รูปภาพบุคคลหรือสถานที่ (Drag & Drop หรือคลิกเลือกไฟล์)
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-slate-800 bg-slate-100'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {photoUrl ? (
                <div className="flex flex-col items-center">
                  <img
                    src={photoUrl}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-xl shadow-md ring-2 ring-slate-800 mb-2"
                  />
                  <span className="text-xs text-emerald-700 font-semibold flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>แนบรูปภาพแล้ว (คลิกเพื่อเปลี่ยนรูป)</span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPhotoUrl('');
                    }}
                    className="mt-1 text-xs text-rose-600 hover:underline"
                  >
                    ลบรูปภาพ
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-7 h-7 text-slate-400 mx-auto" />
                  <p className="text-xs font-semibold text-slate-700">
                    ลากไฟล์รูปภาพมาวางที่นี่ หรือคลิกเพื่ออัปโหลด
                  </p>
                  <p className="text-[11px] text-slate-400">
                    รองรับ JPG, PNG, WebP
                  </p>
                </div>
              )}
            </div>

            {/* Direct Image URL input as backup */}
            <div className="flex items-center space-x-2 pt-1">
              <span className="text-[11px] text-slate-500 whitespace-nowrap">หรือใส่ลิงก์รูป URL:</span>
              <input
                type="url"
                value={photoUrl.startsWith('data:') ? '' : photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700"
              />
            </div>
          </div>

          {/* Step 3: Personal Information */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              3. ข้อมูลบุคคลผู้ถูกแจ้ง <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">
                  ชื่อ-นามสกุล / ชื่อจริง <span className="text-rose-500">*</span>
                </label>
                <input
                  id="input-fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="เช่น นายสมชาย คำแสง"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">
                  ฉายา / ชื่อเล่น (ถ้ามี)
                </label>
                <input
                  id="input-alias"
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="เช่น เอก ลายพราง, มาร์ค คำสะอาด"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">เพศ</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="ไม่ระบุ">ไม่ระบุ</option>
                  <option value="ชาย">ชาย</option>
                  <option value="หญิง">หญิง</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">อายุโดยประมาณ (ปี)</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="เช่น 28"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Step 4: Address Information (Default to ตำบลธาตุทอง อำเภอสว่างแดนดิน จังหวัดสกลนคร) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>4. ที่อยู่และหมู่บ้านในพื้นที่ตำบลธาตุทอง <span className="text-rose-500">*</span></span>
              </label>
              <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ต.ธาตุทอง อ.สว่างแดนดิน จ.สกลนคร
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">บ้านเลขที่ / ซอย</label>
                <input
                  type="text"
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                  placeholder="เช่น 45/2 หรือ ท้ายหมู่บ้าน"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">หมู่บ้านในตำบลธาตุทอง <span className="text-rose-500">*</span></label>
                <select
                  value={villageNo}
                  onChange={(e) => setVillageNo(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  {THAT_THONG_VILLAGES.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                  <option value="other">ระบุหมู่บ้าน/ชุมชนอื่น...</option>
                </select>
                {villageNo === 'other' && (
                  <input
                    type="text"
                    value={customVillage}
                    onChange={(e) => setCustomVillage(e.target.value)}
                    placeholder="พิมพ์ชื่อหมู่บ้าน/ชุมชน"
                    className="mt-1.5 w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 focus:bg-white focus:ring-2 focus:ring-slate-900"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">ตำบล <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={subdistrict}
                  onChange={(e) => setSubdistrict(e.target.value)}
                  placeholder="ธาตุทอง"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">อำเภอ <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="สว่างแดนดิน"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 block mb-1">จังหวัด <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="สกลนคร"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">จุดสังเกตเด่นชัด / สถานที่พบเห็น</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="เช่น ท้ายซอยวัดธาตุทอง, ใกล้ รพ.สต.ธาตุทอง, หนองน้ำบ้านคำสะอาด"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">ระดับความเร่งด่วน</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="low">ปกติ</option>
                  <option value="medium">ปานกลาง</option>
                  <option value="high">สูง</option>
                  <option value="critical">เร่งด่วนวิกฤต</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 5: Drug Types */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              5. ประเภทสารเสพติดที่เกี่ยวข้อง <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {['ยาบ้า', 'ไอซ์', 'เคตามีน', 'เฮโรอีน', 'ยาอี', 'กัญชา/น้ำกระท่อมผิดกฎหมาย', 'สารระเหย (Inhalants)'].map((drug) => {
                const isSelected = selectedDrugs.includes(drug);
                return (
                  <button
                    key={drug}
                    type="button"
                    onClick={() => toggleDrug(drug)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {drug}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 6: Behavior details */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              6. พฤติการณ์และข้อมูลเพิ่มเติม
            </label>
            <textarea
              rows={3}
              value={behaviorDetails}
              onChange={(e) => setBehaviorDetails(e.target.value)}
              placeholder="ระบุพฤติกรรม เช่น เวลาที่มักมาส่งของ, สถานที่ซ่อนยา, พฤติกรรมก้าวร้าว, หรือความประสงค์เข้ารับการบำบัดฟื้นฟู..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {/* Step 7: Vehicles & Informant Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-xs text-slate-600 block mb-1">ยานพาหนะที่ใช้ (ถ้ามี)</label>
              <input
                type="text"
                value={vehicleInfo}
                onChange={(e) => setVehicleInfo(e.target.value)}
                placeholder="เช่น มอเตอร์ไซค์เวฟ สีดำ ทะเบียน สกลนคร"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 block mb-1">ผู้แจ้งเบาะแส</label>
              <div className="flex items-center space-x-2">
                <label className="inline-flex items-center space-x-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <span>ไม่ประสงค์ออกนาม (รักษาความลับ)</span>
                </label>
              </div>
              {!isAnonymous && (
                <input
                  type="text"
                  value={informantContact}
                  onChange={(e) => setInformantContact(e.target.value)}
                  placeholder="เบอร์โทรศัพท์ผู้แจ้ง"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 mt-1 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              id="btn-submit-add-tip"
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-colors"
            >
              บันทึกข้อมูลรายบุคคล
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
