const db = require("../db/database.js");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const jwtSecret = process.env.JWT_SECRET;
// login
const auth = {

    login: function (res, body) {
        const email = body.email;
        const password = body.password;

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }

        db.get("SELECT * FROM users WHERE email = ?",
            email,
            (err, rows) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/login",
                            title: "Database error",
                            detail: err.message
                        }
                    });
                }

                if (rows === undefined) {
                    return res.status(401).json({
                        errors: {
                            status: 401,
                            source: "/login",
                            title: "Användaren hittas ej",
                            detail: "User with provided email not found."
                        }
                    });
                }

                const user = rows;

                bcrypt.compare(password, user.user_password, (err, result) => {
                    if (err) {
                        return res.status(500).json({
                            errors: {
                                status: 500,
                                source: "/login",
                                title: "bcrypt error",
                                detail: "bcrypt error"
                            }
                        });
                    }

                    if (result) {
                        let payload = { api_key: user.apiKey, email: user.email };
                        let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });
                        res.header('fixa_en_cookie', jwtToken) // bättre än att skicka det som nedan ?
                        return res.json({
                            data: {
                                type: "success",
                                message: "User logged in",
                                user: payload,
                                token: jwtToken
                            }
                        });
                    }

                    return res.status(401).json({
                        errors: {
                            status: 401,
                            source: "/login",
                            title: "Fel lösenord",
                            detail: "Password is incorrect."
                        }
                    });
                });
            });
    },

    register: function (res, body) {
        const email = body.email;
        const password = body.password;
        const firstName = body.firstName;
        const lastName = body.lastName;

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/register",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }

        bcrypt.hash(password, 10, function (err, hash) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            db.serialize(() => {
                db.run("INSERT INTO users (first_name, last_name, email, user_password) VALUES (?, ?, ?, ?)",
                    firstName,
                    lastName,
                    email,
                    hash, (err) => {
                        if (err) {
                            return err.message;
                        }


                    });
                db.serialize(() => {
                    db.run("insert into user_funds (u_email, funds) VALUES (?, 0)",                 
                        email,
                        (err) => {
                            if (err) {
                                return err.message;
                            }


                        });
                    let init = `
            insert into com_sum
                (u_email, c_id, c_sum) 
            values
                (?, 1, 0), 
                (?, 2, 0), 
                (?, 3, 0)
            `;

                    db.serialize(() => {
                        db.run(
                            init,
                            email,
                            email,
                            email
                        ), (err) => {
                            if (err) {
                                return res.status(500).json({
                                    errors: {
                                        status: 500,
                                        source: "/register",
                                        title: "Database error",
                                        detail: err.message
                                    }
                                });
                            }

                        }
                        return res.status(201).json({
                            data: {
                                message: "User successfully registered."
                            }
                        });
                    })
                })
            })

        });
    },
};

module.exports = auth;
// return res.status(201).json({
//     data: {
//         message: "User successfully registered."
//     }
// });