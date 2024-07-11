export type role = "Admin" | "User" | "Employee"

export interface User {
    _id: string,
    profileUrl?: string,
    username: string,
    email: string,
    phoneNumber: number,
    roles: role[],
    refreshToken?: string,
    createdAt?: Date,
    updatedAt?: Date,
    password?: string,
    age?: number,
    address?: string,
    medicalHistory?: string,
    currentMedication?: string,
    vaccination?: string,
    emergencyContactName?: string,
    relationship?: string,
    emergencyContactNumber?: number
}

export interface RegisterUserPayload {
    username: string,
    email: string,
    phoneNumber: number,
    password: string
}

export interface LoginUserPayload {
    email: string,
    password: string,
}

export interface FetchUserPayload {
    userId: string;
}