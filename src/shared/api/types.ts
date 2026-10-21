export type UserPublic = {
    id: string
    email: string
}

export type UserProfile = UserPublic &  {
    createdAt: string
    updatedAt: string
}

export type AuthLoginRequest = {
    email: string
    password: string
}

export type AuthResponse = {
    token: string
    user: UserPublic
}
export type AuthRegisterRequest = {
    email: string
    password: string
}

