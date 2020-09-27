FROM nvidia/cuda:10.2-base
CMD nvidia-smi

ENV DEBIAN_FRONTEND=noninteractive

#set up environment
RUN apt-get update && apt-get install --no-install-recommends --no-install-suggests -y curl
RUN apt-get -y install unzip python3 python3-pip libgl1-mesa-glx wget python-skimage

COPY YOLO_DETECTION /app/YOLO_DETECTION
COPY entrypoint.sh /app/entrypoint.sh
COPY requirements.txt /app/requirements.txt

WORKDIR /app/YOLO_DETECTION
RUN pip3 install --upgrade scikit-image scikit-build
RUN pip3 install -r /app/requirements.txt

WORKDIR /app/YOLO_DETECTION/config
RUN ./download_weights.sh

ENTRYPOINT ["/app/entrypoint.sh"]
