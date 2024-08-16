import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

@InputType()
export class RepositoryBaseRequest {
    @Field()
    @IsNotEmpty()
    @IsString()
    token: string;

    @Field(type => Int, { nullable: true })
    @IsOptional()
    @IsNumber()
    page?: number;


    @Field(type => Int, { nullable: true })
    @IsOptional()
    @IsNumber()
    perPage?: number;
}