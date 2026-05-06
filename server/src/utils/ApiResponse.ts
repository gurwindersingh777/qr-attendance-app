export class ApiResponse<T> {
  success: boolean
  data: T | null
  message: string

  constructor(data: T | null, message: string) {
    this.success = true
    this.data = data
    this.message = message
  }
}