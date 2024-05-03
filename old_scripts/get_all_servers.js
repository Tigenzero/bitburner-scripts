/** @param {NS} ns */
export async function get_all_servers(ns) {
	var servers = ["home"]
	let scans = ns.scan()
	for (let x in scans) {
		let scan = scans[x]
		servers.push(scan)
	}

	var i = 0
	while (i < servers.length) {
		var server = servers[i]
		var s = ns.scan(server)
		for (var j in s) {
			var con = s[j]
			if (servers.indexOf(con) < 0) {
				servers.push(con)
			}
		}
		i += 1
	}
	return servers
}