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
    movie_external_id: number;
    title: string;
    title_original?: string | null;
    description?: string | null;
    poster_url?: string | null;
    year?: number | null;
    rating_kinopoisk?: number | null;
    rating_imdb?: number | null;
    rating_votes?: number | null;
    film_length?: number | null;
    slogan?: string | null;
    countries?: string | null;
    film_type?: string | null;
    genres: Genre[];
};

export type InteractionCreateRequest = {
    movie_id: number; // Внешний ID или ID фильма (см. шаг 2)
    rating: 1 | -1;
};

export type MoviesFilterParams = {
    search?: string;
    genre?: string[];
    page?: number;
    limit?: number;
};
