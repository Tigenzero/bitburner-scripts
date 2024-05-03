/** @param {NS} ns */

function super_connect(ns, host, parents){
	// for (let parent in parents){
	// 	ns.connect(parent)
	// }
	// ns.connect(host)
	ns.tprint(parents + host)
}

export async function main(ns) {
	let args = ns.args
	let dest = args[0]
	var servers = [["home", ""]]
	var serv_set = ["home"]
	var i = 0
	// ns.tprint(servers)
	while (i < servers.length) {
		var tuple = servers[i]
		// ns.tprint(tuple)
		let server = tuple[0]
		let parents = tuple[1]
		if (server == dest){
			super_connect(ns, server, parents)
			ns.exit()
		}
		// parents.push(server)
		parents = parents + server + "->"
		var s = ns.scan(server)
		for (var j in s) {
			var con = s[j]
			// check if we've seen this server
			if (serv_set.indexOf(con) < 0) {
				serv_set.push(con)
				servers.push([con, parents])
			}
		}
		i += 1
	}
}