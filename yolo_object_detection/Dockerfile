FROM tensorflow/tensorflow:latest-gpu
# nvidia/cuda
SHELL ["/bin/bash", "-c"]

RUN apt-get update && apt-get install --no-install-recommends --no-install-suggests -y curl wget vlc xvfb
# libsm6 libxext6 libxrender-dev
WORKDIR /tmp
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda.sh \
	&& chmod +x miniconda.sh && mkdir /root/.conda \
	&& bash miniconda.sh -b -p /conda 
	# && rm -r /tmp

WORKDIR /
COPY ./conda-or-obj-detection.yml conda-or-obj-detection.yml
RUN source /conda/bin/activate \
	&& conda init bash \
	&& conda env create -f conda-or-obj-detection.yml

COPY ./weights ./app/data/

COPY ./app /app

RUN mkdir /scripts
COPY docker-start-command.sh /scripts/docker-start-command.sh

# RUN Xvfb -ac :99 -screen 0 800x600x16 +extension RANDR

RUN ["chmod", "a+x", "/scripts/docker-start-command.sh"]

# virtual display used by vlc to make snapshots

# ENTRYPOINT
ENTRYPOINT bash ./scripts/docker-start-command.sh
# CMD ['object_tracker.py']
	