/**************************** API ***************************/

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type CallApiError = {
    url: string;
    method: HTTPMethod;
    data: Record<string, any> | null;
    success: boolean;
    headers: Record<string, string>;
    error: {
        status: number | null;
        message: string;
        data?: any; // Peut contenir des informations d'erreur supplémentaires
    };
};


export type CallApiResponse<T = any> = {
    data: T; // La réponse peut être générique selon l'API
    success: boolean;
    method: HTTPMethod;
    url: string;
    error: null;
};


/******************************* USER ****************************/
export interface UserMetadata {
    email?: string;
    email_verified?: boolean;
    phone_verified?: boolean;
    sub?: string;
    username?: string;
    last_name?: string;
    first_name?: string;
    city?: string;
    country?: string;
    bio?: string;
    gym_place?: string;
    gender?: string;
    main_sport?: string;
    height?: string;
    weight?: string;
    profil_picture_uri?: string;
}
