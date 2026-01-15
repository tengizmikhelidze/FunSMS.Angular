import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  imports: [
    AvatarModule,
    MenuModule,
    ButtonModule
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

  themeIcon = computed(() => {
    return this.currentTheme() === 'dark' ? 'pi pi-sun' : 'pi pi-moon';
  });

  themeLabel = computed(() => {
    return this.currentTheme() === 'dark' ? 'Light Mode' : 'Dark Mode';
  });

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

