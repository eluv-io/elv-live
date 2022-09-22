
build:
	npm run build

run:
	npm run serve

install:
	npm install

open:
	@echo opening http://localhost:8086
	open http://localhost:8086

deploy:
	#firebase use production-260101
	firebase use elv-rewriter
	#npm run build && firebase deploy --only functions,hosting:elv-rewriter
	firebase deploy --only functions,hosting:elv-rewriter

clean:
	rm -rf dist/
