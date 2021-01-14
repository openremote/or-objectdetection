#!/bin/bash
source /conda/bin/activate
conda activate or-obj-detection
cd /app
# pulseaudio --start --system
# xhost +
python object_tracker.py --dont_show
