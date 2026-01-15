import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule],
  template: `
    <p-toast position="bottom-center" />
    <router-outlet />
  `,
  styles: [],
})
export class App {
  protected readonly title = signal('smsjoke.angular');
}
