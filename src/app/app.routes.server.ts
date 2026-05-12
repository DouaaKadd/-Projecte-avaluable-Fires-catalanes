import { RenderMode, ServerRoute } from '@angular/ssr';
import { CATALAN_FAIRS } from './model/fairs';

/* Aqui prerenderitzo totes les rutes perque GitHub Pages nomes serveix fitxers estatics.
 Per la ruta amb parametre faig servir getPrerenderParams per generar un HTML per cada comarca. */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'comarques/:nomComarca',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      // Recorro totes les fires i em quedo amb la llista unica de noms de comarca
      const comarques = new Set<string>();
      for (const fira of (CATALAN_FAIRS as any[])) {
        comarques.add(fira.regionName);
      }
      // Retorno un objecte per cada comarca amb la clau que coincideix amb el nom del parametre
      return [...comarques].map(nomComarca => ({ nomComarca }));
    }
  },
  { path: 'preferides', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Prerender }
];
