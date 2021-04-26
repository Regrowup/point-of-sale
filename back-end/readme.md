# Point of Sale backend

This is a [Laravel](https://laravel.com/) API backend. The frontend for this application lives in another folder: https://github.com/chipit24/point-of-sale/tree/main/front-end.

## Getting started

Follow the steps below to get the application running locally:

1. Clone the repository and `cd` into it:
   ```console
   $ git clone git@github.com:chipit24/point-of-sale.git
   $ cd point-of-sale/back-end
   ```
2. Download and install Docker:
   * Mac: https://docs.docker.com/docker-for-mac/
   * Windows: https://docs.docker.com/docker-for-windows/
> **Note:** If you're installing Docker on a Raspberry Pi (Raspbian/Debian Stretch), you will need both `docker` and `docker-compose` (these are already included in the Docker Desktop installs above):
> 
>    * Docker: https://docs.docker.com/install/linux/docker-ce/debian. For RPi, you will need to install using the convenience script:
>    ```console
>    $ curl -fsSL https://get.docker.com -o get-docker.sh
>    $ sudo sh get-docker.sh
>    $ sudo usermod -aG docker your-user
>    ```
> 
>    * Docker-compose: https://docs.docker.com/compose/install. For RPi, you will need to install using `pip`:
>    ```console
>    $ sudo pip install docker-compose
>    ```
3. Back in your `point-of-sale/back-end` directory, set up your environment variables:
   ```console
   $ cp .env.example .env
   ````
>    **Note:** If you're setting this up on a RPi, change the `DOCKER_DB_IMAGE` variable in `.env` from `mysql:5.7` to `hypriot/rpi-mysql:5.5`.

4. Start the Docker containers:
   ```console
   $ docker-compose up -d
   ````
>    **Note:** This command will create two docker containers. The `pos-db` runs the MySQL server and will store its data in the `../pos-db-data` folder (one directory up from `point-of-sale/back-end`). This will ensure your database info persists between Docker restarts.
5. Connect to the `pos-api` docker container using `docker-compose exec`:
   ```console
   $ docker-compose exec pos-api bash
   ```
6. Run the following commands:
   ```console
   root@f608df7a0a85:/var/www/html $ composer install
   root@f608df7a0a85:/var/www/html $ php artisan key:generate
   root@f608df7a0a85:/var/www/html $ php artisan migrate --seed
   ```
7. If you have not already done so, follow the steps to set up the frontend UI: https://github.com/chipit24/point-of-sale/tree/main/front-end/README.md.
