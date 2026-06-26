import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const auth = inject(AuthService);

  const requiredRole = route.data['role'];
  const userRole = auth.getUserRole();

if (!auth.isLoggedIn()) {

    router.navigate([
        state.url.startsWith('/admin')
            ? '/admin/login'
            : '/user/user-login'
    ]);

    return false;
}

  // 🔥 Role-based check
  if (requiredRole && userRole !== requiredRole) {
    router.navigate(['/user/home']); // unauthorized access
    return false;
  }

  return true;

};
