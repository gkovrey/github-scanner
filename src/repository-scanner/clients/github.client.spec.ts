import { config } from 'dotenv';
import { RepositoryFileContentRequest } from '../interfaces/boundary/repositore-file-content.request';
import { RepositoryDetailsRequest } from '../interfaces/boundary/repository-details.request';
import { RepositoryDetails } from '../models/repository-details.model';
import { Repository } from '../models/repository.model';
import { GitHubClient } from './github.client';

describe('GitHubClient', () => {
    let githubClient: GitHubClient;
    
    const mockRepositoryDetailsRequestStub: RepositoryDetailsRequest = {
        token: 'token',
        owner: 'owner',
        name: 'repoName',
    };

    const mockRepositoryFileSearchRequestStub: RepositoryFileContentRequest = {
        ...mockRepositoryDetailsRequestStub,
        path: 'path',
    }

    const mockRepositoryListResponseStub: Repository[] = [
        { name: 'repo1', owner: 'owner1', size: 100 },
        { name: 'repo2', owner: 'owner2', size: 200 },
    ];

    const mockRepositoryDetailsResponseStub: RepositoryDetails = {
        owner: "owner",
        name: "repoName",
        size: 25461,
        isPrivate: false,
        fileCount: 5200,
        ymlContent: "rules:\n  no-console: 0\n  no-empty: [2, allowEmptyCatch: true]\n",
        webhooks: [],
        setFileCount: jest.fn(),
        setYmlContent: jest.fn(),
        setWebhooks: jest.fn(),
    };

    const mockFileContentStub = "rules:\n  no-console: 0\n  no-empty: [2, allowEmptyCatch: true]\n";

    const mockSearchResponseStub = {
        totalCount: 2,
        incompleteResults: false,
        items: [
            { name: 'repo1' },
            { name: 'repo2' },
        ],
    };

    const mockWebhooksResponseStub = [
        { name: 'webhook1',  config: { url: 'url1' } },
        { name: 'webhook2',  config: { url: 'url2' }  },
    ];

    beforeEach(() => {
        githubClient = new GitHubClient();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a list of repositories', async () => {
        jest.spyOn(githubClient, 'getRepositoryList').mockResolvedValue(mockRepositoryListResponseStub);

        const repositoryList = await githubClient.getRepositoryList({ token: 'token'});

        expect(repositoryList).toEqual(mockRepositoryListResponseStub);
    });

    it('should return repository details', async () => {
        jest.spyOn(githubClient, 'getRepositoryDetails').mockResolvedValue(mockRepositoryDetailsResponseStub);

        const repositoryDetails = await githubClient.getRepositoryDetails(mockRepositoryDetailsRequestStub);

        expect(repositoryDetails).toEqual(mockRepositoryDetailsResponseStub);
    });

    it('should search repositories and return search response', async () => {
        jest.spyOn(githubClient, 'searchRepository').mockResolvedValue(mockSearchResponseStub);

        const searchResponse = await githubClient.searchRepository(mockRepositoryDetailsRequestStub);

        expect(searchResponse).toEqual(mockSearchResponseStub);
    });

    it('should return file content', async () => {
        jest.spyOn(githubClient, 'getFileContent').mockResolvedValue(mockFileContentStub);

        const fileContent = await githubClient.getFileContent(mockRepositoryFileSearchRequestStub);

        expect(fileContent).toEqual(mockFileContentStub);
    });

    it('should return webhooks for a repository', async () => {
        jest.spyOn(githubClient, 'getWebhooks').mockResolvedValue(mockWebhooksResponseStub);

        const webhooks = await githubClient.getWebhooks(mockRepositoryDetailsRequestStub);

        expect(webhooks).toEqual(mockWebhooksResponseStub);
    });
});