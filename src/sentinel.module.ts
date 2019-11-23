import { DynamicModule, Module } from '@nestjs/common';
import { SentinelService } from './sentinel';

@Module({})
export class SentinelModule {
    static forRoot(): DynamicModule {
        const providers = [
            {
                provide: SentinelService,
                useValue: new SentinelService
            },
        ];

        return {
            providers: providers,
            exports: providers,
            module: SentinelModule,
        };
    }
}