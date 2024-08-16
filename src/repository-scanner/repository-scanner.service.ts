import { Inject, Injectable } from '@nestjs/common';
import { RepositoryClient } from './interfaces/repository-client.interface';
import { RepositoryDetailsRequest } from './interfaces/boundary/repository-details.request';
import { RepositoryListRequest } from './interfaces/boundary/repository-list.request';
import { Repository } from './models/repository.model';
import { RepositoryDetails } from './models/repository-details.model';
import { RepositorySearchResponse } from './interfaces/boundary/repository-search.response';
import { RepositorySearchRequest } from './interfaces/boundary/repository-search.request';
import { RepositoryFileContentRequest } from './interfaces/boundary/repositore-file-content.request';
import { RepositoryWebhookResponse } from './interfaces/boundary/repository-webhooks.response';

@Injectable()
export class RepositoryScannerService {
    constructor(
        @Inject("RepositoryClient") private repositoryClient: RepositoryClient,
    ) {
    }

    async getRepositoryList(listRequest: RepositoryListRequest): Promise<Repository[]> {
        return this.repositoryClient.getRepositoryList(listRequest);
    }

    async getRepositoryDetails(detailsRequest: RepositoryDetailsRequest): Promise<RepositoryDetails> {
        const repositoryDetails: RepositoryDetails = await this.repositoryClient.getRepositoryDetails(detailsRequest);

        if (!repositoryDetails.fileCount) {
            repositoryDetails.setFileCount(
                await this.getTotalFileCount(detailsRequest)
            )
        }

        if (!repositoryDetails.ymlContent) {
            repositoryDetails.setYmlContent(
                await this.getFirstYmlFileContent(detailsRequest)
            )
        }

        if (!repositoryDetails.webhooks || !repositoryDetails.webhooks.length) {
            repositoryDetails.setWebhooks(
                (await this.getWebhooks(detailsRequest)).map(webhook => webhook.config.url)
            )
        }

        return repositoryDetails;
    }

    private async getTotalFileCount(generalSearch: RepositoryDetailsRequest): Promise<number> {
        const searchResults = await this.searchRepository(generalSearch);

        if (!searchResults || !searchResults.totalCount) {
            return 0;
        }

        return searchResults.totalCount;
    }

    private async getFirstYmlFileContent(detailsRequest: RepositoryDetailsRequest): Promise<string> {
        const searchRequest: RepositorySearchRequest = {
            ...detailsRequest,
            fileExtension: 'yml',
        };

        const searchResponse: RepositorySearchResponse = await this.searchRepository(searchRequest);

        if (!searchResponse || !searchResponse.totalCount) {
            return "";
        }

        const firstFile = searchResponse.items.shift();

        return this.getFileContent({
            ...detailsRequest,
            path: firstFile.path
        });

    }

    public async getFileContent(fileContentRequest: RepositoryFileContentRequest): Promise<string> {
        return this.repositoryClient.getFileContent(fileContentRequest);
    }

    public async searchRepository(searchRequest: RepositorySearchRequest): Promise<RepositorySearchResponse> {
        return this.repositoryClient.searchRepository(searchRequest);
    }

    public async getWebhooks(detailsRequest: RepositoryDetailsRequest): Promise<RepositoryWebhookResponse[]> {
        return this.repositoryClient.getWebhooks(detailsRequest);
    }
}
