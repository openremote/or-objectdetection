FROM python

COPY YOLO_DETECTION /app/YOLO_DETECTION
COPY requirements.txt /app/requirements.txt

RUN pip install -r /app/requirements.txt

ENTRYPOINT ["python", "/app/YOLO_DETECTION/start.py"]
