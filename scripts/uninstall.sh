#!/bin/bash

if [ "$EUID" -ne 0 ]
  then 
  echo "Must be run as adminitrator for system configurations and installations."
  exit
fi

echo "Stop raspalarm"
systemctl stop raspalarm
systemctl disable raspalarm
rm /usr/lib/systemd/system/raspalarm
rm /usr/lib/systemd/system/raspalarm
systemctl daemon-reload
systemctl reset-failed

echo "Cleanning raspalarm..."
rm -rf /var/run/raspalarm 1>/dev/null
rm -rf node_modules 1>/dev/null
rm -rf /etc/systemd/system/raspalarm.service /etc/systemd/system/mongo.service 1>/dev/null
rm -rf /home/pi/.config/lxsession/LXDE-pi/autostart 1>/dev/null
rm -rf /etc/rsyslog.d/logsplit.conf 1>/dev/null
echo -e "127.0.0.1       localhost
::1             localhost ip6-localhost ip6-loopback
ff02::1         ip6-allnodes
ff02::2         ip6-allrouters

127.0.1.1               raspberrypi" > /etc/hosts
echo "raspberrypi" > /etc/hostname

echo "Restore autostart"
mv /etc/xdg/lxsession/LXDE-pi/autostart.save /etc/xdg/lxsession/LXDE-pi/autostart

echo "Reset cursor on next boot"
mv /etc/lightdm/lightdm.save.conf /etc/lightdm/lightdm.conf 

echo "Reset screen rotation"
mv /boot/config.save.txt /boot/config.txt

echo "Reset startup verbose"
mv /boot/cmdline.save.txt /boot/cmdline.txt

echo "Reset Splash Screen"
mv /usr/share/plymouth/themes/pix/splash.save.png /usr/share/plymouth/themes/pix/splash.png

echo "Reset chromium kiosk mode"
echo "lxpanel --profile LXDE-pi" > /etc/xdg/lxsession/LXDE-pi/autostart

echo "Uninstall done"