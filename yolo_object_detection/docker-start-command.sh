#!/bin/bash
source /conda/bin/activate
conda activate or-obj-detection
cd /app
# Xvfb :1 -screen 0 1024x768x16

python object_tracker.py