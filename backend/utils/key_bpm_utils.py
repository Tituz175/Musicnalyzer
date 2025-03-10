"""
Audio processing module for analyzing, modifying, and calculating musical properties of audio files.

This module provides functions for:
- Determining the musical key of an audio file.
- Changing the pitch of an audio file to match a new key.
- Estimating the beats-per-minute (BPM) of an audio file.
- Modifying the BPM of an audio file.
- Calculating new musical keys based on transposition values.

Dependencies:
    - os: File and directory path operations.
    - madmom: Tempo and beat detection.
    - ffmpeg: Audio manipulation, particularly for tempo adjustment.
    - librosa: Audio loading, harmonic-percussive separation, and pitch shifting.
    - soundfile: Writing audio files in various formats.
"""

import os
import madmom
import ffmpeg
import librosa
import soundfile as sf
from . import key_finder
from .path_utils import update_key_in_path, update_bpm_in_path, encode_special_chars

def get_key(audio, sample_rate):
    """
    Determines the musical key of an audio file.

    Parameters:
        audio (ndarray): Audio time series data.
        sample_rate (int): Sampling rate of the audio file.

    Returns:
        str: The estimated musical key of the audio.
    """
    audio_harmonic, _ = librosa.effects.hpss(audio)
    return key_finder.Tonal_Fragment(audio_harmonic, sample_rate).get_key()

def change_key(audio, sample_rate, value, current_audio_path, new_key):
    """
    Shifts the pitch of an audio file to a new key if it does not already exist.

    Parameters:
        audio (ndarray): Audio time series data.
        sample_rate (int): Sampling rate of the audio.
        value (int): Number of semitones to shift the pitch.
        current_audio_path (str): Path to the original audio file.
        new_key (str): The target musical key after pitch shifting.

    Returns:
        str: Path to the pitch-shifted audio file.
    """
    output_path, output_path_url = update_key_in_path(current_audio_path, new_key)
    if os.path.exists(output_path):
        print(f"File already exists: {output_path}")
        return output_path_url

    # Perform pitch shifting
    y_shifted = librosa.effects.pitch_shift(y=audio, sr=sample_rate, n_steps=value, bins_per_octave=12)
    sf.write(output_path, y_shifted, sample_rate)
    
    print(f"Pitch-shifted audio saved as: {output_path}")
    return output_path_url

def get_bpm(filename):
    """
    Estimates the beats-per-minute (BPM) of an audio file.

    Parameters:
        filename (str): Path to the audio file.

    Returns:
        int: The estimated BPM of the audio file.
    """
    tempo_estimator = madmom.features.tempo.TempoEstimationProcessor(fps=100)
    beat_processor = madmom.features.beats.RNNBeatProcessor()(filename)
    estimated_tempo = tempo_estimator(beat_processor)
    return round(estimated_tempo[0][0])

def change_bpm(current_audio_path, current_bpm, value_bpm):
    """
    Changes the BPM of an audio file and saves it as a new file.

    Parameters:
        current_audio_path (str): Path to the original audio file.
        current_bpm (int): The current BPM of the audio file.
        value_bpm (int): The target BPM for the modified audio.

    Returns:
        str: Path to the BPM-modified audio file.
    """
    current_audio_path, output_path = update_bpm_in_path(current_audio_path, value_bpm)

    if os.path.exists(output_path):
        print(f"File already exists: {output_path}")
        return encode_special_chars(output_path)

    tempo_change = round((value_bpm / current_bpm), 4)
    ffmpeg.input(current_audio_path).filter('atempo', tempo_change).output(output_path).overwrite_output().run()
    
    print(f"Modified audio saved as '{output_path}'")
    return encode_special_chars(output_path)


def calculate_new_key(current_key, value):
    """
    Calculates a new musical key based on a transposition value.

    Parameters:
        current_key (str): The original musical key.
        value (int): The number of semitones to shift the key.

    Returns:
        str: The transposed musical key.
    """
    major_key_list = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    minor_key_list = ['Am', 'A#m', 'Bm', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m']

    if 'm' in current_key:
        new_index = (minor_key_list.index(current_key) + value) % 12
        return minor_key_list[new_index]
    else:
        new_index = (major_key_list.index(current_key) + value) % 12
        return major_key_list[new_index]