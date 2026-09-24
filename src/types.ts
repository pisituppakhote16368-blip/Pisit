/**
 * Types for Narcotics Tip and Case Management System
 */

export type TipCategory = 'dealer' | 'user' | 'rehab';

export type TipStatus = 
  | 'pending'           // รอดำเนินการตรวจสอบ
  | 'investigating'     // อยู่ระหว่างสืบสวน/ลงพื้นที่
  | 'action_taken'      // ดำเนินคดี/จับกุมแล้ว
  | 'rehab_referred'    // ส่งต่อสถานบำบัดฟื้นฟู
  | 'rehab_completed'   // บำบัดฟื้นฟูสำเร็จ
  | 'closed';           // ปิดเรื่อง

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export interface AddressInfo {
  houseNo?: string;
  villageNo?: string;
  subdistrict: string;
  district: string;
  province: string;
  landmark?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface TipRecord {
  id: string;
  source: 'google_form' | 'manual';
  formResponseId?: string;
  category: TipCategory;
  fullName: string;
  alias?: string;
  age?: number;
  gender?: 'ชาย' | 'หญิง' | 'ไม่ระบุ';
  photoUrl?: string;
  address: AddressInfo;
  drugTypes: string[];
  behaviorDetails: string;
  vehicleInfo?: string;
  frequency?: string;
  reportedAt: string;
  informantContact?: string;
  isAnonymous: boolean;
  status: TipStatus;
  urgency: UrgencyLevel;
  assignedUnit?: string;
  actionLog?: {
    date: string;
    action: string;
    by: string;
  }[];
}

export interface GoogleDriveFormItem {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface GoogleFormQuestion {
  questionId: string;
  title: string;
}

export interface GoogleFormResponseItem {
  responseId: string;
  createTime: string;
  lastSubmittedTime: string;
  answers: Record<string, {
    questionId: string;
    textAnswers?: {
      answers: { value: string }[];
    };
  }>;
}

export interface CategoryStat {
  dealer: number;
  user: number;
  rehab: number;
  total: number;
}
