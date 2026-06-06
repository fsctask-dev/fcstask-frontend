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
  return api.post<CourseDTO>('/api/courses', req)
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
  return api.put<CourseDTO>(`/api/courses/${courseId}`, req)
}

// Task board

export async function getCourseBoard(courseId: string): Promise<TaskBoardSummary> {
  return api.get<TaskBoardSummary>(`/api/courses/${courseId}/board`)
}

// Scores / Leaderboard

export interface LeaderboardEntry {
  username: string
  totalScore: number
  rank: number
}

export async function getCourseScores(courseId: string): Promise<LeaderboardEntry[]> {
  return api.get<LeaderboardEntry[]>(`/api/courses/${courseId}/scores`)
}

// Join course

export async function joinCourse(courseId: string, code?: string): Promise<void> {
  return api.post(`/api/courses/${courseId}/join`, { code: code ?? '' })
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
  name?: string
  position: number
  score: number
  is_bonus: boolean
  is_public: boolean
}

export async function listTasks(courseId: string, hwId: string): Promise<TaskDTO[]> {
  return api.get<TaskDTO[]>(`/admin/courses/${courseId}/homework/${hwId}/tasks`)
}

export async function createTask(courseId: string, hwId: string, req: {
  score?: number
  repo_url?: string
  task_url?: string
}): Promise<TaskDTO> {
  return api.post<TaskDTO>(`/admin/courses/${courseId}/homework/${hwId}/tasks`, req)
}

export async function publishTask(courseId: string, hwId: string, taskId: string, isPublic: boolean): Promise<TaskDTO> {
  return api.patch<TaskDTO>(`/admin/courses/${courseId}/homework/${hwId}/tasks/${taskId}/publish`, { is_public: isPublic })
}

export async function deleteTask(courseId: string, hwId: string, taskId: string): Promise<void> {
  return api.delete(`/admin/courses/${courseId}/homework/${hwId}/tasks/${taskId}`)
}

// Admin: deadline

export async function getDeadlineByHwId(hwId: string): Promise<string> {
  return api.get<string>(`/admin/homework/${hwId}/deadline`)
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
