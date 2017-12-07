#!/bin/bash

clear

#######################
#  UPLOAD POPULATION  #
#######################

echo ---------------------------------------------------------------------------
echo Do you want to upload the population to TrenThesis mongo database? Y/y/yes
echo Mind that this will erase all the data that is already present in the db
echo ---------------------------------------------------------------------------

read upload

if [ "$upload" == "Y" ] || [ "$upload"  == "y" ] || [ $upload == "yes" ]; then

		echo -----------------------------------
		echo Insert the password of the database
		echo -----------------------------------

		read -s password
		mongoimport --host ds233895.mlab.com --port 33895 --username trenthesisDB --password $password --db trenthesis --collection professors --drop --maintainInsertionOrder --file tools/db_populations/professors.json
		mongoimport --host ds233895.mlab.com --port 33895 --username trenthesisDB --password $password --db trenthesis --collection topics --drop --maintainInsertionOrder --file tools/db_populations/topics.json
		mongoimport --host ds233895.mlab.com --port 33895 --username trenthesisDB --password $password --db trenthesis --collection categories --drop --maintainInsertionOrder --file tools/db_populations/categories.json
		mongoimport --host ds233895.mlab.com --port 33895 --username trenthesisDB --password $password --db trenthesis --collection users --drop --maintainInsertionOrder --file tools/db_populations/users.json
		echo ">>> Remote data upload completed"

fi
