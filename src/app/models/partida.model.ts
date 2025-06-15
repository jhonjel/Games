export interface Partida {
  id?: number; // O string, si tu backend lo maneja así
  juego_id: string; // <--- DEBE SER STRING
  fecha: string;
  tiempo: number;
  nivel?: string;
  // Otros campos si tu backend los espera para el POST de partida
}
