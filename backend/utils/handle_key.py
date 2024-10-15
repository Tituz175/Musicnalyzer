import librosa
import soundfile as sf
from . import key_finder

def get_key(audio, sample_rate):
	audio_harmonic, _ = librosa.effects.hpss(audio)
	return (key_finder.Tonal_Fragment(audio_harmonic, sample_rate).get_key())


def change_key(audio, sample_rate, value, name, key):
	# Shift the pitch (e.g., 4 semitones up)
    y_shifted = librosa.effects.pitch_shift(y=audio, sr=sample_rate, n_steps=value, bins_per_octave=12)

    # Save the modified audio to a new file
    output_path = f'./{name}_{key}.wav'
    sf.write(output_path, y_shifted, sample_rate)

    print("Pitch-shifted audio saved!")