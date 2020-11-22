#!/bin/bash
usage() {
  echo "Must be run as adminitrator for system configurations and installations.

Usage: $0 [-hv][-n][-x]

Options:

  -n           Run this command if you're not on linux
  -x           Don't reboot system at end
  -h           See this help
  -v           Get version"
  exit
}

NOT_LINUX=0
NO_REBOOT=0
while getopts ":h:v:n:x" o; do
    case "${o}" in
        h)
          usage
          ;;
        v)
          echo "Raspalarm installator v1.0"
          exit
          ;;
        n)
          NOT_LINUX=1
          ;;
        x)
          NO_REBOOT=1
          ;;
        *)
          ;;
    esac
done

if [ "$EUID" -ne 0 ]
  then 
  usage
  exit
fi

# define vars
DIR=$(printf "%q\n" "$(pwd)")

echo -e "Current dir : $DIR"
BASE_PATH=/var/raspalarm
MONGO_DB_PATH=/var/raspalarm/db

# Create needed folders
mkdir /var/raspalarm 1>/dev/null
mkdir /var/raspalarm/db 1>/dev/null

# kill script when a command fail
set -e
trap "exit" INT

if [ $NOT_LINUX -ne 1 ] 
then 
  echo "Launching linux install"
  ## Install mongodb
  dpkg -l | grep "ii  mongodb" &> /dev/null
  if [ $? -eq 0 ]
  then
          echo "MongoDB already installed"
  else
          echo "MongoDB installation"
          apt-get install --assume-yes mongodb
          echo "MongoDB installed !"
  fi

  ## Install nodejs
  dpkg -l | grep "ii  npm" &> /dev/null
  if [ $? -eq 0 ]
  then
          echo "Node package manager already installed"
  else
          echo "NodeJS installation"
          apt-get install --assume-yes npm
          echo "NodeJS installed !"
  fi



echo "Generate raspalarm.service file"
echo "
[Unit]
Description=Raspalarm

[Service]
# set the working directory to have consistent relative paths
WorkingDirectory=$DIR

# start the server file (file is relative to WorkingDirectory here)
ExecStart=/usr/bin/node ./build/src/app.js

# if process crashes, always try to restart
Restart=always

# let 500ms between the crash and the restart
RestartSec=500ms

# send log tot syslog here (it doesn't compete with other log config in the app itself)
StandardOutput=syslog
StandardError=syslog

# nodejs process name in syslog
SyslogIdentifier=nodejs

# set the environement (dev, prod…)
Environment=NODE_ENV=production


[Install]
# start node at multi user system level (= sysVinit runlevel 3) 
WantedBy=multi-user.target" > raspalarm.service


  echo "if $programname == 'raspalarm' then /var/log/raspalarm.log
& stop" > /etc/rsyslog.d/logsplit.conf

  cp ./raspalarm.service /etc/systemd/system/
  chmod 777 /etc/systemd/system/raspalarm.service
  rm ./raspalarm.service
  systemctl daemon-reload
  systemctl enable raspalarm
  systemctl enable mongodb

  echo "Setting hostname raspalarm"
  echo -e "127.0.0.1       localhost
::1             localhost ip6-localhost ip6-loopback
ff02::1         ip6-allnodes
ff02::2         ip6-allrouters

127.0.1.1               raspberrypi
127.0.1.1               raspalarm" > /etc/hosts
  echo "raspalarm" > /etc/hostname

  mv /etc/xdg/lxsession/LXDE-pi/autostart /etc/xdg/lxsession/LXDE-pi/autostart.save
  echo "
#lxpanel --profile LXDE-pi
#@xset s off
#@xset -dpms
@xset s 120
#@xset s noblank
@$BASE_PATH/chromium.sh" > /etc/xdg/lxsession/LXDE-pi/autostart

cp ./libs/chromium.sh $BASE_PATH/chromium.sh

  echo "Configure screen rotation"
  mv /boot/config.save.txt /boot/config.txt 
  cp /boot/config.txt /boot/config.save.txt
  echo "framebuffer_width=531
framebuffer_height=320
disable_splash=1" >> /boot/config.txt

  echo "Set startup screen quiet"
  cp /boot/cmdline.txt /boot/cmdline.save.txt
  echo "dwc_otg.lpm_enable=0 console=ttyAMA0,115200 console=tty3 root=/dev/mmcblk0p2 rootfstype=ext4 elevator=deadline rootwait fbcon=map:10 fbcon=font:ProFont6x11 loglevel=3 splash quiet plymouth.ignore-serial-consoles logo.nologo vt.global_cursor_default=0" > /boot/cmdline.txt

  cp /usr/share/plymouth/themes/pix/splash.png /usr/share/plymouth/themes/pix/splash.save.png
  cp ./libs/splash.png /usr/share/plymouth/themes/pix/splash.png

fi

echo "Installing raspalarm modules..."
if test -d "./node_modules"; then
    echo "Node modules already installed"
else
  npm install
  echo "$FILE installed on back"
fi

echo "Copy Widevinecdm libs to Chromium"
cp ./libs/libwidevinecdm.so /usr/lib/chromium-browser/
cp ./libs/libpepflashplayer.so /usr/lib/chromium-browser/

echo "Set sound on Jack"
amixer cset numid=1 1
echo "Set sound to 100%"
sudo amixer sset 'Headphone' 100%

## Install and build application

echo "Hide cursor on next boot"
mv /etc/lightdm/lightdm.conf /etc/lightdm/lightdm.save.conf
cp ./libs/lightdm.conf /etc/lightdm/lightdm.conf

echo "Installation finished."

if [ $NO_REBOOT -ne 1 ]
then 
  reboot
fi



