import { CanActivate, ExecutionContext } from '@nestjs/common';

/**
 * Mock guard that always allows access
 * Use with .overrideGuard(YourGuard).useValue(mockGuard)
 */
export const mockGuard: CanActivate = {
  canActivate: (context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    // Set default user if not already set
    if (!request.user) {
      request.user = {
        id: 1,
        email: 'test@test.com',
        roles: [],
      };
    }
    return true;
  },
};
