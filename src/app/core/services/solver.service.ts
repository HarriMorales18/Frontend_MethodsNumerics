import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  RequestIntervalo,
  RespuestaIntervalo,
  RequestPuntoFijo,
  RespuestaPuntoFijo,
  RequestNewtonRaphson,
  RespuestaNewtonRaphson,
} from '../models/solvers.model';

@Injectable({
  providedIn: 'root',
})
export class SolverService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8000/api';

  calcularBiseccion(payload: RequestIntervalo): Observable<ApiResponse<RespuestaIntervalo>> {
    return this.http.post<ApiResponse<RespuestaIntervalo>>(`${this.apiUrl}/biseccion`, payload);
  }

  calcularFalsaPosicion(payload: RequestIntervalo): Observable<ApiResponse<RespuestaIntervalo>> {
    return this.http.post<ApiResponse<RespuestaIntervalo>>(`${this.apiUrl}/falsa-posicion`, payload);
  }

  calcularPuntoFijo(payload: RequestPuntoFijo): Observable<ApiResponse<RespuestaPuntoFijo>> {
    return this.http.post<ApiResponse<RespuestaPuntoFijo>>(`${this.apiUrl}/punto-fijo`, payload);
  }

  calcularNewtonRaphson(payload: RequestNewtonRaphson): Observable<ApiResponse<RespuestaNewtonRaphson>> {
    return this.http.post<ApiResponse<RespuestaNewtonRaphson>>(`${this.apiUrl}/newton-raphson`, payload);
  }
}