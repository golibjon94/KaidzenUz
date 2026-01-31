import { Injectable, inject } from '@angular/core';
import { ApplicationsService } from '../../../core/services/applications.service';
import { ApplicationStatus } from '../../../core/models/enums';

@Injectable({
  providedIn: 'root'
})
export class AdminAppsService {
  private appsService = inject(ApplicationsService);

  getApplications() {
    return this.appsService.getApplications();
  }

  updateStatus(id: string, status: ApplicationStatus) {
    return this.appsService.updateStatus(id, status);
  }
}
