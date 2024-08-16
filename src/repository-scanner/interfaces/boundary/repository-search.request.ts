import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";
import { RepositoryDetailsRequest } from "./repository-details.request";

@InputType()
export class RepositorySearchRequest extends RepositoryDetailsRequest {
    @Field()
    @IsString()
    @IsOptional()
    criteria?: string;

    @Field()
    @IsString()
    @IsOptional()
    fileExtension?: string;
}