FROM ubuntu

RUN apt-get update
RUN apt-get install vim sudo curl -y

RUN useradd -m -s /bin/bash -G sudo coder
# Let's add a fancy prompt!
RUN echo "PS1='🐳 \[\033[1;36m\]\h \[\033[1;34m\]\W\[\033[0;35m\] \[\033[1;36m\]# \[\033[0m\]'" > /home/coder/.bashrc && \
    chown coder:coder /home/coder/.bashrc

# Install Node.js + npm (LTS version)
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && \
    apt-get update && \
    apt-get install -y nodejs

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

USER coder
