FROM php:8-apache

# Install Calendar
RUN docker-php-ext-install calendar

# Install PDO ODBC
RUN apt-get update -y
RUN apt-get install unixodbc unixodbc-dev -y \
 && docker-php-ext-configure pdo_odbc --with-pdo-odbc=unixODBC,/usr \
 && docker-php-ext-install pdo_odbc

WORKDIR /var/www/html/