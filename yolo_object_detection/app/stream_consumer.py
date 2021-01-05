from time import sleep
import youtube_dl as ydl
import numpy
import cv2
import vlc
import re
import time

def consume_ipcam(url):
	# -I dummy --dummy-quiet --no-video
	instance = vlc.Instance('--intf dummy --vout dummy')
	player = instance.media_player_new()
	
	player.set_mrl(url)
	player.play()
	i=0
	while True:
		i+=1
		print ('frame '+ str(i))
		player.video_take_snapshot(0,'file.png',0,0)
		raw_image = cv2.imread('file.png', 0)
		width,height = player.video_get_size()
		if raw_image is not None and width > 0 and height > 0:
			print('yielded')
			image = numpy.frombuffer(raw_image, dtype='uint8')
			image = image.reshape((height, width, 1))
			yield image

def consume_youtube(youtube_url, quality = 'normal'):
	with ydl.YoutubeDL({
	"default_search": 'ytsearch',
	'format': '94'
	}) as dloader:
		info_dict = dloader.extract_info(youtube_url, download=False)
		formats = info_dict['formats']
		def only_take_useful_data(format):
			return {
				'format_id': format.get('format_id'),
				'width': format.get('width'),
				'height': format.get('height')
			}
		formats = list(map(only_take_useful_data,formats))
		count = len(formats)
		#failsafe for low quality streams, in case a high quality is selected, and its not available, get the highest one from there
		if quality == 'low':
			count = 1
		if quality == 'high':
			if count > 5:
				count = 5
		elif quality == 'best':
			count = count
		else:
			if count > 3:
				count = 3
		format = formats[count-1]

	with ydl.YoutubeDL({
	"default_search": 'ytsearch',
	'format': format.get('format_id')
	}) as dloader:
		info_dict = dloader.extract_info(youtube_url, download=False)
		stream_url = info_dict['url']

		player = vlc.MediaPlayer(stream_url)
		player.play()

		while True:
			player.video_take_snapshot(0,'file.png',0,0)
			raw_image = cv2.imread('file.png', 0)
			width, height = player.video_get_size()
			if raw_image is not None and width > 0 and height > 0 :
				image = numpy.frombuffer(raw_image, dtype='uint8')
				image = image.reshape((format.get('height'), format.get('width'), 1))
				yield image

def consume_stream(url, framerate = 5, quality = 'normal'):
	consumer=None
	if re.search("http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?", url) is not None:
		consumer = consume_youtube(url, quality)
	else:
		consumer = consume_ipcam(url)
	
	starttime = time.time()
	for frame in consumer:
		timepast = (time.time() - starttime)/1000		
		yield frame
		sleep((1/framerate)-timepast)
		starttime = time.time()