export interface InterfaceReport<T> {
  template: Template;
  data: T;
}

interface Template {
  name: string;
}
