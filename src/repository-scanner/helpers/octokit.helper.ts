import {Injectable } from '@nestjs/common';

@Injectable()
export class OctokitHelper {
    public static async getOctokit(token: string) {
        const { Octokit } = await import('@octokit/rest');
        return new Octokit({
            auth: token
        });
    }
}