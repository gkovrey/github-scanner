import { Test, TestingModule } from '@nestjs/testing';
import { QueueRepositoryClientDecorator } from './queue-client.decorator';
import { RepositoryClient } from '../interfaces/repository-client.interface';
import { ConfigService } from '@nestjs/config';
import { RepositoryListRequest } from '../interfaces/boundary/repository-list.request';
import { GitHubClient } from '../clients/github.client';

describe('QueuePepositoryClientDecorator', () => {
    let decorator: QueueRepositoryClientDecorator;
    let repositoryClient: RepositoryClient;
    let configService: ConfigService;

    const mockRepositoryListRequestStub: RepositoryListRequest = {
        token: 'token',
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: GitHubClient,
                    useValue: {
                        getRepositoryList: jest.fn(),
                        getRepositoryDetails: jest.fn(),
                        searchRepository: jest.fn(),
                        getFileContent: jest.fn(),
                        getWebhooks: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn(() => 1),
                    },
                },
                {
                    provide: QueueRepositoryClientDecorator,
                    useFactory: async (repositoryClient: RepositoryClient, config: ConfigService): Promise<QueueRepositoryClientDecorator> => {
                        return new QueueRepositoryClientDecorator(repositoryClient, config);
                    },
                    inject: [GitHubClient, ConfigService],
                }
            ],
        }).compile();

        decorator = module.get<QueueRepositoryClientDecorator>(
            QueueRepositoryClientDecorator,
        );
        repositoryClient = module.get<RepositoryClient>(GitHubClient);
        configService = module.get<ConfigService>(ConfigService);
    });

    it('should call the repositoryClient.getRepositoryList method', async () => {
        await decorator.getRepositoryList(mockRepositoryListRequestStub);

        expect(repositoryClient.getRepositoryList).toHaveBeenCalledWith(mockRepositoryListRequestStub);
    });
});