# Dix Mille 🎲

![Tests](https://github.com/jacklj/dix-mille-web/workflows/tests/badge.svg)

Frontend code for multiplayer dice web game [dix-mille.com/](https://dix-mille.com/).

## Local development

```bash
yarn start
```

## Deploying

```bash
yarn deploy
```

## Notes

### How to test on a physical device

- Run the dev server locally on your computer
- Make sure your phone/tablet is on same wifi network as your computer
- Access the site using the IP address specified by the dev server (usually http://192.168.1.66:3000)
- Although the website is being served locally, it is 'talking to' the prod DB and cloud functions. Therefore, to play a game with it, you need the other players to be using the prod app.
