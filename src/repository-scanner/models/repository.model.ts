import { Field, Int, ObjectType } from "@nestjs/graphql";
import { RepositoryType } from "../interfaces/types/repository.type";

@ObjectType()
export class Repository {
    constructor({name, size, owner}: RepositoryType) {
        this.name = name;
        this.size = size;
        this.owner = owner;
    }

    @Field(type => String)
    name: string;

    @Field(type => Int)
    size: number;

    @Field(type => String)
    owner: string;
}