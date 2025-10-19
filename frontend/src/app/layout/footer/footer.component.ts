import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit {
  currYear: number = 0;
  pathName: string = '';
  isBrowser = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.pathName = window.location.pathname;
    }

    this.currYear = new Date().getFullYear();
  }

  backToTop() {
    if (this.isBrowser) {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
  }
}
