#
# makefile is for the index rewriter app
#

build:
	npm run build

run:
	npm run serve

clean:
	rm -rf dist/

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

toplevel-test:
	curl -s https://elv-rewriter.web.app/maskverse | head -20
	curl -s https://elv-rewriter.firebaseapp.com/dolly/dolly | head -20
	curl -s https://elv-rewriter.web.app/indieflix/indieflix | head -20
	curl -s https://elv-rewriter.web.app/eluvio/community | head -20

emu-test:
	curl -s http://localhost:5050/maskverse | head -20
	curl -s http://localhost:5050/dolly/dolly | head -20
	curl -s http://localhost:5050/indieflix/indieflix | head -20
	curl -s http://localhost:5050/microsoft/ms | head -20
	curl -s http://localhost:5050/eluvio/community | head -20
	curl -s http://localhost:5050/emp | head

functions-test:
	@echo --- emulator
	curl http://localhost:5001/elv-rewriter/us-central1/ping || true
	@echo --- real
	curl https://us-central1-elv-rewriter.cloudfunctions.net/ping

create-index-emu:
	@echo --- emulator index
	curl http://localhost:5001/elv-rewriter/us-central1/create_index_html

load-livedata-emu:
	@echo --- load elv-live data
	curl http://localhost:5001/elv-rewriter/us-central1/load_elv_live_data | jq .

emu:
	firebase emulators:start

featured_sites:
	@echo --- main
	curl -s "https://host-76-74-91-11.contentfabric.io/s/main/qlibs/ilib2GdaYEFxB7HyLPhSDPKMyPLhV8x9/q/iq__suqRJUt2vmXsyiWS5ZaSGwtFU9R/meta/public/asset_metadata/" | jq ".featured_events | . [] | keys" | paste - - -
	curl -s -L https://main.net955305.contentfabric.io/s/main/qlibs/ilib2GdaYEFxB7HyLPhSDPKMyPLhV8x9/q/iq__suqRJUt2vmXsyiWS5ZaSGwtFU9R/meta/public/asset_metadata/info/domain_map | jq .
	@echo --- demov3
	curl -L -s "https://demov3.net955210.contentfabric.io/s/demov3/qlibs/ilib36Wi5fJDLXix8ckL7ZfaAJwJXWGD/q/iq__2gkNh8CCZqFFnoRpEUmz7P3PaBQG/meta/public/asset_metadata/" |jq ".featured_events | . [] | keys" | paste - - -


network_and_mode_test:
	time curl -s -L "https://main.net955305.contentfabric.io/s/main/qlibs/ilib2GdaYEFxB7HyLPhSDPKMyPLhV8x9/q/iq__suqRJUt2vmXsyiWS5ZaSGwtFU9R/meta/public/asset_metadata/" | jq . | head
	time curl -s -L "https://demov3.net955210.contentfabric.io/s/demov3/qlibs/ilib36Wi5fJDLXix8ckL7ZfaAJwJXWGD/q/iq__2gkNh8CCZqFFnoRpEUmz7P3PaBQG/meta/public/asset_metadata/" | jq . | head
