import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-vista-3d',
  template: `<div #caja class="visor"></div>`,
  styles: [`.visor { width: 100vw; height: 100vh; background: #000; }`]
})
export class Vista3dComponent implements OnInit {
  @ViewChild('caja', { static: true }) caja!: ElementRef;


}