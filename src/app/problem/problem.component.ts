import {
  Component,
  input,
  computed,
  signal,
  WritableSignal,
  output,
  effect,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'problem',
  imports: [MatIconModule],
  templateUrl: './problem.component.html',
  styleUrl: './problem.component.scss',
})
export class ProblemComponent {
  problem = input.required<Problem>();
  hasCorrectSolution = output<boolean>();

  inputString = signal<string>('');

  inputValue = computed(() => {
    return Number(this.inputString());
  });
  isCorrect = computed(() => {
    return this.problem().solution === this.inputValue();
  });
  isCorrectIcon = computed(() => {
    return this.isCorrect() ? 'check_circle' : 'cancel';
  });

  constructor() {
    effect(() => {
      this.hasCorrectSolution.emit(this.isCorrect());
    });
  }

  updateInputValue(event: Event) {
    this.inputString.set((event.target as HTMLInputElement).value);
  }
}

export interface Problem {
  x: number;
  y: number;
  operation: OPERATION;
  solution: number;
  track: string;
}

export enum OPERATION {
  ADDITION = '+',
  SUBTRACTION = '-',
  MULTIPLICATION = 'X',
  DIVISION = '/',
}
