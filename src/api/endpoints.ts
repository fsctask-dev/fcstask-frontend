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
  status: string
  startDate: string
  endDate: string
  repoTemplate: string
  description: string
  url: string
}

export async function getCourses(status?: string): Promise<CourseDTO[]> {
  const query = status ? `?status=${status}` : ''
  return api.get<CourseDTO[]>(`/api/courses${query}`)
}

export async function getCourse(courseId: string): Promise<CourseDTO> {
  return api.get<CourseDTO>(`/api/courses/${courseId}`)
}

export async function createCourse(req: {
  name: string
  slug: string
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

// Helpers

export function courseDTOToModel(dto: CourseDTO): Course {
  return {
    id: dto.id,
    name: dto.name,
    status: dto.status as Course['status'],
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
