import { Injectable, inject } from '@angular/core';
import { BlogService } from '../../../core/services/blog.service';
import { CasesService } from '../../../core/services/cases.service';
import { TestsService } from '../../../core/services/tests.service';
import { ApplicationsService } from '../../../core/services/applications.service';
import { CreateApplicationDto } from '../../../core/models/application.model';
import { BlogStatus } from '../../../core/models/enums';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private blogService = inject(BlogService);
  private casesService = inject(CasesService);
  private testsService = inject(TestsService);
  private appsService = inject(ApplicationsService);

  getLatestPosts() {
    return this.blogService.getPosts(BlogStatus.PUBLISHED);
  }

  getCases() {
    return this.casesService.getCases();
  }

  getTests() {
    return this.testsService.getTests();
  }

  submitApplication(data: CreateApplicationDto) {
    return this.appsService.submitApplication(data);
  }
}
