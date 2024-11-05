FROM mysql:8.0

RUN mkdir /var/log/mysql
RUN chown mysql:mysql /var/log/mysql
COPY ./init_sql /docker-entrypoint-initdb.d
