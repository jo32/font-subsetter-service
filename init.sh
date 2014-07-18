#/bin/bash

(cd server/java; mvn install);
if [ ! -d "lib" ]; then
    mkdir lib
fi
jarname=`find server/java/target/font-subsetter-*-jar-with-dependencies.jar -type f -printf "%f\n"`;
cp $jarname lib/;

(cd node; npm install);
(cd thrift/gen-nodejs; npm install);