#!/bin/bash
set -eux

npm run build

# Pending migration: https://github.com/sqldef/sqldef/issues/451
# curl -LO https://github.com/sqldef/sqldef/releases/latest/download/psqldef_linux_amd64.tar.gz
# tar -xzf psqldef_linux_amd64.tar.gz
# chmod +x psqldef
#
# ./psqldef -h $POSTGRES_HOST -U $POSTGRES_USER -W $POSTGRES_PASSWORD $POSTGRES_DATABASE --enable-drop-table < db/schema.sql
