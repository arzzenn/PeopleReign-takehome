# check if stdout is a terminal...
if test -t 1; then

  # see if terminal supports colors...
  ncolors=$(tput colors 2> /dev/null)

  if test -n "$ncolors" && test $ncolors -ge 8; then
    black=`tput setaf 0`
    red=`tput setaf 1`
    green=`tput setaf 2`
    yellow=`tput setaf 3`
    blue=`tput setaf 4`
    magenta=`tput setaf 5`
    cyan=`tput setaf 6`
    white=`tput setaf 7`
    reset=`tput sgr0`

    bold=`tput bold`
  fi
fi

echo_check_silent() {
    SILENT=$1;
    shift
    if [ -z ${SILENT+x} ]; then
        echo $@;
    fi
}

# not every app will need this, delete if not needed
installMongoshTool() {
  export MONGOSH_COMMAND=mongosh
  export MONGOSH_RELEASE=mongosh-1.10.1-linux-x64
  export MONGOSH_RELEASE_EXTENTION=tgz

  if [ ! -f "/usr/local/bin/${MONGOSH_COMMAND}" ]; then
    echo -e "\n⏭  ${bold}Install ${MONGOSH_COMMAND}${reset}"
    pushd /tmp > /dev/null || exit
    wget https://downloads.mongodb.com/compass/${MONGOSH_RELEASE}.${MONGOSH_RELEASE_EXTENTION}
    tar -xzf ${MONGOSH_RELEASE}.${MONGOSH_RELEASE_EXTENTION}
    sudo mv ${MONGOSH_RELEASE}/bin/* /usr/local/bin/
    rm -rf "${MONGOSH_RELEASE}"
    popd > /dev/null || exit
  fi
}

export -f installMongoshTool
