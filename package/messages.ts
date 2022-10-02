export const messages = {

    missedInjection(className: string): string {
        return `
            Can not create an instance of "${className}" class.
            Did you forget to add @injectable decorator?
        `
    }

}