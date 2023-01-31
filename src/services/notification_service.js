const fs = require('fs');
const path = require('path');
const { transporter } = require("../config/smtp")

const {
  FICHAJE_NOTIFICATION_EMAIL,
  FICHAJE_NOTIFICATION_ENABLED,
  FICHAJE_NOTIFICATION_LOG_ATTACHMENT
} = process.env;

const sendEmail = async (date,action,incident,valid) => {
  const {file} = await _getMostRecentFile(FICHAJE_NOTIFICATION_LOG_ATTACHMENT);
  console.log(`----- CALL SEND_EMAIL STATUS: ${valid}-----`);
  if (FICHAJE_NOTIFICATION_ENABLED === 'true') {
    transporter.sendMail({
      from: FICHAJE_NOTIFICATION_EMAIL || 'email@prueba.com', 
      to: FICHAJE_NOTIFICATION_EMAIL,
      subject: `{FICHAJE} Notification ${valid ? '✅✅✅✅' : '⛔⛔⛔⛔'}`,
      html: _generateTemplate(date,action,incident,valid),
      attachments: [
        {
          filename: file,
          path: `${FICHAJE_NOTIFICATION_LOG_ATTACHMENT}/${file}` // stream this file
        },
      ]
    }).then(info => {
      console.log({info});
      console.log('----- FINISH SEND_EMAIL -----');
    }).catch(console.error);
  } else {
    console.log('EMAIL DISABLED OR IN VERIFY PROCESS');
    console.log('----- FINISH SEND_EMAIL -----');
  }
}

const _generateTemplate = (date,action,incident,valid) => {
  return  `
  <div dir=3D"ltr">
    <div><b>Notificación de Fichaje:</b></div>
    <br><br>
    <div><b>DATE: </b> ${date}</div>
    <div><b>ACTION: </b>${action}</div>
    <div><b>INCIDENT: </b>${incident}</div>
    <div><b>STATUS: </b>${valid}</div>
    <br>
    <div>Log attached</div>
  </div>
  `
}

const _getMostRecentFile = (dir) => {
  const files = _orderRecentFiles(dir);
  return files.length ? files[0] : undefined;
};

const _orderRecentFiles = (dir) => {
  return fs.readdirSync(dir)
      .filter(file => fs.lstatSync(path.join(dir, file)).isFile())
      .map(file => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
};

module.exports = {
  sendEmail
}