# web-sovellus-projekti
Web-ohjelmoinnin sovellusprojekti (syksy 2024)

# Run app

1) Register your app on imdb to get api token

2) Register your app on imdb to get api token. Create .env file, copy values from .env.vite and paste your imdb token

3) Open server folder and create .env file inside it. Copy all values from .env.example

4) Or run db in docker:
`docker run --detach --name db --volume ./db:/docker-entrypoint-initdb.d --env POSTGRES_USER=admin --env POSTGRES_PASSWORD=87654321 --env POSTGRES_DB=todo -p 127.0.0.1:5435:5432 postgres:17-alpine`

## Run client

`npm run dev`
