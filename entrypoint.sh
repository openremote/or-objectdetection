#!/bin/bash

cd /app/YOLO_DETECTION
./config/download_weights.sh
python start.py
