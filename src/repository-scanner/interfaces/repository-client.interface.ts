import { RepositoryDetails } from "../models/repository-details.model";
import { Repository } from "../models/repository.model";
import { RepositoryFileContentRequest } from "./boundary/repositore-file-content.request";
import { RepositoryDetailsRequest } from "./boundary/repository-details.request";
import { RepositoryListRequest } from "./boundary/repository-list.request";
import { RepositorySearchRequest } from "./boundary/repository-search.request";
import { RepositorySearchResponse } from "./boundary/repository-search.response";
import { RepositoryWebhookResponse } from "./boundary/repository-webhooks.response";

export interface RepositoryClient {
    getRepositoryList(listRequest: RepositoryListRequest): Promise<Repository[]>;
    getRepositoryDetails(detailsRequest: RepositoryDetailsRequest): Promise<RepositoryDetails>;
    getFileContent(detailsRequest: RepositoryFileContentRequest): Promise<string>;
    getWebhooks(detailsRequest: RepositoryDetailsRequest): Promise<RepositoryWebhookResponse[]>;

    searchRepository(searchRequest: RepositorySearchRequest): Promise<RepositorySearchResponse>;
    
}