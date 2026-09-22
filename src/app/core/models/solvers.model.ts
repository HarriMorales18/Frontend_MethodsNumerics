// --- Respuestas genéricas de API ---
export interface ApiResponse<T> {
  ok: boolean;
  data: T;
}

// --- Bisección y Falsa Posición ---
export interface RequestIntervalo {
  expresion: string;
  a: number;
  b: number;
  tolerancia: number;
  max_iter?: number;
}

export interface IteracionIntervalo {
  iteracion: number;
  a: number;
  b: number;
  xr: number;
  f_xr: number;
  error: number;
}

export interface RespuestaIntervalo {
  raiz: number;
  iteraciones: IteracionIntervalo[];
}

// --- Punto Fijo ---
export interface RequestPuntoFijo {
  expresion_g: string;
  x0: number;
  tolerancia: number;
  max_iter?: number;
}

export interface IteracionPuntoFijo {
  iteracion: number;
  p0: number;
  p1: number;
  error: number;
}

export interface RespuestaPuntoFijo {
  variable: string;
  expresion_g: string;
  derivada_g: string;
  evaluacion_g_prima_x0: number | null;
  cumple_criterio_convergencia: boolean | null;
  iteraciones: IteracionPuntoFijo[];
}

// --- Newton-Raphson ---
export interface RequestNewtonRaphson {
  expresion: string;
  x0: number;
  tolerancia: number;
  max_iter?: number;
}

export interface IteracionNewtonRaphson {
  iteracion: number;
  xi: number;
  f_xi: number;
  df_xi: number;
  xi_siguiente: number;
  error: number;
}

export interface RespuestaNewtonRaphson {
  derivada: string;
  raiz?: number;
  iteraciones: IteracionNewtonRaphson[];
}