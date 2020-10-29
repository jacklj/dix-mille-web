# Dix mille
![Tests](https://github.com/jacklj/dix-mille-web/workflows/tests/badge.svg)

## How to test the website on your phone _in dev_

- Run the dev server locally
- Make sure phone is on same wifi network as computer
- Access the site using the IP address specified by the dev server (usually http://192.168.1.66:3000)
- Although the website is being served locally, it is 'talking to' the prod DB and cloud functions - to play a game with it, you need the other players to be using the prod app.

## Troubleshooting

What if avatars aren't loading on frontend?

- Did you import the DB seed json into the wrong place in the database, i.e. not in the top level? Make sure you're at the top level before you click the Import button.
