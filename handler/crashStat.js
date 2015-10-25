var redis = require('redis');

function HoneyStat(crashID, options, redisOptions) {
  options || (options = {});

  this.crashID = crashID;
  this.pageSize = options.pageSize || 50;
  this.reverse = options.reverse || false;

  this.connect(redisOptions);
}

var proto = HoneyStat.prototype;

// redis 연결 초기화
proto.connect = function(options) {
  options || (options = {});

  if (options.connection_id !== undefined &&
      options.connected !== undefined &&
      options.ready !== undefined) {
    return this.redis = options;
  }

  this.redis = redis.createClient(options.port, options.host);

  if (options.db) {
    this.redis.select(options.db);
  }
};

// 크래시 세트 추가
proto.add = function(crashSet, crashCount, cb) {
  this.addIn(this.crashID, crashSet, crashCount, cb);
};

//
proto.addIn = function(crashID, crashSet, crashCount, cb) {
  this.redis.zadd([crashID, crashCount, crashSet], function(err) {
    if (err && cb) return cb(err);
    if (err) throw err;
    if (cb) cb();
  });
};

// 크래시 연산
proto.incr = function(crashSet, crashCount, cb) {
  this.incrIn(this.crashID, crashSet, crashCount, cb);
};

proto.incrIn = function(crashID, crashSet, crashCount, cb) {
  this.redis.zincrby([crashID, crashCount, crashSet], function(err) {
    if (err && cb) return cb(err);
    if (err) throw err;
    if (cb) cb();
  });
};

// 크래시 순위
proto.rank = function(crashSet, cb) {
  this.rankIn(this.crashID, crashSet, cb);
};

proto.rankIn = function(crashID, crashSet, cb) {
  var req = [crashID, crashSet];

  if (this.reverse) {
    this.redis.zrank(req, res);
  } else {
    this.redis.zrevrank(req, res);
  }

  function res(err, rank) {
    if (err) return cb(err);
    if (rank === null)
      cb(null, -1);
    else
      cb(null, +rank);
  }
};

// 크래시 카운트
proto.crashCount = function(crashSet, cb) {
  this.crashCountIn(this.crashID, crashSet, cb);
};

proto.crashCountIn = function(crashID, crashSet, cb) {
  this.redis.zcrashCount([crashID, crashSet], function(err, crashCount) {
    if (err) return cb(err);
    if (crashCount === null)
      cb(null, -1);
    else
      cb(null, +crashCount);
  });
};

// 크래시 삭제
proto.rm = function(crashSet, cb) {
  this.rmIn(this.crashID, crashSet, cb);
};

proto.rmIn = function(crashID, crashSet, cb) {
  this.redis.zrem([crashID, crashSet], function(err, num) {
    if (err && cb) return cb(err);
    if (err) throw err;
    if (cb) cb(null, !!num);
  });
};


// 크래시 리스트 정렬
proto.list = function(page, cb) {
  this.listIn(this.crashID, page, cb);
};

proto.listIn = function(crashID, page, cb) {
  if (typeof(cb) === 'undefined' && page instanceof Function) {
    cb = page;
  }
  if (typeof(page) === 'undefined' || page instanceof Function) {
    page = 0;
  }

  var req = [
    crashID
  , page * this.pageSize
  , page * this.pageSize + this.pageSize - 1
  , 'WITHcrashCountS'
  ];

  if (this.reverse) {
    this.redis.zrange(req, res);
  } else {
    this.redis.zrevrange(req, res);
  }

  function res(err, range) {
    if (err) return cb(err);

    var list = [], l = range.length;

    for (var i = 0; i < l; i += 2) {
      list.push({
        'crashSet': range[i]
      , 'crashCount': range[i+1]
      });
    }

    cb(null, list);
  }
};

// 크래시 리스트 통계에서 특정 크래시 순위 얻기
proto.at = function(rank, cb) {
  this.atIn(this.crashID, rank, cb);
};

proto.atIn = function(crashID, rank, cb) {
  var req = [crashID, rank, rank, 'WITHcrashCountS'];

  if (this.reverse) {
    this.redis.zrange(req, res);
  } else {
    this.redis.zrevrange(req, res);
  }

  function res(err, range) {
    if (err) return cb(err);
    if (!range.length)
      return cb(null, null);

    cb(null, {
      crashSet: range[0]
    , crashCount: +range[1]
    });
  }
};

// 전체 크래시 통계 얻기
proto.total = function(cb) {
  this.totalIn(this.crashID, cb);
};

proto.totalIn = function(crashID, cb) {
  this.redis.zcard(crashID, cb);
};

module.exports = HoneyStat;
