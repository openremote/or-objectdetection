FROM python

COPY YOLO_DETECTION /app/YOLO_DETECTION
COPY entrypoint.sh /app/entrypoint.sh
COPY requirements.txt /app/requirements.txt

WORKDIR /app/YOLO_DETECTION/config
RUN ./download_weights.sh

WORKDIR /app/YOLO_DETECTION
RUN pip install -r /app/requirements.txt
RUN apt-get update && apt-get install -y libgl1-mesa-glx && rm -rf /var/lib/apt/lists/*
RUN apt-get update &&\
apt-get install -y \
python-skimage \
python-pip
RUN pip install --upgrade scikit-image

RUN apt-get update && apt-get install -y build-essential
RUN apt-get --purge remove -y nvidia*
ADD ./Downloads/nvidia_installers /tmp/nvidia                             > Get the install files you used to install CUDA and the NVIDIA drivers on your host
RUN /tmp/nvidia/NVIDIA-Linux-x86_64-331.62.run -s -N --no-kernel-module   > Install the driver.
RUN rm -rf /tmp/selfgz7                                                   > For some reason the driver installer left temp files when used during a docker build (i don't have any explanation why) and the CUDA installer will fail if there still there so we delete them.
RUN /tmp/nvidia/cuda-linux64-rel-6.0.37-18176142.run -noprompt            > CUDA driver installer.
RUN /tmp/nvidia/cuda-samples-linux-6.0.37-18176142.run -noprompt -cudaprefix=/usr/local/cuda-6.0   > CUDA samples comment if you don't want them.
RUN export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/cuda/lib64         > Add CUDA library into your PATH
RUN touch /etc/ld.so.conf.d/cuda.conf                                     > Update the ld.so.conf.d directory
RUN rm -rf /temp/*  > Delete installer files.

ENTRYPOINT ["/app/entrypoint.sh"]
