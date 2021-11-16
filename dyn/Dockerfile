FROM php:8-apache

# Install Dependencies
RUN docker-php-ext-install calendar
RUN docker-php-ext-install pdo pdo_odbc

WORKDIR /var/www/html/