.PHONY: default install install-ng install-php test test-php test-ng generate pb-ng pb-ng

proto_path = ./protos/
proto_files = $(wildcard $(proto_path)*/*.proto)
pb_ng_out = ./angular/src/pb/
pb_php_out = ./symfony/src-pb/


default: install build
	@echo "Done."


install: install-ng generate install-php

install-ng:
	@pushd angular/ && yarn install >/dev/null --silent && popd

install-php:
	@pushd symfony/ && symfony composer install && popd


generate: pb-ng pb-php

pb-ng: $(proto_files)
	@find $(pb_ng_out) ! -path $(pb_ng_out) ! -name '.gitignore' -exec rm -rf {} +
	@protoc \
		--plugin=./angular/node_modules/.bin/protoc-gen-ts \
		--ts_opt=generate_dependencies \
		--ts_opt=long_type_string \
		--ts_opt=enable_angular_annotations \
		--proto_path=$(proto_path) \
		--ts_out=$(pb_ng_out) \
		$^

pb-php: $(proto_files)
	@find $(pb_php_out) ! -path $(pb_php_out) ! -name '.gitignore' -exec rm -rf {} +
	protoc --proto_path=$(proto_path) --php_out=$(pb_php_out) $^
	@echo generated $@


test: test-ng test-php

test-ng:
	@pushd angular/ && node_modules/.bin/ng test --watch=false && popd

test-php:
	@pushd symfony/ && symfony php bin/phpunit && popd


build: build-ng

build-ng:
	@pushd angular/ && yarn build && popd
