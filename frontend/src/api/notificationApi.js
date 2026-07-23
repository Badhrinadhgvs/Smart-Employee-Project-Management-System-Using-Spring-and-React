import axiosClient from './axiosClient';

// GET /api/notifications -> List<NotificationDto.Response>
export const getNotifications = () => axiosClient.get('/notifications').then((res) => res.data);

// GET /api/notifications/unread-count -> { unreadCount: number }
export const getUnreadCount = () => axiosClient.get('/notifications/unread-count').then((res) => res.data);

// PATCH /api/notifications/{id}/read -> 204
export const markAsRead = (id) => axiosClient.patch(`/notifications/${id}/read`);

// PATCH /api/notifications/read-all -> 204
export const markAllAsRead = () => axiosClient.patch('/notifications/read-all');
