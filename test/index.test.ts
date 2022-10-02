import { injectable } from '../package/injectable';
import { Container } from '../package/container';
import { messages } from '../package/messages';

describe('Main cases', () => {

    describe('Container', () => {

        beforeEach(() => {
            Reflect.set(Container, 'instances', {});
        });

        describe('inject', () => {

            it('should throw exception because injectable decorator is missed', () => {
                class Example {}

                expect(() => Container.inject({ class: Example })).toThrow(
                    new Error(messages.missedInjection(Example.name))
                );
            });

            it('should create instance once because it is cashed by default', () => {
                @injectable()
                class Example {
                    constructor(public isCached) {
                    }
                }

                Container.inject({ class: Example, overrides: [true] })

                expect(Container.inject({ class: Example, overrides: [false] }).isCached).toBe(true);
            });

            it('should create instance twice because rewrite is true', () => {
                @injectable()
                class Example {
                    constructor(public isCached) {
                    }
                }

                Container.inject({ class: Example, overrides: [true] })

                expect(Container.inject({ class: Example, rewrite: true, overrides: [false] }).isCached)
                    .toBe(false);
            });

            it('should use passed instance if it is presented', () => {
                @injectable()
                class Example {
                    constructor(public foo) {
                    }
                }

                const instance = new Example(123);

                expect(Container.inject({ class: Example, instance }).foo).toBe(123);
            });

            it('should create instances of children dependencies', () => {
                @injectable()
                class Child {
                    foo() {
                        return 12345;
                    }
                }
                @injectable()
                class Parent {
                    constructor(private child: Child) {
                    }
                    foo() {
                        return this.child.foo();
                    }
                }

                const instance = Container.inject({ class: Parent });

                expect(instance.foo()).toBe(12345);
            });

        });

    });

});