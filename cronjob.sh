#!/bin/bash

# NVM needs the ability to modify your current shell session's env vars,
# which is why it's a sourced function
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

FICHAJE_DATE="$(date +'%m-%d-%Y_%T')"

cd $3

$(which npm) run neoris_check -- -a $1 -f $2 2>&1| tee logs/fichaje/fichaje_$FICHAJE_DATE.log