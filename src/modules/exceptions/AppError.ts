export class AppError extends Error {
    public title: string;

    public data: any;

    constructor(message?: string) {
        super(message);

        this.title = this.constructor.name;
        this.data = {};
    }
}