import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
}

