import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth-service';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const auth = inject(AuthService);

  const requiredRole = route.data['role'];
  const userRole = auth.getUserRole();

  if (!auth.isLoggedIn()) {
    if (state.url.startsWith('/admin')) {
      router.navigate(['/admin/login']);
    } else {
      router.navigate(['/user/user-login']);
    }
    return false;
  }

  // 🔥 Role-based check
  if (requiredRole && userRole !== requiredRole) {
    router.navigate(['/user/home']); // unauthorized access
    return false;
  }

  return true;

};
