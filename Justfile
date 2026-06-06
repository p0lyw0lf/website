build:
	../driver/target/release/driver run ./BUILD.js
serve:
	../driver/target/release/driver serve --host 127.0.0.1 --port 8000 ./SERVE.js
clean:
	rm -rf dist
	rm -r .driver/cache.zst
trace:
	RUST_LOG=query=trace ../driver/target/release/driver run ./BUILD.js > trace.txt
	nvim trace.txt
graph:
	../driver/target/release/driver print-graph
