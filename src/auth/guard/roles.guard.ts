import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core'; 
import { ROLES_KEY } from '../decorator';
import { Role } from '@prisma/client';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Récupère les rôles requis depuis le décorateur @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si aucun rôle n'est requis, on autorise l'accès
    if (!requiredRoles) {
      return true;
    }

    // Récupère l'utilisateur depuis la requête
    const { user } = context.switchToHttp().getRequest();
    
    // Si l'utilisateur n'a pas de rôle, on refuse l'accès
    if (!user?.role) {
      throw new ForbiddenException('Access denied - No user role');
    }

    // Vérifie si l'utilisateur a un des rôles requis
    const hasPermission = requiredRoles.some((role) => user.role === role);

    if (!hasPermission) {
      throw new ForbiddenException(
        `Access denied - Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}