import { Module } from '@nestjs/common';
import { RepositoryScannerResolver } from './repository-scanner.resolver';
import { RepositoryScannerService } from './repository-scanner.service';
import { GitHubClient } from './clients/github.client';
import { OctokitHelper } from './helpers/octokit.helper';
import { QueueRepositoryClientDecorator } from './decorators/queue-client.decorator';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RepositoryClient } from './interfaces/repository-client.interface';

@Module({
    imports: [ConfigModule.forRoot()],
    providers: [
        OctokitHelper,
        GitHubClient,
        {
            provide: 'RepositoryClientQueued',
            useFactory: async (RepositoryClient: RepositoryClient, config: ConfigService): Promise<RepositoryClient> => {
                return new QueueRepositoryClientDecorator(RepositoryClient, config);
            },
            inject: [GitHubClient, ConfigService]
        },
        {
            provide: RepositoryScannerService,
            useFactory: async (RepositoryClient: RepositoryClient) => {
                return new RepositoryScannerService(RepositoryClient);
            },
            inject: ['RepositoryClientQueued']
        },
        RepositoryScannerResolver
    ]
})
export class RepositoryScannerModule {}
