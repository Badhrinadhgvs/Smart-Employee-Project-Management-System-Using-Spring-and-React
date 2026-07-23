import axiosClient from './axiosClient';
export const pendingUsers = () => axiosClient.get('/admin/employees/pending').then(r => r.data);
export const approveUser = (id) => axiosClient.post(`/admin/employees/${id}/approve`);
export const downloadAuditLogs = () => axiosClient.get('/admin/audit-logs', { responseType: 'blob' }).then(r => { const url=URL.createObjectURL(r.data); const a=document.createElement('a'); a.href=url; a.download='audit-logs.csv'; a.click(); URL.revokeObjectURL(url); });
