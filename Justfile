build:
	../driver/target/release/driver run ./BUILD.js
watch:
	(echo BUILD.js && ls -d src/**/*) | entr just
serve:
	live-server --host 127.0.0.1 --port 8000 dist
clean:
	rm -rf dist
	rm -r .driver/cache.zst
trace:
	RUST_LOG=query=trace ../driver/target/release/driver run ./BUILD.js > trace.txt
	nvim trace.txt
graph:
	../driver/target/release/driver print-graph
