import { Component } from '@angular/core';
import { Vista3dComponent } from './vista-3d.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Vista3dComponent],
  template: `<app-vista-3d></app-vista-3d>`,
})
export class App {} 
