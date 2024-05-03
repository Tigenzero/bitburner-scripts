/** @param {NS} ns */
export async function get_all_servers(ns) {
	var servers = ["home"]
	var result = []
	let scans = ns.scan()
	for (let x in scans) {
		let scan = scans[x]
		servers.push(scan)
		if (ns.hasRootAccess(scan)) {
			result.push(scan)
		}
	}
	// var servers = ["home"] + Array(ns.scan())[0]

	var i = 0
	// ns.tprint(servers)
	while (i < servers.length) {
		var server = servers[i]
		// tprint(server)

		var s = ns.scan(server)
		for (var j in s) {
			var con = s[j]
			if (servers.indexOf(con) < 0) {
				servers.push(con)
				if (ns.hasRootAccess(con)) {
					result.push(con)
				}
			}
		}
		i += 1
	}
	return result
}