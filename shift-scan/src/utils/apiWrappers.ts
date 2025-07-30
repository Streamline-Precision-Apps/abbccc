/**
 * API wrapper functions for common Shift Scan endpoints with offline support
 */

import { apiGet, executeOrQueueAction, fetchWithOfflineCache } from './offlineApi';

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
  
  setJobSite: (jobSiteData: any) => executeOrQueueAction(
    '/api/setJobSite',
    'POST',
    jobSiteData
  ),
};

// Cost Code APIs
export const costCodeApi = {
  getAll: () => apiGet('/api/getCostCodes', { cacheKey: 'costcodes-all' }),
  
  getRecent: () => apiGet('/api/getRecentCostCodes', { cacheKey: 'costcodes-recent' }),
  
  setCostCode: (costCodeData: any) => executeOrQueueAction(
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
  
  setTruck: (truckData: any) => executeOrQueueAction(
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
  
  submitForm: (formData: any) => executeOrQueueAction(
    '/api/submitForm',
    'POST',
    formData
  ),
};

// Clock APIs
export const clockApi = {
  getLogs: () => apiGet('/api/getLogs', { cacheKey: 'clock-logs' }),
  
  clockoutDetails: () => apiGet('/api/clockoutDetails', { cacheKey: 'clockout-details' }),
  
  clockIn: (clockData: any) => executeOrQueueAction(
    '/api/clockIn',
    'POST',
    clockData
  ),
  
  clockOut: (clockData: any) => executeOrQueueAction(
    '/api/clockOut',
    'POST',
    clockData
  ),
};

// Settings APIs
export const settingsApi = {
  get: () => apiGet('/api/getSettings', { cacheKey: 'user-settings' }),
  
  update: (settings: any) => executeOrQueueAction(
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
