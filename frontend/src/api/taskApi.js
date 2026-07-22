import axiosClient from './axiosClient';

// GET /api/tasks -> List<TaskDto.Response>  (ADMIN only per SecurityConfig)
export const listAllTasks = () => axiosClient.get('/tasks').then((res) => res.data);

// GET /api/tasks/employee/{employeeId} -> List<TaskDto.Response> (ADMIN or EMPLOYEE)
export const listTasksByEmployee = (employeeId) =>
  axiosClient.get(`/tasks/employee/${employeeId}`).then((res) => res.data);

// POST /api/tasks -> TaskDto.Response (ADMIN only)
export const createTask = (payload) => axiosClient.post('/tasks', payload).then((res) => res.data);

// PUT /api/tasks/{id} -> TaskDto.Response (ADMIN only)
export const updateTask = (id, payload) =>
  axiosClient.put(`/tasks/${id}`, payload).then((res) => res.data);

// PATCH /api/tasks/{id}/status -> TaskDto.Response (ADMIN or EMPLOYEE - own task)
export const updateTaskStatus = (id, payload) =>
  axiosClient.patch(`/tasks/${id}/status`, payload).then((res) => res.data);

// DELETE /api/tasks/{id} -> 204 (ADMIN only)
export const deleteTask = (id) => axiosClient.delete(`/tasks/${id}`);
