import { AuthGuard } from "@nestjs/passport";

export class JwtAuthGuard extends AuthGuard('jwt') {JwtAuthGuard
  constructor() {
    super();
  }
}