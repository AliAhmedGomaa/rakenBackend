import { Controller, Get } from '@nestjs/common';
import { HealthCheckDocs, HealthControllerDocs } from './swagger/docs';

@HealthControllerDocs()
@Controller()
export class AppController {
  @Get('health')
  @HealthCheckDocs()
  health() {
    return { ok: true, service: 'raken-backend', time: new Date().toISOString() };
  }
}
