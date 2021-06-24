#!/bin/bash

/replace-markers.sh

# taken from https://github.com/bitnami/bitnami-docker-nginx/blob/master/1.19/debian-10/rootfs/opt/bitnami/scripts/nginx/entrypoint.sh
# and adjusted

set -o errexit
set -o nounset
set -o pipefail
# set -o xtrace # Uncomment this line for debugging purpose

# Load libraries
. /opt/bitnami/scripts/libbitnami.sh
. /opt/bitnami/scripts/libnginx.sh

# Load NGINX environment variables
. /opt/bitnami/scripts/nginx-env.sh

print_welcome_page

# Load NGINX environment variables
if [[ "$*" = "/opt/bitnami/scripts/nginx/run.sh" ]]; then
    info "** Starting NGINX setup **"
    /opt/bitnami/scripts/nginx/setup.sh
    info "** NGINX setup finished! **"
fi

echo ""
exec "$@"
