FROM node:18

RUN apt update
RUN apt install -y maven

COPY html_dev/game_page html_dev/game_page
RUN cd html_dev/game_page && npm install && npm run build
COPY html_dev/editor_page html_dev/editor_page
RUN cd html_dev/editor_page && npm install && npm run build

COPY html_dev/main_page/* kotlin_dev/src/main/resources/public/main_page/
COPY kotlin_dev kotlin_dev



RUN cp -r html_dev/editor_page/dist/* kotlin_dev/src/main/resources/public/editor_page/
RUN cp -r html_dev/game_page/dist/* kotlin_dev/src/main/resources/public/game_page/


# build the kotlin server
WORKDIR /kotlin_dev
RUN mvn package 
CMD java -jar target/consoleApp-1.0-SNAPSHOT-jar-with-dependencies.jar

EXPOSE 5000
