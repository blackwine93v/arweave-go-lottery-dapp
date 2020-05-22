declare class Odometer {
  constructor(options: object) {}

  update: Function;
}

declare module 'odometer' {
  export = Odometer;
}
