# Use an official PHP runtime as a parent image
FROM php:7.3-apache-stretch

ARG DEBIAN_FRONTEND=noninteractive

ENV COMPOSER_ALLOW_SUPERUSER 1
ENV APACHE_DOCUMENT_ROOT /var/www/html/public

# Install any needed packages
RUN apt-get update -yqq && apt-get install -yqq --no-install-recommends \
    apt-utils \
    openssl \
    libzip-dev zip unzip \
    git \
    mariadb-client \
    libpng-dev \
  && docker-php-ext-configure zip --with-libzip \
  && docker-php-ext-install pdo_mysql zip \
  && docker-php-ext-configure gd \
  && docker-php-ext-install gd \
  && php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
  && php -r "if (hash_file('sha384', 'composer-setup.php') === 'a5c698ffe4b8e849a443b120cd5ba38043260d5c4023dbf93e1558871f1f07f58274fc6f4c93bcfd858c6bd0775cd8d1') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" \
  && php composer-setup.php \
  && php -r "unlink('composer-setup.php');" \
  && mv composer.phar /usr/local/bin/composer \
  && sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
  && sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf \
  && a2enmod rewrite \
  # Clean up
  && apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    rm /var/log/lastlog /var/log/faillog \
  && usermod -u 1000 www-data
