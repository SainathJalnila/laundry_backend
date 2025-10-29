import { Response } from 'express';

type Primitive = string | number | boolean | null;

export type ApiSuccess<T = unknown> = {
	success: true;
	message: string;
	data?: T;
};

export type ApiError = {
	success: false;
	message: string;
	errors?: Record<string, string> | string[] | Primitive;
};

export function sendSuccess<T>(res: Response, message = 'OK', data?: T, status = 200) {
	const body: ApiSuccess<T> = { success: true, message };
	if (typeof data !== 'undefined') body.data = data;
	return res.status(status).json(body);
}

export function sendError(
	res: Response,
	message: any,
	opts?: { errors?: Record<string, string> | string[] | Primitive; status?: number }
) {
	const status = opts?.status ?? 400;
	const body: ApiError = { success: false, message };
	if (typeof opts?.errors !== 'undefined') body.errors = opts.errors;
	return res.status(status).json(body);
}


