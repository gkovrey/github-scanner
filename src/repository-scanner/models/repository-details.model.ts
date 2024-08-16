import { Field, Int, ObjectType } from "@nestjs/graphql";
import { RepositoryDetailsType } from "../interfaces/types/repository-details.type";

@ObjectType()
export class RepositoryDetails {
    @Field(type => String)
    name: string;

    @Field(type => Number)
    size: number;

    @Field(type => String)
    owner: string;

    @Field(type => Boolean)
    isPrivate: boolean;

    @Field(type => Int)
    fileCount: number;

    @Field(type => String, { nullable: true })
    ymlContent: string;

    @Field(type => [String])
    webhooks: string[];

    constructor(repositoryDetails: RepositoryDetailsType) {
        this.name = repositoryDetails.name;
        this.size = repositoryDetails.size;
        this.owner = repositoryDetails.owner;
        this.isPrivate = repositoryDetails.isPrivate;
        this.fileCount = repositoryDetails.fileCount;
        this.ymlContent = repositoryDetails.ymlContent;
        this.webhooks = repositoryDetails.webhooks;
    }

    public setFileCount(fileCount: number): void {
        this.fileCount = fileCount;
    }

    public setYmlContent(ymlContent: string): void {
        this.ymlContent = ymlContent;
    }

    public setWebhooks(webhooks: string[]): void {
        this.webhooks = webhooks;
    }
}