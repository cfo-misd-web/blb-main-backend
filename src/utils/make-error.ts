export function makeError(message: string, status: number = 400) {
    const err = new Error(message);
    // @ts-ignore
    err.status = status;
    return err;
}
