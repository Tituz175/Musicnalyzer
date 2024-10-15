import librosa

def get_bpm(audio, sample_rate):
	tempo, _ = librosa.beat.beat_track(y=audio, sr=sample_rate)
	return round(tempo[0])

def change_bpm(audio, sample_rate, value):
	pass