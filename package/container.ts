import { Injection } from './injection';
import { Dependency } from './dependency';
import { Dependencies } from './dependencies';
import 'reflect-metadata';

export class Container {
    private static instances: { [k: string]: Injection<any> } = {};

    static get<T>(Constructor: Dependency<T>, ...overrides): T {
        if (!Container.instances[Constructor.name]) {
            Container.set<T>(Constructor, ...overrides);
        }
        return Container.instances[Constructor.name].instance;
    }

    static set<T>(Constructor: Dependency<T>, ...overrides): void {
        if (Reflect.getMetadata('injectable', Constructor)) {
            Container.instances[Constructor.name] = new Injection<T>(Container.createInstance(Constructor, ...overrides));
        } else {
            throw new Error(`Can not create an instance of "${Constructor.name}" class. Did you forget to add @injectable decorator?`);
        }
    }

    private static createInstance<T>(Constructor: Dependency<T>, ...overrides): T {
        const dependencies = overrides.length ? overrides : [];
        if (!dependencies.length) {
            (Container.getDependencies<T>(Constructor) || []).forEach((Dependency, index) => {
                dependencies.push(typeof overrides[index] === 'undefined' ? Container.get(Dependency) : overrides[index] );
            });
        }
        return new Constructor(...dependencies);
    }

    private static getDependencies<T>(Constructor: Dependency<T>): Dependencies {
        return Reflect.getMetadata('design:paramtypes', Constructor);
    }
}