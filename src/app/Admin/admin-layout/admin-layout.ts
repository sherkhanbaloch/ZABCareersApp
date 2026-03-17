import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SideBar } from "../side-bar/side-bar";
import { Dashboard } from "../dashboard/dashboard";
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ScriptLoaderService } from '../../services/script-loader-service';
import { filter } from 'rxjs';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-admin-layout',
  imports: [SideBar, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout implements OnInit {

  constructor(private router: Router, private scriptLoader: ScriptLoaderService, private auth: AuthService) {

  }

  ngOnInit() {

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadAllScripts();
      });

    this.loadAllScripts();
  }

  loadAllScripts() {

    const scripts = [
      'Admin/assets/vendor/libs/jquery/jquery.js',
      'Admin/assets/vendor/libs/popper/popper.js',
      'Admin/assets/vendor/js/bootstrap.js',
      'Admin/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js',
      'Admin/assets/vendor/js/menu.js',
      'Admin/assets/vendor/libs/apex-charts/apexcharts.js',
      'Admin/assets/js/helpers.js',
      'Admin/assets/js/config.js',
      'Admin/assets/js/main.js',
      'Admin/assets/js/dashboards-analytics.js',
      'Admin/assets/vendors/ckeditor/ckeditor.js'
    ];

    this.scriptLoader.loadScripts(scripts).then(() => {
      console.log('All Sneat JS Loaded Successfully');
    });

  }

  get UserName(): string | null {
    return this.auth.getUserName();
  }

  get UserRole(): string | null {
    return this.auth.getUserRole();
  }

  AdminLogout() {
    this.auth.logout();
    console.log("Logout Successfull.");
    this.router.navigate(['/admin/login']);
  }

}
