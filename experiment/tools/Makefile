BUILD_DIR = build
TMP_DIR = tmp
JS_DIR = ../js
DOC_DIR = ../docs

SHIMS = $(JS_DIR)/lib/functionPrototypeBind.js $(JS_DIR)/lib/requestAnimationFrame.js $(JS_DIR)/lib/classList.js
OBJECTS = app

all: $(OBJECTS)

app: min
	mkdir -p $(BUILD_DIR)
	cp ../index.html $(BUILD_DIR)/
	if [ -a ../favicon.ico ]; then cp ../favicon.ico $(BUILD_DIR)/; fi;
	cp -R ../css $(BUILD_DIR)/
	if [ -d ../content ]; then cp -R ../content $(BUILD_DIR)/; fi;
	mkdir -p $(BUILD_DIR)/js
	cp $(TMP_DIR)/app.min.js $(BUILD_DIR)/js/app.js
	patch --no-backup-if-mismatch -p0 $(BUILD_DIR)/index.html loadwrapped.diff

build:
	r.js -o build.js out=$(TMP_DIR)/app.build.js

docs:
	mkdir -p $(DOC_DIR)
	jsdoc -p -l -c jsdoc_conf.json -r $(JS_DIR)/famous $(JS_DIR)/famous-* -d $(DOC_DIR)/jsdoc
	docco $(JS_DIR)/*.js $(JS_DIR)/app/*.js -o $(DOC_DIR)/docco

single: obfuscate
	cat $(SHIMS) $(TMP_DIR)/app.obfuscate.js > $(TMP_DIR)/app.single.js

obfuscate: build
	node renamer.js $(TMP_DIR)/app.build.js > $(TMP_DIR)/app.obfuscate.js

min: single
	java -jar compiler.jar --js $(TMP_DIR)/app.single.js --compilation_level=ADVANCED_OPTIMIZATIONS --externs externs.js --externs samsungtv/externs.js > $(TMP_DIR)/app.min.js

samsungtv: app
	cp ../config.xml $(BUILD_DIR)/
	cp ../widget.info $(BUILD_DIR)/
	patch --no-backup-if-mismatch -p1 $(BUILD_DIR)/index.html samsungtv/index.diff

samsungtv_nl: samsungtv
	patch --no-backup-if-mismatch -p1 $(BUILD_DIR)/index.html samsungtv/noload.diff

zip: app
	cd $(BUILD_DIR) && zip -r ../app.zip *

tizen: app
	cp ../config.xml $(BUILD_DIR)
	cd $(BUILD_DIR) && zip -r ../app.wgt *

clean:
	rm -rf $(BUILD_DIR)
	rm -rf $(TMP_DIR)
	rm -f app.zip
	rm -f app.wgt
