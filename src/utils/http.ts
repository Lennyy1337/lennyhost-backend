import { FastifyReply } from 'fastify';

interface HttpError {
    message: string;
    type: string;
}

class HttpException extends Error {
    statusCode: number;
    error: HttpError;

    constructor(statusCode: number, message: string, type: string) {
        super(message);
        this.name = 'HttpException';
        this.statusCode = statusCode;
        this.error = {
            message,
            type,
        };

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = new Error(message).stack;
        }
    }
}

function handleHttpException(reply: FastifyReply, error: HttpException) {
    reply.status(error.statusCode || 500).send({
        error: {
            message: error.message,
            type: error.error.type,
        },
    });
}

function handleHttpExceptionError(error: any, reply: any) {
    if (error instanceof HttpException) {
        return handleHttpException(reply, error);
    }

    return handleHttpException(
        reply,
        new HttpException(
            500,
            'An unexpected error occurred while processing your request. Please try again later.',
            'api_error'
        )
    );
}

export { HttpException, handleHttpException, handleHttpExceptionError };
