export function injectable() {
    return <T extends { new (...args: any[]): object }>(constructor: T) => {
        Reflect.defineMetadata('injectable', true, constructor);
        return constructor;
    };
}