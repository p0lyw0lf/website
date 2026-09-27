build:
	../driver/target/release/driver run ./BUILD.js
watch:
	../driver/target/release/driver watch ./BUILD.js
serve:
	live-server dist -p 8001
clean:
	../driver/target/release/driver clean --db --dist
trace:
	RUST_LOG=query=trace ../driver/target/release/driver run ./BUILD.js > trace.txt
	nvim trace.txt
graph:
	../driver/target/release/driver print-graph
linkcheck:
	lychee --root-dir $(pwd)/dist dist/**/*.html
