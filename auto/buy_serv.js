/** @param {NS} ns */
const SERV_EXT = "-serv"
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
				if (ns.hasRootAccess(con) && parseInt(ns.getServerMaxMoney(con)) > 0 && ns.getServerMaxRam(con)==0 && !ns.serverExists(con+SERV_EXT)) {
					result.push(con)
				}
			}
		}
		i += 1
	}
	return result
}

export async function main(ns) {
	var ram = ns.args[0]
	var servers = get_all_servers(ns)
	servers.reverse()
	for (var i in servers) {
		var server = servers[i]
		var hostname = ns.purchaseServer(server+SERV_EXT, ram)
		if (hostname == ""){
			ns.tprint(server + " server could not be created. Max servers already?")
		}
		ns.run("execute.script", 1, "weaken", server, hostname)	
	}
}