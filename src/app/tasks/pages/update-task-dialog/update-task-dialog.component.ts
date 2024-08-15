import { Component, Inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { merge } from 'rxjs';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Task } from '../../../interfaces/task.interface';

@Component({
  selector: 'app-update-task-dialog',
  templateUrl: './update-task-dialog.component.html',
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
export class UpdateTaskDialogComponent{

  public taskForm: FormGroup;
  public task?: Task;

  public errorTitleMessage = signal('');
  public errorDescriptionMessage = signal('');
  public errorDueDateMessage = signal('');

  constructor(private dialogRef: MatDialogRef<UpdateTaskDialogComponent>, private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: Task ) {
    this.taskForm = this.fb.group({
      title: [this.data.title, Validators.required],
      description: [this.data.description, Validators.required],
      dueDate: [new Date(this.data.dueDate), Validators.required],
      isCompleted: [this.data.isCompleted || false]
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
  onCancel() {
    this.dialogRef.close();
  }
  onUpdate() {
    if (this.taskForm.valid) {
      const taskValue: Task = this.taskForm.value;
      taskValue.id = this.data.id;

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

      // console.log('Datos enviados desde el diálogo(update):', taskValue);

      // Devuelve los datos del formulario al componente padre
      this.dialogRef.close(taskValue);
    }
  }

}
