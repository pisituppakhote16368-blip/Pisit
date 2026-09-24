import { GoogleDriveFormItem, TipRecord, TipCategory, TipStatus, UrgencyLevel } from '../types';

/**
 * Fetch Google Forms list from Google Drive
 */
export async function listGoogleForms(accessToken: string): Promise<GoogleDriveFormItem[]> {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.form' and trashed=false");
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,modifiedTime,webViewLink)&orderBy=modifiedTime desc&pageSize=20`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch forms: ${response.statusText}`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Fetch details of a specific Google Form
 */
export async function getFormDetails(accessToken: string, formId: string) {
  const cleanId = extractFormId(formId);
  const url = `https://forms.googleapis.com/v1/forms/${cleanId}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to load form details: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch form responses
 */
export async function getFormResponses(accessToken: string, formId: string) {
  const cleanId = extractFormId(formId);
  const url = `https://forms.googleapis.com/v1/forms/${cleanId}/responses`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Failed to fetch responses: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Helper to extract Form ID from full Google Forms URL or raw ID
 */
export function extractFormId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  // Match forms.google.com/d/e/... or docs.google.com/forms/d/...
  const match = trimmed.match(/\/forms\/d\/(?:e\/)?([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

/**
 * Intelligent parser that converts Google Form responses into TipRecords
 */
export function parseResponsesToTips(formData: any, responsesData: any): TipRecord[] {
  if (!responsesData?.responses || !Array.isArray(responsesData.responses)) {
    return [];
  }

  // Build question dictionary from items
  const questionMap: Record<string, string> = {};
  if (formData?.items) {
    for (const item of formData.items) {
      if (item.questionItem?.question) {
        questionMap[item.questionItem.question.questionId] = item.title || '';
      }
      if (item.questionGroupItem?.questions) {
        for (const subQ of item.questionGroupItem.questions) {
          questionMap[subQ.questionId] = item.title || '';
        }
      }
    }
  }

  return responsesData.responses.map((resp: any, index: number) => {
    let category: TipCategory = 'user';
    let fullName = 'บุคคลตามรายงานเบาะแส';
    let alias = '';
    let behaviorDetails = 'มีพฤติการณ์ตามข้อมูลในแบบฟอร์มรับแจ้ง';
    let drugTypes: string[] = ['ยาบ้า'];
    let addressText = '';
    let vehicleInfo = '';
    let informantContact = '';
    let isAnonymous = true;
    let photoUrl = '';
    let urgency: UrgencyLevel = 'medium';

    if (resp.answers) {
      for (const [qId, ans] of Object.entries<any>(resp.answers)) {
        const title = (questionMap[qId] || '').toLowerCase();
        const textAnsList = ans.textAnswers?.answers || [];
        const answerVal = textAnsList.map((a: any) => a.value).join(', ');

        if (!answerVal) continue;

        // Detect Category
        if (title.includes('ประเภท') || title.includes('หัวข้อ') || title.includes('สถานะ') || title.includes('ผู้ค้า') || title.includes('ผู้เสพ')) {
          if (answerVal.includes('ค้า') || answerVal.includes('ขาย') || answerVal.includes('จำหน่าย') || answerVal.includes('dealer')) {
            category = 'dealer';
            urgency = 'high';
          } else if (answerVal.includes('เลิก') || answerVal.includes('บำบัด') || answerVal.includes('ฟื้นฟู') || answerVal.includes('rehab')) {
            category = 'rehab';
            urgency = 'medium';
          } else if (answerVal.includes('เสพ') || answerVal.includes('มั่วสุม') || answerVal.includes('user')) {
            category = 'user';
            urgency = 'medium';
          }
        }

        // Detect Name / Alias
        if (title.includes('ชื่อ') || title.includes('นามสกุล') || title.includes('ผู้ถูกแจ้ง') || title.includes('ฉายา')) {
          if (title.includes('ฉายา') || title.includes('ชื่อเล่น')) {
            alias = answerVal;
          } else if (!fullName || fullName === 'บุคคลตามรายงานเบาะแส') {
            fullName = answerVal;
          }
        }

        // Detect Drugs
        if (title.includes('ยา') || title.includes('สารเสพติด') || title.includes('ประเภทของกลาง')) {
          const rawDrugs = answerVal.split(/[,/\n]/).map((d: string) => d.trim()).filter(Boolean);
          if (rawDrugs.length > 0) {
            drugTypes = rawDrugs;
          }
        }

        // Detect Address / Location
        if (title.includes('ที่อยู่') || title.includes('สถานที่') || title.includes('พิกัด') || title.includes('ตำบล') || title.includes('อำเภอ') || title.includes('จุดสังเกต')) {
          addressText += (addressText ? ' ' : '') + answerVal;
        }

        // Detect Behavior
        if (title.includes('พฤติการณ์') || title.includes('รายละเอียด') || title.includes('ข้อมูลเพิ่มเติม') || title.includes('เหตุการณ์')) {
          behaviorDetails = answerVal;
        }

        // Detect Vehicle
        if (title.includes('ยานพาหนะ') || title.includes('รถ') || title.includes('ทะเบียน')) {
          vehicleInfo = answerVal;
        }

        // Detect Photos / Attachments
        if (title.includes('รูป') || title.includes('ภาพ') || title.includes('photo') || title.includes('image')) {
          if (answerVal.startsWith('http')) {
            photoUrl = answerVal;
          }
        }

        // Detect Informant Contact
        if (title.includes('ผู้แจ้ง') || title.includes('เบอร์โทร') || title.includes('ติดต่อ')) {
          informantContact = answerVal;
          if (answerVal && !answerVal.includes('ไม่ประสงค์')) {
            isAnonymous = false;
          }
        }
      }
    }

    // Default status
    const status: TipStatus = category === 'rehab' ? 'rehab_referred' : 'pending';

    return {
      id: `gf-${resp.responseId || index + 1}`,
      source: 'google_form',
      formResponseId: resp.responseId,
      category,
      fullName: fullName || `ผู้ถูกแจ้งเบาะแส #${index + 1}`,
      alias: alias || undefined,
      gender: 'ไม่ระบุ',
      photoUrl: photoUrl || undefined,
      address: {
        subdistrict: extractSubdistrict(addressText) || 'ธาตุทอง',
        district: extractDistrict(addressText) || 'สว่างแดนดิน',
        province: extractProvince(addressText) || 'สกลนคร',
        landmark: addressText || 'จุดที่ระบุในแบบฟอร์มกูเกิ้ล',
      },
      drugTypes: drugTypes.length > 0 ? drugTypes : ['ยาบ้า'],
      behaviorDetails: behaviorDetails || 'ข้อมูลได้รับแจ้งผ่าน Google Form',
      vehicleInfo: vehicleInfo || undefined,
      reportedAt: resp.createTime || new Date().toISOString(),
      informantContact: informantContact || undefined,
      isAnonymous,
      status,
      urgency,
      assignedUnit: 'ศูนย์ปฏิบัติการร่วมปราบปรามและบำบัดฟื้นฟู ต.ธาตุทอง อ.สว่างแดนดิน',
    };
  });
}

function extractSubdistrict(text: string): string {
  const match = text.match(/(?:ต\.|ตำบล)\s*([^\s,]+)/);
  return match ? match[1] : '';
}

function extractDistrict(text: string): string {
  const match = text.match(/(?:อ\.|อำเภอ)\s*([^\s,]+)/);
  return match ? match[1] : '';
}

function extractProvince(text: string): string {
  const match = text.match(/(?:จ\.|จังหวัด)\s*([^\s,]+)/);
  return match ? match[1] : '';
}
