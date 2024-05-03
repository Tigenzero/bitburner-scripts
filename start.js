/** @param {NS} ns */
export async function main(ns) {
	ns.run("hacking/crawler.js")
	ns.run("mcp.js")
	ns.run("auto/home_auto.js")
	while(!ns.hasRootAccess())
}