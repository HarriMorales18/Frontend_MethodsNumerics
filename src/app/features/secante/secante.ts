import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SolverService } from '../../core/services/solver.service';
import { RespuestaSecante } from '../../core/models/solvers.model';
import { TablaResultados } from '../../shared/components/tabla-resultados/tabla-resultados';
import { ColumnaTabla } from '../../core/models/table.model';

@Component({
  selector: 'app-secante',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TablaResultados],
  templateUrl: './secante.html',
  styleUrls: ['./secante.css']
})
export class Secante {
  private readonly fb = inject(FormBuilder);
  private readonly solverService = inject(SolverService);

  resultado = signal<RespuestaSecante | null>(null);
  errorMensaje = signal<string | null>(null);
  cargando = signal<boolean>(false);

  columnasTabla: ColumnaTabla[] = [
    { key: 'iteracion', label: '# Iteración' },
    { key: 'x0', label: 'X₀' },
    { key: 'x1', label: 'X₁' },
    { key: 'f_x0', label: 'f(X₀)' },
    { key: 'f_x1', label: 'f(X₁)' },
    { key: 'x_siguiente', label: 'Xᵢ₊₁' },
    { key: 'error', label: 'Error' }
  ];

  form = this.fb.group({
    expresion: ['', [Validators.required]],
    x0: [null, [Validators.required]],
    x1: [null, [Validators.required]],
    tolerancia: [null, [Validators.required, Validators.min(0.000001)]],
    max_iter: [null, [Validators.required, Validators.min(1)]]
  });

  limpiarFormulario(): void {
    this.form.reset({
      expresion: '',
      x0: null,
      x1: null,
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
    const expresion = rawValue.expresion;
    const x0 = rawValue.x0;
    const x1 = rawValue.x1;
    const tolerancia = rawValue.tolerancia;
    const maxIter = rawValue.max_iter;

    if (
      !expresion ||
      x0 == null ||
      x1 == null ||
      tolerancia == null ||
      maxIter == null
    ) {
      return;
    }

    this.cargando.set(true);
    this.errorMensaje.set(null);

    this.solverService.calcularSecante({
      expresion,
      x0: Number(x0),
      x1: Number(x1),
      tolerancia: Number(tolerancia),
      max_iter: Number(maxIter)
    }).subscribe({
      next: (res) => {
        this.resultado.set(res.data);
        this.cargando.set(false);
      },
      error: (err) => {
        this.errorMensaje.set(err.error?.detail || 'Error al procesar el cálculo.');
        this.resultado.set(null);
        this.cargando.set(false);
      }
    });
  }
}