# Production Server Configuration

## PM2 (Node Process Manager)
TODO

## MySQL (Database)
TODO

## Redis (In-memory Session Caching)

- Redis was compiled and installed from source using the latest stable version. [See here for a guide](https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-redis-on-ubuntu-16-04)
- There is a user and a group named `redis` and the working directory is `/var/lib/redis`, which is owned by the user
- There is a systemd service set up at `/etc/systemd/system/redis.service` which will start Redis when the system starts

## Firewall
TODO
