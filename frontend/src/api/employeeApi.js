import axiosClient from './axiosClient';

// GET /api/employees/list -> List<EmployeeDto.Response> (lightweight, for dropdowns etc.)
export const listAllEmployees = () =>
  axiosClient.get('/employees/list').then((res) => res.data);

// GET /api/employees?page&size&search&department&sort -> Page<EmployeeDto.Response>
export const searchEmployees = ({ page = 0, size = 5, search = '', department = '', sort = '' } = {}) =>
  axiosClient
    .get('/employees', {
      params: {
        page,
        size,
        search: search || undefined,
        department: department || undefined,
        sort: sort || undefined,
      },
    })
    .then((res) => res.data);

// POST /api/admin/employees -> EmployeeDto.Response
export const createEmployee = (payload) =>
  axiosClient.post('/admin/employees', payload).then((res) => res.data);

// PUT /api/admin/employees/{id} -> EmployeeDto.Response
export const updateEmployee = (id, payload) =>
  axiosClient.put(`/admin/employees/${id}`, payload).then((res) => res.data);

// DELETE /api/admin/employees/{id} -> 204
export const deleteEmployee = (id) => axiosClient.delete(`/admin/employees/${id}`);
