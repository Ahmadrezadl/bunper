export type Middleware = (request: Request, response: Response, next: Function) => void | Promise<void>;
export type ErrorMiddleware = (error: any, request: Request, response: Response, next: Function) => void | Promise<void> | Response;

// Middleware to log requests
export const requestLogger: Middleware = async (request, response, next) => {
    const start = Date.now();  // Record the start time of the request
    const { method, url } = request;
    const clientIp = request.headers.get('x-forwarded-for') || "";  // Get client IP address

    // Call the next middleware or route handler and wait for it to finish
    await next();

    // Calculate the response time
    const responseTime = Date.now() - start;

    // Log the request and response details
    console.log(`${new Date().toISOString()} - ${clientIp} - Received ${method} request for ${url} - Response Time: ${responseTime}ms`);
};
