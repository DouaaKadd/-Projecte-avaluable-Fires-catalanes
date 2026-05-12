import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagina-no-trobada',
  imports: [RouterLink],
  templateUrl: './pagina-no-trobada.html',
  styleUrl: './pagina-no-trobada.css',
  // Poso OnPush perque el component es estatic, no cal cap deteccio de canvis
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginaNoTrobada {}
