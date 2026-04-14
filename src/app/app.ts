import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';


@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DashboardComponent],
  template: '<app-dashboard></app-dashboard>',

})
export class App {
  protected readonly title = signal('devRoadMap');
}
