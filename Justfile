build:
	../driver/target/release/driver ./BUILD.js
watch:
	(echo BUILD.js && ls -d src/**/*) | entr just
clean:
	rm -rf dist
	rm -r .driver/cache.zst
trace:
	RUST_LOG=query=trace ../driver/target/release/driver ./BUILD.js > trace.txt
	nvim trace.txt
graph:
	../driver/target/release/driver --print_graph
