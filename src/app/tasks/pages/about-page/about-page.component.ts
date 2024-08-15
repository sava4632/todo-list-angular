import { Component } from '@angular/core';
import { TaskService } from '../../services/tasks.service';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
  styleUrl: './about-page.component.css'
})
export class AboutPageComponent {

  constructor( private taskService: TaskService ){
    this.taskService.updateCurrentPage('about');
  }
}
