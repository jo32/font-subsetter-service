#/bin/bash

(cd server/java; mvn install);
if [ ! -d "lib" ]; then
    mkdir lib
fi
jarname=`find server/java/target/font-subsetter-*-jar-with-dependencies.jar`;
cp $jarname lib/;

(cd server/node; npm install);
(cd server/thrift/gen-nodejs; npm install);
(cd client/web-client/; npm install; grunt prod);
mkdir server/font;