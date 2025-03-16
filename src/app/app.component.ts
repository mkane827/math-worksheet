import {
  Component,
  WritableSignal,
  signal,
  Signal,
  computed,
  effect,
} from '@angular/core';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import {
  ProblemComponent,
  Problem,
  OPERATION,
} from './problem/problem.component';

function getSolution(x: number, y: number, operation: OPERATION): number {
  switch (operation) {
    case OPERATION.ADDITION:
      return x + y;
    case OPERATION.SUBTRACTION:
      return Math.abs(x - y);
    case OPERATION.MULTIPLICATION:
      return x * y;
    case OPERATION.DIVISION:
      return x;
  }
}

function getX(x: number, y: number, operation: OPERATION): number {
  switch (operation) {
    case OPERATION.SUBTRACTION:
      return Math.max(x, y);
    case OPERATION.DIVISION:
      return x * y;
    default:
      return x;
  }
}

function getY(x: number, y: number, operation: OPERATION): number {
  switch (operation) {
    case OPERATION.SUBTRACTION:
      return Math.min(x, y);
    default:
      return y;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    MatCheckboxModule,
    MatButton,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    ProblemComponent,
  ],
  standalone: true,
})
export class AppComponent {
  readonly showSettings: WritableSignal<boolean>;
  readonly numProblems: WritableSignal<number>;
  readonly includeAddition: WritableSignal<boolean>;
  readonly maxAddition: WritableSignal<number>;
  readonly includeSubtraction: WritableSignal<boolean>;
  readonly maxSubtraction: WritableSignal<number>;
  readonly includeMultiplication: WritableSignal<boolean>;
  readonly maxMultiplication: WritableSignal<number>;
  readonly includeDivision: WritableSignal<boolean>;
  readonly maxDivision: WritableSignal<number>;
  readonly problems: WritableSignal<Problem[]>;
  readonly fontSize: WritableSignal<number>;
  readonly operations: Signal<OPERATION[]>;
  readonly allowGenerate: Signal<boolean>;
  readonly maxPerOperation: Signal<{
    [OPERATION.ADDITION]: number;
    [OPERATION.SUBTRACTION]: number;
    [OPERATION.MULTIPLICATION]: number;
    [OPERATION.DIVISION]: number;
  }>;
  readonly areAnswersCorrect: WritableSignal<boolean[]>;
  readonly gotThemAllRight: Signal<boolean>;

  constructor() {
    this.showSettings = signal(true);
    this.numProblems = signal(10);
    this.includeAddition = signal(false);
    this.maxAddition = signal(10);
    this.includeSubtraction = signal(false);
    this.maxSubtraction = signal(10);
    this.includeMultiplication = signal(false);
    this.maxMultiplication = signal(10);
    this.includeDivision = signal(false);
    this.maxDivision = signal(10);
    this.problems = signal([]);
    this.fontSize = signal(20);
    this.areAnswersCorrect = signal([]);

    this.operations = computed(() => {
      const includeAddition = this.includeAddition();
      const includeSubtraction = this.includeSubtraction();
      const includeMultiplication = this.includeMultiplication();
      const includeDivision = this.includeDivision();

      const operations = [];
      if (includeAddition) {
        operations.push(OPERATION.ADDITION);
      }
      if (includeSubtraction) {
        operations.push(OPERATION.SUBTRACTION);
      }
      if (includeMultiplication) {
        operations.push(OPERATION.MULTIPLICATION);
      }
      if (includeDivision) {
        operations.push(OPERATION.DIVISION);
      }
      return operations;
    });

    this.allowGenerate = computed(() => {
      return this.operations().length > 0;
    });

    this.maxPerOperation = computed(() => {
      return {
        [OPERATION.ADDITION]: this.maxAddition(),
        [OPERATION.SUBTRACTION]: this.maxSubtraction(),
        [OPERATION.MULTIPLICATION]: this.maxMultiplication(),
        [OPERATION.DIVISION]: this.maxDivision(),
      };
    });

    this.gotThemAllRight = computed(() => {
      const numProblems = this.numProblems();
      const areAnswersCorrect = this.areAnswersCorrect();
      for (let i = 0; i < numProblems; i++) {
        if (!areAnswersCorrect[i]) {
          return false;
        }
      }
      return true;
    });
  }

  customTrackBy(index: number, problem: Problem) {
    return `${index}:${problem.x}:${problem.y}`;
  }

  generate() {
    const problems: Problem[] = [];
    for (let i = 0; i < this.numProblems(); i++) {
      const operation =
        this.operations()[
          Math.floor(Math.random() * 100) % this.operations().length
        ];
      let x =
        (Math.floor(Math.random() * 100) % this.maxPerOperation()[operation]) +
        1;
      let y =
        (Math.floor(Math.random() * 100) % this.maxPerOperation()[operation]) +
        1;
      problems.push({
        x: getX(x, y, operation),
        y: getY(x, y, operation),
        operation,
        solution: getSolution(x, y, operation),
        track: `${i}:${x}:${y}`,
      });
    }
    this.problems.set(problems);
    this.areAnswersCorrect.set([]);
    this.showSettings.set(false);
  }

  handleShowSettings() {
    this.showSettings.set(true);
  }

  changeFontSize(event: Event) {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.fontSize.set(parseInt(target.value));
    }
  }

  setMaxValSignal(event: Event, maxValSignal: WritableSignal<number>) {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      maxValSignal.set(Number(target.value));
    }
  }

  hasCorrectSolution(isCorrect: boolean, index: number) {
    const correctness = [...this.areAnswersCorrect()];
    correctness[index] = isCorrect;
    this.areAnswersCorrect.set(correctness);
  }
}
