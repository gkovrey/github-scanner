import { Test, TestingModule } from "@nestjs/testing";
import { RepositoryScannerService } from "./repository-scanner.service";
import { RepositoryListRequest } from "./interfaces/boundary/repository-list.request";
import { RepositoryDetailsRequest } from "./interfaces/boundary/repository-details.request";
import { RepositoryFileContentRequest } from "./interfaces/boundary/repositore-file-content.request";
import { GitHubClient } from "./clients/github.client";
import { RepositoryClient } from "./interfaces/repository-client.interface";
import { Repository } from "./models/repository.model";
import { RepositoryDetails } from "./models/repository-details.model";


describe('ScannerService', () => {
    let service: RepositoryScannerService;
    let githubClient: RepositoryClient;

    const mockRepositoryListRequestStub: RepositoryListRequest = {
        token: 'token',
    };
    
    const mockRepositoryListResponseStub: Repository[] = [
        { name: 'repo1', owner: 'owner1', size: 100 },
        { name: 'repo2', owner: 'owner2', size: 200 },
    ];
    
    const mockRepositoryDetailsRequestStub: RepositoryDetailsRequest = {
        token: 'token',
        owner: 'owner',
        name: 'repoName',
    };

    const mockRepositoryFileSearchRequestStub: RepositoryFileContentRequest = {
        ...mockRepositoryDetailsRequestStub,
        path: 'path',
    }

    const mockRepositoryDetailsResponseStub: RepositoryDetails = {
        owner: "owner",
        name: "repoName",
        size: 25461,
        isPrivate: false,
        fileCount: 5200,
        ymlContent: null,
        webhooks: [],
        setFileCount: jest.fn(),
        setYmlContent: jest.fn(),
        setWebhooks: jest.fn(),
    };

    const mockYmlContentStub = "rules:\n  no-console: 0\n  no-empty: [2, allowEmptyCatch: true]\n";

    const mockWebhooksResponseStub = [
        { name: 'webhook1',  config: { url: 'url1' } },
        { name: 'webhook2',  config: { url: 'url2' }  },
    ];

    const mockSearchResponseStub = {
        totalCount: 2,
        incompleteResults: false,
        items: [
            { name: 'repo1' },
            { name: 'repo2' },
        ],
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
                    provide: RepositoryScannerService,
                    useFactory: async (repositoryClient: GitHubClient): Promise<RepositoryScannerService> => {
                        return new RepositoryScannerService(repositoryClient);
                    },
                    inject: [GitHubClient]
                }
            ],
        }).compile();

        service = module.get<RepositoryScannerService>(RepositoryScannerService);
        githubClient = module.get<GitHubClient>(GitHubClient);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return a list of repositories', async () => {
        jest.spyOn(githubClient, 'getRepositoryList').mockResolvedValue(mockRepositoryListResponseStub);
        
        const repositories = await service.getRepositoryList(mockRepositoryListRequestStub);
        
        expect(repositories).toBeDefined();
        expect(Array.isArray(repositories)).toBe(true);
        expect(repositories).toEqual(mockRepositoryListResponseStub);
    });

    it('should return the file content', async () => {
        jest.spyOn(githubClient, 'getFileContent').mockResolvedValue(mockYmlContentStub);

        const fileContent = await service.getFileContent(mockRepositoryFileSearchRequestStub);
        
        expect(fileContent).toBeDefined();
        expect(fileContent).toEqual(mockYmlContentStub);
    });

    it('should search for repositories', async () => {
        jest.spyOn(githubClient, 'searchRepository').mockResolvedValue(mockSearchResponseStub);

        const searchResponse = await service.searchRepository(mockRepositoryDetailsRequestStub);
        
        expect(searchResponse).toBeDefined();
        expect(searchResponse).toEqual(mockSearchResponseStub);
    });

    it('should return webhooks for a repository', async () => {
        jest.spyOn(githubClient, 'getWebhooks').mockResolvedValue(mockWebhooksResponseStub);

        const webhooks = await service.getWebhooks(mockRepositoryDetailsRequestStub);

        expect(webhooks).toBeDefined();
        expect(Array.isArray(webhooks)).toBe(true);
        expect(webhooks).toEqual(mockWebhooksResponseStub);
    });

    it('should return repository details', async () => {
        jest.spyOn(githubClient, 'getRepositoryDetails').mockResolvedValue(mockRepositoryDetailsResponseStub);
        jest.spyOn(githubClient, 'searchRepository').mockResolvedValue(mockSearchResponseStub);
        jest.spyOn(githubClient, 'getWebhooks').mockResolvedValue(mockWebhooksResponseStub);
        jest.spyOn(githubClient, 'getFileContent').mockResolvedValue(mockYmlContentStub);

        const repositoryDetails = await service.getRepositoryDetails(mockRepositoryDetailsRequestStub);

        expect(repositoryDetails).toBeDefined();
    });

});
