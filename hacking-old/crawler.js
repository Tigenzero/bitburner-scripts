/** @param {NS} ns */
/*
Crawls through all servers, attempting to hack any available.
Recommendation: alias crawler='run hacking/crawler.js'
- RAM REQ: 3GB + 2.35GB for worm.js
- disables useless logs
- runs a BFS (breadth first search) through the network.
- sends any servers that pass the check (below) to worm.js
- sleeps for the minutes in SLEEP_TIME (default is 3 minutes.)
*/
const IGNORE = ["darkweb"]
const LOGS = ["scan", "run", 'getServerRequiredHackingLevel', 'getHackingLevel']
const SLEEP_TIME = 3

function disable_logs(ns) {
	for (var log of LOGS) {
		ns.disableLog(log)
	}
}

export async function main(ns) {
	disable_logs(ns)
	while (true) {
		var servers = Array(ns.scan())[0]
		var serv_set = Array(servers)
		var hacking_lvl = ns.getHackingLevel()
		serv_set.push("home")

		var i = 0
		while (i < servers.length) {
			var server = servers[i]
			// Checks: does not have root access, hacking level is under player lvl, not in the IGNORE list.
			if (!ns.hasRootAccess(server) && ns.getServerRequiredHackingLevel(server) <= hacking_lvl && !IGNORE.includes(server)) {
				ns.run("hacking/worm.js", 1, server)
				// waiting prevents multiple worm.js processes which could exceed the available RAM.
				await ns.sleep(1000)
			}
			var s = ns.scan(server)
			for (var con of s) {
				if (serv_set.indexOf(con) < 0) {
					serv_set.push(con)
					servers.push(con)
				}
			}
			i += 1
		}

		await ns.sleep(60000 * SLEEP_TIME)
	}

}