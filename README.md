# Dix mille 🎲

![Tests](https://github.com/jacklj/dix-mille-web/workflows/tests/badge.svg)

Frontend code for online multiplayer dice game [www.dix-mille.com](www.dix-mille.com).

## Local development

```bash
yarn start
```

## Deploying

```bash
yarn deploy
```

## Troubleshooting

### How to test on a physical device

- Run the dev server locally on your computer
- Make sure your phone/tablet is on same wifi network as your computer
- Access the site using the IP address specified by the dev server (usually http://192.168.1.66:3000)
- Although the website is being served locally, it is 'talking to' the prod DB and cloud functions. Therefore, to play a game with it, you need the other players to be using the prod app.

### What if avatars aren't loading on frontend?

- Did you import the DB seed json into the wrong place in the database, i.e. not in the top level? Make sure you're at the top level before you click the 'Import' button.
