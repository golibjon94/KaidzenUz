import { Module } from '@nestjs/common';
import { PuppeteerModule } from 'nest-puppeteer';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';

@Module({
  imports: [
    PuppeteerModule.forFeature(),
  ],
  controllers: [TestsController],
  providers: [TestsService],
})
export class TestsModule {}
