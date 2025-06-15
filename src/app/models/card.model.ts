export interface Card {
    id: number;
    value: string;
    revealed: boolean;
    matched: boolean;
      matchedBy: number | null; // Add this line
  }
