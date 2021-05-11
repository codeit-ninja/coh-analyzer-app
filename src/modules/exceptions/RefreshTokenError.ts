import { AppError } from "./AppError";

export class RefreshTokenError extends AppError {
    constructor(message?: string) {
        super(message);

        this.name = 'RefreshTokenError';
        this.message = 'An error occured while trying to refresh your Twitch authentication token.';
        this.data = {
            solve: 'Try to login again via the dashboard.'
        };
    }
}