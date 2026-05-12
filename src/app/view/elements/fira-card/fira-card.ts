import { ChangeDetectionStrategy, Component, Signal, computed, inject, input } from '@angular/core';
import { ServeiPreferits } from '../../../service/preferits';

@Component({
  selector: 'app-fira-card',
  imports: [],
  templateUrl: './fira-card.html',
  styleUrl: './fira-card.css',
  // Poso OnPush perquè la targeta nomes depen del seu input 'fira' i del signal de preferides
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FiraCard {
  // Demano la fira al component pare amb l'API d'inputs 
  public fira = input.required<any>();

  // Necessito el servei de preferides per saber si la fira esta marcada i per poder-la alternar
  private serveiPreferits = inject(ServeiPreferits);

  /* Aquest signal em diu si la fira actual esta marcada com a preferida.
   Es recalcula sol quan canvia el signal intern del servei. */
  public esPreferida: Signal<boolean>;

  /* Text que mostro al boto del cor segons l'estat actual. */
  public textBotoCor: Signal<string>;

  // Icona Material Symbols que representa visualment el sector de la fira
  public icona: Signal<string>;

  /* URL del web de la fira ja normalitzada amb protocol. Algunes fires del JSON tenen el camp
   'web' sense 'http://' davant (per exemple "www.copons.cat") i sense aixo el navegador les
   tractaria com a rutes relatives a localhost. */
  public urlWeb: Signal<string>;

  /* URL de la imatge decorativa de la card. Faig servir Loremflickr amb paraules clau segons
   el sector, perque cada fira tingui sempre la mateixa imatge. */
  public urlImatge: Signal<string>;

  constructor() {
    this.esPreferida = computed(() =>
      this.serveiPreferits.esPreferida(this.fira().activityId)
    );

    this.textBotoCor = computed(() => {
      if (this.esPreferida()) {
        return 'Treure de preferides';
      } else {
        return 'Afegir a preferides';
      }
    });

    this.icona = computed(() => this.calcularIcona(this.fira().sectorName));

    this.urlWeb = computed(() => this.calcularUrlWeb(this.fira().web));

    this.urlImatge = computed(() => {
      const id = this.fira().activityId;
      const tema = this.calcularTemaImatge(this.fira().sectorName);
      /* Loremflickr accepta paraules clau separades per comes per buscar fotos tematiques.
       Amb 'lock' fixo la imatge segons l'activityId perque cada fira tingui sempre la mateixa imatge. */
      return 'https://loremflickr.com/400/300/' + tema + '?lock=' + id;
    });
  }

  /* Decideixo quines paraules clau li passo a Loremflickr segons el sector de la fira,
   perque la imatge tingui relacio temàtica amb el contingut. */
  private calcularTemaImatge(sectorName: string): string {
    const nom = sectorName.toLowerCase();

    if (nom.includes('alimentació') || nom.includes('vins') || nom.includes('hoteleria')) {
      return 'food,market';
    } else if (nom.includes('artesania')) {
      return 'craft,artisan';
    } else if (nom.includes('automoció') || nom.includes('vehicle')) {
      return 'car,classic';
    } else if (nom.includes('moda') || nom.includes('tèxtil')) {
      return 'fashion';
    } else if (nom.includes('salut') || nom.includes('bellesa') || nom.includes('estètic')) {
      return 'wellness,nature';
    } else if (nom.includes('esport')) {
      return 'sport';
    } else if (nom.includes('agricul') || nom.includes('ramad') || nom.includes('jardin')) {
      return 'farm,agriculture';
    } else if (nom.includes('tecnolog') || nom.includes('informàtic') || nom.includes('electrònic')) {
      return 'technology';
    } else if (nom.includes('infantil') || nom.includes('joguin')) {
      return 'toys,children';
    } else if (nom.includes('construcc')) {
      return 'construction';
    } else if (nom.includes('llibre') || nom.includes('cultura')) {
      return 'books,festival';
    } else if (nom.includes('música')) {
      return 'concert,music';
    } else {
      return 'fair,market,festival';
    }
  }

  /* Normalitzo la URL del web: si no comença per 'http://' o 'https://' li poso 'https://' davant.
   Si el camp ve buit o null, retorno cadena buida. */
  private calcularUrlWeb(web: string | null | undefined): string {
    if (web == null) {
      return '';
    }
    const text = String(web).trim();
    if (text.length === 0) {
      return '';
    }
    if (text.startsWith('http://') || text.startsWith('https://')) {
      return text;
    } else {
      return 'https://' + text;
    }
  }

  /* Quan l'usuari clica el botó del cor, alterno l'estat de preferida d'aquesta fira*/
  public onAlternarPreferida(esdeveniment: MouseEvent): void {
    esdeveniment.stopPropagation();
    this.serveiPreferits.alternar(this.fira().activityId);
  }

  // Decideixo quina icona Material Symbols toca segons les paraules clau del nom del sector. 
  private calcularIcona(sectorName: string): string {
    const nom = sectorName.toLowerCase();

    if (nom.includes('alimentació') || nom.includes('vins') || nom.includes('hoteleria')) {
      return 'restaurant';
    } else if (nom.includes('artesania')) {
      return 'palette';
    } else if (nom.includes('automoció') || nom.includes('vehicle')) {
      return 'directions_car';
    } else if (nom.includes('moda') || nom.includes('tèxtil')) {
      return 'checkroom';
    } else if (nom.includes('salut') || nom.includes('bellesa') || nom.includes('estètic')) {
      return 'spa';
    } else if (nom.includes('esport')) {
      return 'sports_soccer';
    } else if (nom.includes('agricul') || nom.includes('ramad') || nom.includes('jardin')) {
      return 'agriculture';
    } else if (nom.includes('tecnolog') || nom.includes('informàtic') || nom.includes('electrònic')) {
      return 'computer';
    } else if (nom.includes('infantil') || nom.includes('joguin')) {
      return 'child_care';
    } else if (nom.includes('construcc')) {
      return 'construction';
    } else if (nom.includes('llibre') || nom.includes('cultura')) {
      return 'menu_book';
    } else if (nom.includes('música')) {
      return 'music_note';
    } else {
      return 'storefront';
    }
  }
}
