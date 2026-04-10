import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<User | null>;
  isLoggedIn = false;
  isDarkMode = false;
  mobileMenuOpen = false;
  isMobileMenu = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.checkMobileMenu();
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
    });

    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkMobileMenu();
  }

  checkMobileMenu(): void {
    this.isMobileMenu = window.innerWidth <= 768;
  }

  toggleMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMenu(): void {
    this.mobileMenuOpen = false;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
