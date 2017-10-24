all: config documentation

documentation:
	./node_modules/.bin/esdoc

config:
	npm install
