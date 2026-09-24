import { TipRecord } from '../types';

export const THAT_THONG_VILLAGES = [
  'หมู่ 1 บ้านธาตุทอง',
  'หมู่ 2 บ้านธาตุทองน้อย',
  'หมู่ 3 บ้านสร้างแก้ว',
  'หมู่ 4 บ้านคำสะอาด',
  'หมู่ 5 บ้านดอนยานาง',
  'หมู่ 6 บ้านหนองแฝก',
  'หมู่ 7 บ้านหนองดินดำ',
  'หมู่ 8 บ้านโนนสะอาด',
];

export const INITIAL_TIPS: TipRecord[] = [
  // --- กลุ่มผู้ค้ายาเสพติด (Dealers) ---
  {
    id: 'tip-dealer-001',
    source: 'manual',
    category: 'dealer',
    fullName: 'นายสมชาย คำแสง',
    alias: 'เอก ลายพราง (ซอย 8)',
    age: 34,
    gender: 'ชาย',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces',
    address: {
      houseNo: '45/2',
      villageNo: 'หมู่ 1 บ้านธาตุทอง',
      subdistrict: 'ธาตุทอง',
      district: 'สว่างแดนดิน',
      province: 'สกลนคร',
      landmark: 'ร้านปะยางท้ายซอยติดวัดธาตุทอง',
      coordinates: { lat: 17.4721, lng: 103.4568 }
    },
    drugTypes: ['ยาบ้า', 'ไอซ์'],
    behaviorDetails: 'เปิดร้านซ่อมปะยางบังหน้า มีกลุ่มวัยรุ่นขี่รถจักรยานยนต์วนเวียนมารับของช่วงเวลา 21.00 - 02.00 น. ซุกซ่อนยาบ้าไว้ในยางรถเก่าข้างร้าน',
    vehicleInfo: 'ฮอนด้า เวฟ 125 สีดำ-แดง ทะเบียน 1กข-4891 สกลนคร',
    frequency: 'กระจายของช่วงหัวค่ำและดึกทุกวัน',
    reportedAt: '2026-09-20T14:30:00Z',
    isAnonymous: true,
    status: 'investigating',
    urgency: 'high',
    assignedUnit: 'ชุดปฏิบัติการปราบปรามยาเสพติด สภ.สว่างแดนดิน',
    actionLog: [
      { date: '2026-09-20 14:30', action: 'รับแจ้งเบาะแสผ่านระบบ', by: 'เจ้าหน้าที่รับเรื่อง ต.ธาตุทอง' },
      { date: '2026-09-21 10:00', action: 'ประสานสายสืบ สภ.สว่างแดนดิน ลงพื้นที่เฝ้าจุดสังเกตการณ์', by: 'ร.ต.อ. ประสิทธิ์' }
    ]
  },
  {
    // Repeat report for นายสมชาย คำแสง (ถูกแจ้งครั้งที่ 2)
    id: 'tip-dealer-001-rpt2',
    source: 'google_form',
    formResponseId: 'resp-gform-8820',
    category: 'dealer',
    fullName: 'นายสมชาย คำแสง',
    alias: 'เอก ลายพราง (ซอย 8)',
    age: 34,
    gender: 'ชาย',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces',
    address: {
      houseNo: '45/2',
      villageNo: 'หมู่ 1 บ้านธาตุทอง',
      subdistrict: 'ธาตุทอง',
      district: 'สว่างแดนดิน',
      province: 'สกลนคร',
      landmark: 'ใกล้สะพานข้ามห้วยทางเข้าบ้านธาตุทอง',
      coordinates: { lat: 17.4725, lng: 103.4572 }
    },
    drugTypes: ['ยาบ้า'],
    behaviorDetails: 'ชาวบ้านแจ้งเพิ่มเติมว่านำยาบ้ามาส่งให้วัยรุ่นบริเวณศาลากลางหมู่บ้านช่วงหัวค่ำ สร้างความเดือดร้อนให้ชาวบ้านในพื้นที่เป็นอย่างมาก',
    vehicleInfo: 'ฮอนด้า เวฟ สีดำ-แดง คันเดิม',
    frequency: 'ทุกเย็นหลัง 18.00 น.',
    reportedAt: '2026-09-22T08:15:00Z',
    isAnonymous: true,
    status: 'investigating',
    urgency: 'critical',
    assignedUnit: 'ฝ่ายความมั่นคง อำเภอสว่างแดนดิน ร่วมกับ สภ.สว่างแดนดิน',
    actionLog: [
      { date: '2026-09-22 08:15', action: 'ได้รับแจ้งซ้ำผ่าน Google Form ส่งข้อมูลเชื่อมโยงแฟ้มสืบสวนเดิม', by: 'เจ้าหน้าที่คัดกรอง' }
    ]
  },
  {
    // Repeat report for นายสมชาย คำแสง (ถูกแจ้งครั้งที่ 3)
    id: 'tip-dealer-001-rpt3',
    source: 'manual',
    category: 'dealer',
    fullName: 'นายสมชาย คำแสง',
    alias: 'เอก ลายพราง (ซอย 8)',
    age: 34,
    gender: 'ชาย',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=faces',
    address: {
      villageNo: 'หมู่ 1 บ้านธาตุทอง',
      subdistrict: 'ธาตุทอง',
      district: 'สว่างแดนดิน',
      province: 'สกลนคร',
      landmark: 'บริเวณกระท่อมนาท้ายหมู่บ้านธาตุทอง',
    },
    drugTypes: ['ยาบ้า', 'ไอซ์'],
    behaviorDetails: 'ผู้ใหญ่บ้านแจ้งเบาะแสว่านายสมชายย้ายจุดนัดส่งของไปไว้ที่กระท่อมนาท้ายบ้านธาตุทองเพื่อหลบเลี่ยงการตรวจของเจ้าหน้าที่สายตรวจ',
    reportedAt: '2026-09-22T16:00:00Z',
    isAnonymous: false,
    informantContact: 'ผู้ใหญ่บ้าน ม.1 (089-572-xxxx)',
    status: 'investigating',
    urgency: 'critical',
    assignedUnit: 'ชุด ชรบ. ตำบลธาตุทอง และ สภ.สว่างแดนดิน'
  },
  {
    id: 'tip-dealer-002',
    source: 'google_form',
    formResponseId: 'resp-gform-8821',
    category: 'dealer',
    fullName: 'นายวิทวัส รุ่งโรจน์',
    alias: 'เดช หนองแฝก',
    age: 29,
    gender: 'ชาย',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=faces',
    address: {
      houseNo: '78/1',
      villageNo: 'หมู่ 6 บ้านหนองแฝก',
      subdistrict: 'ธาตุทอง',
      district: 'สว่างแดนดิน',
      province: 'สกลนคร',
      landmark: 'บ้านไม้สองชั้นริมสระน้ำหนองแฝก ทางไปบ้านสร้างแก้ว',
      coordinates: { lat: 17.4812, lng: 103.4691 }
    },
    drugTypes: ['ยาบ้า', 'กัญชา/น้ำกระท่อมผิดกฎหมาย'],
    behaviorDetails: 'เป็นเอเย่นต์จำหน่ายยาบ้าให้กับวัยรุ่นต่างหมู่บ้านในเขตตำบลธาตุทองและตำบลใกล้เคียง มักใช้โทรศัพท์นัดหมายแล้วโยนของตามโคนเสาไฟฟ้า',
    vehicleInfo: 'รถกระบะอีซูซุ ดีแมกซ์ สีบรอนซ์เงิน ทะเบียน บง-7741 สกลนคร',
    reportedAt: '2026-09-21T09:15:00Z',
    isAnonymous: false,
    informantContact: '089-112-xxxx (ขอปกปิดชื่อ)',
    status: 'pending',
    urgency: 'high',
    assignedUnit: 'ฝ่ายปกครอง อ.สว่างแดนดิน'
  },
  {
    id: 'tip-dealer-003',
    source: 'manual',
    category: 'dealer',
    fullName: 'นางสาวสายใจ พุ่มแก้ว',
    alias: 'เจ๊ใจ ตลาดนัดสร้างแก้ว',
    age: 42,
    gender: 'หญิง',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop&crop=faces',
    address: {
      houseNo: '12/4',
      villageNo: 'หมู่ 3 บ้านสร้างแก้ว',
      subdistrict: 'ธาตุทอง',
      district: 'สว่างแดนดิน',
      province: 'สกลนคร',
      landmark: 'แผงขายของชำตรงข้ามศาลากลางหมู่บ้านสร้างแก้ว',
      coordinates: { lat: 17.4654, lng: 103.4810 }
    },
    drugTypes: ['ยาบ้า'],
    behaviorDetails: 'ซุกซ่อนยาบ้าไว้ใต้ชั้นสินค้าในร้านขายของชำ ลักลอบจำหน่ายให้ผู้ใช้แรงงานและวัยรุ่น บรรจุในหลอดกาแฟสีชมพู',
    reportedAt: '2026-09-18T16:00:00Z',
    isAnonymous: true,
    status: 'action_taken',
    urgency: 'high',
    assignedUnit: 'สภ.สว่างแดนดิน',
    actionLog: [
      { date: '2026-09-18 16:00', action: 'รับแจ้งเบาะแสจากชาวบ้าน', by: 'จนท. ต.ธาตุทอง' },
      { date: '2026-09-19 13:45', action: 'นำกำลังตรวจค้นพร้อมฝ่ายปกครองสว่างแดนดิน พบยาบ้า 240 เม็ด ดำเนินคดีตามกฎหมายแล้ว', by: 'พ.ต.ท. วิชัย' }
    ]
  },

  // --- กลุ่มผู้เสพยาเสพติด (Users) ---
  {
    id: 'tip-user-001',
    source: 'google_form',
    formResponseId: 'resp-gform-8822',
    category: 'user',
    fullName: 'นายกิตติ เกษมสุข',
    alias: 'มาร์ค คำสะอาด',
    age: 23,
    gender: 'ชาย',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=faces',
    address: {
      houseNo: '54/2',
      villageNo: 'หมู่ 4 บ้านคำสะอาด',
      subdistrict: 'ธาตุทอง',
      district: 'สว่างแดนดิน',
      province: 'สกลนคร',
      landmark: 'กระท่อมริมคันนา ใกล้คลองส่งน้ำบ้านคำสะอาด',
      coordinates: { lat: 17.4765, lng: 103.4623 }
    },
    drugTypes: ['ยาบ้า'],
    behaviorDetails: 'มักชวนเพื่อนวัยรุ่นมามั่วสุมเสพยาบ้าช่วงบ่ายและกลางคืน ส่งเสียงดัง ขี่รถจักรยานยนต์ดัดแปลงท่อเสียงดังรบกวนชาวบ้าน มีพฤติกรรมก้าวร้าวกับคนในบ้าน',
    frequency: 'เสพประจำวันละ 2-3 เม็ด',
    reportedAt: '2026-09-21T18:40:00Z',
    isAnonymous: true,
    status: 'investigating',
    urgency: 'medium',
    assignedUnit: 'ฝ่ายปกครอง ต.ธาตุทอง ร่วมกับชุด รพ.สต.ธาตุทอง'
  },
  {
    // Repeat report for นายกิตติ เกษมสุข (ถูกแจ้งครั้งที่ 2)
    id: 'tip-user-001-rpt2',
    source: 'manual',
    category: 'user',
    fullName: 'นายกิตติ เกษมสุข',
    alias: 'มาร์ค คำสะอาด',
    age: 23,
    gender: 'ชาย',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=faces',
    address: {
      houseNo: '54/2',
      villageNo: 'หมู่ 4 บ้านคำสะอาด',
      subdistrict: 'ธาตุทอง',
      district: 'สว่างแดนดิน',
      province: 'สกลนคร',
      landmark: 'บ้านพักเดิมในหมู่ 4 บ้านคำสะอาด',
    },
    drugTypes: ['ยาบ้า'],
    behaviorDetails: 'ญาติแจ้งเพิ่มเติมว่ามีอาการประสาทหลอน หวาดระแวง กลัวคนมาทำร้าย ขว้างปาสิ่งของในบ้าน ขอให้เจ้าหน้าที่เข้าช่วยนำตัวไปบำบัดรักษาด่วน',
    reportedAt: '2026-09-22T14:20:00Z',
    isAnonymous: false,
    informantContact: 'บิดา (084-332-xxxx)',
    status: 'rehab_referred',
    urgency: 'high',
    assignedUnit: 'ทีมบำบัด รพ.สต.ธาตุทอง และ รพ.สมเด็จพระยุพราชสว่างแดนดิน',
    actionLog: [
      { date: '2026-09-22 14:20', action: 'รับแจ้งขอความช่วยเหลือจากครอบครัว มีอาการก้าวร้าว', by: 'พยาบาล รพ.สต.ธาตุทอง' },
      { date: '2026-09-22 15:30', action: 'ลงพื้นที่พูดคุยประเมินอาการเพื่อส่งต่อไป รพ.สมเด็จพระยุพราชสว่างแดนดิน', by: 'จนท. สหวิชาชีพ' }
    ]
  },
  {
    id: 'tip-user-002',
    source: 'manual',
    category: 'user',
    fullName: 'นายอนุพงศ์ ชัยชนะ',
    alias: 'โอเล่ ดอนยานาง',
    age: 27,
    gender: 'ชาย',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&h=300&fit=crop&crop=faces',
    address: {
      houseNo: '33',
      villageNo: 'หมู่ 5 บ้านดอนยานาง',
      subdistrict: 'ธาตุทอง',
      district: 'สว่างแดนดิน',
      province: 'สกลนคร',
      landmark: 'ซอยโรงสีเก่าบ้านดอนยานาง',
      coordinates: { lat: 17.4891, lng: 103.4735 }
    },
    drugTypes: ['ยาบ้า', 'กัญชา/น้ำกระท่อมผิดกฎหมาย'],
    behaviorDetails: 'ครอบครัวแจ้งว่ามีอาการหวาดระแวง ไม่ยอมนอน เดินรอบหมู่บ้านเวลากลางคืน เกรงว่าจะก่อเหตุร้ายในชุมชน',
    reportedAt: '2026-09-19T11:20:00Z',
    isAnonymous: false,
    informantContact: 'มารดา 081-445-xxxx',
    status: 'pending',
    urgency: 'high',
    assignedUnit: 'ทีมสุขภาพจิต รพ.สต.ธาตุทอง ร่วมกับผู้ช่วยผู้ใหญ่บ้าน'
  },
  {
    id: 'tip-user-003',
    source: 'manual',
    category: 'user',
    fullName: 'นายศุภชัย ทวีผล',
    alias: 'บาส โนนสะอาด',
    age: 28,
    gender: 'ชาย',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=faces',
    address: {
      villageNo: 'หมู่ 8 บ้านโนนสะอาด',
      subdistrict: 'ธาตุทอง',
      district: 'สว่างแดนดิน',
      province: 'สกลนคร',
      landmark: 'เพิงพักร้างข้างหนองน้ำบ้านโนนสะอาด',
      coordinates: { lat: 17.4942, lng: 103.4880 }
    },
    drugTypes: ['ยาบ้า', 'สารระเหย (Inhalants)'],
    behaviorDetails: 'อาศัยหลับนอนตามเพิงร้าง ดมสารระเหยและเสพยาบ้า บางครั้งเดินขอเงินชาวบ้านในตลาดนัด',
    reportedAt: '2026-09-17T08:50:00Z',
    isAnonymous: true,
    status: 'closed',
    urgency: 'medium',
    assignedUnit: 'ฝ่ายสวัสดิการสังคม อบต.ธาตุทอง ร่วมกับฝ่ายปกครอง',
    actionLog: [
      { date: '2026-09-17 08:50', action: 'รับแจ้งเบาะแส', by: 'จนท. รับเรื่อง' },
      { date: '2026-09-18 15:00', action: 'นำตัวเข้าสู่กระบวนการคัดกรองและส่งต่อครอบครัวพร้อมประสานบำบัด', by: 'นักสังคมสงเคราะห์' }
    ]
  },

  // --- กลุ่มผู้ต้องการเลิกยาเสพติด / ขอรับการบำบัดรักษา (Rehab Seekers) ---
  {
    id: 'tip-rehab-001',
    source: 'google_form',
    formResponseId: 'resp-gform-8823',
    category: 'rehab',
    fullName: 'นายธนากร รัตนประเสริฐ',
    alias: 'บอล ธาตุทองน้อย',
    age: 22,
    gender: 'ชาย',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&h=300&fit=crop&crop=faces',
    address: {
      houseNo: '109/2',
      villageNo: 'หมู่ 2 บ้านธาตุทองน้อย',
      subdistrict: 'ธาตุทอง',
      district: 'สว่างแดนดิน',
      province: 'สกลนคร',
      landmark: 'เยื้องวัดบ้านธาตุทองน้อย',
      coordinates: { lat: 17.4740, lng: 103.4610 }
    },
    drugTypes: ['ยาบ้า'],
    behaviorDetails: 'ผู้เสพและมารดากรอกฟอร์มขอรับการบำบัดด้วยความสมัครใจ ยอมรับว่าหลงผิดติดยาบ้ามา 1 ปี ต้องการเลิกเพื่อกลับไปช่วยครอบครัวทำนาและดูแลพ่อแม่',
    reportedAt: '2026-09-21T20:10:00Z',
    isAnonymous: false,
    informantContact: '095-883-xxxx (เบอร์คุณแม่)',
    status: 'rehab_referred',
    urgency: 'high',
    assignedUnit: 'ศูนย์คัดกรองผู้ป่วยยาเสพติด รพ.สต.ธาตุทอง',
    actionLog: [
      { date: '2026-09-21 20:10', action: 'ส่งข้อมูลผ่านระบบสมัครใจบำบัด', by: 'ผู้ป่วยและครอบครัว' },
      { date: '2026-09-22 09:30', action: 'เจ้าหน้าที่สาธารณสุขโทรนัดหมายตรวจสุขภาพและประเมิน CBTx', by: 'พยาบาลวิชาชีพ รพ.สต.ธาตุทอง' }
    ]
  },
  {
    id: 'tip-rehab-002',
    source: 'google_form',
    formResponseId: 'resp-gform-8824',
    category: 'rehab',
    fullName: 'นางสาวปวีณา สุริยันต์',
    alias: 'แนน ดินดำ',
    age: 26,
    gender: 'หญิง',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&crop=faces',
    address: {
      houseNo: '72/1',
      villageNo: 'หมู่ 7 บ้านหนองดินดำ',
      subdistrict: 'ธาตุทอง',
      district: 'สว่างแดนดิน',
      province: 'สกลนคร',
      landmark: 'ใกล้โรงเรียนบ้านหนองดินดำ',
      coordinates: { lat: 17.4870, lng: 103.4912 }
    },
    drugTypes: ['ยาบ้า', 'ยาไอซ์ (Crystal Meth)'],
    behaviorDetails: 'เคยทำงานต่างถิ่นและติดยา มีอาการซึมเศร้า วิตกกังวล สมัครใจเข้ารับการฟื้นฟูโดยชุมชนเป็นฐาน (CBTx) ในตำบลธาตุทอง',
    reportedAt: '2026-09-20T11:45:00Z',
    isAnonymous: false,
    informantContact: '082-991-xxxx',
    status: 'rehab_referred',
    urgency: 'medium',
    assignedUnit: 'คลินิกฟ้าใส รพ.สมเด็จพระยุพราชสว่างแดนดิน'
  },
  {
    id: 'tip-rehab-003',
    source: 'manual',
    category: 'rehab',
    fullName: 'นายชานนท์ มั่นคง',
    alias: 'นนท์ สร้างแก้ว',
    age: 31,
    gender: 'ชาย',
    photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&h=300&fit=crop&crop=faces',
    address: {
      houseNo: '14/5',
      villageNo: 'หมู่ 3 บ้านสร้างแก้ว',
      subdistrict: 'ธาตุทอง',
      district: 'สว่างแดนดิน',
      province: 'สกลนคร',
      landmark: 'ตรงข้ามศูนย์เรียนรู้ชุมชนบ้านสร้างแก้ว',
      coordinates: { lat: 17.4660, lng: 103.4825 }
    },
    drugTypes: ['ยาบ้า'],
    behaviorDetails: 'เคยเสพยาบ้ามากว่า 3 ปี สมัครใจเข้าบำบัด ณ ศูนย์มินิธัญญารักษ์ และฟื้นฟูโดยชุมชนเป็นฐาน (CBTx) ตำบลธาตุทอง ครบกำหนด 90 วัน ปัจจุบันประกอบอาชีพเกษตรกรรมสุจริต',
    reportedAt: '2026-08-15T10:00:00Z',
    isAnonymous: false,
    informantContact: '086-778-xxxx',
    status: 'rehab_completed',
    urgency: 'low',
    assignedUnit: 'รพ.สต.ธาตุทอง ร่วมกับ อสม. ประจำหมู่บ้านสร้างแก้ว',
    actionLog: [
      { date: '2026-08-15 10:00', action: 'เริ่มเข้าสู่กระบวนการบำบัด CBTx', by: 'ทีมสหวิชาชีพ ต.ธาตุทอง' },
      { date: '2026-09-15 14:00', action: 'ประเมินผลผ่านเกณฑ์ฟื้นฟูสำเร็จ ปัสสาวะไม่พบสารเสพติด 3 เดือนต่อเนื่อง', by: 'แพทย์เวชศาสตร์ครอบครัว' }
    ]
  }
];

export const DRUG_OPTIONS = [
  'ยาบ้า (Methamphetamine)',
  'ยาไอซ์ (Crystal Meth)',
  'เคตามีน (Ketamine)',
  'เฮโรอีน (Heroin)',
  'ยาอี (Ecstasy)',
  'แฮปปี้วอเตอร์ (Happy Water)',
  'กัญชา/น้ำกระท่อมผิดกฎหมาย',
  'สารระเหย (Inhalants)',
  'ยาเสพติดชนิดอื่น'
];

export const STATUS_LABELS: Record<string, { label: string; color: string; bg: string; border: string }> = {
  pending: {
    label: 'รอดำเนินการตรวจสอบ',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200'
  },
  investigating: {
    label: 'กำลังสืบสวน/ลงพื้นที่',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  action_taken: {
    label: 'จับกุม/ดำเนินคดีแล้ว',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200'
  },
  rehab_referred: {
    label: 'ส่งต่อสถานบำบัดฟื้นฟู',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200'
  },
  rehab_completed: {
    label: 'บำบัดฟื้นฟูสำเร็จ',
    color: 'text-teal-700',
    bg: 'bg-teal-50',
    border: 'border-teal-200'
  },
  closed: {
    label: 'ปิดเรื่อง/ยุติเรื่อง',
    color: 'text-slate-600',
    bg: 'bg-slate-100',
    border: 'border-slate-200'
  }
};

export const CATEGORY_CONFIG = {
  dealer: {
    key: 'dealer',
    label: 'ผู้ค้ายาเสพติด',
    shortLabel: 'ผู้ค้า',
    description: 'ผู้ผลิต ลักลอบจำหน่าย กระจาย หรือเอเย่นต์ยาเสพติดในพื้นที่',
    badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
    accentColor: '#e11d48',
    cardBorder: 'border-rose-200 hover:border-rose-400',
    iconColor: 'text-rose-600',
    headerBg: 'bg-rose-600 text-white'
  },
  user: {
    key: 'user',
    label: 'ผู้เสพยาเสพติด',
    shortLabel: 'ผู้เสพ',
    description: 'ผู้มีพฤติกรรมเสพหรือมั่วสุมยาเสพติด สร้างความเดือดร้อนหรือมีอาการผิดปกติ',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    accentColor: '#d97706',
    cardBorder: 'border-amber-200 hover:border-amber-400',
    iconColor: 'text-amber-600',
    headerBg: 'bg-amber-600 text-white'
  },
  rehab: {
    key: 'rehab',
    label: 'ผู้ต้องการเลิกยาเสพติด',
    shortLabel: 'ผู้ต้องการเลิกยา',
    description: 'ผู้ติดยาเสพติดหรือญาติที่สมัครใจประสงค์ขอรับการบำบัดรักษาและฟื้นฟูสภาพ',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    accentColor: '#059669',
    cardBorder: 'border-emerald-200 hover:border-emerald-400',
    iconColor: 'text-emerald-600',
    headerBg: 'bg-emerald-600 text-white'
  }
};
