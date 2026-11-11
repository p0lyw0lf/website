build:
	driver run ./BUILD.js
watch:
	driver watch ./BUILD.js
serve:
	live-server dist -p 8001
clean:
	driver clean --db --dist
trace:
	RUST_LOG=query=trace ../driver/target/release/driver run ./BUILD.js > trace.txt
	nvim trace.txt
graph:
	driver print-graph
linkcheck:
	lychee --root-dir $(pwd)/dist dist/**/*.html
