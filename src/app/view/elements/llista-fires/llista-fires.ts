import { ChangeDetectionStrategy, Component, InputSignal, Signal, WritableSignal, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATALAN_FAIRS } from '../../../model/fairs';
import { FiraCard } from '../fira-card/fira-card';

@Component({
  selector: 'app-llista-fires',
  imports: [RouterLink, FiraCard],
  templateUrl: './llista-fires.html',
  styleUrl: './llista-fires.css',
  // Poso OnPush perquè la branca del llistat de fires no depen de la capçalera
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LlistaFires {
  /* Rebo el nom de la comarca directament del paràmetre ':nomComarca' gracies a
   withComponentInputBinding(). El nom de l'InputSignal ha de coincidir amb el del parametre de la ruta. */
  public nomComarca: InputSignal<string> = input.required<string>();

  // Llista de fires filtrades, es recalcula sola quan canvia 'nomComarca'
  public fires: Signal<any[]>;

  // Text del comptador amb singular/plural.
  public textComptador: Signal<string>;

  /* Posició actual dins del carrusel, es a dir, l'index de la primera card visible.
   Faig servir linkedSignal perque es reseteji a 0 quan canvia la comarca, pero a la vegada
   puc modificar-lo a mà quan l'usuari clica les fletxes */
  public indexActual: WritableSignal<number>;

  // Estat dels botons del carrusel: si encara hi ha fires anteriors o seguents per mostrar
  public potAnarEnrere: Signal<boolean>;
  public potAnarEndavant: Signal<boolean>;

  constructor() {
    this.fires = computed(() => {
      const nom = this.nomComarca();
      return (CATALAN_FAIRS as any[]).filter(fira => fira.regionName === nom);
    });

    this.textComptador = computed(() => {
      const total = this.fires().length;
      if (total === 1) {
        return total + ' fira';
      } else {
        return total + ' fires';
      }
    });

    // Cada cop que canvia la comarca el carrusel torna a la primera fira
    this.indexActual = linkedSignal({
      source: () => this.nomComarca(),
      computation: () => 0
    });

    this.potAnarEnrere = computed(() => this.indexActual() > 0);
    this.potAnarEndavant = computed(() => this.indexActual() < this.fires().length - 1);
  }

  // Vaig una posicio enrere al carrusel, pero sense passar de 0
  public onAnterior(): void {
    this.indexActual.update(valor => Math.max(0, valor - 1));
  }

  // Vaig una posicio endavant sense passar de la ultima fira
  public onSeguent(): void {
    const ultim = this.fires().length - 1;
    this.indexActual.update(valor => Math.min(ultim, valor + 1));
  }
}
