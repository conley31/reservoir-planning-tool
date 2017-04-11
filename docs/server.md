# Production Server Configuration Guide

## Node.js (Server-side JavaScript Runtime)

- Installed using latest LTS version of Node v6.x using [nodesource.com](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions) repositories.

## PM2 (Node.js Process Manager)

- [PM2](http://pm2.keymetrics.io/) is a process manager for Node.js applications which handles logging, makes sure the the server is always running (if it crashes, it will restart the process), and loads the node server on startup of the VM
- PM2 is configured to run on startup using systemd - [More Information Here](http://pm2.keymetrics.io/docs/usage/startup/)
- `processes.yml` in this repository outlines the processes for PM2 and configures it
- Useful Commands:

  - `pm2 start ~/reservoir-planning-tool/processes.yml`: Start the server process (if it is not already)
  - `pm2 restart ~/reservoir-planning-tool/processes.yml`: Manually restart the server
  - `pm2 status`: Shows an overview of the current processes running
  - `pm2 monit`: Shows real-time stats of the current processes
  - `pm2 logs`: Shows real-time logs of the current processes

- [Additional Documentation](http://pm2.keymetrics.io/docs/usage/quick-start/)

## NGINX

TODO

## MySQL (Database)

- MySQL is running on the virtual machine using the `mysql_secure_installation` command and associated settiongs
- [Setup Guide Here](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-16-04)

## Redis (In-memory Session Caching)

- Redis was compiled and installed from source using the latest stable version. [See here for a guide](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-redis-on-ubuntu-16-04)
- There is a user and a group named `redis` and the working directory is `/var/lib/redis`, which is owned by the user
- There is a systemd service set up at `/etc/systemd/system/redis.service` which will start Redis when the system starts

## Firewall

TODO
