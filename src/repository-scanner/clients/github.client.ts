import { OctokitHelper } from "../helpers/octokit.helper";
import { RepositoryDetailsRequest as RepositoryDetailsRequest } from "../interfaces/boundary/repository-details.request";
import { RepositoryClient } from "../interfaces/repository-client.interface";
import { RepositoryDetails } from "../models/repository-details.model";
import { Repository } from "../models/repository.model";
import { RepositoryListRequest } from "../interfaces/boundary/repository-list.request";
import { RepositorySearchRequest } from "../interfaces/boundary/repository-search.request";
import { RepositorySearchResponse } from "../interfaces/boundary/repository-search.response";
import { RepositoryWebhookResponse } from "../interfaces/boundary/repository-webhooks.response";
import { RepositoryFileContentRequest } from "../interfaces/boundary/repositore-file-content.request";

export class GitHubClient implements RepositoryClient {
    private _octokitPool: Map<string, any> = new Map();
    
    protected async getOctokit(token: string) {
        if (!this._octokitPool.has(token)) {
            this._octokitPool.set(token, await OctokitHelper.getOctokit(token));
        }

        return this._octokitPool.get(token);
    }

    public async getRepositoryList(request: RepositoryListRequest): Promise<Repository[]> {
        const repositoryList = await (await this.getOctokit(request.token)).rest.repos.listForAuthenticatedUser();

        if (!repositoryList || !repositoryList.data) {
            return [];
        }

        return this.convertOctokitResponceToRepositoryList(repositoryList.data);
    }

    public async getRepositoryDetails(detailsRequest: RepositoryDetailsRequest): Promise<RepositoryDetails> {
        const repoDetails = await (await this.getOctokit(detailsRequest.token)).rest.repos.get({
            owner: detailsRequest.owner,
            repo: detailsRequest.name,
        });

        if (!repoDetails || !repoDetails.data) {
            return null;
        }

        return this.convertOctokitResponceToRepositoryDetails(repoDetails.data);
    }

    public async searchRepository(searchRequest: RepositorySearchRequest): Promise<RepositorySearchResponse> {
        let searchCriteria = ""; 

        if (searchRequest.criteria) {
            searchCriteria += `${searchRequest.criteria}`;
        }

        searchCriteria += `repo:${searchRequest.owner}/${searchRequest.name}`;

        if (searchRequest.fileExtension) {
            searchCriteria += `+extension:${searchRequest.fileExtension}`;
        }

        const searchResults =  await (await this.getOctokit(searchRequest.token)).rest.search.code({
            q: searchCriteria,
            page: searchRequest.page,
            per_page: searchRequest.perPage
        });

        return {
            totalCount: searchResults.data.total_count,
            incompleteResults: searchResults.data.incomplete_results,
            items: searchResults.data.items
        };
    }

    public async getFileContent(detailsRequest: RepositoryFileContentRequest): Promise<string> {
        const fileContentData = await (await this.getOctokit(detailsRequest.token)).rest.repos.getContent({
            owner: detailsRequest.owner,
            repo: detailsRequest.name,
            path: detailsRequest.path
        });
        
        if (!fileContentData || !fileContentData.data.content) {
            return "";
        }

        return Buffer.from(fileContentData.data.content, fileContentData.data.encoding).toString();
    }

    public async getWebhooks(detailsRequest: RepositoryDetailsRequest): Promise<RepositoryWebhookResponse[]> {
        const webhooks = await (await this.getOctokit(detailsRequest.token)).rest.repos.listWebhooks({
            owner: detailsRequest.owner,
            repo: detailsRequest.name,
        });

        if (!webhooks || !webhooks.data) {
            return [];
        }

        return webhooks.data;
    }

    private convertOctokitResponceToRepositoryList(octokitResponse): Repository[] {
        return octokitResponse.map(repo => new Repository({
            name: repo.name,
            size: repo.size,
            owner: repo.owner.login
        }));
    }

    private convertOctokitResponceToRepositoryDetails(octokitResponse): RepositoryDetails {
        return new RepositoryDetails({
            name: octokitResponse.name,
            size: octokitResponse.size,
            owner: octokitResponse.owner.login,
            isPrivate: octokitResponse.private
        });
    }
}