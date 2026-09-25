---
title: "Tectonic Platform"
summary: "The clan's system of record: a Go API with an OpenAPI spec and PostgreSQL, used by the bot, the bingo site and the website."
role: "Lead developer"
---

At the core of Tectonic's systems is a REST API written in Go that replaced the previous implementation. The clan's Discord bot, bingo site and website all use it, so the business logic lives in one place.

- Go with chi and huma, OpenAPI documentation generated from code
- PostgreSQL with pgx, squirrel and goose migrations
- Unit and integration tests (`go test`) in the CI/CD pipeline
- Docker Compose for local development
- **tectonic-sync**: a scheduled job that keeps player names up to date via the Wise Old Man API
- **tectonic-website**: a SvelteKit frontend on top of the API
