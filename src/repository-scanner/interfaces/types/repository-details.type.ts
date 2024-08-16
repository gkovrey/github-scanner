export type RepositoryDetailsType = {
    name: string,
    size: number,
    owner: string,
    isPrivate: boolean,
    fileCount?: number,
    ymlContent?: string,
    webhooks?: string[]
}