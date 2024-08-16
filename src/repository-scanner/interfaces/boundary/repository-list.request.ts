import { RepositoryBaseRequest } from "./repository-base.request";
import { InputType } from "@nestjs/graphql";

@InputType()
export class RepositoryListRequest extends RepositoryBaseRequest {
}