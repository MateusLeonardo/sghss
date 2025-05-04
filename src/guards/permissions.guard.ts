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
    // Obter os metadados de permissões definidos pelo decorador
    const requiredPermission = this.reflector.get<{ action: string, resource: string }>('permissions', context.getHandler());

    if (!requiredPermission) {
      return true; // Se não houver permissões definidas, a rota está aberta
    }

    const { action, resource } = requiredPermission;

    // Garantir que o resource seja do tipo PermissionResource
    const resourceTyped = resource as PermissionResource;

    const request = context.switchToHttp().getRequest();
    const user = request.user; // O usuário autenticado

    if (!user) {
      throw new ForbiddenException('Usuário não encontrado.');
    }

    // Criar a habilidade (ability) do usuário
    const ability = this.caslAbilityService.createForUser(user);

    // Verificar se o usuário tem permissão para realizar a ação no recurso
    if (!ability.can(action as PermActions, resourceTyped)) {
      throw new ForbiddenException('Você não tem permissão para acessar este recurso.');
    }

    return true;
  }
}
