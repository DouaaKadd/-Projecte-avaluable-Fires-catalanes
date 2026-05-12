import { ChangeDetectionStrategy, Component, Signal, WritableSignal, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATALAN_FAIRS } from '../../../model/fairs';
import { ServeiImatges } from '../../../service/imatges';

/* Tipus d'una entrada del directori: nom de la comarca, quantitat de fires i identificador
que faig servir per generar la URL determinista de la imatge.*/

interface EntradaComarca {
  nom: string;
  quantitat: number;
  regionId: string;
}

@Component({
  selector: 'app-llista-comarques',
  imports: [RouterLink],
  templateUrl: './llista-comarques.html',
  styleUrl: './llista-comarques.css',
  // Aplico OnPush: les dades són estàtiques i la paginació es gestiona amb signals.
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LlistaComarques {
  // Mida de cada bloc de paginació: quantes comarques mostro alhora.
  private static readonly MIDA_PAGINA = 10;

  // Servei que es comunica amb la Viquipèdia per obtenir imatges reals de cada comarca.
  private serveiImatges = inject(ServeiImatges);

  // Llista completa de comarques calculada a partir del JSON de fires.
  public comarques: EntradaComarca[];

  /* Quantitat de comarques que mostro actualment al grid. Comença a 10 i s'incrementa
   cada cop que l'usuari prem el botó "Carregar més comarques".*/

  public quantitatVisible: WritableSignal<number>;

  // Subconjunt de comarques que es renderitzen ara mateix. Es recalcula sol quan canvia la paginació.
  public comarquesVisibles: Signal<EntradaComarca[]>;

  // Si encara queden comarques per carregar modtro el botó "Carregar més".
  public hiHaMes: Signal<boolean>;

  /* Diccionari de URLs d'imatges per nom de comarca. Llegeix els signals del serveis
   i fa fallback a Picsum si no hi ha imatge.*/
  public urlsImatges: Signal<Record<string, string>>;

  constructor() {
    this.comarques = this.calcularComarques();
    this.quantitatVisible = signal(LlistaComarques.MIDA_PAGINA);
    this.comarquesVisibles = computed(() => this.comarques.slice(0, this.quantitatVisible()));
    this.hiHaMes = computed(() => this.quantitatVisible() < this.comarques.length);

    this.urlsImatges = computed(() => {
      /* Llegeixo el signal de cada comarca; si encara no hi ha resposta de la Viquipèdia, faig
       fallback a una imatge de Picsum, així sempre es veu alguna imatge. */
      const map: Record<string, string> = {};
      for (const c of this.comarques) {
        const imatgeWiki = this.serveiImatges.obtenirImatge(c.nom)();
        if (imatgeWiki) {
          map[c.nom] = imatgeWiki;
        } else {
          map[c.nom] = 'https://picsum.photos/seed/comarca-' + c.regionId + '/400/250';
        }
      }
      return map;
    });
  }

  // Amplio la quantitat visible amb un bloc més. Si me'n passo, el slice ja s'encarrega de tallar.
  public onCarregarMes(): void {
    this.quantitatVisible.update(valor => valor + LlistaComarques.MIDA_PAGINA);
  }

  /* Faig scroll suau fins al grid de comarques quan l'usuari prem el botó, pero abans
   comprovo que existeixi 'document'  */
  public onComencarExploracio(): void {
    if (typeof document === 'undefined') return;
    const grid = document.getElementById('directori-grid');
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  private calcularComarques(): EntradaComarca[] {
    // Faig servir un Map per anar comptant fires i guardant el regionId associat a cada comarca.
    const comptador = new Map<string, { quantitat: number; regionId: string }>();
    for (const fira of (CATALAN_FAIRS as any[])) {
      const existent = comptador.get(fira.regionName);
      if (existent) {
        existent.quantitat += 1;
      } else {
        comptador.set(fira.regionName, { quantitat: 1, regionId: fira.regionId });
      }
    }

    // Converteixo el Map en una llista i l'ordeno alfabèticament pel nom de la comarca.
    return [...comptador.entries()]
      .map(([nom, dades]) => ({ nom, quantitat: dades.quantitat, regionId: dades.regionId }))
      .sort((a, b) => a.nom.localeCompare(b.nom, 'ca'));
  }
}
