/** @param {NS} ns
Traverses network, nuking servers that have a hacking level less than the player.
RAM: 3GB
Recommendation: alias crawler="run hacking/crawler.js"
*/
const IGNORE = ["darkweb"]

function disable_logs(ns) {
    // removes general function logs so our logs stand out.
	var logs = ["scan", "run", 'getServerRequiredHackingLevel', 'getHackingLevel']
	for (var i in logs) {
		ns.disableLog(logs[i])
	}
}

async function hack_all_servers(ns, serv_set) {
    var servers = Array(ns.scan())[0]
    var serv_set = Array(servers)
    serv_set.push("home")
    var i = 0
    while (i < servers.length) {
        var server = servers[i]
        if (!ns.hasRootAccess(server) && ns.getServerRequiredHackingLevel(server) <= ns.getHackingLevel() && !IGNORE.includes(server)) {
            ns.run("hacking/worm.js", 1, server)
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
}

export async function main(ns) {
	disable_logs(ns)
	var SLEEP_TIME = 3
	while (true) {
        hack_all_servers(ns)
		await ns.sleep(60000 * SLEEP_TIME)
	}

}