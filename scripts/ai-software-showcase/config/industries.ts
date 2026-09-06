/** Reusable industry terminology & KPI context for AI prompts. */

export type IndustryContext = {
  id: string;
  label: string;
  entities: string[];
  units: string[];
  roles: string[];
  kpiTypes: string[];
  sampleRows: string[];
};

export const INDUSTRY_CONTEXTS: Record<string, IndustryContext> = {
  ecommerce: {
    id: 'ecommerce',
    label: 'E-commerce',
    entities: ['SKU', 'Order', 'Courier', 'COD', 'Variant', 'Consignment'],
    units: ['BDT', 'pcs', 'orders'],
    roles: ['Store owner', 'Ops lead', 'Warehouse'],
    kpiTypes: ['GMV', 'Orders today', 'Pending shipments', 'COD due'],
    sampleRows: ['ORD-10482', 'Pathao', 'Steadfast', 'SKU-TEE-BLK-M'],
  },
  garments: {
    id: 'garments',
    label: 'Garments',
    entities: ['Buyer', 'Style', 'PO', 'Cutting', 'Sewing', 'LC', 'T&A'],
    units: ['pcs', 'dozen', 'CM', 'BDT'],
    roles: ['Merchandiser', 'Production manager', 'Commercial'],
    kpiTypes: ['Open styles', 'Line output', 'On-time shipment %'],
    sampleRows: ['Style GM-2401', 'Buyer H&M', 'LC BD-8891'],
  },
  accounting: {
    id: 'accounting',
    label: 'Accounting',
    entities: ['COA', 'Voucher', 'Ledger', 'AR', 'AP', 'Bank'],
    units: ['BDT'],
    roles: ['Accountant', 'CFO'],
    kpiTypes: ['Cash', 'Bank', 'AR outstanding', 'AP outstanding'],
    sampleRows: ['JV-24091', 'Cash-in-hand', 'City Bank CA'],
  },
  hotel: {
    id: 'hotel',
    label: 'Hotel',
    entities: ['Reservation', 'Room', 'Guest', 'Folio', 'Housekeeping'],
    units: ['rooms', 'BDT', 'nights'],
    roles: ['Front desk', 'Revenue manager'],
    kpiTypes: ['Occupancy %', 'ADR', 'Arrivals', 'Departures'],
    sampleRows: ['Room 412', 'Deluxe Twin', 'Arriving 14:00'],
  },
  gym: {
    id: 'gym',
    label: 'Gym',
    entities: ['Member', 'Membership', 'Check-in', 'Trainer', 'Plan'],
    units: ['BDT', 'visits'],
    roles: ['Front desk', 'Gym owner'],
    kpiTypes: ['Active members', 'Check-ins today', 'Due fees'],
    sampleRows: ['Gold Annual', 'PT Session', 'RFID check-in'],
  },
  feed_mill: {
    id: 'feed-mill',
    label: 'Feed Mill',
    entities: ['Maize', 'Soybean Meal', 'Batch', 'Formula', 'Dealer', 'MT'],
    units: ['MT', 'Bag', 'BDT'],
    roles: ['Mill manager', 'Production', 'Dealer sales'],
    kpiTypes: ['Batch output', 'Raw stock days', 'Dealer outstanding'],
    sampleRows: ['Formula Layer-18', 'Batch B-1024', 'Dealer Sylhet'],
  },
};

export function industryPromptBlock(industryId: string): string {
  const ctx = INDUSTRY_CONTEXTS[industryId] ?? {
    id: industryId,
    label: industryId,
    entities: [],
    units: ['BDT'],
    roles: ['Manager'],
    kpiTypes: ['KPI'],
    sampleRows: [],
  };
  return [
    `INDUSTRY CONTEXT (${ctx.label}):`,
    `Entities: ${ctx.entities.join(', ') || 'domain-specific'}.`,
    `Units: ${ctx.units.join(', ')}. Roles: ${ctx.roles.join(', ')}.`,
    `KPIs: ${ctx.kpiTypes.join(', ')}. Sample: ${ctx.sampleRows.join('; ') || 'realistic local data'}.`,
  ].join(' ');
}
