FROM tensorflow/tensorflow:2.2.2-gpu
# nvidia/cuda:11.1-runtime
#
#latest-gpu  nvidia/cuda:11.1-runtime

SHELL ["/bin/bash", "-c"]

RUN apt-get update && apt-get install --no-install-recommends --no-install-suggests -y curl wget vlc xvfb
# libgtk2.0-dev pkg-config
WORKDIR /tmp
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda.sh \
	&& chmod +x miniconda.sh && mkdir /root/.conda \
	&& bash miniconda.sh -b -p /conda 

WORKDIR /
COPY ./conda-or-obj-detection.yml conda-or-obj-detection.yml
RUN source /conda/bin/activate \
	&& conda init bash \
	&& conda env create -f conda-or-obj-detection.yml

COPY ./app /app

RUN wget https://github.com/AlexeyAB/darknet/releases/download/darknet_yolo_v3_optimal/yolov4.weights -O /app/data/yolov4.weights

RUN mkdir /scripts
COPY docker-start-command.sh /scripts/docker-start-command.sh

RUN ["chmod", "a+x", "/scripts/docker-start-command.sh"]

# ENTRYPOINT
ENTRYPOINT bash ./scripts/docker-start-command.sh
