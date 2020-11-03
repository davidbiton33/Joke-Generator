const nodemailer = require('nodemailer');
const log = require("../../global/console");

//
//
//
async function sendEmail(data) {
    return new Promise(async (res, rej) => {
        //case of: mail for approve user email after register
        if (data.ApproveEmail) {
            let response = await mailOfApproveUserEmail(data);
            res(response);
        }

        // case of: mail for reset the user password
        if (data.ResetPassword) {
            let response = await mailOfResetPasswordEmail(data);
            res(response);
        }
    })
}



//send email to user for approve the email
async function mailOfApproveUserEmail(data) {
    return new Promise(async (res, rej) => {
        let to = data.Email;
        let subject = "Approve email";
        let message = `
        <div style="text-align: center">
        <h1>welcome to our shop</h1>
        <p style="font-size: 16px">
            <label>Dear ${data.Name ? data.Name : " "},</label> 
            <br/>
            You have register to our shop. to continue in the process
            Please follw to this link to approve your email: <a href="http://localhost:2020/#/verification-email/${data.Email}">Approve email</a>
        </p>
        <img border="0" width="200" height="100" id="m_4331912880153398889_x0000_i1026" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Jaffa_slope1821.jpg/1000px-Jaffa_slope1821.jpg" class="CToWUd">
        </div>
        `;

        try {
            let response = await sendMail(to, subject, message);

            res(response);
        } catch (err) {
            log.error("Failed to send approve email to user");
            res(false);
        }
    });
}





// send email to user to restore the password of him
async function mailOfResetPasswordEmail(data) {
    return new Promise(async (res, rej) => {
        let to = data.Email;
        let subject = "reset password";
        let message = `
        <div style="text-align: center">
        <h1>welcome to our shop</h1>
        <p style="font-size: 16px">
            <label>Dear ${data.Name},</label> 
            <br/>
            hey ${data.Name} !
            Please follow to this link to reset the password: <a href="http://localhost:2020/#/reset-password/${data._id}">reset password</a>
        </p>
        <img border="0" width="200" height="100" id="m_4331912880153398889_x0000_i1026" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Jaffa_slope1821.jpg/1000px-Jaffa_slope1821.jpg" class="CToWUd">
        </div>
        `;

        try {
            let response = await sendMail(to, subject, message);
            res(response);
        } catch (err) {
            log.error("Failed to send reset password email to user");
        }
    });
}




/* function that send the email */
/* function of  'nodemailer' packege*/
async function sendMail(to, subject, text) {
    return new Promise(async (res, rej) => {
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "ajamishop@gmail.com",
                pass: "0525888032",
            },
        });

        var mailOptions = {
            from: '"ajami shop" <ajamishop@gmail.com>',
            to: to,
            subject: subject,
            html: text,
        };

        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                log.error(error.message);
                res(false);
            } else {
                log.info("Email sent: " + info.response);
                log.info("Email sent to : " + mailOptions.to);
                

                res(true);
            }
        });
    })
}

module.exports.sendEmail = sendEmail;