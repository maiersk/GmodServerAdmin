class Group {
    /**
     * user power group
     * @param {number} id 
     * @param {string} name 
     * @param {string} powers   使用toJson()时. powers类型为Array
     */
    constructor(id, name, powers) {
        this.id = id;
        this.name = name;
        this.powers = powers;
        
        this.list = JSON.parse(this.powers) || [];
    }

    addPower(...items) {
        items.forEach((item, key) => {
            this.list.push(item);
        })
        // console.log(this.list);
        // this.powers = JSON.stringify(this.list);
    }

    delPower(...items) {
        this.list.forEach((power, i) => {
            items.forEach((item, k) => {
                if (power === item) {
                    this.list.splice(i, 1);
                }
            })
        })
        // console.log(this.list);
        // this.powers = JSON.stringify(this.list);
    }

    getPowers() {
        return this.list;
    }

    toJson() {
        let json = {};
        json.id = this.id;
        json.name = this.name;
        json.powers = this.list;    //输出格式需要数组形式
        return json;
    }

    static from(json) {
        return new Group(
            json.id,
            json.name,
            json.powers,
        );
    }
}

Group.ROOT = 'root';
Group.SUPERADMIN = 'superadmin';
Group.ADMIN = 'admin';
Group.PLAYER = 'player';

module.exports = Group;