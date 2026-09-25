---
title: "Tectonic Platform"
summary: "Klaanin tietojärjestelmä: Go-rajapinta OpenAPI-kuvauksella ja PostgreSQL. Sitä käyttävät botti, bingosivusto ja verkkosivu."
role: "Pääkehittäjä"
featured: true
group: "tectonic"
order: 1
repos: ["Miconen/tectonic-api", "Miconen/tectonic-website", "Miconen/tectonic-sync"]
skills: ["Go", "PostgreSQL", "OpenAPI", "SvelteKit", "TypeScript", "Docker", "GitHub Actions", "Wise Old Man API", "go test"]
---

Tectonicin tietojärjestelmän ydin on Go:lla kirjoitettu REST-rajapinta, joka korvasi aiemman toteutuksen. Samaa rajapintaa käyttävät klaanin Discord-botti, bingosivusto ja verkkosivu, joten liiketoimintalogiikka on yhdessä paikassa.

- Go, chi ja huma, OpenAPI-dokumentaatio suoraan koodista
- PostgreSQL, pgx, squirrel ja goose-migraatiot
- Yksikkö- ja integraatiotestit (`go test`) osana CI/CD-putkea
- Docker Compose paikalliseen kehitykseen
- **tectonic-sync**: ajastettu työ, joka pitää pelaajanimet ajan tasalla Wise Old Man -rajapinnan kautta
- **tectonic-website**: SvelteKit-käyttöliittymä rajapinnan päälle
