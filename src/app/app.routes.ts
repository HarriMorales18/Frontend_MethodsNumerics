import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'biseccion', pathMatch: 'full' },
  {
    path: 'biseccion',
    loadComponent: () => import('./features/biseccion/biseccion').then(m => m.Biseccion)
  },
  {
    path: 'falsa-posicion',
    loadComponent: () => import('./features/falsa-posicion/falsa-posicion').then(m => m.FalsaPosicion)
  },
  {
    path: 'punto-fijo',
    loadComponent: () => import('./features/punto-fijo/punto-fijo').then(m => m.PuntoFijo)
  },
  {
    path: 'newton-raphson',
    loadComponent: () => import('./features/newton-raphson/newton-raphson').then(m => m.NewtonRaphson)
  },
  { path: '**', redirectTo: 'biseccion' }
];