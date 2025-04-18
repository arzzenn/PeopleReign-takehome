#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
source ${SCRIPT_DIR}/helpers.sh

# Start application
echo "${bold}Run app${reset}"
pushd ${SCRIPT_DIR}/..
node dist/main
