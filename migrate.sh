#! /bin/bash

docker-compose run server /bin/bash -c "./node_modules/.bin/sequelize db:migrate:undo:all &&
                                        ./node_modules/.bin/sequelize db:migrate &&
                                        ./node_modules/.bin/sequelize db:seed:all"