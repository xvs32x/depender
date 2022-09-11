# Depender
A simple javascript realisation of Dependency Injection pattern.


## Example of  DI


	import { injectable } from '@depender/core/injectable';
	import { Container } from '@depender/core/container';
	
	@injectable() // <-- Add injectable decorator
	class DependencyOne { 
        print() {
            console.log(123);
        }
	}
	
	@injectable() // <-- Add injectable decorator
	class DependencyTwo { ... }
	
    @injectable()  <-- Add injectable decorator
	class Application {  
	    constructor(
		    public dependencyOne: DependencyOne, // <-- instance will be created by Depender
		) {}

		callDependency() {
			this.dependencyOne.print(); // <-- Call children instance created by Depender
		}
	}
	
	const applicationInstance: Application = Container.get(Application);
	applicationInstance.callDependency() // <-- Prints 123
