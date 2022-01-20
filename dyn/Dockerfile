FROM php:8-apache

# Install Calendar
RUN docker-php-ext-install calendar

# Disable Error Reporting to User
# RUN echo 'error_reporting = 0' >> /usr/local/etc/php/conf.d/no_error_reporting.ini

WORKDIR /var/www/html/