/** @param {NS} ns */
// NOTE: if starting with 128 threads, currently uses ~60TB
// Benchmarks compound. 128->256->512
var BENCHMARKS = {
	"max-hardware" : 2**1, //256,
	"crush-fitness": 2**2, //512,
	"computek": 2**3, //1024,
	"syscore": 2**4, //2048,
	"alpha-ent": 2**5, //4096,
	"galactic-cyber": 2**5, //8192,
	"deltaone": 2**6, //16384,
	"omnitek": 2**7, //32768,
	"megacorp": 2**8, //65536
}
var END = ""
var WEAKEN = "/scripts/weaken.script"
var GROW = "/scripts/grow.script"

function get_all_servers(ns) {
	var servers = ["home"]
	var result = []
	var stats = {}
	var i = 0
	while (i < servers.length) {
		var server = servers[i]
		var s = ns.scan(server)
		for (var j in s) {
			var con = s[j]
			if (servers.indexOf(con) < 0) {
				servers.push(con)
				if (ns.hasRootAccess(con) && parseInt(ns.getServerMaxMoney(con)) > 0 && !ns.isRunning(WEAKEN, "home", con)) {
					// result.push(con)
					stats[parseInt(ns.getServerMaxMoney(con))] = con
				}
			}
		}
		i += 1
	}
	var keys = Object.keys(stats)
	keys.sort((a, b) => a - b)
	for (var i in keys){
		var key = keys[i]
		result.push(stats[key])
	}

	return result
}

export async function main(ns) {
	var ram_arg = ns.args[0]
	if (ram_arg == ""){
		ram_arg = 1
	}
	var ram = ram_arg
	var servers = get_all_servers(ns)
	for (var index in servers){
		var server = servers[index]
		if (server == END){
			exit()
		}
		if (server in BENCHMARKS) {
			ram = ram_arg * BENCHMARKS[server]
		}
		ns.run(WEAKEN, ram, server)
		ns.run(GROW, ram, server)
	}
}