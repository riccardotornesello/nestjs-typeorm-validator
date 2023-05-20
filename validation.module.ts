import { Global, Module } from '@nestjs/common';
import { UniqueRule } from './validators/unique.validator';

@Global()
@Module({
  providers: [UniqueRule],
  exports: [UniqueRule],
})
export class ValidationModule {}
