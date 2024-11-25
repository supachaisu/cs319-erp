import { Component, signal } from '@angular/core';
import { StatusRepositoryService } from '../services/status-repository.service';
import { Status } from '../models/status.model';
import { CommonModule } from '@angular/common';
import { EditStatusDialogComponent } from './edit-status-dialog.component';
import { DeleteStatusDialogComponent } from './delete-status-dialog.component';
import { AddStatusDialogComponent } from './add-status-dialog.component';

@Component({
  selector: 'app-status-list',
  standalone: true,
  imports: [
    CommonModule,
    EditStatusDialogComponent,
    DeleteStatusDialogComponent,
    AddStatusDialogComponent,
  ],
  templateUrl: './status-list.component.html',
})
export class StatusListComponent {
  statuses = signal<Status[]>([]);
  isAddDialogOpen = false;
  isEditDialogOpen = false;
  isDeleteDialogOpen = false;
  selectedStatus: Status | null = null;

  constructor(private statusRepository: StatusRepositoryService) {}

  ngOnInit() {
    this.loadStatuses();
  }

  loadStatuses() {
    this.statusRepository.getStatuses().subscribe((statuses) => {
      this.statuses.set(statuses);
    });
  }

  editStatus(status: Status) {
    this.selectedStatus = status;
    this.isEditDialogOpen = true;
  }

  deleteStatus(status: Status) {
    this.selectedStatus = status;
    this.isDeleteDialogOpen = true;
  }

  confirmDeleteStatus() {
    if (this.selectedStatus) {
      this.statusRepository.deleteStatus(this.selectedStatus.id).subscribe(() => {
        this.isDeleteDialogOpen = false;
        this.loadStatuses();
      });
    }
  }

  createStatus(status: any) {
    this.statusRepository.createStatus(status).subscribe(() => {
      this.isAddDialogOpen = false;
      this.loadStatuses();
    });
  }
} 