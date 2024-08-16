## Developer comments

I've split the required application into 3 main parts: GraphQL server, Github API connection, and queue to limit concurrent fetching of repository details. The Nest framework ties all of them together. While Nest isn't strictly necessary, I believe it helps enforce best practices, maintain clean code, and support a clean architecture approach.

One design challenge I faced was determining how to implement the queue. Using databases, message brokers, daemons, or secondary applications felt like overkill. After extensive research, I found a library that provided a data structure with the exact properties I needed.

Another decision was to use a segregated GitHub access client along with a request queue decorator. This approach might be less straightforward (not as KISSy), but it results in cleaner, more maintainable code.

In general, I added additional types and request/response DTOs. While this adds some complexity, I believe it supports clean code, clean architecture, and best practices.


## Installation

```bash
$ npm install
```

## Before runnning

Rename `.env.template` file to `.env`. 

`SCANNER_QUEUE_CONCURENCY` is responcible for the Github API requests concurency managed by 3rd-party queue. Default value is 2 - defined by project requirements

## Running the app

```bash
$ npm run start
```

## Test

```bash
$ npm run test
```
