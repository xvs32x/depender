import { Injection } from './injection';
import { Dependency } from './dependency';
import { Dependencies } from './dependencies';
import { messages } from './messages';
import 'reflect-metadata';

export class Container {

    private static instances: { [k: string]: Injection<any> } = {};

    static inject<T>(injectionLike: Injection<T>): T {
        if (!Reflect.getMetadata('injectable', injectionLike.class)) {
            throw new Error(messages.missedInjection(injectionLike.class.name));
        }

        return Container.get(injectionLike);
    }

    private static get<T>(injectionLike: Injection<T>): T {
        if (!!Container.instances[injectionLike.class.name] && !injectionLike.rewrite) {
            return Container.instances[injectionLike.class.name].instance;
        }

        return Container.set(injectionLike);
    }

    private static set<T>(injectionLike: Injection<T>): T {
        const instance = injectionLike.instance || Container.createInstance(injectionLike);

        Container.instances[injectionLike.class.name] = new Injection<T>({ ...injectionLike, instance });
        return Container.instances[injectionLike.class.name].instance;
    }

    private static createInstance<T>(injectionLike: Injection<T>): T {
        const deps = injectionLike.overrides?.length ? injectionLike.overrides : [];
        (Container.getDependencies<T>(injectionLike.class) || []).forEach((Dependency, index) => {
            deps.push(typeof deps[index] === 'undefined' ? Container.inject({ class: Dependency }) : deps[index] );
        });
        return new injectionLike.class(...deps);
    }

    private static getDependencies<T>(Constructor: Dependency<T>): Dependencies {
        return Reflect.getMetadata('design:paramtypes', Constructor);
    }
}