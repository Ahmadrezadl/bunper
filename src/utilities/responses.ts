export function success(data: any, status: number = 200, headers: { [key: string]: string } = {}): Response {
    return new Response(JSON.stringify(data), {
        status: status,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    });
}

export function error(data: any, status: number = 500, headers: { [key: string]: string } = {}): Response {
    return new Response(JSON.stringify(data), {
        status: status,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    });
}
