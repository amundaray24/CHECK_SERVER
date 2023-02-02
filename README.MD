# Check Time Report
# fichaje
- author: ANGERSON JOSE AMUNDARAY RENGIFO
- version: 1.0.0
- type: NodeJs

IMPORTANT:
```

must create .env file example:

FICHAJE_USER=correo@ejemplo.com
FICHAJE_PASSWORD=miclave123
FICHAJE_URL=https://fichaje.com
FICHAJE_HOLIDAYS="2023-03-09"
FICHAJE_NOTIFICATION_EMAIL=correo@ejemplo.com
FICHAJE_NOTIFICATION_PASSWORD=super_password
FICHAJE_NOTIFICATION_ENABLED=true
FICHAJE_NOTIFICATION_VERIFY=true
FICHAJE_NOTIFICATION_LOG_ATTACHMENT=~/projects/fichaje/logs/fichaje

```


init command:
```

npm run neoris_check -- -a <OPEN/CLOSE> -f <true/false>

```


CronJob command:
```

* * * * * ~/projects/fichaje/cronjob.sh <OPEN/CLOSE> <true/false> ~/projects/fichaje >> ~/projects/fichaje/logs/cronjob.log 2>&1

```