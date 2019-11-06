/**
 * @interface UserBehavior
 * eventProperty：事件属性，事件描述
 */
interface UserBehavior{
  module?: string,
  eventName: string,
  eventProperty: string,
  version?: string,
  date?: Date
}

export function Log(value:UserBehavior) {
    return function (target: any, name: string, descriptor: PropertyDescriptor) {
        Object.assign(value, {
            date: new Date(),
            version: navigator.platform,
            module: name,
        });
        console.log(value);
    };
}
