import axiosClient from './axiosClient';

// GET /api/projects?page&size&search&status&priority&sort -> Page<ProjectDto.Response>
export const searchProjects = ({ page = 0, size = 6, search = '', status = '', priority = '', sort = '' } = {}) =>
  axiosClient
    .get('/projects', {
      params: {
        page,
        size,
        search: search || undefined,
        status: status || undefined,
        priority: priority || undefined,
        sort: sort || undefined,
      },
    })
    .then((res) => res.data);

// POST /api/projects -> ProjectDto.Response
export const createProject = (payload) =>
  axiosClient.post('/projects', payload).then((res) => res.data);

// PUT /api/projects/{id} -> ProjectDto.Response
export const updateProject = (id, payload) =>
  axiosClient.put(`/projects/${id}`, payload).then((res) => res.data);

// DELETE /api/projects/{id} -> 204
export const deleteProject = (id) => axiosClient.delete(`/projects/${id}`);
