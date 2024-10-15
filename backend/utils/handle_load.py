import librosa
from . import handle_key, handle_bpm


def load_song(source_audio):
	audio, sample_rate = librosa.load(source_audio)
	return audio, sample_rate


def analyze_song(audio, sample_rate):
	key = handle_key.get_key(audio, sample_rate)
	bpm = handle_bpm.get_bpm(audio, sample_rate)
	return key, bpm