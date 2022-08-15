import { injectable } from '../package/injectable';
import { Container } from '../package/container';
import { Injection } from '../package/injection';

describe('Main cases', () => {

    describe('Container', () => {

        beforeEach(() => {
            Reflect.set(Container, 'instances', {});
        })

        describe('get', () => {

            test('should call "set" method because constructor does not exist in #instances property', () => {
                @injectable()
                class Example {
                    foo = '123';
                }

                Container.set = jest.fn().mockImplementation(Container.set);

                const instance: Example = Container.get(Example);

                expect(Container.set).toHaveBeenCalledWith(Example);
                expect(instance instanceof Example).toBe(true);
            });

            test('should not call "set" method because constructor exists in #instances property', () => {
                @injectable()
                class Example {
                    foo1 = '123'
                }

                Container.set(Example);
                Container.set = jest.fn().mockImplementation(Container.set);

                const instance: Example = Container.get(Example);

                expect(Container.set).toHaveBeenCalledTimes(0);
                expect(instance instanceof Example).toBe(true);
            });

        });

        describe('set', () => {

            test('should overwrite existed constructor', () => {
                @injectable()
                class Example {
                    foo() {
                        return 12345;
                    }
                }
                const initialInstance: Example = {
                    foo() {
                        return 123;
                    }
                }
                Reflect.set(Container, 'instances', { [Example.name]: new Injection(initialInstance) });

                // Rewrite initial instance with another realisation
                Container.set(Example);
                const instance = Container.get(Example);

                expect(instance.foo()).toBe(12345);
            });

        });

        describe('Dependencies resolving', () => {

            test('should create instances of children dependencies', () => {
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

                const instance = Container.get(Parent);

                expect(instance.foo()).toBe(12345);
            });

        });

    });

});