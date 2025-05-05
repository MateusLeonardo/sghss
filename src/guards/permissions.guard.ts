import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core'; 
import { CaslAbilityService, PermActions, PermissionResource } from 'src/casl/casl-ability/casl-ability.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly caslAbilityService: CaslAbilityService,
    private readonly reflector: Reflector, 
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermission = this.reflector.get<{ action: string, resource: string }>('permissions', context.getHandler());

    if (!requiredPermission) {
      return true; 
    }

    const { action, resource } = requiredPermission;

    const resourceTyped = resource as PermissionResource;

    const request = context.switchToHttp().getRequest();
    const user = request.user; 

    if (!user) {
      throw new ForbiddenException('Usuário não encontrado.');
    }
    
    const ability = this.caslAbilityService.createForUser(user);
    
    if (!ability.can(action as PermActions, resourceTyped)) {
      throw new ForbiddenException('Você não tem permissão para acessar este recurso.');
    }

    return true;
  }
}
