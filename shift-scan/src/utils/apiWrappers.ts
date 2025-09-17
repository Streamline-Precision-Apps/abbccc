/**
 * API wrapper functions for common Shift Scan endpoints with offline support
 */

import { apiGet, executeOrQueueAction, fetchWithOfflineCache } from './offlineApi';

// Interface definitions for API data types
interface JobSiteData extends Record<string, unknown> {
  id?: string;
  qrId?: string;
  code?: string;
  name?: string;
  description?: string;
  comment?: string;
  streetNumber?: string;
  streetName?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  isActive?: boolean;
  latitude?: number;
  longitude?: number;
  radiusMeters?: number;
}

interface CostCodeData extends Record<string, unknown> {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  comment?: string;
  isActive?: boolean;
}

interface TruckData extends Record<string, unknown> {
  id?: string;
  qrId?: string;
  name?: string;
  description?: string;
  equipmentTag?: string;
  make?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  vin?: string;
  currentWeight?: number;
  mileage?: number;
}

interface FormSubmissionData extends Record<string, unknown> {
  formId?: string;
  employeeId?: string;
  responses?: Record<string, unknown>;
  signature?: string;
  submissionDate?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
}

interface ClockData extends Record<string, unknown> {
  userId?: string;
  date?: string;
  jobsiteId?: string;
  costcode?: string;
  startTime?: string;
  endTime?: string;
  workType?: string;
  equipment?: string;
  comment?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  withinFence?: boolean;
  materialType?: string;
  laborType?: string;
  shiftType?: string;
}

interface UserSettings extends Record<string, unknown> {
  id?: string;
  employeeId?: string;
  notifications?: boolean;
  language?: string;
  theme?: string;
  autoClockOut?: boolean;
  gpsTracking?: boolean;
  biometricAuth?: boolean;
}

// Equipment APIs
export const equipmentApi = {
  getAll: () => apiGet('/api/getEquipment', { cacheKey: 'equipment-all' }),
  
  getList: () => apiGet('/api/getEquipmentList', { cacheKey: 'equipment-list' }),
  
  getAllWithIds: () => apiGet('/api/getAllEquipmentIdAndQrId', { cacheKey: 'equipment-ids' }),
  
  getByQrId: (qrId: string) => apiGet(`/api/getEquipmentbyQrId/${qrId}`, { 
    cacheKey: `equipment-qr-${qrId}` 
  }),
  
  getLastMileage: (equipmentId: string) => apiGet(`/api/equipment/${equipmentId}/lastMileage`, {
    cacheKey: `equipment-mileage-${equipmentId}`
  }),
  
  setEquipment: (equipmentId: string) => executeOrQueueAction(
    '/api/setEquipment', 
    'POST', 
    { equipmentId }
  ),
};

// Job Site APIs
export const jobSiteApi = {
  getAll: () => apiGet('/api/getJobsites', { cacheKey: 'jobsites-all' }),
  
  getDetails: (jobSiteId: string) => apiGet(`/api/jobsites/${jobSiteId}`, {
    cacheKey: `jobsite-${jobSiteId}`
  }),
  
  getRecent: () => apiGet('/api/getRecentJobsites', { cacheKey: 'jobsites-recent' }),
  
  setJobSite: (jobSiteData: JobSiteData) => executeOrQueueAction(
    '/api/setJobSite',
    'POST',
    jobSiteData
  ),
};

// Cost Code APIs
export const costCodeApi = {
  getAll: () => apiGet('/api/getCostCodes', { cacheKey: 'costcodes-all' }),
  
  getRecent: () => apiGet('/api/getRecentCostCodes', { cacheKey: 'costcodes-recent' }),
  
  setCostCode: (costCodeData: CostCodeData) => executeOrQueueAction(
    '/api/setCostCode',
    'POST',
    costCodeData
  ),
};

// Time Sheet APIs
export const timeSheetApi = {
  getRecent: () => apiGet('/api/getRecentTimecard', { cacheKey: 'timesheet-recent' }),
  
  getRecentReturn: () => apiGet('/api/getRecentTimecardReturn', { 
    cacheKey: 'timesheet-recent-return' 
  }),
  
  getTodaysTimesheets: () => apiGet('/api/getTodaysTimesheets', { 
    cacheKey: 'timesheets-today' 
  }),
  
  getByDate: (date: string) => apiGet(`/api/getTimesheetsByDate?date=${date}`, {
    cacheKey: `timesheets-${date}`
  }),
  
  getById: (employeeId: string, timesheetId: string) => apiGet(
    `/api/getTimesheetById/${employeeId}?id=${timesheetId}`,
    { cacheKey: `timesheet-${employeeId}-${timesheetId}` }
  ),
  
  getPayPeriod: () => apiGet('/api/getPayPeriodTimeSheets', { 
    cacheKey: 'timesheets-payperiod' 
  }),
  
  getBannerData: (id: string) => apiGet(`/api/getBannerData?id=${id}`, {
    cacheKey: `banner-${id}`
  }),
};

// Trucking APIs
export const truckingApi = {
  getTruckData: () => apiGet('/api/getTruckData', { cacheKey: 'truck-data' }),
  
  getTruckingLogs: (timeSheetId: string) => apiGet(
    `/api/getTruckingLogs/equipmentId/${timeSheetId}`,
    { cacheKey: `trucking-logs-${timeSheetId}` }
  ),
  
  getTruckingLogDetails: (truckingLogId: string) => apiGet(
    `/api/truckingLogDetails/${truckingLogId}`,
    { cacheKey: `trucking-details-${truckingLogId}` }
  ),
  
  setTruck: (truckData: TruckData) => executeOrQueueAction(
    '/api/setTruck',
    'POST',
    truckData
  ),
  
  setStartingMileage: (mileage: string) => executeOrQueueAction(
    '/api/setStartingMileage',
    'POST',
    { mileage }
  ),
};

// Tasco APIs
export const tascoApi = {
  getTascoLog: (tascoId: string) => apiGet(`/api/getTascoLog/${tascoId}`, {
    cacheKey: `tasco-log-${tascoId}`
  }),
};

// User APIs
export const userApi = {
  getUserInfo: (employeeId: string) => apiGet(`/api/getUserInfo/${employeeId}`, {
    cacheKey: `user-info-${employeeId}`
  }),
  
  getUserImage: () => apiGet('/api/getUserImage', { cacheKey: 'user-image' }),
  
  getMyTeamsUsers: () => apiGet('/api/getMyTeamsUsers', { cacheKey: 'team-users' }),
  
  getAllEmployees: () => apiGet('/api/getAllEmployees?filter=all', { 
    cacheKey: 'employees-all' 
  }),
  
  getAllCrews: () => apiGet('/api/getAllCrews', { cacheKey: 'crews-all' }),
  
  setWorkRole: (role: string) => executeOrQueueAction(
    '/api/setWorkRole',
    'POST',
    { role }
  ),
};

// Cookie APIs
export const cookieApi = {
  get: (name: string) => apiGet(`/api/cookies?method=get&name=${name}`, {
    cacheKey: `cookie-${name}`
  }),
  
  set: (name: string, value: string) => executeOrQueueAction(
    '/api/cookies',
    'POST',
    { method: 'set', name, value }
  ),
};

// Forms APIs
export const formsApi = {
  getComment: () => apiGet('/api/getComment', { cacheKey: 'form-comment' }),
  
  submitForm: (formData: FormSubmissionData) => executeOrQueueAction(
    '/api/submitForm',
    'POST',
    formData
  ),
};

// Clock APIs
export const clockApi = {
  getLogs: () => apiGet('/api/getLogs', { cacheKey: 'clock-logs' }),
  
  clockoutDetails: () => apiGet('/api/clockoutDetails', { cacheKey: 'clockout-details' }),
  
  clockIn: (clockData: ClockData) => executeOrQueueAction(
    '/api/clockIn',
    'POST',
    clockData
  ),
  
  clockOut: (clockData: ClockData) => executeOrQueueAction(
    '/api/clockOut',
    'POST',
    clockData
  ),
};

// Settings APIs
export const settingsApi = {
  get: () => apiGet('/api/getSettings', { cacheKey: 'user-settings' }),
  
  update: (settings: UserSettings) => executeOrQueueAction(
    '/api/updateSettings',
    'POST',
    settings
  ),
};

// Export all APIs as a single object for easy importing
export const offlineApiWrappers = {
  equipment: equipmentApi,
  jobSite: jobSiteApi,
  costCode: costCodeApi,
  timeSheet: timeSheetApi,
  trucking: truckingApi,
  tasco: tascoApi,
  user: userApi,
  cookie: cookieApi,
  forms: formsApi,
  clock: clockApi,
  settings: settingsApi,
};
