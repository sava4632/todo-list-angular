import { Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { merge } from 'rxjs';
import { Task } from '../../../interfaces/task.interface';

@Component({
  selector: 'tasks-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  providers: [provideNativeDateAdapter()],
  styles: `
    form{
      width: 100%;

      & mat-form-field {
        width: 100%;
      }
    }

    textarea{
      max-height: 100px;
    }

    .actions{
      display: flex;
      justify-content: center;
    }
  `
})
export class CreateTaskDialogComponent {


  public taskForm: FormGroup;

  public errorTitleMessage = signal('');
  public errorDescriptionMessage = signal('');
  public errorDueDateMessage = signal('');

  constructor( private dialogRef: MatDialogRef<CreateTaskDialogComponent> , private fb: FormBuilder ){
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      dueDate: ['', Validators.required],
      isCompleted: [false]
    });

    // Subscribe to value and status changes to update error messages
    merge(this.taskForm.get('title')!.statusChanges, this.taskForm.get('title')!.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateTitleErrorMessage());

    merge(this.taskForm.get('description')!.statusChanges, this.taskForm.get('description')!.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateDescriptionErrorMessage());

    merge(this.taskForm.get('dueDate')!.statusChanges, this.taskForm.get('dueDate')!.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateDueDateErrorMessage());
  }

  updateTitleErrorMessage() {
    const titleControl = this.taskForm.get('title');
    if (titleControl?.hasError('required')) {
      this.errorTitleMessage.set('You must enter a title');
    } else {
      this.errorTitleMessage.set('');
    }
  }

  updateDescriptionErrorMessage() {
    const descriptionControl = this.taskForm.get('description');
    if (descriptionControl?.hasError('required')) {
      this.errorDescriptionMessage.set('You must enter a description');
    } else {
      this.errorDescriptionMessage.set('');
    }
  }

  updateDueDateErrorMessage() {
    const dueDateControl = this.taskForm.get('dueDate');
    if (dueDateControl?.hasError('required')) {
      this.errorDueDateMessage.set('You must select an expiration date');
    } else {
      this.errorDueDateMessage.set('');
    }
  }

  onCreate() {
    if (this.taskForm.valid) {
      const taskValue: Task = this.taskForm.value;

      // Obtener la fecha sin la hora para evitar cambios en la zona horaria
      const localDueDate = new Date(taskValue.dueDate);
      const utcDueDate = new Date(
        Date.UTC(
          localDueDate.getFullYear(),
          localDueDate.getMonth(),
          localDueDate.getDate()
        )
      ).toISOString();

      taskValue.dueDate = utcDueDate;

      // console.log('Datos enviados desde el diálogo:', taskValue);

      // Devuelve los datos del formulario al componente padre
      this.dialogRef.close(taskValue);
    }
  }


  onCancel(){
    this.dialogRef.close();
  }
}
