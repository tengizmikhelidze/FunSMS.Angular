import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MenuItem } from 'primeng/api';
import {StyleClass} from "primeng/styleclass";

@Component({
  selector: 'app-header',
  imports: [
    FormsModule,
    AvatarModule,
    MenuModule,
    ButtonModule,
    ToggleButtonModule,
    StyleClass
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  protected themeService = inject(ThemeService);

  currentUser = this.authService.getCurrentUser();
  currentTheme = this.themeService.theme;

  // ToggleButton requires a writable property for ngModel
  isDarkMode = this.themeService.theme() === 'dark';

  userInitials = computed(() => {
    const user = this.currentUser();
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  });

  themeLabel = computed(() => {
    return this.currentTheme() === 'dark' ? 'Dark Mode' : 'Light Mode';
  });

  onThemeToggle(): void {
    const newTheme = this.isDarkMode ? 'dark' : 'light';
    this.themeService.setTheme(newTheme);
  }

  menuItems: MenuItem[] = [
    {
      label: 'Account',
      icon: 'pi pi-user',
      command: () => this.navigateToAccount()
    },
    {
      label: 'SMS History',
      icon: 'pi pi-history',
      command: () => this.navigateToHistory()
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  navigateToAccount(): void {
    this.router.navigate(['/account']);
  }

  navigateToHistory(): void {
    this.router.navigate(['/history']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.router.navigate(['/auth/login']);
      }
    });
  }
}

