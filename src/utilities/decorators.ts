export function Method(method: string, path: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        if (!target.constructor.routes) {
            target.constructor.routes = [];
        }
        target.constructor.routes.push({
            method,
            path,
            handler: descriptor.value, // The actual method
        });
    };
}

export function Get(path: string,) {
    return Method('GET', path);
}

export function Post(path: string) {
    return Method('POST', path);
}

export function Put(path: string) {
    return Method('PUT', path);
}

export function Delete(path: string) {
    return Method('DELETE', path);
}

export function Patch(path: string) {
    return Method('PATCH', path);
}

export function Options(path: string) {
    return Method('OPTIONS', path);
}

export function Head(path: string) {
    return Method('HEAD', path);
}

