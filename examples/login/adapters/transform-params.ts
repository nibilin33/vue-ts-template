//import 'reflect-metadata';

export function format(target: any, name: string|symbol, descriptor: PropertyDescriptor) {
  const savedValue = descriptor.value;
  // 如果多个参数表 （...args:any[]）
  descriptor.value = (args:string) => {
    console.log(args, 'before');
    args = 'dddd';
    return Reflect.apply(savedValue, target, [args]);
  };
}

export function validate() {

}
