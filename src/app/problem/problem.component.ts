import { Component, input } from '@angular/core';

@Component({
  selector: 'problem',
  imports: [],
  templateUrl: './problem.component.html',
  styleUrl: './problem.component.scss',
})
export class ProblemComponent {
  problem = input.required<Problem>();
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
  MULTIPLICATION = '*',
  DIVISION = '/',
}
