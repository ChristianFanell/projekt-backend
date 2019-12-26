const db = require('../db/database.js');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET;

const me = {

    // localhost:1337/trade/funds
    getFunds(res, body) {
        let sql = `
            SELECT
                f.funds
            from
                user_funds f
            inner join users u on
                f.u_email = ?
        `;

        db.get(sql, body.id,
            (err, row) => {
                if (err) {
                    return res.status(500).json({
                        error: {
                            status: 500,
                            path: "GET /trade/funds",
                            title: "Database error",
                            message: err.message
                        }
                    });
                }
                return res.status(200).json({
                    data: row,
                    message: 'success'
                })
            })
    },

    getComSum(res, body) {
        let sql = `
        select cs.c_sum, c.com_name
        from com_sum cs
        join commoditys c
        on c.com_id = cs.c_id
        where cs.u_email = ?
        `;

        db.all(sql, body.id,
            (err, row) => {
                if (err) {
                    return res.status(500).json({
                        error: {
                            status: 500,
                            path: "GET /trade/funds",
                            title: "Database error",
                            message: err.message
                        }
                    });
                }
                return res.status(200).json({
                    data: row,
                    message: 'success'
                })
            })
    },

    // localhost:1337/trade/deposit
    addMoney(res, body) {
        let sql = `
            update user_funds
            set funds = funds + ?
            where u_email = ?;
        `;

        db.run(
            sql,
            body.amount,
            body.id,
            function (err) {
                if (err) {
                    return res.status(500).json({
                        error: {
                            status: 500,
                            path: "PUT /trade/deposit",
                            title: "Database error",
                            message: err.message
                        }
                    });
                }
                return res.status(201).json({
                    data: {
                        message: 'Money deposited'
                    }
                });
            })
    },

    buyMetals(res, body) {
      console.log(body)
        let id = body.id;//email
        let amount = body.amount;
        let quantity = body.quantity;
        let commodity = body.commodity;

        let sql = `
            update user_funds
            set funds = funds - ?
            where u_email = ?;
        `;

        let sql2 = `
        insert into purchases
	        (p_email, p_price, p_amount, p_com_id)
        VALUES
	        (?, ?, ?, ?);
        `;

        let sql3 = `
        update com_sum
        set c_sum = c_sum + ?
        where c_id = ? and u_email = ?

        `;

        db.serialize(() => {
            db.run(
                sql,
                body.amount,
                body.id,
                function (err) {
                    if (err) {
                        return err.message;
                    }
                })
            db.serialize(() => {
                db.run(
                    sql3,
                    quantity,
                    commodity,
                    id,
                    function (err) {
                        if (err) {
                            return err.message;
                        }
                    })

                db.serialize(() => {
                    db.run(sql2,
                        id,
                        amount,
                        quantity,
                        commodity,
                        function (err) {
                            if (err) {
                                return err.message;
                            }
                            return res.status(201).json({
                                data: {
                                    message: "Purchase added"
                                }
                            })
                        }
                    )
                })
            })
        })
    },

    getBuyHistory(res, body) {
        let sql = `
        select p.p_price, p.p_amount, c.com_name
        from purchases p
            inner join commoditys c
            on c.com_id = p.p_com_id
            where p.p_email = ?
        `;

        db.all(
            sql,
            [body.id],
            (err, row) => {
                if (err) {
                    return res.status(500).json({
                        error: {
                            status: 500,
                            path: "GET /trade/buyhistory",
                            title: "Database error",
                            message: err.message
                        }
                    });
                }

                return res.status(200).json({
                    data: row,
                    message: 'success'
                })
            })
    },

    sellMetals(res, body) {
        let id = body.id;//email
        let amount = body.amount;
        let quantity = body.quantity;
        let commodity = body.commodity;

        let sql = `
            update user_funds
            set funds = funds + ?
            where u_email = ?;
        `;

        let sql2 = `
        insert into sold
	        (s_email, s_price, s_amount, s_com_id)
        VALUES
	        (?, ?, ?, ?);
        `;

        let sql3 = `
        update com_sum
        set c_sum = c_sum - ?
        where c_id = ? and u_email = ?

        `;

        db.serialize(() => {
            db.run(
                sql,
                body.amount,
                body.id,
                function (err) {
                    if (err) {
                        return err.message;
                    }
                })
            db.serialize(() => {
                db.run(
                    sql3,
                    quantity,
                    commodity,
                    id,
                    function (err) {
                        if (err) {
                            return err.message;
                        }
                    })

                db.serialize(() => {
                    db.run(sql2,
                        id,
                        amount,
                        quantity,
                        commodity,
                        function (err) {
                            if (err) {
                                return err.message;
                            }
                            return res.status(201).json({
                                data: {
                                    message: "Purchase sold"
                                }
                            })
                        }
                    )
                })
            })
        })
    },

    getSellHistory(res, body) {

        let id = body.id;

        let sql = `
        select s.s_price, s.s_amount, c.com_name
        from sold s
            inner join commoditys c
            on c.com_id = s.s_com_id
            where s.s_email = ?
        `;

        db.all(
            sql,
            [body.id],
            (err, row) => {
                if (err) {
                    return res.status(500).json({
                        error: {
                            status: 500,
                            path: "GET /trade/sellhistory",
                            title: "Database error",
                            message: err.message
                        }
                    });
                }

                return res.status(200).json({
                    data: row,
                    message: 'success'
                })
            })
    },


    checkToken: function (req, res, next) {
        var token = req.headers['x-access-token'];

        jwt.verify(token, jwtSecret, function (err, decoded) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: req.path,
                        title: "Failed authentication",
                        detail: err.message
                    }
                });
            }

            next();
            return undefined;
        });

    }
};

module.exports = me;
