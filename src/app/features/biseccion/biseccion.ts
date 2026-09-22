import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SolverService } from '../../core/services/solver.service';
import { RespuestaIntervalo } from '../../core/models/solvers.model';
import { TablaResultados } from '../../shared/components/tabla-resultados/tabla-resultados';
import { ColumnaTabla } from '../../core/models/table.model';

@Component({
  selector: 'app-biseccion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TablaResultados],
  templateUrl: './biseccion.html',
  styleUrls: ['./biseccion.css']
})
export class Biseccion {
  private readonly fb = inject(FormBuilder);
  private readonly solverService = inject(SolverService);

  resultado = signal<RespuestaIntervalo | null>(null);
  errorMensaje = signal<string | null>(null);
  cargando = signal<boolean>(false);

  columnasTabla: ColumnaTabla[] = [
    { key: 'iteracion', label: '# Iteración' },
    { key: 'a', label: 'a' },
    { key: 'b', label: 'b' },
    { key: 'xr', label: 'Xr (Punto Medio)' },
    { key: 'f_xr', label: 'f(Xr)' },
    { key: 'error', label: 'Error' }
  ];

  form = this.fb.nonNullable.group({
    expresion: ['x**3 - x - 2', [Validators.required]],
    a: [1.0, [Validators.required]],
    b: [2.0, [Validators.required]],
    tolerancia: [0.01, [Validators.required, Validators.min(0.000001)]],
    max_iter: [100, [Validators.required, Validators.min(1)]]
  });

  procesarCalculo(): void {
    if (this.form.invalid) return;

    this.cargando.set(true);
    this.errorMensaje.set(null);

    this.solverService.calcularBiseccion(this.form.getRawValue()).subscribe({
      next: (res) => {
        const iteracionesRaw = res.data.iteraciones || [];

        // Mapeo de claves adaptado a 'c' y 'fc' de la respuesta JSON
        const iteracionesNormalizadas = iteracionesRaw.map((it: any) => ({
          ...it,
          xr: it.xr ?? it.x_r ?? it.c ?? it.p ?? it.pm,
          f_xr: it.f_xr ?? it.fc ?? it.f_c ?? it.f_p ?? it.f_pm
        }));

        // Extracción de la raíz aproximada del último ciclo realizado
        const ultimaIteracion = iteracionesNormalizadas[iteracionesNormalizadas.length - 1];
        const raizCalculada = res.data.raiz ?? ultimaIteracion?.xr ?? null;

        this.resultado.set({
          ...res.data,
          raiz: raizCalculada,
          iteraciones: iteracionesNormalizadas
        });

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