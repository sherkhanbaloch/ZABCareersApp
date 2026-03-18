import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {

  constructor(private router: Router, private auth: AuthService, private toastr: ToastrService) { }

  isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  LogoutUser(): void {
    this.auth.logout();
    this.toastr.success("Logout Successfull.", 'Success', { closeButton: true });
    this.router.navigate(['/user/home']);
  }

}
