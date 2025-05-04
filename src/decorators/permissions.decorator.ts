import { SetMetadata } from '@nestjs/common';
import { PermActions, PermissionResource } from 'src/casl/casl-ability/casl-ability.service';

export const Permissions = (action: PermActions, resource: PermissionResource) => {
  return SetMetadata('permissions', { action, resource });
};