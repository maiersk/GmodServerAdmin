function toSteam32(steamid64) {
    const steamid1 = steamid64.substr(-1) % 2;
    const steamid2a = steamid64.substr(0, 4) - 7656;
    let steamid2b = steamid64.substr(4) - 1197960265728;
    steamid2b -= steamid1;
    return `STEAM_0:${steamid1}:` + ((steamid2a + steamid2b) / 2);
}

console.log(toSteam32('76561198098162297'));