# Boot.dev Blog Aggregator in Typescript

Also called 'gator'.

## What you'll need to run this CLI program:

- npm version ??. Run `npm i` to install dependencies.
- config file in home directory `./.gatorconfig.json`. An example file is provided in the repo. You can also see an outline of the structure [here](#example-config).
- postgresql database see [setting up a postgres database](#setting-up-a-postgres-database) if you don't have one already.

## Setting up a postgres database

### Installation & Server Start

Download and install postgres version 16+ according the official documentation for your system. For Linux / WSL (Debian) you can run:

```
sudo apt update
sudo apt install postgresql postgresql-contrib
```

For Mac, install with:
`brew install postgresql@16`

Check your version with: `psql --version` to ensure you are on at least v16+.

Set a password (Linux only) (this is the system user's password):
`sudo passwd postgres`

Start Postgres as a server in the background:
Mac: `brew services start postgresql@16`
Linux: `sudo service postgresql start`

### Creating the database

Enter the psql shell:
Mac: `psql postgres`
Linux: `sudo -u postgres psql`

You should see a prompt looking like this:
`postgres=#`

Create a new database (this example will call it gator):
`CREATE DATABASE gator;`

Connect to the database with:
`\c gator`

You should see a prompt that looks like this:
`gator=#`

If on Linux, set the user password (this is the _database_ user's password, NOT the system user's password):
`ALTER USER postgres PASSWORD 'postgres';`

You should be able to run commands against the database now, for example you can run the following to see the version of Postgres you are running:
`SELECT version();`

Exit the shell with `exit` or `\q`.

## How to set up the config file and run the program:

### Example config

Config structure:

```
{
  "db_url": "postgres://<username>:<password>@localhost:5432/<db-name>?sslmode=disable",
  "current_user_name": "example"
}
```

Config example:

```
{
  "db_url": "postgres://postgres:postgres@localhost:5432/gator?sslmode=disable",
  "current_user_name": "gatorUser"
}
```

### How to run the program

First, ensure the dependencies are installed with `npm i`. You can then run the below commands prefixed by `npm run start`.

## Example commands

#### Register a new user

```
npm run start register <username>
```

```
npm run start register gatorUser
```

#### Login user

```
npm run start login <username>
```

```
npm run start login gatorUser
```

#### Reset users in database

```
npm run start reset
```

#### List users

```
npm run start users
```

#### Aggregate RSS feeds

```
npm run start agg <time-between-requests>
```

Time between requests may use h, m, s, or ms for the time format. Examples below:

```
npm run start agg 1h
npm run start agg 30m
npm run start agg 60s
npm run start agg 10000ms
```

#### Add a feed

```
npm run start addFeed <feed-name> <feed-url>
```

```
npm run start addFeed "Bootdev blog" "https://blog.boot.dev/index.xml"
```

#### List added feeds

```
npm run start feeds
```

#### Follow a previously added feed

```
npm run start follow <feed-url>
```

```
npm run start follow "https://blog.boot.dev/index.xml"
```

#### List followed feeds

```
npm run start followed
```

#### Unfollow a feed

```
npm run start unfollow <feed-url>
```

```
npm run start unfollow "https://blog.boot.dev/index.xml"
```

#### Browse latest posts for user

```
npm run start browse <optional-limit>
```

```
npm run start browse 3
npm run start browse
```
