export default class CustomError extends Error {
    code: number
    
    constructor(message: string, code: number) {
        super(message)
        this.code = code || 400
    }

    toJSON() {
        return {
            message: this.message,
            code: this.code
        }
    }
}