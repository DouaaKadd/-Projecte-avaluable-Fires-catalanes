import { Routes } from '@angular/router';
import { LlistaComarques } from './view/elements/llista-comarques/llista-comarques';
import { LlistaFires } from './view/elements/llista-fires/llista-fires';
import { Preferides } from './view/elements/preferides/preferides';
import { PaginaNoTrobada } from './view/elements/pagina-no-trobada/pagina-no-trobada';

/* Aqui defineixo les rutes de l'app.
 L'estructura es una subruta estatica que també te una de parametritzada . */
export const routes: Routes = [
  {
    path: 'comarques',
    children: [
      // Pagina principal: llista de totes les comarques
      { path: '', component: LlistaComarques },
      /* Pagina de detall: fires d'una comarca concreta. ':nomComarca' es el parametre
       que arribara al component LlistaFires via InputSignal. */
      { path: ':nomComarca', component: LlistaFires }
    ]
  },
  // Pagina amb totes les fires que tinc marcades com a preferides
  { path: 'preferides', component: Preferides },
  // Quan algu entra a l'arrel sense fragment el redirigeixo a la llista de comarques
  { path: '', redirectTo: 'comarques', pathMatch: 'full' },
  // Qualsevol altra URL no definida cau aqui i mostra la pagina 404
  { path: '**', component: PaginaNoTrobada }
];
