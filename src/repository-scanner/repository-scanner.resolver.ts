import { Args, Int, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Repository } from "./models/repository.model";
import { RepositoryDetails } from "./models/repository-details.model";
import { RepositoryScannerService } from "./repository-scanner.service";
import { Inject } from "@nestjs/common";
import { RepositoryDetailsRequest } from "./interfaces/boundary/repository-details.request";
import { RepositoryListRequest } from "./interfaces/boundary/repository-list.request";

@Resolver(of => Repository)
export class RepositoryScannerResolver {
    constructor(
        @Inject() private repositoryScannerService: RepositoryScannerService,
    ) {}

    @Query(returns => [Repository], { name : 'repositories' })
    async getRepositoryList(@Args('RepositoryListRequest') listRequest: RepositoryListRequest): Promise<Repository[]> {
        return this.repositoryScannerService.getRepositoryList(listRequest);
    }

    @Query(returns => RepositoryDetails, { name: 'repository' })
    async getRepository(@Args('RepositoryDetailsRequest') detailsRequest: RepositoryDetailsRequest): Promise<RepositoryDetails> {
        return this.repositoryScannerService.getRepositoryDetails(detailsRequest);
    }
}