#!/bin/bash
source /conda/bin/activate
conda activate or-obj-detection
cd /app

python object_tracker.py --dont_show