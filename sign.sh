#!/bin/bash -ex

pushd webkitbuilds

set +e
rm GarlicWallet-win64.zip
rm GarlicWallet-win64.zip.sig
rm GarlicWallet-linux.zip.sig
set -e

pushd GarlicWallet
zip -r GarlicWallet-win64.zip win64/*
mv GarlicWallet-win64.zip ..
popd 

gpg -u 56302769 -b GarlicWallet-win64.zip
gpg -u 56302769 -b GarlicWallet-linux.zip