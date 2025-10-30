export function sendSuccess(res, message = 'OK', data, status = 200) {
    const body = { success: true, message };
    if (typeof data !== 'undefined')
        body.data = data;
    return res.status(status).json(body);
}
export function sendError(res, message, opts) {
    const status = opts?.status ?? 400;
    const body = { success: false, message };
    if (typeof opts?.errors !== 'undefined')
        body.errors = opts.errors;
    return res.status(status).json(body);
}
