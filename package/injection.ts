import { Dependency } from './dependency';

export class Injection<T> {
    class: Dependency<T>;
    instance?: T;
    overrides?: any[];
    rewrite?: boolean;

    constructor(injectionLike: Partial<Injection<T>>) {
        this.class = injectionLike.class;
        this.instance = injectionLike.instance;
        this.overrides = injectionLike.overrides || [];
        this.rewrite = injectionLike.rewrite || false;
    }
}