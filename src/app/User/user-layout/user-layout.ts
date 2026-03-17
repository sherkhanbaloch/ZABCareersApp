import { Component } from '@angular/core';
import { Header } from "../header/header";
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Footer } from "../footer/footer";
import { ScriptLoaderService } from '../../services/script-loader-service';
import { filter } from 'rxjs';


@Component({
  selector: 'app-user-layout',
  imports: [Header, RouterOutlet, Footer],
  templateUrl: './user-layout.html',
  styleUrl: './user-layout.css',
})
export class UserLayout {

  constructor(
    private router: Router,
    private scriptLoader: ScriptLoaderService
  ) { }

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
      '/User/assets/js/vendor/modernizr-3.5.0.min.js',

      '/User/assets/js/vendor/jquery-1.12.4.min.js',
      '/User/assets/js/popper.min.js',
      '/User/assets/js/bootstrap.min.js',

      '/User/assets/js/jquery.slicknav.min.js',

      '/User/assets/js/owl.carousel.min.js',
      '/User/assets/js/slick.min.js',
      '/User/assets/js/price_rangs.js',

      '/User/assets/js/wow.min.js',
      '/User/assets/js/animated.headline.js',
      '/User/assets/js/jquery.magnific-popup.js',

      '/User/assets/js/jquery.scrollUp.min.js',
      '/User/assets/js/jquery.nice-select.min.js',
      '/User/assets/js/jquery.sticky.js',

      '/User/assets/js/contact.js',
      '/User/assets/js/jquery.form.js',
      '/User/assets/js/jquery.validate.min.js',
      '/User/assets/js/mail-script.js',
      '/User/assets/js/jquery.ajaxchimp.min.js',

      '/User/assets/js/plugins.js',
      '/User/assets/js/main.js'
    ];

    this.scriptLoader.loadScripts(scripts).then(() => {
      console.log('All Job Portal JS Loaded Successfully');
    });

  }

}
