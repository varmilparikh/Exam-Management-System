export interface RegisterUserDto {
  employeeCode: string;
  name: string;
  email: string;
  password: string;
  designation: string;
  departmentId: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}