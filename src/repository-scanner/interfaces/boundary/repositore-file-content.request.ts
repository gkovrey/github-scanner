import { Field, InputType } from "@nestjs/graphql";
import { RepositoryDetailsRequest } from "./repository-details.request";
import { IsString } from "class-validator";

@InputType()
export class RepositoryFileContentRequest extends RepositoryDetailsRequest {
    @Field()
    @IsString()
    path: string;
}