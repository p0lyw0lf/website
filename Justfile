build:
	../driver/target/release/driver ./BUILD.js
clean:
	rm -rf dist
	rm -f .driver_cache.zst
trace:
	RUST_LOG=query=trace ../driver/target/release/driver ./BUILD.js > trace.txt
	nvim trace.txt
graph:
	../driver/target/release/driver --print_graph
