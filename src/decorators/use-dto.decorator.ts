import { Constructor } from '@app-types/utils.types';

export const DTO_CLASS_KEY = 'dto_class';

export function UseDto(
  dtoClass: Constructor<any, [any, any?]>,
): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(DTO_CLASS_KEY, dtoClass, target);
  };
}
