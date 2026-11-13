export type ApiFieldError = {
    path: string
    message: string
}

export type ApiErrorResponse = {
    
    message: string
    errors?: ApiFieldError[]
}

export type UserPublic = {
    id: string
    email: string
    name: string
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
    message: string;
    JWT_token: string;
    token_type: string;
}
export type RegisterResponse = {
    message: string;
    email: string;
}

export type AuthRegisterRequest = {
    email: string
    password: string
    name: string
}

export type PasswordRecoveryRequest = {
    email: string
}

export type PasswordRecoveryResponse = {
    response: string
}

export type PasswordRecoveryChangeRequest  = {
    new_password: string
    token: string
}

export type UserUpdateRequest = {
    email?: string;
    name?: string;
}

export type PasswordUpdateRequest = {
    old_password: string;
    new_password: string;
}

export type Genre = {
    id: number;
    name: string;
};

export type Movie = {
    id: number;
    title: string;
    year: number;
    rating: number;
    poster_url?: string;
    genres: Genre[];
};

export type MovieDetails = Movie & {
    description?: string;
    duration?: string;
    director?: string;
    actors?: string[];
};

export type PaginatedMoviesResponse = {
    items: Movie[];
    total: number;
    page: number;
    size: number;
    pages: number;
};

export type MoviesFilterParams = {
    page?: number;
    size?: number;
    genre_ids?: number[];
    sort_by?: string;
};