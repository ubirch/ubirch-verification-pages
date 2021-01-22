#!/bin/bash

# replace the markers in any file.
# we need to prepend the protocol, otherwise hugo will try to optimize.
# we cannot use @@ for markers, as they will get escaped in some cases.
find /usr/share/nginx/html -type f -exec \
    sed -i \
        -e "s%https://__VERIFICATION_HUGO_BASE_URL__%${VERIFICATION_HUGO_BASE_URL}%" \
        -e "s%https://__VERIFICATION_SCRIPT_URL__%${VERIFICATION_SCRIPT_URL}%" \
        -e "s%__SHOW_DEMO_DISCLAIMER__%${SHOW_DEMO_DISCLAIMER}%" \
        {} \;
