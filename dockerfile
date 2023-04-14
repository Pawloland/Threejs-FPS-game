FROM node:18

# update repositories and install maven
RUN apt update
RUN apt install -y maven

# copy editor page dependencies config
COPY html_dev/editor_page/package.json html_dev/editor_page/
COPY html_dev/editor_page/webpack.config.js html_dev/editor_page/

# intall editor page dependencies
RUN cd html_dev/editor_page && npm install

# copy game page dependencies config
COPY html_dev/game_page/package.json html_dev/game_page/
COPY html_dev/game_page/webpack.config.js html_dev/game_page/

# intall game page dependencies
RUN cd html_dev/game_page && npm install

# copy kotlin server dependencies config
COPY kotlin_dev/pom.xml kotlin_dev/

# install kotlin server dependencies
RUN cd kotlin_dev && mvn verify --fail-never

# copy editor page source code
COPY html_dev/editor_page/src html_dev/editor_page/src

# build editor page
RUN cd html_dev/editor_page && npm run build

# copy game page source code
COPY html_dev/game_page/src html_dev/game_page/src

# build game page
RUN cd html_dev/game_page && npm run build

# copy kotlin server source code
COPY kotlin_dev/src kotlin_dev/src

# copy built editor page to kotlin server resources
RUN cp -r html_dev/editor_page/dist/* kotlin_dev/src/main/resources/public/editor_page/

# copy built game page to kotlin server resources
RUN cp -r html_dev/game_page/dist/* kotlin_dev/src/main/resources/public/game_page/

# copy main page to kotlin server resources
COPY html_dev/main_page kotlin_dev/src/main/resources/public/main_page

# build the kotlin server
WORKDIR /kotlin_dev
RUN mvn package 

# run the kotlin server
CMD java -jar target/consoleApp-1.0-SNAPSHOT-jar-with-dependencies.jar

# expose port 5000 for the kotlin server
EXPOSE 5000
