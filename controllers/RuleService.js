const conn = require('../lib/mysql');
const Dao = require('../controllers/dataDao');
const ruledao = new Dao(Dao.RULES, conn);

const BaseService = require('../controllers/BaseService');
const Rule = require('../models/Rule');

class RuleService extends BaseService {
    constructor(obj, dao) {
        super(obj, dao, 'serverid');
    }

}

module.exports = new RuleService(Rule, ruledao);