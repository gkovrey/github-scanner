import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";
import { RepositoryBaseRequest } from "./repository-base.request";

@InputType()
export class RepositoryDetailsRequest extends RepositoryBaseRequest {
    @Field()
    @IsNotEmpty()
    @IsString()
    owner: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    name: string;
}