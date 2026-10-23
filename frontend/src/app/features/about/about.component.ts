import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * About Us component detailing organization history, mission, and Shariah governance credo.
 */
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {}
