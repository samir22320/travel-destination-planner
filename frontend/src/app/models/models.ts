export interface AuthRegisterResponse {
    message: string;
    statusCode: number;
}

export interface AuthTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface CountrySuggestionResponse {
    name: string;
    capital: string;
    region: string;
    population: number;
    currencies: { [key: string]: { name: string, symbol: string } };
    flags: { png: string, svg: string };
    cca2: string; // Country Code
}

export interface DestinationResponse {
    id: number;
    countryCode: string;
    countryName: string;
    capital: string;
    region: string;
    population: number;
    currencyCode: string;
    currencyName: string;
    flagUrl: string;
}

export interface AddDestinationRequest {
    countryName: string;
    capital: string;
    region: string;
    population: number;
    currencyCode: string;
    currencyName: string;
    flagUrl: string;
    countryCode: string;
}

export interface Page<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            empty: boolean;
            unsorted: boolean;
            sorted: boolean;
        };
        offset: number;
        unpaged: boolean;
        paged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
        empty: boolean;
        unsorted: boolean;
        sorted: boolean;
    };
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}
