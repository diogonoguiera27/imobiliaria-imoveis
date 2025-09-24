import { parsePhoneNumberFromString } from "libphonenumber-js";


export function formatPhone(phone?: string | null): string {
  if (!phone) return "-";

  const parsed = parsePhoneNumberFromString(phone, "BR");

  if (!parsed) return phone; 

  return parsed.formatNational(); 
}

export function formatPhoneInternational(phone?: string | null): string {
  if (!phone) return "-";

  const parsed = parsePhoneNumberFromString(phone, "BR");

  if (!parsed) return phone;

  return parsed.formatInternational(); 
}
