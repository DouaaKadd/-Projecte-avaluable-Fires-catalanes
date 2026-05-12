import { Injectable, Signal, WritableSignal, computed, signal } from '@angular/core';

// La clau que faig servir per guardar les meves preferides al localStorage
const CLAU_LOCAL_STORAGE = 'fires-preferides';

@Injectable({ providedIn: 'root' })
export class ServeiPreferits {
  /* Aquí guardo els codis (activityId) de les fires preferides com un WritableSignal.
   El deixo privat perquè vull que només es pugui modificar des de dins del servei. */
  private _codis: WritableSignal<string[]>;

  // Exposo el signal en només lectura perqué els components el puguin llegir però no escriure-hi directament.
  public codis: Signal<string[]>;

  // Comptador de preferides, es recalcula sol quan canvien els codis
  public total: Signal<number>;

  constructor() {
    this._codis = signal<string[]>([]);
    this.codis = this._codis.asReadonly();
    this.total = computed(() => this._codis().length);

    // Quan creo el servei intento recuperar les preferides que tenia de la última visita
    this.carregar();
  }

  // Em diu si una fira esta marcada com a preferida o no
  public esPreferida(codiFira: string): boolean {
    return this._codis().includes(codiFira);
  }

  /* Si la fira ja era preferida la trec, si no l'afegeixo. Despres guardo el canvi al localStorage.
   Faig servir update() per crear un nou array (els signals detecten canvis per referencia). */
  public alternar(codiFira: string): void {
    this._codis.update(actuals => {
      if (actuals.includes(codiFira)) {
        return actuals.filter(codi => codi !== codiFira);
      }
      return [...actuals, codiFira];
    });
    this.guardar();
  }

  // Guardo la llista de codis al localStorage en format JSON
  public guardar(): void {
    // Compruebo que existeixi el localStorage perquè durant el prerender d'SSR no hi és
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(CLAU_LOCAL_STORAGE, JSON.stringify(this._codis()));
  }

  // Recupero la llista del localStorage. Retorno true si he trobat dades, false si no
  public carregar(): boolean {
    if (typeof localStorage === 'undefined') return false;
    const dades = localStorage.getItem(CLAU_LOCAL_STORAGE);
    if (dades != null) {
      this._codis.set(JSON.parse(dades));
      return true;
    }
    return false;
  }

  // Esborro totes les preferides, tant del localStorage com del signal
  public esborrar(): void {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(CLAU_LOCAL_STORAGE);
    this._codis.set([]);
  }
}
