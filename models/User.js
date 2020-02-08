class User {
    /**
     * User class
     * @param {number|string} id 
     * @param {number|string} groupid 
     * @param {string} steamobj 
     */
    constructor(id, groupid, steamobj) {
        this.id = id;
        this.groupid = groupid;
        //新建SteamObj对象过滤其余参
        this.steamobj = JSON.stringify(new SteamObj(steamobj).getJson());   
    }

    getSteamID32() {
        const steamid1 = this.id.substr(-1) % 2;
        const steamid2a = this.id.substr(0, 4) - 7656;
        let steamid2b = this.id.substr(4) - 1197960265728;
        steamid2b -= steamid1;
        return `STEAM_0:${steamid1}:` + ((steamid2a + steamid2b) / 2);
    }

    getData() {
        return new SteamObj(this.steamobj);
    }

    toJson() {
        let json = {};
        json.id = this.id;
        json.groupid = this.groupid;
        json.steamobj = this.getData().getJson();
        return json;
    }

    static from(json) {
        return new User(
            json.id,
            json.groupid,
            json.steamobj,
        );
    }
}

class SteamObj {
    /**
     * steam data obj
     * @param {string} strjson 
     */
    constructor(strjson) {
        let steamobj = JSON.parse(strjson);
        // console.log(steamobj);
        this.userobj = {
            personaname : steamobj.personaname,
            lastlogoff : steamobj.lastlogoff,
            profileurl : steamobj.profileurl,
            avatar : steamobj.avatar,
            avatarmedium : steamobj.avatarmedium,
            avatarfull : steamobj.avatarfull,
        }
    }

    getName() {
        return this.userobj.personaname;
    }

    getLastlogoff() {
        return this.userobj.lastlogoff;
    }

    getProfileurl() {
        return this.userobj.profileurl;
    }

    /**
     * s, m, f size avatar
     * small, medium, full
     * @param {string} size 
     */
    getAvatar(size) {
        switch(size) {
            case 's' : return this.userobj.avatar;
            case 'm' : return this.userobj.avatarmedium;
            case 'f' : return this.userobj.avatarfull;
        }
    }

    getJson() {
        return this.userobj;
    }
}

module.exports = User;