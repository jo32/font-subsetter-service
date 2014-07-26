#/bin/bash
cwd=`pwd`
jarname=`find $cwd/lib/font-subsetter-*-jar-with-dependencies.jar`;
java -jar $jarname