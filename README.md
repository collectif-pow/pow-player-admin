# Admin dashboard for the pow-player

## Install

Clone then `npm i`.

## Build

`npm run build`

## Run

`npm run server`

## Dev

-   `npm start` for the frontend
-   `npm run server:dev` for the server

## `init.d` script

Copy the following:

```
sudo cp misc/pow-player-admin /etc/init.d/
sudo chmod +x /etc/init.d/pow-player-admin
sudo update-rc.d pow-player-admin defaults
```

This will make the app run at startup
