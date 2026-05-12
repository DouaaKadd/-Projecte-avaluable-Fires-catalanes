import { Injectable, Signal, WritableSignal, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ServeiImatges {
  /* Cache en memoria: per cada comarca que demano, guardo un signal amb la URL de la imatge.
   El signal es crea de seguida amb null i s'omple quan arriba la resposta de la Viquipèdia.
   Els components que llegeixen el signal es re-renderitzen sols quan canvia el valor. */
  private cache: Map<string, WritableSignal<string | null>> = new Map();

  /* Em retorna el signal de la imatge per una comarca. Si encara no l'havia demanat creo el signal,
   llanço la consulta a la Viquipèdia en paral·lel i retorno el signal amb valor inicial null.
   Quan arribi la resposta de la API el signal s'actualitza i els components es renderitzen. */
  public obtenirImatge(nomComarca: string): Signal<string | null> {
    const existent = this.cache.get(nomComarca);
    if (existent) {
      return existent.asReadonly();
    }

    const nou = signal<string | null>(null);
    this.cache.set(nomComarca, nou);

    /* Durant el prerender de SSR no tinc 'window' i no vull fer crides de xarxa,
     ja s'encarregara el client de fer la consulta despres de la hidratacio */
    if (typeof window !== 'undefined') {
      this.consultarViquipedia(nomComarca, nou);
    }

    return nou.asReadonly();
  }

  /* Faig la crida a la Viquipèdia en català per obtenir el resum de l'article de la comarca.
   Si l'article te miniatura, agafo la url. Si no, deixo el signal a null i ja s'encarregarà el
   component de mostrar el fallback de Picsum. */
  private async consultarViquipedia(nomComarca: string, sig: WritableSignal<string | null>): Promise<void> {
    try {
      const titol = encodeURIComponent(nomComarca);
      const url = 'https://ca.wikipedia.org/api/rest_v1/page/summary/' + titol;
      const resposta = await fetch(url);
      if (!resposta.ok) return;
      const dades = await resposta.json();
      const imatge = dades?.thumbnail?.source;
      if (typeof imatge === 'string' && imatge.length > 0) {
        sig.set(imatge);
      }
    } catch {
      // Si peta per xarxa o CORS no faig res, el signal es queda a null i ja s'utilitzarà el fallback
    }
  }
}
