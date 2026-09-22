import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SolverService } from '../../core/services/solver.service';
import { RespuestaNewtonRaphson } from '../../core/models/solvers.model';
import { TablaResultados } from '../../shared/components/tabla-resultados/tabla-resultados';
import { ColumnaTabla } from '../../core/models/table.model';

@Component({
  selector: 'app-newton-raphson',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TablaResultados],
  templateUrl: './newton-raphson.html',
  styleUrls: ['./newton-raphson.css']
})
export class NewtonRaphson {
  private readonly fb = inject(FormBuilder);
  private readonly solverService = inject(SolverService);

  resultado = signal<RespuestaNewtonRaphson | null>(null);
  errorMensaje = signal<string | null>(null);
  cargando = signal<boolean>(false);

  columnasTabla: ColumnaTabla[] = [
    { key: 'iteracion', label: '# Iteración' },
    { key: 'xi', label: 'Xᵢ' },
    { key: 'f_xi', label: 'f(Xᵢ)' },
    { key: 'df_xi', label: "f'(Xᵢ)" },
    { key: 'xi_siguiente', label: 'Xᵢ₊₁' },
    { key: 'error', label: 'Error' }
  ];

  form = this.fb.nonNullable.group({
    expresion: ['x**2 - 2', [Validators.required]],
    x0: [1.0, [Validators.required]],
    tolerancia: [0.001, [Validators.required, Validators.min(0.000001)]],
    max_iter: [100, [Validators.required, Validators.min(1)]]
  });

  procesarCalculo(): void {
    if (this.form.invalid) return;

    this.cargando.set(true);
    this.errorMensaje.set(null);

    this.solverService.calcularNewtonRaphson(this.form.getRawValue()).subscribe({
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