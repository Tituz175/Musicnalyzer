import os
import librosa
import soundfile as sf
from . import key_finder

def get_key(audio, sample_rate):
	audio_harmonic, _ = librosa.effects.hpss(audio)
	return (key_finder.Tonal_Fragment(audio_harmonic, sample_rate).get_key())


def change_key(audio, sample_rate, value, name, new_key):
    new_key_url = new_key
    
    # URL-safe encoding for the key with '#'
    if len(new_key) > 1:
        new_key_url = f"{new_key[0]}%23"

    # Generate the output filename as WAV
    output_filename = f'{name}_{new_key}.wav'
    output_filename_url = f'{name}_{new_key_url}.wav'
    output_path = os.path.join('./uploads', output_filename)
    output_path_url = os.path.join('./uploads', output_filename_url)

    # Check if the file already exists
    if os.path.exists(output_path):
        print(f"File already exists: {output_path}")
        return {"new_path": output_path_url, "new_key": new_key}

    # Shift the pitch if the file does not exist
    y_shifted = librosa.effects.pitch_shift(y=audio, sr=sample_rate, n_steps=value, bins_per_octave=12)

    # Save the pitch-shifted audio to a WAV file
    sf.write(output_path, y_shifted, sample_rate)

    print(f"Pitch-shifted audio saved as WAV: {output_path}")
    return {"new_path": output_path_url, "new_key": new_key}
