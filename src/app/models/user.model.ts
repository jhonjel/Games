
export interface Usuario {
  id: number;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  juego_id: string; // <--- DEBE SER STRING
}
