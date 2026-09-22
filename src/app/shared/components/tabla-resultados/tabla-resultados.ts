import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ColumnaTabla } from '../../../core/models/table.model';

@Component({
  selector: 'app-tabla-resultados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-resultados.html',
  styleUrl: './tabla-resultados.css',
})
export class TablaResultados {
  @Input({ required: true }) columnas: ColumnaTabla[] = [];
  @Input({ required: true }) filas: Record<string, any>[] = [];
}
