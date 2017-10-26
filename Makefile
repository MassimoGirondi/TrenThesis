all: config documentation

documentation:
	./node_modules/.bin/apidoc -i api/ -o docs/apidoc/
	./node_modules/.bin/apidoc -f ./routes.js -o docs/apidoc/


config:
	npm install
