import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.Service';
import {jwtDecode} from 'jwt-decode';

interface JwtPayload {
  id: string;
  roles: string[];
  exp?: number;
}

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const token = this.authService.getToken();
    if (!token) {
      return this.router.parseUrl('/login');
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      const allowedRoles: string[] = route.data['roles'];
      if (!allowedRoles || allowedRoles.length === 0) {
        return true;
      }

      const hasRole = decoded.roles.some((role) => allowedRoles.includes(role));
      if (!hasRole) {
        return this.router.parseUrl('/');
      }

      return true;
    } catch (err) {
      return this.router.parseUrl('/login');
    }
  }
}
