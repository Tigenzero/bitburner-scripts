/** 
 * @param {NS} ns 
 **/

const SEC_DIF = 5
const MON_PERC = 0.75
// const MON_LIMIT = 10000000
const SLEEP_TIME = 1
var SERVERS = {
	"crush-fitness": { "action": null, "servers": ["CSEC"] }, // 0 B
	"johnson-ortho": { "action": null, "servers": ['avmnite-02h'] }, // 0 B
	"computek": { "action": null, "servers": ["I.I.I.I"] }, // 0 B
	"snap-fitness": { "action": null, "servers": ["run4theh111z"] }, // 0 B
	"syscore": { "action": null, "servers": [] }, // 0 B TODO: change to serv0
	"applied-energetics": { "action": null, "servers": [] }, // 0 B
	"4sigma": { "action": null, "servers": [] }, // 0 B
	"fulcrumassets": { "action": null, "servers": [] },
	"nwo": { "action": null, "servers": [] },
}

function disable_logs(ns) {
	var logs = ["scan", "run", 'getServerSecurityLevel', 'getServerMoneyAvailable', 'getServerMoneyAvailable', 'getServerMaxMoney', 'getServerMinSecurityLevel']
	for (var i in logs) {
		ns.disableLog(logs[i])
	}
}

function get_action(ns, host) {
	var actions = ns.ps(host)
	if (actions.length == 0) {
		// ns.print(host, " has no scripts.")
		return null
	}
	return actions[0].filename.replace("/scripts/", "").replace(".script", "")
}

function get_all_servers(ns) {
	var servers = ["home"]
	var result = []
	var i = 0
	while (i < servers.length) {
		var server = servers[i]
		var s = ns.scan(server)
		for (var j in s) {
			var con = s[j]
			if (servers.indexOf(con) < 0) {
				servers.push(con)
				result.push(con)
			}
		}
		i += 1
	}
	return result
}

function update_servers(ns, SERVERS) {
	var all_servers = get_all_servers(ns)
	for (var i in all_servers) {
		var server = all_servers[i]
		if (server in SERVERS || parseInt(ns.getServerMaxMoney(server)) == 0) { continue }
		SERVERS[server] = { "action": null, "servers": [] }
		SERVERS[server]["action"] = get_action(ns, server)
		// ns.print(server + ": " +SERVERS[server])
	}
}


export async function main(ns) {
	// disable_logs(ns)
	update_servers(ns, SERVERS)
	ns.print(SERVERS)
	while (true) {
		for (var server in SERVERS) {
			if (!ns.hasRootAccess(server)) {
				continue
			}
			var money = ns.getServerMoneyAvailable(server)
			var mon_perc = money / ns.getServerMaxMoney(server)
			var sec_dif = ns.getServerSecurityLevel(server) - ns.getServerMinSecurityLevel(server)
			var message = server + " money_perc:" + mon_perc.toFixed(2) + " sec_dif:" + sec_dif + " current action:" + SERVERS[server]["action"] + " new action:"
			// determine action
			if (sec_dif >= SEC_DIF) { var action = "weaken" }
			else if (mon_perc < MON_PERC) { var action = "grow" }
			else { var action = "hack" }
			// execute action if the current action is different from now one.
			if (SERVERS[server]["action"] != action) {
				SERVERS[server]["action"] = action
				ns.print(message, action)
				ns.run("execute.script", 1, action, server, server)
				await ns.sleep(500)
				for (var i in SERVERS[server]["servers"]) {
					var host = SERVERS[server]["servers"][i]
					ns.run("execute.script", 1, action, server, host)
					await ns.sleep(500)
				}
			}
			if (ns.serverExists(server + "-serv")) {
				ns.run("execute.script", 1, action, server, server + "-serv")
			}

		}
		// ns.print(SERVERS)
		await ns.sleep(60000 * SLEEP_TIME)
	}
}