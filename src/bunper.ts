import {
    Middleware,
    ErrorMiddleware,
    requestLogger,
} from "./utilities/middlewares";

type Handler = (
    request: Request,
    params: { [key: string]: string },
) => Response | Promise<Response>;

interface Route {
    method: string;
    path: string;
    handler: Handler;
    regex: RegExp;
    keys: string[];
    description: string;
    params: { [key: string]: { type: string, description: string } };
}

interface BunperOptions {
    addDefaultMiddlewares?: boolean;
}


export class Bunper {
    private routes: Route[] = [];
    private middlewares: Middleware[] = [];
    private errorMiddlewares: ErrorMiddleware[] = [];


    constructor(options?: BunperOptions) {
        const {addDefaultMiddlewares = true} = options || {};

        if (addDefaultMiddlewares) {
            console.log("Adding default middlewares")
            this.use(requestLogger);
        }
    }

    private addRoute(method: string,
                     path: string,
                     handler: Handler,
                     description: string = '',
                     params: { [key: string]: any } = {}) {
        const keys: string[] = [];
        path = path.replace(/:([^\/]+)/g, (_, key) => {
            keys.push(key);
            return '([^/]+)';
        });
        const regex = new RegExp(`^${path}$`);
        this.routes.push({method, path, handler, regex, keys, description, params});
    }

    public use(middleware: Middleware | ErrorMiddleware) {
        if (this.isErrorMiddleware(middleware)) {
            this.errorMiddlewares.push(middleware);
        } else {
            this.middlewares.push(middleware);
        }
    }

    private isErrorMiddleware(middleware: Middleware | ErrorMiddleware): middleware is ErrorMiddleware {
        // Error middlewares have 4 parameters instead of 3
        return middleware.length === 4;
    }

    public get(path: string, handler: Handler, description: string = '', params: { [key: string]: any } = {}) {
        this.addRoute('GET', path, handler, description, params);
    }

    public post(path: string, handler: Handler, description: string = '', params: { [key: string]: any } = {}) {
        this.addRoute('POST', path, handler, description, params);
    }

    public put(path: string, handler: Handler, description: string = '', params: { [key: string]: any } = {}) {
        this.addRoute('PUT', path, handler, description, params);
    }

    public delete(path: string, handler: Handler, description: string = '', params: { [key: string]: any } = {}) {
        this.addRoute('DELETE', path, handler, description, params);
    }

    public patch(path: string, handler: Handler, description: string = '', params: { [key: string]: any } = {}) {
        this.addRoute('PATCH', path, handler, description, params);
    }

    public options(path: string, handler: Handler, description: string = '', params: { [key: string]: any } = {}) {
        this.addRoute('OPTIONS', path, handler, description, params);
    }

    public head(path: string, handler: Handler, description: string = '', params: { [key: string]: any } = {}) {
        this.addRoute('HEAD', path, handler, description, params);
    }

    public async listen(port: number) {
        Bun.serve({
            fetch: async (req: Request) => {
                const url = new URL(req.url);
                const matchedRoute = this.routes.find(route => route.method === req.method && route.regex.test(url.pathname));

                if (matchedRoute) {
                    const match = matchedRoute.regex.exec(url.pathname);
                    const params = match ? match.slice(1).reduce((params, value, index) => {
                        params[matchedRoute.keys[index]] = value;
                        return params;
                    }, {} as { [key: string]: string }) : {};

                    let handlerResponse: Response | undefined = undefined;

                    // Process middlewares before handling the route
                    await this.applyMiddlewares(req, new Response(), this.middlewares, async () => {
                        try {
                            handlerResponse = await matchedRoute.handler(req, params);
                        } catch (error) {
                            handlerResponse = await this.applyErrorMiddlewares(error, req, new Response(), this.errorMiddlewares);
                        }
                    });

                    // Return the response from the handler or error middlewares
                    return handlerResponse || new Response("Handler did not send a response.", {status: 500});
                }

                // If no route matched, return 404 Not Found
                return new Response("Not Found", {status: 404});
            },
            port: port,
        });

        console.log(`Server running on http://localhost:${port}`);
    }


    private async applyMiddlewares(req: Request, res: Response, middlewares: Middleware[], callback: Function) {
        try {
            if (middlewares.length === 0) {
                // If there are no more middlewares to apply, call the route handler or the next function
                await callback();
            } else {
                // Extract the first middleware from the list
                const [firstMiddleware, ...rest] = middlewares;

                // Call the first middleware and provide a function to call the next middleware
                await firstMiddleware(req, res, async () => {
                    // When the current middleware calls 'next', apply the remaining middlewares
                    await this.applyMiddlewares(req, res, rest, callback);
                });
            }
        } catch (error) {
            // If an error occurs in any middleware, handle it with error middlewares
            await this.applyErrorMiddlewares(error, req, res, this.errorMiddlewares);
        }
    }


    private async applyErrorMiddlewares(error: any, req: Request, res: Response, errorMiddlewares: ErrorMiddleware[]): Promise<Response> {
        if (errorMiddlewares.length === 0) {
            console.error('Unhandled error:', error);
            return new Response('Internal Server Error', {status: 500});
        }
        const [firstMiddleware, ...rest] = errorMiddlewares;

        try {
            let response: Response | undefined = undefined;
            await firstMiddleware(error, req, res, async () => {
                response = await this.applyErrorMiddlewares(error, req, res, rest);
            });
            return response || new Response('Internal Server Error', {status: 500});
        } catch (err) {
            console.error('Error in error middleware:', err);
            return new Response('Internal Server Error', {status: 500});
        }
    }

    public serveDocumentation() {
        this.get('/api-docs', async (req, params) => {
            const docsHtml = this.generateDocumentationHtml();
            return new Response(docsHtml, {
                headers: {
                    'Content-Type': 'text/html',
                },
            });
        });
    }

    private generateDocumentationHtml(): string {
        let docsHtml = `<html><head><title>API Documentation</title></head><body>`;
        docsHtml += `<h1>API Documentation</h1>`;
        for (const route of this.routes) {
            docsHtml += "<div>";
            let hasDescription = route.description.length != 0;
            let hasParameters = Object.entries(route.params).length > 0;
            if (hasDescription || hasParameters) {
                docsHtml += `
                <h2>${route.method.toUpperCase()}: ${route.path}</h2>
                <p>${route.description}</p>`;
            }
            if (hasParameters) {
                docsHtml += `<h3>Parameters:</h3>
                <ul>`
                for (const [paramName, paramDetails] of Object.entries(route.params)) {
                    docsHtml += `<li><strong>${paramName}</strong>: ${paramDetails.description || ''} (${paramDetails.type || 'unknown'})</li>`;
                }
                docsHtml += `</ul>`;
            }
            docsHtml += "</div>";
        }
        docsHtml += `</body></html>`;
        return docsHtml;
    }


    public registerController(controller: any) {
        const prefix = controller.prefix || '';
        const routes = controller.constructor.routes as Route[] || [] ;
        routes.forEach(route => {
            const fullPath = `${prefix}${route.path}`;
            this.addRoute(route.method, fullPath, route.handler);
        });
    }
}

