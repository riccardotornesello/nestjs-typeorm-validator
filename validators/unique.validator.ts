import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraintInterface,
  ValidatorConstraint,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
import { EntityManager, EntityTarget } from 'typeorm';

@ValidatorConstraint({ name: 'UniqueRule', async: true })
@Injectable()
export class UniqueRule implements ValidatorConstraintInterface {
  constructor(private entityManager: EntityManager) {}

  async validate(value: string, args: any) {
    const [entity, field]: [EntityTarget<any>, string] = args.constraints;
    const foundCount = await this.entityManager.count(entity, {
      where: {
        [field]: value,
      },
    });
    return foundCount === 0;
  }

  defaultMessage(args: ValidationArguments) {
    return `Value ${args.value} already exists`;
  }
}

export function Unique(
  entity: EntityTarget<any>,
  field: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity, field],
      validator: UniqueRule,
    });
  };
}
