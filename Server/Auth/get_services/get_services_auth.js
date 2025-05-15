    const jwt = require("jsonwebtoken");
    var amqp = require('amqplib/callback_api');

    exports.check_token =  (token) => {
        let check = false
        jwt.verify(token, "secret", (err, token) => {
            if (err) {
            console.log('Error: ' + err);
            } else{
                check = true
            }
        })
        return check
    }

    exports.sign_in_default = async (body) => {
        console.log(typeof body, "TYPE NBODY");
        try {
            const parsedBody = JSON.parse(body);
            console.log(parsedBody, "PARSED BODY");
    
            const falseUser = parsedBody.false_user;
            const email = falseUser.email;
            const password = falseUser.password;
    
            const trueUser = JSON.parse(parsedBody.true_user);
    
            const token = await new Promise((resolve, reject) => {
                jwt.sign({ user: falseUser }, "secret", (err, token) => {
                    err ? reject(err) : resolve(token);
                });
            });
    
            console.log("Comparing:", email, "vs", trueUser.email);
            console.log("Passwords:", password, "vs", trueUser.password);
            console.log(email == trueUser.email)
            console.log(password == trueUser.password)
    
            const isValid = email == trueUser.email && password == trueUser.password;
            return { is_valid: isValid, token: isValid ? token : null, id: trueUser.id };
        } catch (error) {
            console.error('Error in sign_in_default:', error);
            return { is_valid: false, token: null };
        }
    };

    exports.sign_up_default = async (user) => {
        console.log("Получили юзера " + user)
        try {
            const token = await new Promise((resolve, reject) => {
                jwt.sign({ user: user }, "secret", (err, token) => {
                    if (err) {
                        console.log('Error: ' + err);
                        reject(err); // Отклоняем промис в случае ошибки
                    } else {
                        console.log(1);
                        resolve(token); // Разрешаем промис с токеном
                    }
                });
            });
            
            return token; // Возвращаем токен
        } catch (error) {
            console.error('Error generating token:', error);
            throw error; // Обработка ошибок
        }
    }