FROM continuumio/miniconda3:latest

WORKDIR /home/docker_conda_template

#copy over the requirements and make the conda environment
COPY conda-reqs.yml ./
RUN conda  env create -f conda-reqs.yml

#copy over all the other files necessary
COPY ./ ./

ENV PATH /opt/conda/envs/backend/bin:$PATH
RUN /bin/bash -c "source activate backend"

CMD [ "python", "init.py" ]

#   make sure to set environment variable BACKEND_HOST in docker run to 0.0.0.0, otherwise it will bind to localhost and not be accessible:
#   docker run --publish 5050:5050 -e BACKEND_HOST=0.0.0.0 be-test:1.0