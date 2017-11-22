all: config documentation

documentation:

# ./node_modules/.bin/apidoc -f ./routes.js -o docs/apidoc/
	$$(npm bin)/apidoc -i api/ -o docs/apidoc/

connect_to_mongo:
	mongo ds233895.mlab.com:33895/trenthesis -u trenthesisDB --password

upload_test_population:
	./tools/test_populations/upload_test_population.sh

push:
	make documentation
	git commit -a
	git push

config:
	npm install
