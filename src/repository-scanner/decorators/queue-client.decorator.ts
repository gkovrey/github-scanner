import { Inject, Injectable } from "@nestjs/common";
import { RepositoryClient } from "../interfaces/repository-client.interface";
import { RepositoryDetailsRequest } from "../interfaces/boundary/repository-details.request";
import { ConfigService } from "@nestjs/config";
import { RepositoryDetails } from "../models/repository-details.model";
import { RepositoryListRequest } from "../interfaces/boundary/repository-list.request";
import { Repository } from "../models/repository.model";
import { RepositorySearchRequest } from "../interfaces/boundary/repository-search.request";
import { RepositoryWebhookResponse } from "../interfaces/boundary/repository-webhooks.response";
import { RepositorySearchResponse } from "../interfaces/boundary/repository-search.response";
import { RepositoryFileContentRequest } from "../interfaces/boundary/repositore-file-content.request";

const queue = require('async/queue') ;

@Injectable()
export class QueueRepositoryClientDecorator implements RepositoryClient {
    private queue: any;

    constructor(
        @Inject() private repositoryClient: RepositoryClient,
        @Inject() private config: ConfigService
    ) {
        this.queue = queue(async <T>(task: () => Promise<T>) => {
            return await task();
        }, this.config.get<number>('SCANNER_QUEUE_CONCURENCY'));
    }

    async getRepositoryList(request: RepositoryListRequest): Promise<Repository[]> {
        return this.repositoryClient.getRepositoryList(request);
    }

    async getRepositoryDetails(detailsRequest: RepositoryDetailsRequest): Promise<RepositoryDetails> {
        return this.queue.push(async () => {
                return this.repositoryClient.getRepositoryDetails(detailsRequest);
            }
        );
    }

    async searchRepository(searchRequest: RepositorySearchRequest): Promise<RepositorySearchResponse> {
        return this.queue.push(async () => {
            return this.repositoryClient.searchRepository(searchRequest);
        });
    }

    async getFileContent(detailsRequest: RepositoryFileContentRequest): Promise<string> {
        return this.queue.push(async () => {
            return this.repositoryClient.getFileContent(detailsRequest);
        });
    }

    async getWebhooks(detailsRequest: RepositoryDetailsRequest): Promise<RepositoryWebhookResponse[]> {
        return this.queue.push(async () => {
            return this.repositoryClient.getWebhooks(detailsRequest);
        });
    }
}