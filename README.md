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

## Configure the IP of the server

```
cd ~/pow-player-admin
nano .env
```

Then in the file change the IP. Be careful to keep `http://` and nothing at the end of the IP. Something like this:

```
SERVER_URL=http://XXX.XXX.XXX.XXX
```

Then run `npm run build` then restart the RPi.

## Check the date

Run `date`, if the returned hour is not the right one, please run `sudo raspi-config` then I the menu "4 Internationalisation Options" set the right timezone.

## Restart the server

Turn off then on the Raspberry Pi.

## `init.d` script

Copy the following:

```
sudo cp misc/pow-player-admin /etc/init.d/
sudo chmod +x /etc/init.d/pow-player-admin
sudo update-rc.d pow-player-admin defaults
```

This will make the app run at startup
