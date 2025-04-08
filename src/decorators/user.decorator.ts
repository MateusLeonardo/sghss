import {
  createParamDecorator,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';

export const UserDecorator = createParamDecorator(
  <K extends keyof User>(
    filter: K | undefined,
    context: ExecutionContext,
  ): User | User[K] => {
    const request = context.switchToHttp().getRequest<{ user?: User }>();

    if (!request.user) {
      throw new NotFoundException('Usuário não encontrado no Request.');
    }

    if (!filter) {
      return request.user;
    }

    return request.user[filter];
  },
);
