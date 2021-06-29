
#!/bin/bash

# replace the markers in any file.
# we need to prepend the protocol, otherwise hugo will try to optimize.
# we cannot use @@ for markers, as they will get escaped in some cases.

find /app_template -type f -exec \
    sed -i \
        -e "s%https://__VERIFICATION_HUGO_BASE_URL__%${VERIFICATION_HUGO_BASE_URL}%" \
        -e "s%__SHOW_DEMO_DISCLAIMER__%${SHOW_DEMO_DISCLAIMER}%" \
        -e "s%__DEPLOYMENT_STAGE__%${DEPLOYMENT_STAGE}%" \
        -e "s%__ACCESS_TOKEN_GD__%${ACCESS_TOKEN_GD}%" \
        {} \;

cp -a /app_template/* /www
