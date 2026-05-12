import { ChangeDetectionStrategy, Component, Signal, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATALAN_FAIRS } from '../../../model/fairs';
import { ServeiPreferits } from '../../../service/preferits';
import { FiraCard } from '../fira-card/fira-card';

@Component({
  selector: 'app-preferides',
  imports: [RouterLink, FiraCard],
  templateUrl: './preferides.html',
  styleUrl: './preferides.css',
  // Poso OnPush perque el component nomes depen del signal de codis del servei de preferides
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Preferides {
  // Demano el servei de preferides per saber quines fires tinc marcades
  private serveiPreferits = inject(ServeiPreferits);

  /* Llista de fires marcades com a preferides. Es recalcula sola quan afegeixo o trec una preferida
   des de qualsevol punt de la app, perque depen del signal del servei. */
  public firesPreferides: Signal<any[]>;

  // Text del comptador en singular o plural. 
  public textComptador: Signal<string>;

  constructor() {
    this.firesPreferides = computed(() => {
      const codis = this.serveiPreferits.codis();
      return (CATALAN_FAIRS as any[]).filter(fira => codis.includes(fira.activityId));
    });

    this.textComptador = computed(() => {
      const total = this.firesPreferides().length;
      if (total === 1) {
        return total + ' fira preferida';
      } else {
        return total + ' fires preferides';
      }
    });
  }
}
