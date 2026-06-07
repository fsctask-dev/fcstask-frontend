import { api, setToken, clearToken } from './client'
import type { Course, TaskBoardSummary, UserProfile } from '../models/types'

// Auth

export interface SignUpRequest {
  username: string
  email: string
  password: string
  tg_uid?: number
}

export interface SignInRequest {
  email?: string
  username?: string
  password: string
}

export interface AuthResponse {
  session_token: string
  user: {
    id: string
    username: string
    email: string
    first_name?: string
    last_name?: string
  }
}

export interface MeResponse {
  username: string
  initials: string
  role: string
}

export async function signUp(req: SignUpRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/api/signup', req)
  setToken(res.session_token)
  return res
}

export async function signIn(req: SignInRequest): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>('/api/signin', req)
  setToken(res.session_token)
  return res
}

export async function signOut(): Promise<void> {
  await api.post('/api/signout', {})
  clearToken()
}

export async function getMe(): Promise<MeResponse> {
  return api.get<MeResponse>('/v1/api/me')
}

// Courses

export interface CourseDTO {
  id: string
  name: string
  slug: string
  status: string
  type: string
  start_date: string
  end_date: string
  repo_template: string
  description: string
  url: string
}

export async function getCourses(status?: string): Promise<CourseDTO[]> {
  const query = status ? `?status=${status}` : ''
  return api.get<CourseDTO[]>(`/api/courses${query}`)
}

export async function getPublicCourses(): Promise<CourseDTO[]> {
  return api.get<CourseDTO[]>('/api/courses/public')
}

export async function getCourse(courseId: string): Promise<CourseDTO> {
  return api.get<CourseDTO>(`/api/courses/${courseId}`)
}

export async function createCourse(req: {
  name: string
  slug: string
  type: string
  status: string
  startDate: string
  endDate: string
  repoTemplate: string
  description: string
}): Promise<CourseDTO> {
  return api.post<CourseDTO>('/admin/courses/create', req)
}

export async function updateCourse(
  courseId: string,
  req: Partial<{
    name: string
    status: string
    type: string
    startDate: string
    endDate: string
    repoTemplate: string
    description: string
  }>,
): Promise<CourseDTO> {
  return api.put<CourseDTO>(`/admin/courses/${courseId}/update`, req)
}

// Task board
export async function getCourseBoard(courseId: string): Promise<TaskBoardSummary> {
  return api.get<TaskBoardSummary>(`/api/courses/${courseId}/board`)
}

// Scores / Leaderboard
export interface TaskScore {
  task_id: string
  title: string
  score: number
}

export interface HomeworkScore {
  homework_id: string
  homework_title: string
  total_score: number
  tasks: TaskScore[]
}

export interface LeaderboardEntry {
  username: string
  totalScore: number
  rank: number
  homeworks: HomeworkScore[]
}

export async function getCourseScores(courseId: string): Promise<LeaderboardEntry[]> {
  return api.get<LeaderboardEntry[]>(`/api/courses/${courseId}/scores`)
}

// Join course
export async function joinCourse(courseId: string, code?: string): Promise<void> {
  return api.post(`/api/courses/${courseId}/join`, { code: code ?? '' })
}

export async function checkPermissions(courseId: string, permissions: string[]): Promise<Record<string, boolean>> {
  return api.post(`/api/courses/${courseId}/check-permissions`, { permissions })
}

// Admin: homework
export interface HomeworkDTO {
  hw_id: string
  course_id: string
  title?: string
  description?: string
  position: number
  is_public: boolean
  start_date?: string
  end_date?: string
}

export async function listHomework(courseId: string): Promise<HomeworkDTO[]> {
  return api.get<HomeworkDTO[]>(`/admin/courses/${courseId}/homework`)
}

export async function getHomework(courseId: string, hwId: string): Promise<HomeworkDTO> {
  return api.get<HomeworkDTO>(`/admin/courses/${courseId}/homework/${hwId}`)
}

export async function createHomework(courseId: string, req: Partial<HomeworkDTO>): Promise<HomeworkDTO> {
  return api.post<HomeworkDTO>(`/admin/courses/${courseId}/homework`, req)
}

export async function updateHomework(courseId: string, hwId: string, req: Partial<HomeworkDTO>): Promise<HomeworkDTO> {
  return api.patch<HomeworkDTO>(`/admin/courses/${courseId}/homework/${hwId}`, req)
}

export async function deleteHomework(courseId: string, hwId: string): Promise<void> {
  return api.delete(`/admin/courses/${courseId}/homework/${hwId}`)
}

export async function publishHomework(courseId: string, hwId: string, isPublic: boolean): Promise<HomeworkDTO> {
  return api.patch<HomeworkDTO>(`/admin/courses/${courseId}/homework/${hwId}/publish`, { is_public: isPublic })
}

// Admin: tasks

export interface TaskDTO {
  task_id: string
  hw_id: string
  title: string
  position: number
  score: number
  is_bonus: boolean
  is_public: boolean
  repo_url?: string
  task_url?: string
}

export async function listTasks(courseId: string, hwId: string): Promise<TaskDTO[]> {
  return api.get<TaskDTO[]>(`/admin/courses/${courseId}/homework/${hwId}/tasks`)
}

export async function createTask(courseId: string, hwId: string, req: {
  title: string
  score: number
  repo_url?: string
  task_url?: string
}): Promise<TaskDTO> {
  return api.post<TaskDTO>(`/admin/courses/${courseId}/homework/${hwId}/tasks`, req)
}

export async function updateTask(courseId: string, hwId: string, taskId: string, req: {
  score?: number
  repo_url?: string
  task_url?: string
}): Promise<TaskDTO> {
  return api.patch<TaskDTO>(`/admin/courses/${courseId}/homework/${hwId}/tasks/${taskId}`, req)
}

export async function setTaskScore(courseId: string, hwId: string, taskId: string, score: number): Promise<TaskDTO> {
  return api.patch<TaskDTO>(`/admin/courses/${courseId}/homework/${hwId}/tasks/${taskId}/score`, { score })
}

export async function publishTask(courseId: string, hwId: string, taskId: string, isPublic: boolean): Promise<TaskDTO> {
  return api.patch<TaskDTO>(`/admin/courses/${courseId}/homework/${hwId}/tasks/${taskId}/publish`, { is_public: isPublic })
}

export async function deleteTask(courseId: string, hwId: string, taskId: string): Promise<void> {
  return api.delete(`/admin/courses/${courseId}/homework/${hwId}/tasks/${taskId}`)
}

// Admin: deadline

export interface DeadlineDTO {
  id: string
  title: string
  description?: string
  course_id: string
  homework_id?: string
  due_date: string
  assigned_by?: string
}

export async function getDeadlineByHwId(hwId: string): Promise<string> {
  return api.get<string>(`/admin/homework/${hwId}/deadline`)
}

export async function setDeadline(courseId: string, hwId: string, req: {
  title: string
  description?: string
  due_date: string
}): Promise<DeadlineDTO> {
  return api.put<DeadlineDTO>(`/admin/courses/${courseId}/homework/${hwId}/deadline`, {
    course_id: courseId,
    ...req,
  })
}

export async function updateDeadline(deadlineId: string, req: {
  title?: string
  description?: string
  due_date?: string
}): Promise<DeadlineDTO> {
  return api.patch<DeadlineDTO>(`/admin/deadlines/${deadlineId}`, req)
}

export async function deleteDeadline(deadlineId: string): Promise<void> {
  return api.delete(`/admin/deadlines/${deadlineId}`)
}

// Admin: roles & participants

export interface UserRoleDTO {
  user_id: string
  course_id: string
  role_id: string
}

export async function listCourseRoles(courseId: string): Promise<UserRoleDTO[]> {
  return api.get<UserRoleDTO[]>(`/admin/courses/${courseId}/roles`)
}

export async function assignCourseAdmin(courseId: string, userId: string): Promise<UserRoleDTO> {
  return api.post<UserRoleDTO>(`/admin/courses/${courseId}/roles`, { user_id: userId })
}

export async function revokeCourseAdmin(courseId: string, userId: string): Promise<void> {
  return api.delete(`/admin/courses/${courseId}/roles`)
}

export async function removeCourseParticipant(courseId: string, userId: string): Promise<void> {
  return api.delete(`/admin/courses/${courseId}/participants`)
}

export async function listRolePermissions(courseId: string, roleId: string): Promise<string[]> {
  return api.get<string[]>(`/admin/courses/${courseId}/roles/${roleId}/permissions`)
}

// Admin: super admins

export async function createSuperAdmin(userId: string): Promise<UserRoleDTO> {
  return api.post<UserRoleDTO>('/admin/super-admins', { user_id: userId })
}

// Invite code

export async function regenerateInviteCode(courseId: string): Promise<string> {
  const res = await api.post<{ invite_code: string }>(`/api/courses/${courseId}/invite`, {})
  return res.invite_code
}

// Health

export async function getHealth(): Promise<{ status: string }> {
  return api.get<{ status: string }>('/health')
}

// Platform stats

export interface PlatformStats {
  totalCourses: number
  publicCourses: number
  privateCourses: number
  totalUsers: number
  healthStatus?: 'ok' | 'degraded'
}

export async function getStats(): Promise<PlatformStats> {
  return api.get<PlatformStats>('/api/stats')
}

// Helpers

export function courseDTOToModel(dto: CourseDTO): Course {
  return {
    id: dto.id,
    name: dto.name,
    status: dto.status as Course['status'],
    type: dto.type as 'public' | 'private',
    url: dto.url,
  isFinished: dto.status === 'finished',
  }
}

export function meToUserProfile(me: MeResponse): UserProfile {
  return {
    username: me.username,
    initials: me.initials,
    role: me.role as UserProfile['role'],
  }
}
