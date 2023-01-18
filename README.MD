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

```


init command:
```

npm run neoris_check -- -a <OPEN/CLOSE> -f <true/false>

```


CronJob command:
```

* * * * * ~/projects/fichaje/cronjob.sh <OPEN/CLOSE> <true/false> ~/projects/fichaje >> ~/projects/fichaje/logs/cronjob.log 2>&1

```