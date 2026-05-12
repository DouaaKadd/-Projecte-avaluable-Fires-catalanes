import { ChangeDetectionStrategy, Component, Signal, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ServeiPreferits } from '../../../service/preferits';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
  /* Poso OnPush perquè la capçalera no depen de la resta de la app,
   nomes depen del signal 'total' del servei de preferides */
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  // Demano una instancia del servei per saber quantes preferides tinc
  private serveiPreferits = inject(ServeiPreferits);

  // Exposo el signal de total perque el pugui llegir la plantilla
  public total: Signal<number>;

  constructor() {
    this.total = this.serveiPreferits.total;
  }
}
