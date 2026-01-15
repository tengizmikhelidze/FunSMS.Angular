import { Component, ChangeDetectionStrategy, inject, computed, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { LanguageService } from '../../../core/services/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { Menu, MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  imports: [
    FormsModule,
    TranslateModule,
    AvatarModule,
    MenuModule,
    ButtonModule,
    ToggleButtonModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  protected themeService = inject(ThemeService);
  protected languageService = inject(LanguageService);

  @ViewChild('menu') menu?: Menu;

  currentUser = this.authService.getCurrentUser();
  currentTheme = this.themeService.theme;

  // ToggleButton requires a writable property for ngModel
  isDarkMode = this.themeService.theme() === 'dark';

  currentLanguage = this.languageService.currentLanguage;
  currentLanguageOption = computed(() => this.languageService.getCurrentLanguageOption());

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

  menuItems = computed<MenuItem[]>(() => {
    const user = this.currentUser();
    const baseItems: MenuItem[] = [
      {
        label: 'Account',
        icon: 'pi pi-user',
        command: () => this.navigateToAccount()
      },
      {
        label: 'SMS History',
        icon: 'pi pi-history',
        command: () => this.navigateToHistory()
      }
    ];

    // Add admin panel if user is admin
    if (user?.role === 'admin') {
      baseItems.push({
        label: 'Admin Panel',
        icon: 'pi pi-shield',
        command: () => this.navigateToAdmin()
      });
    }

    // Add separator and logout
    baseItems.push(
      { separator: true },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    );

    return baseItems;
  });

  navigateToAccount(): void {
    this.menu?.hide();
    setTimeout(() => this.router.navigate(['/account']), 100);
  }

  navigateToHistory(): void {
    this.menu?.hide();
    setTimeout(() => this.router.navigate(['/sms-history']), 100);
  }

  navigateToAdmin(): void {
    this.menu?.hide();
    setTimeout(() => this.router.navigate(['/admin']), 100);
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.menu?.hide();
    setTimeout(() => {
      this.authService.logout().subscribe({
        next: () => {
          this.router.navigate(['/auth/login']);
        },
        error: () => {
          this.router.navigate(['/auth/login']);
        }
      });
    }, 100);
  }
}

