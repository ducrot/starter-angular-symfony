# Prepare Debian
RUN apt-get update

# Install Symfony CLI
RUN curl -1sLf 'https://dl.cloudsmith.io/public/symfony/stable/setup.deb.sh' | sudo -E bash
RUN apt install symfony-cli

# Install Angular CLI
RUN npm install -g @angular/cli@v14-lts

# Install Protobuf v.23.4 binary from https://github.com/protocolbuffers/protobuf/releases
RUN cd /tmp/
RUN curl -LO https://github.com/protocolbuffers/protobuf/releases/download/v23.4/protoc-23.4-linux-x86_64.zip
RUN unzip protoc-23.4-linux-x86_64.zip
RUN mv bin/protoc /usr/local/bin/protoc
RUN mv include /usr/local/bin/include

# Install make
RUN apt install -y make
