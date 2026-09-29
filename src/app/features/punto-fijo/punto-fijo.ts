import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SolverService } from '../../core/services/solver.service';
import { RespuestaPuntoFijo } from '../../core/models/solvers.model';
import { TablaResultados } from '../../shared/components/tabla-resultados/tabla-resultados';
import { ColumnaTabla } from '../../core/models/table.model';

@Component({
  selector: 'app-punto-fijo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TablaResultados],
  templateUrl: './punto-fijo.html',
  styleUrls: ['./punto-fijo.css']
})
export class PuntoFijo {
  private readonly fb = inject(FormBuilder);
  private readonly solverService = inject(SolverService);

  resultado = signal<RespuestaPuntoFijo | null>(null);
  errorMensaje = signal<string | null>(null);
  cargando = signal<boolean>(false);

  columnasTabla: ColumnaTabla[] = [
    { key: 'iteracion', label: '# Iteración' },
    { key: 'p0', label: 'P₀' },
    { key: 'p1', label: 'P₁ = g(P₀)' },
    { key: 'error', label: 'Error (|P₁ - P₀|)' }
  ];

  form = this.fb.group({
    expresion_g: ['', [Validators.required]],
    x0: [null, [Validators.required]],
    tolerancia: [null, [Validators.required, Validators.min(0.000001)]],
    max_iter: [null, [Validators.required, Validators.min(1)]]
  });

  limpiarFormulario(): void {
    this.form.reset({
      expresion_g: '',
      x0: null,
      tolerancia: null,
      max_iter: null
    });
    this.resultado.set(null);
    this.errorMensaje.set(null);
    this.cargando.set(false);
  }

  procesarCalculo(): void {
    if (this.form.invalid) return;

    const rawValue = this.form.getRawValue();
    const expresionG = rawValue.expresion_g;
    const x0 = rawValue.x0;
    const tolerancia = rawValue.tolerancia;
    const maxIter = rawValue.max_iter;

    if (!expresionG || x0 == null || tolerancia == null || maxIter == null) {
      return;
    }

    this.cargando.set(true);
    this.errorMensaje.set(null);

    this.solverService.calcularPuntoFijo({
      expresion_g: expresionG,
      x0: Number(x0),
      tolerancia: Number(tolerancia),
      max_iter: Number(maxIter)
    }).subscribe({
      next: (res) => {
        this.resultado.set(res.data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.errorMensaje.set(err.error?.detail || 'Error al procesar el método.');
        this.resultado.set(null);
        this.cargando.set(false);
      }
    });
  }
}